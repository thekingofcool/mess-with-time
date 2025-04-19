# 部署指南：Cloudflare Pages + Workers

本项目已配置为在Cloudflare Pages上运行，API功能通过Cloudflare Workers或Pages Functions实现。

## 部署步骤

### 前提条件

1. 安装依赖：
   ```bash
   npm install
   ```

2. 安装Wrangler CLI（如果尚未安装）：
   ```bash
   npm install -g wrangler
   ```

3. 登录Cloudflare账户：
   ```bash
   wrangler login
   ```

### 方法1：Pages + Functions（推荐）

Cloudflare Pages Functions是最简单的部署方式，它允许您在Pages环境中运行服务器端代码。

1. 构建项目：
   ```bash
   npm run build
   ```

2. 预览部署（可选）：
   ```bash
   npx wrangler pages dev dist
   ```

3. 部署到Cloudflare Pages：
   ```bash
   npx wrangler pages deploy dist
   ```

部署后，API端点将自动可用，无需额外设置。

### 方法2：Pages + Workers

如果您需要更复杂的API功能，可以使用Workers：

1. 构建项目：
   ```bash
   npm run build
   ```

2. 部署Pages：
   ```bash
   npx wrangler pages deploy dist
   ```

3. 部署Worker：
   ```bash
   npx wrangler publish
   ```

4. 配置路由规则：
   在Cloudflare控制台中，为您的域名添加Route将`/api/*`路径指向Worker。

## 配置文件说明

- `wrangler.toml` - Workers配置文件
- `public/_redirects` - Cloudflare Pages重定向配置
- `public/_routes.json` - Cloudflare Pages路由配置
- `public/_headers` - HTTP头和CORS配置
- `functions/api/[[path]].js` - Pages Functions实现

## 故障排除

1. **API请求404错误**
   - 确保路由配置正确（`_routes.json`）
   - 确认Functions或Worker正确部署

2. **CORS错误**
   - 检查`_headers`文件或Worker中的CORS设置

3. **Pages部署后找不到页面**
   - 确保`_redirects`配置正确，以支持SPA路由

## 注意事项

- 本项目使用相对URL，以便在不同环境中正常工作
- API实现有两个版本（Workers和Functions），可根据需要选择
- 在生产环境中，建议使用`apiKey`认证API请求 