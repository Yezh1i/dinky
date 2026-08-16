# Dinky MySQL CDC 到 StarRocks 项目代理约束

## 1. 文件用途和优先级

本文件是 Dinky 仓库内后续代码代理、运维代理和维护者的项目级约束。它不替代面向人工执行的运行手册；完整部署、监控、审计和迁移步骤见：

`docs/docs/practical_guide/scenario_practice/mysqlcdc2starrocks.md`

配套的脱敏部署模板见：

`deploy/docker/erp-cdc/`

如果本文件、运行手册和用户当前明确要求冲突，以用户当前明确要求为最高优先级；涉及破坏性操作、权限、密码或生产数据时，必须先确认范围和目标。

## 2. 当前系统边界

本项目维护的是：

```text
MySQL 5.7 ROW/FULL Binlog
  -> Flink CDC 3.6.0 on Flink 1.20.3
  -> StarRocks 4.0.14
  -> 由 Dinky 1.x 的 Catalogue + Task 管理
```

当前生产主任务基线：

```text
Task ID: 98
Job ID: 207fe7532b948f1094e664e0c42ce824
源库: haidb_new
目标库: dinky_cdc_erp_v3
并行度: 16
目标全量吞吐: 稳定 >= 30,000 行/秒
```

Job ID 仅用于核对现网状态，不能写死进部署脚本。任何生产改动前，先通过 Dinky 和 Flink REST 双侧确认该 Job 是否仍为 `RUNNING`，并确认没有第二个同源任务。

服务器操作统一使用 XTerminal MCP。不要以 Web 页面操作代替已约定的 Dinky API 流程，也不要在未授权时直接登录或执行远程命令。密码、Token、数据库账号、完整连接串和公网地址不得写入本文件、Git、日志或回复。

## 3. 固定版本和状态要求

- Dinky 镜像必须使用仓库已验收的固定 tag/digest；不能使用 `latest`。当前基线为 `ghcr.io/yezh1i/dinky-standalone-server:sha-10d198a` 及部署模板中的 digest。
- `deploy/docker/erp-cdc/compose.yaml` 只启动 Dinky。Dinky 元数据库使用用户已有的外部 MySQL，不得由本项目安装、启动、停止或修改。StarRocks 同样不在本项目操作范围内；Pipeline 只使用用户明确提供的查询地址、Stream Load 地址和 Sink 账号。
- Flink、Flink CDC、Java 和 StarRocks 版本必须与运行手册一致。未验证的跨版本升级不得直接复用旧 checkpoint/savepoint。
- Dinky 元数据、StarRocks FE/BE 数据、Flink checkpoint/savepoint、日志目录必须持久化。跨服务器迁移优先使用共享状态存储。
- 现网任务曾使用本机 H2 元数据和本机 `file://` 状态路径；迁移时必须先备份并验证可读性，不能假设容器重建后状态仍然存在。
- `autoRestart=false` 属于当前已知风险。开启自动恢复前，必须完成 checkpoint/savepoint、Binlog 保留期和容器重启演练。

## 4. 正式任务提交流程

正式任务必须通过 Dinky 管理，顺序不可省略：

1. 在 Dinky 注册中心创建并测试 Flink Standalone 集群，使用 Compose 服务名或稳定 DNS，不使用临时容器 ID。
2. 通过 Dinky OpenAPI 创建 Catalogue，并在同一流程建立 Catalogue 与 Task 关联。
3. 保存 Pipeline Task 配置，检查显式表白名单、目标库、server-id、并行度、checkpoint 和 Sink 参数。
4. 提交 Task，并分别通过 Dinky API、Dinky 页面和 Flink `/jobs/overview` 验证实例存在且只有一个。
5. 先提交 1 至 3 张 canary 表，验证类型、注释、中文标识符、Stream Load 和 DDL 演进，再扩大到正式白名单。

关键接口形态：

```text
PUT /api/catalogue/saveOrUpdateCatalogueAndTask
PUT /api/task
GET /api/task/submitTask?id=<TASK_ID>
GET /api/catalogue/findByTaskId?taskId=<TASK_ID>
```

不要直接调用 Flink REST 提交正式 CDC Job；不要对同一个 Task 重复点击提交；不要为了“重试”创建第二个同源任务。停止或迁移时先触发 savepoint，再取消 Job，确认 Flink 为 `CANCELED` 后再删除 Catalogue/Task。删除任务和删除 StarRocks 数据是两件事，绝不合并执行。

## 5. 表准入和 schema 规则

生产任务只能使用经过预检并归档的显式白名单，禁止使用未审核的 `.*` 全库正则。每次变更白名单都要记录新增、移除、原因和验收结果。

当前基线是源库约 495 张表，主任务纳入 468 张，另有 27 张隔离。隔离包括表名带空格、无主键、类型/注释预检失败和人工隔离表。

准入前必须检查：

- 表名、库名、字段名可安全引用；表名包含空白字符时默认隔离。
- 字段类型存在已验收的 MySQL 到 StarRocks 映射；`UNSIGNED`、`BIT`、`BIGINT UNSIGNED` 等边界值必须有测试。
- 注释统一转义引号、反斜杠、NUL、换行、回车、Tab 和 `0x1A`，并覆盖 `audited` 注释用例。
- 中文库名、表名、字段名和表注释必须通过测试。
- CREATE、ADD COLUMN、RENAME、TYPE CHANGE、TRUNCATE、DROP 等 DDL 必须在 canary 任务验证。

无主键表当前不直接纳入主任务，因为 StarRocks Primary Key Upsert/Delete 无法保证语义。若业务明确要求同步无主键表，必须先单独设计目标表模型、删除语义和一致性校验，再以独立任务验收；不得静默过滤，也不得未经确认纳入主任务。

## 6. 性能和内存约束

当前全量基线为并行度 16、TaskManager 16 slots/6144m、chunk 16384、fetch 2048、连接池 4、Sink buffer 128 MiB、flush interval 10 秒。验收使用至少 5 分钟窗口，要求稳定达到 30,000 行/秒，同时 checkpoint 连续成功、无持续反压、内存不持续上涨。

不得为了追求瞬时峰值无限增大 chunk、fetch、buffer、I/O 线程或 TaskManager 数量。每次调参都要记录 source/sink 吞吐、checkpoint、反压、RSS、Swap 和 StarRocks BE 负载；先定位瓶颈，再改一个变量。

发现全部 Slot 空闲的额外 TaskManager 时，先核对 ResourceID、日志和 PID，再正常终止对应实例。禁止按模糊进程名批量 `kill`。

## 7. DDL/DML 审计边界

MySQL `ROW` Binlog 不保存原始 `INSERT/UPDATE/DELETE SQL`，Flink CDC Sink 以批量 Stream Load 写入 StarRocks，也不会生成逐条 DML SQL。因此审计必须同时看：

1. MySQL/RDS 原始 DDL 审计或 Binlog 解析结果。
2. Flink 的 `FlushEvent`、Schema Change 和 evolved schema 日志。
3. StarRocks FE 目标 DDL 审计。
4. Stream Load 的表名、Label、成功行数和过滤行数。
5. DDL 前后源目标行数、主键范围和抽样内容。

不要因为 StarRocks `fe.audit.log` 没有某条 SQL，就判断上游没有执行 DDL。已确认的事件包括：

```sql
TRUNCATE TABLE haidb_new.item_sku_sales_count;
```

`cdc-audit` 不是 Dinky 内置命令；若要提供统一命令，必须先实现、安装、测试并在文档中说明其数据源和权限，不能假装它已经存在。

## 8. 故障恢复和迁移

- Task 失败但集群存活：先读失败原因和最近成功 checkpoint，确认是否为可重试的瞬态错误；禁止无限重试掩盖数据错误。
- Dinky/Flink 意外停止：先确认 checkpoint/savepoint 完整、Binlog 尚未过期，再恢复 Job；验证 Job ID 更新、状态为 `RUNNING`、延迟回落，并对高变更表做一致性校验。
- 跨服务器迁移：旧任务触发 savepoint并记录路径/校验值，停止旧任务，备份 Dinky 元数据或 Task JSON，复制状态目录，使用新的 MySQL CDC server-id 范围，在新环境先跑 canary，再恢复正式任务。
- 版本、连接器或 Java 大版本变化时，不承诺旧 savepoint 可恢复；先在隔离环境验证，失败则同步到新目标库并重新做 initial 全量。
- 同一 MySQL 上并行运行的 CDC 任务必须使用互不重叠的 server-id 范围；旧连接尚未退出时不得复用。

## 9. 代码和文档修改要求

- 先查找调用链、现有测试和运行手册，再修改最小必要文件。
- 类型映射、DDL 生成、注释转义、中文标识符和 DDL 演进变更必须补测试；优先运行相关模块测试，再运行 `git diff --check`。
- 不把现网密码、Token、任务 Statement、日志中的敏感连接信息复制进示例或文档；使用占位符和受限环境变量。
- 修改部署模板后必须执行 Compose 配置渲染校验，并检查镜像仍为固定版本/digest。
- 不修改与本任务无关的用户变更；不使用 `git reset --hard`、`git checkout --` 等破坏性命令。

## 10. 交付前最小检查

```text
[ ] 现网 Job 207fe7532b948f1094e664e0c42ce824 状态已核对
[ ] Dinky Catalogue 与 Task 关联存在
[ ] 只有一个同源 Job，server-id 不冲突
[ ] 表白名单、隔离清单和目标库已确认
[ ] canary 类型/注释/中文字段/DDL 测试通过
[ ] checkpoint/savepoint 路径可读且已持久化
[ ] 吞吐、延迟、反压、内存和 Stream Load 指标已记录
[ ] 未回显密码、Token 或完整敏感连接串
[ ] git diff --check 通过
```
