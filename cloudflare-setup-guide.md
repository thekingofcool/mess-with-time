# Cloudflare Pages 部署指南

本文档详细说明如何在 Cloudflare Pages 上部署 messwithtime.com 项目。

## 部署步骤

### 1. 连接 GitHub 仓库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** 部分
3. 点击 **创建应用程序** 按钮
4. 选择 **连接 Git** 选项
5. 授权并选择包含项目的 GitHub 仓库

### 2. 配置构建设置

在构建配置页面，输入以下设置：

| 设置项 | 值 |
|-------|-----|
| 项目名称 | `messwithtime` |
| 生产分支 | `main` 或 `master` (根据仓库实际情况) |
| 框架预设 | `Vite` |
| 构建命令 | `npm run cf:build` |
| 构建输出目录 | `dist` |

### 3. 环境变量设置

在 **环境变量** 部分添加：

| 名称 | 值 |
|-----|-----|
| NODE_VERSION | `18` |

### 4. 启用 Functions

在高级设置中：

1. 确保 **Functions** 选项已启用
2. Functions 目录：`/functions` (默认值)
3. 兼容性日期：使用默认值或设置为 `2023-07-10`

### 5. 保存并部署

点击 **保存并部署** 按钮启动初始构建。

## 自定义域设置

部署成功后，配置自定义域：

1. 在项目设置中找到 **自定义域** 选项
2. 点击 **设置自定义域**
3. 输入 `messwithtime.com`
4. 按照 Cloudflare 的提示设置 DNS 记录

## 故障排除

如果遇到构建失败，请检查以下常见问题：

1. **Node 版本问题**
   - 确保 `NODE_VERSION` 环境变量设置为 `18` 或更高
   - 检查 `.node-version` 文件是否正确

2. **依赖安装问题**
   - 项目已配置使用 `npm ci` 而非 `bun install`
   - 确保 `package-lock.json` 文件存在且最新

3. **Functions 路由问题**
   - 检查 `public/_routes.json` 是否正确配置
   - API 路径格式为 `/api/v1/*` 

## 部署成功检查

部署完成后，检查以下端点确认功能正常：

1. 前端: `https://messwithtime.com`
2. API: `https://messwithtime.com/api/v1/current`

## 已完成的优化

1. 使用 npm 替代 bun 避免锁文件冲突
2. 添加专用的 Cloudflare 构建命令 `cf:build`
3. 配置 Functions 处理 API 请求
4. 设置 `_redirects` 确保 SPA 路由
5. 添加 Node 版本限制 