# ERP CDC 最小部署

这个 Compose 只启动一个 `dinky` 服务，其中包含 Flink 1.20.3 和已验收的 CDC 补丁。

Dinky 元数据库、源 MySQL 和目标 StarRocks 都使用你已有的外部服务，本部署包不会安装、启动、修改或删除它们。

## 启动

```bash
cp .env.example .env
chmod 600 .env
docker compose --env-file .env -f compose.yaml config --quiet
docker compose --env-file .env -f compose.yaml up -d
```

启动前在 `.env` 填写已有 Dinky 元数据库的地址、端口、库名、账号和密码。MySQL 位于同一台 Docker 宿主机时使用 `DINKY_DB_HOST=host.docker.internal`；位于其他服务器时填写实际内网地址。不要填写 `127.0.0.1`，容器中的该地址指向 Dinky 容器自身。

Dinky：`http://127.0.0.1:8888`

Flink：`http://127.0.0.1:8081`

端口默认只监听 `127.0.0.1`。需要远程访问时使用 SSH 隧道，不直接开放公网。

## 提交 CDC

1. 运行 `preflight.sql` 生成显式表白名单。
2. 替换 `pipeline.template.yaml` 中所有占位符，包括外部 StarRocks 的查询地址和 Stream Load 地址。
3. 先用 1 至 3 张 canary 表验证类型、注释、中文字段和 DDL。
4. 通过 Dinky Catalogue + Task API 提交正式任务。

StarRocks 不在本部署包的操作范围内。这里只把用户提供的查询地址、Stream Load 地址和 Sink 账号填入 Pipeline，不安装或修改 StarRocks。
