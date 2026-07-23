# create-axewo-micro 🚀

> 企业级微前端 CLI 脚手架工具 — Vue 3 + Vite + Rspack + micro-app 1.0.0

通过一条命令，快速初始化企业级微前端**基座宿主工程**、**业务子应用模板**及 **SDK 核心基础设施**。

---

## ⚡ 快速使用 (Quick Start)

使用 `npx` 零安装运行脚手架：

```bash
npx create-axewo-micro [项目名称]
```

或使用 `npm create` / `pnpm create`：

```bash
npm create axewo-micro [项目名称]
# 或
pnpm create axewo-micro [项目名称]
```

---

## 📦 支持的模板选择

命令行工具将为您提供以下 3 种工程模板选择：

1. **业务子应用模板 (Sub-App Template)**：基于 Vue 3 + Vite + `@axewo/micro-shared`。
2. **基座宿主工程 (Main Host Portal)**：基于 Vue 3 + Rspack + `@axewo/micro-*`。
3. **SDK 核心基础库 (Core SDK Monorepo)**：包含 `@axewo/micro-core`、`@axewo/micro-shared` 和 `@axewo/micro-ui`。

---

## ✨ 特性亮点

- ⚡ **秒级克隆**：基于 `degit` 动态拉取 GitHub 仓库，无繁重的 Git commit 历史下载。
- ⚙️ **全自动依赖安装**：模板拉取后自动在后台触发 `pnpm install`。
- 🚀 **全自动开发启动**：依赖就绪后自动启动 `pnpm dev` 打开服务。
- 🔒 **微前端沙箱**：内置 `micro-app 1.0.0` 原生 `iframe` 沙箱隔离支持。

---

## 📄 License

MIT
