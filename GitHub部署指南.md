# GitHub + Cloudflare Pages 一键部署指南

## 🚀 快速部署步骤

### 1. 上传到GitHub

```bash
# 在 cloudflare-pages-deploy 目录下执行
git init
git add .
git commit -m "Initial commit: 密码学评估考试系统"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 2. Cloudflare Pages 连接GitHub

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Pages** 页面
3. 点击 **创建项目** → **连接到Git**
4. 选择你的GitHub仓库
5. 配置构建设置：

#### 构建配置
```
框架预设: None
构建命令: (留空)
构建输出目录: /
根目录: /
```

#### 环境变量设置
在 **设置** → **环境变量** 中添加：

```
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_PASSWORD=your-admin-password
RATE_LIMIT_MAX=100
CACHE_TTL=3600
```

### 3. 自动部署配置

创建 `.github/workflows/deploy.yml` 实现自动部署：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Cloudflare Pages
      uses: cloudflare/pages-action@v1
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        projectName: crypto-exam-system
        directory: ./
```

### 4. 域名配置

#### 自定义域名（可选）
1. 在 Cloudflare Pages 项目设置中
2. 点击 **自定义域名**
3. 添加你的域名
4. 按提示配置DNS记录

### 5. 安全配置检查清单

- [ ] 环境变量已正确设置
- [ ] JWT_SECRET 使用强密码
- [ ] 启用了速率限制
- [ ] 配置了适当的缓存策略
- [ ] 检查了所有API端点的安全性

## 🔧 高级配置

### 分支部署
- `main` 分支 → 生产环境
- `develop` 分支 → 预览环境
- 功能分支 → 临时预览

### 监控和日志
- 在Cloudflare Analytics中查看访问统计
- 使用Cloudflare Logs查看详细日志
- 设置告警通知

### 性能优化
- 启用Cloudflare的CDN加速
- 配置缓存规则
- 启用Brotli压缩

## 📱 移动端适配

系统已包含响应式设计，支持：
- 手机端考试界面
- 平板电脑适配
- 桌面端完整功能

## 🛠️ 故障排除

### 常见问题

1. **404错误**
   - 检查 `_routes.json` 配置
   - 确认所有必要文件已上传

2. **环境变量未生效**
   - 重新部署项目
   - 检查变量名拼写

3. **JWT认证失败**
   - 确认JWT_SECRET已设置
   - 检查token格式

### 调试命令

```bash
# 本地测试
npx wrangler pages dev

# 查看部署日志
npx wrangler pages deployment list
```

## 📞 支持

如遇问题，请检查：
1. GitHub仓库是否公开
2. Cloudflare账户权限
3. 环境变量配置
4. 构建日志错误信息

---

**部署完成后，你的密码学评估考试系统将在几分钟内上线！** 🎉