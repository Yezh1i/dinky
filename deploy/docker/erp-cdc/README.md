# ERP CDC deployment bundle

This directory is the deployable companion to the Chinese production runbook:

`docs/docs/practical_guide/scenario_practice/mysqlcdc2starrocks.md`

## Files

- `compose.yaml`: Dinky metadata MySQL, Dinky/Flink, and one-node StarRocks.
- `flink-config.yaml`: the verified 16-slot, 6 GiB TaskManager baseline.
- `pipeline.template.yaml`: sanitized Dinky Flink CDC Pipeline template.
- `preflight.sql`: read-only source metadata admission checks.
- `.env.example`: image pins, bind address, persistent paths, and local secrets.

## Bootstrap

1. Use a host with at least 8 vCPU and 32 GiB RAM; 16 vCPU and 64 GiB RAM is recommended.
2. Copy `.env.example` to `.env`, replace every password, and run `chmod 600 .env`.
3. Keep `BIND_IP=127.0.0.1` unless a protected management network is configured.
4. Create the persistent root directories from `.env`.
5. Run `docker compose --env-file .env -f compose.yaml config` and review the rendered configuration.
6. Start with `docker compose --env-file .env -f compose.yaml up -d`.
7. Change the default StarRocks root password and create a least-privilege sink user before submitting a task.
8. Run `preflight.sql`, build an explicit table whitelist, and test a canary task first.

Do not reuse the example passwords, reuse an active MySQL CDC server-id range, or restore a savepoint across unverified Flink/CDC versions.
