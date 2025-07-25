# 🚀 快速部署指南

## 📋 重要提示

由于项目文件较多，这个部署包只包含了核心文件。要获取完整的项目文件，请按照以下步骤操作：

## 🔄 获取完整文件

### 方法一：手动复制（推荐）

1. **复制以下目录和文件到 `cloudflare-pages-deploy` 文件夹**：

```
需要复制的文件：
├── src/handlers/static.js
├── src/middleware/
│   ├── cache.js
│   ├── logger.js
│   ├── rateLimit.js
│   └── security.js
├── src/templates/
│   ├── components/
│   │   ├── animations.js
│   │   ├── button.js
│   │   ├── card.js
│   │   ├── form.js
│   │   └── styles.js
│   └── pages/
│       ├── index.js
│       └── exam.js
├── src/utils/
│   ├── crypto.js
│   ├── helpers.js
│   └── validation.js
├── src/config/
│   ├── constants.js
│   └── environments.js
└── data/
    └── questions.json
```

2. **从原项目根目录复制这些文件到对应位置**

### 方法二：使用脚本复制

如果你有命令行访问权限，可以运行：

```bash
# 在项目根目录执行
cp -r src/handlers/static.js cloudflare-pages-deploy/src/handlers/
cp -r src/middleware/* cloudflare-pages-deploy/src/middleware/
cp -r src/templates/* cloudflare-pages-deploy/src/templates/
cp -r src/utils/* cloudflare-pages-deploy/src/utils/
cp -r src/config/* cloudflare-pages-deploy/src/config/
cp -r data/* cloudflare-pages-deploy/data/
```

## 📁 最终文件结构

确保你的 `cloudflare-pages-deploy` 文件夹包含以下完整结构：

```
cloudflare-pages-deploy/
├── functions/
│   └── _middleware.js          ✅ 已包含
├── src/
│   ├── handlers/
│   │   ├── auth.js            ✅ 已包含
│   │   ├── questions.js       ✅ 已包含
│   │   └── static.js          ❌ 需要复制
│   ├── middleware/
│   │   ├── cache.js           ❌ 需要复制
│   │   ├── logger.js          ❌ 需要复制
│   │   ├── rateLimit.js       ❌ 需要复制
│   │   └── security.js        ❌ 需要复制
│   ├── templates/
│   │   ├── components/        ❌ 需要复制整个目录
│   │   └── pages/             ❌ 需要复制整个目录
│   ├── utils/
│   │   ├── crypto.js          ❌ 需要复制
│   │   ├── helpers.js         ❌ 需要复制
│   │   └── validation.js      ❌ 需要复制
│   └── config/
│       ├── constants.js       ❌ 需要复制
│       └── environments.js    ❌ 需要复制
├── data/
│   └── questions.json         ❌ 需要复制
├── _routes.json              ✅ 已包含
├── package.json              ✅ 已包含
├── INSTALL.md                ✅ 已包含
├── README.md                 ✅ 已包含
└── QUICK_START.md            ✅ 本文件
```

## ⚡ 快速部署步骤

1. **复制所有必要文件**（按照上面的指南）
2. **阅读 `INSTALL.md`** 了解详细部署步骤
3. **上传到 Cloudflare Pages**
4. **配置 KV 存储和环境变量**
5. **测试部署结果**

## 🔧 核心配置

### 环境变量（必须设置）
```
ENVIRONMENT=production
VERSION=3.0.0
DEBUG=false
LOG_LEVEL=WARN
JWT_SECRET=your-secret-key-here
LOGIN_PASSWORD=Xiaoshan123
```

### KV 绑定（必须配置）
- 变量名：`QUESTIONS_KV`
- 命名空间：创建一个新的 KV 命名空间

## 🆘 需要帮助？

1. 确保所有文件都已正确复制
2. 检查 `INSTALL.md` 中的详细步骤
3. 访问 `/api/health` 检查系统状态
4. 查看 Cloudflare Pages 的部署日志

## 🎯 部署成功标志

- 能够访问登录页面
- 能够成功登录（密码：Xiaoshan123）
- 能够看到题库统计信息
- 能够开始答题

祝你部署成功！🚀