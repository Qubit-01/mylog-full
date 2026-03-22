## 前置依赖

```bash
## prism 拉取 db schema 生产 ts 类型
prisma db pull && prisma generate && prisma generate --sql
```

## Compile and run the project

```bash
pnpm run start # development
pnpm run start:dev # watch mode
```

## 生产环境

```bash
$ pnpm run start:prod # production mode
```