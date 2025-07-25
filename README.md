# 密评考试系统 - Cloudflare Pages 部署包

## 🚀 项目概述

这是密评考试系统的 Cloudflare Pages 部署版本，包含完整的4600+题库和现代化的用户界面。

## 📦 部署包内容

```
cloudflare-pages-deploy/
├── functions/
│   └── _middleware.js          # Pages Functions 入口文件
├── src/                        # 源代码目录
│   ├── handlers/              # 请求处理器
│   │   ├── auth.js           # 认证处理
│   │   ├── questions.js      # 题库处理
│   │   └── static.js         # 静态资源处理
│   ├── middleware/            # 中间件
│   │   ├── cache.js          # 缓存管理
│   │   ├── logger.js         # 日志记录
│   │   ├── rateLimit.js      # 频率限制
│   │   └── security.js       # 安全中间件
│   ├── templates/             # 前端模板
│   │   ├── components/       # UI组件
│   │   └── pages/            # 页面模板
│   ├── utils/                 # 工具函数
│   │   ├── crypto.js         # 加密工具
│   │   ├── helpers.js        # 通用工具
│   │   └── validation.js     # 数据验证
│   └── config/                # 配置文件
│       ├── constants.js      # 系统常量
│       └── environments.js   # 环境配置
├── data/
│   └── questions.json         # 题库数据文件（4600+题目）
├── _routes.json              # Pages 路由配置
├── package.json              # 项目配置
├── INSTALL.md                # 详细安装教程
└── README.md                 # 本文件
```

## 🎯 快速开始

### 1. 阅读安装教程
请仔细阅读 `INSTALL.md` 文件，其中包含详细的部署步骤。

### 2. 准备 Cloudflare 账户
- 注册 Cloudflare 账户
- 确保账户已验证

### 3. 上传到 Cloudflare Pages
- 将整个 `cloudflare-pages-deploy` 文件夹上传到 Cloudflare Pages
- 按照 `INSTALL.md` 中的步骤配置 KV 存储和环境变量

## 🌟 系统特性

- ✅ **完整题库**: 4600+ 密评考试题目
- ✅ **现代化UI**: 美观的界面设计和流畅动画
- ✅ **多种题型**: 支持单选题、多选题、判断题
- ✅ **考试模式**: 20/50/100/140题多种模式
- ✅ **实时统计**: 答题进度和正确率统计
- ✅ **响应式设计**: 完美适配手机、平板、电脑
- ✅ **安全认证**: JWT令牌认证和防暴力破解
- ✅ **性能优化**: 多层缓存和数据分片处理

## 🔐 默认配置

- **登录密码**: `Xiaoshan123`
- **系统名称**: 密评考试系统
- **版本**: 3.0.0

## 📞 技术支持

如果在部署过程中遇到问题：

1. 首先查看 `INSTALL.md` 中的故障排除部分
2. 检查 Cloudflare Pages 的部署日志
3. 访问 `/api/health` 检查系统状态

## 🎉 部署成功后

部署成功后，您将拥有一个功能完整的在线考试系统：

- 访问您的 Pages 域名即可使用
- 使用默认密码登录
- 开始在线刷题和考试

祝您使用愉快！🚀