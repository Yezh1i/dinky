# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dinky is a real-time data development platform based on Apache Flink, enabling agile data development, deployment and operation. It's a full-stack application with a Java/Spring Boot backend and React/TypeScript frontend.

## Build and Development Commands

### Backend (Java/Maven)
- **Build**: `./mvnw clean package -Dmaven.test.skip=true -P aliyun,prod,web,flink-1.14`
- **Build script**: `./build.sh` (uses Flink 1.14 profile by default)
- **Test**: `./mvnw test`
- **Format code**: `./mvnw spotless:apply`
- **Check code style**: `./mvnw spotless:check`

### Frontend (React/TypeScript)
Navigate to `dinky-web/` directory:
- **Development server**: `npm run dev` or `npm run start:dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Format**: `npm run prettier`
- **Type check**: `npm run tsc`

### Profiles and Configurations
- **Flink versions**: Supports Flink 1.14-1.19 via Maven profiles (`flink-1.14`, `flink-1.15`, etc.)
- **Environment**: Use `-P dev` for development (compile scope) or `-P prod` for production (provided scope)
- **Repositories**: Default uses Aliyun mirror (`-P aliyun`), can switch to Maven Central (`-P maven-central`)

## Code Architecture

### Backend Structure
- **dinky-admin**: Main Spring Boot application entry point (`org.dinky.Dinky`)
- **dinky-core**: Core execution engine and Flink integration
- **dinky-flink**: Flink version-specific implementations (1.14-1.19)
- **dinky-gateway**: Gateway and cluster management
- **dinky-metadata**: Database metadata providers (MySQL, PostgreSQL, ClickHouse, etc.)
- **dinky-cdc**: Change Data Capture functionality
- **dinky-alert**: Alert system with multiple providers (DingTalk, WeChat, Email, etc.)
- **dinky-web**: React frontend application

### Frontend Structure
- **DataStudio**: Main FlinkSQL development interface with editor, console, and results
- **DevOps**: Job monitoring, metrics, and operations
- **RegCenter**: Registration center for clusters, datasources, UDFs, etc.
- **AuthCenter**: User management, roles, and permissions
- **SettingCenter**: System configuration and settings

### Key Components
- **Executor Framework**: Abstracts different Flink execution modes (Local, Standalone, Yarn, Kubernetes)
- **Multi-version Support**: Supports multiple Flink versions through modular architecture
- **SQL Enhancement**: Extends FlinkSQL with custom statements (CDC, variables, etc.)
- **Catalog Integration**: Supports various data catalogs and metadata discovery

## Development Notes

### Multi-module Maven Project
- Root POM manages all module dependencies and versions
- Each Flink version has its own module for compatibility
- Uses dependency management for consistent versioning across modules

### Frontend Technology Stack
- **Framework**: React 18 + TypeScript + UMI 4
- **UI Library**: Ant Design + Pro Components
- **Editor**: Monaco Editor for SQL development
- **Charts**: ECharts, G2, Ant Design Charts
- **State Management**: Built-in UMI models

### Code Quality
- **Java**: Uses Spotless with Palantir Java format
- **Frontend**: ESLint + Prettier configuration
- **License**: All files must include Apache 2.0 license header

## Testing

- **Backend**: JUnit 5 + Mockito for unit tests
- **Integration**: TestContainers for database testing
- **Frontend**: Jest configuration available

## Database Support

Supports multiple databases with dedicated metadata modules:
- MySQL, PostgreSQL (primary)
- ClickHouse, Doris, StarRocks
- Oracle, SQL Server
- H2 (for testing/development)