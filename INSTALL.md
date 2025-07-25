# 密评考试系统 - Cloudflare Pages 部署教程

## 📋 部署概述

本教程将指导您如何将密评考试系统部署到 Cloudflare Pages。整个过程包括文件上传、KV 存储配置、环境变量设置等步骤。

## 🎯 部署前准备

### 1. 确认文件结构
确保您的部署文件夹包含以下文件：

```
cloudflare-pages-deploy/
├── functions/
│   └── _middleware.js          # Pages Functions 入口文件
├── src/                        # 源代码目录
│   ├── handlers/              # 请求处理器
│   ├── middleware/            # 中间件
│   ├── templates/             # 前端模板
│   ├── utils/                 # 工具函数
│   └── config/                # 配置文件
├── data/
│   └── questions.json         # 题库数据文件
├── _routes.json              # Pages 路由配置
├── package.json              # 项目配置
├── INSTALL.md                # 本安装教程
└── README.md                 # 项目说明
```

### 2. 准备 Cloudflare 账户
- 访问 [cloudflare.com](https://cloudflare.com) 注册账户
- 确保账户已验证邮箱

## 🚀 详细部署步骤

### 第一步：创建 KV 命名空间

1. **登录 Cloudflare Dashboard**
   - 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 使用您的账户登录

2. **进入 Workers 和 Pages**
   - 在左侧导航栏中找到并点击 "Workers 和 Pages"
   - 点击顶部的 "KV" 选项卡

3. **创建 KV 命名空间**
   - 点击 "创建命名空间" 按钮
   - 在 "命名空间名称" 输入框中输入：`QUESTIONS_KV`
   - 点击 "添加" 按钮创建命名空间

4. **记录命名空间 ID**
   - 创建完成后，您会看到一个类似这样的 ID：`1234567890abcdef1234567890abcdef`
   - **重要**：请复制并保存这个 ID，稍后配置时需要用到

### 第二步：上传题库数据到 KV

1. **进入刚创建的 KV 命名空间**
   - 在 KV 列表中点击 `QUESTIONS_KV` 命名空间

2. **上传题库数据**
   - 点击 "添加条目" 按钮
   - **键名称** 输入：`questions`
   - **值** 输入：打开 `data/questions.json` 文件，复制全部内容粘贴到这里
   - 点击 "保存" 保存

3. **上传统计数据**
   - 再次点击 "添加条目" 按钮
   - **键名称** 输入：`stats`
   - **值** 输入以下内容：
   ```json
   {
     "total": 4615,
     "single": 1527,
     "multiple": 1619,
     "judge": 1469,
     "lastUpdated": "2024-01-01T00:00:00.000Z"
   }
   ```
   - 点击 "保存" 保存

### 第三步：创建 Pages 项目

1. **返回 Workers 和 Pages 主页**
   - 点击 "Workers 和 Pages" 回到主页面
   - 点击 "创建应用程序" 按钮

2. **选择 Pages**
   - 选择 "Pages" 选项卡
   - 点击 "上传资源" 按钮

3. **上传项目文件**
   - 项目名称输入：`miping-exam-system`
   - 将整个 `cloudflare-pages-deploy` 文件夹拖拽到上传区域
   - 或者点击 "从计算机选择" 选择文件夹
   - 点击 "部署站点" 开始部署

### 第四步：配置环境变量

1. **进入项目设置**
   - 部署完成后，点击项目名称进入项目详情页
   - 点击 "设置" 选项卡

2. **添加环境变量**
   - 在左侧菜单中点击 "环境变量"
   - 点击 "添加变量" 按钮，逐一添加以下变量：

   | 变量名 | 值 | 说明 |
   |--------|----|----|
   | `ENVIRONMENT` | `production` | 运行环境 |
   | `VERSION` | `3.0.0` | 系统版本 |
   | `SYSTEM_NAME` | `密评考试系统` | 系统名称 |
   | `DEBUG` | `false` | 调试模式 |
   | `LOG_LEVEL` | `WARN` | 日志级别 |
   | `JWT_SECRET` | `your-secret-key-2024` | JWT密钥（请修改为您的密钥） |
   | `LOGIN_PASSWORD` | `Xiaoshan123` | 登录密码（可修改） |

3. **保存环境变量**
   - 每添加一个变量后点击 "保存" 保存
   - 所有变量添加完成后，系统会自动重新部署

### 第五步：配置 KV 绑定

1. **进入 Functions 设置**
   - 在项目设置页面，点击左侧的 "Functions"
   - 找到 "KV 命名空间绑定" 部分

2. **添加 KV 绑定**
   - 点击 "添加绑定" 按钮
   - **变量名称** 输入：`QUESTIONS_KV`
   - **KV 命名空间** 选择：选择第一步创建的 `QUESTIONS_KV` 命名空间
   - 点击 "保存" 保存

3. **触发重新部署**
   - 保存后系统会自动重新部署
   - 等待部署完成（通常需要1-2分钟）

### 第六步：测试部署

1. **获取访问地址**
   - 在项目详情页面，您会看到类似这样的地址：
   - `https://miping-exam-system.pages.dev`

2. **测试系统功能**
   - 访问上述地址
   - 应该看到登录页面
   - 输入密码：`Xiaoshan123`（或您设置的密码）
   - 成功登录后应该看到考试系统主页

3. **测试 API 接口**
   - 访问：`https://your-site.pages.dev/api/health`
   - 应该返回系统健康状态信息

## 🔧 高级配置

### 自定义域名（可选）

1. **添加自定义域名**
   - 在项目设置中点击 "自定义域"
   - 点击 "设置自定义域"
   - 输入您的域名（如：`exam.yourdomain.com`）
   - 按照提示配置 DNS 记录

### 安全设置

1. **修改默认密码**
   - 在环境变量中修改 `LOGIN_PASSWORD` 的值
   - 建议使用强密码

2. **更新 JWT 密钥**
   - 在环境变量中修改 `JWT_SECRET` 的值
   - 使用随机生成的强密钥

## 🔍 故障排除

### 常见问题及解决方案

#### 1. 部署后显示 "Internal Server Error"
**可能原因**：KV 绑定未正确配置
**解决方案**：
- 检查 KV 命名空间是否正确绑定
- 确认变量名为 `QUESTIONS_KV`
- 重新保存绑定设置

#### 2. 登录后无法加载题目
**可能原因**：题库数据未正确上传
**解决方案**：
- 检查 KV 中是否存在 `questions` 键
- 确认数据格式正确
- 重新上传题库数据

#### 3. 页面样式显示异常
**可能原因**：静态资源加载失败
**解决方案**：
- 检查 `_routes.json` 配置
- 确认所有源文件都已上传
- 清除浏览器缓存后重试

#### 4. API 接口返回 404
**可能原因**：Functions 配置问题
**解决方案**：
- 确认 `functions/_middleware.js` 文件存在
- 检查文件路径是否正确
- 重新部署项目

### 查看日志

1. **实时日志**
   - 在项目详情页面点击 "Functions"
   - 点击 "实时日志" 查看实时日志

2. **部署日志**
   - 在项目详情页面点击 "部署"
   - 点击具体的部署记录查看详细日志

## 📞 获取帮助

如果遇到问题，可以：

1. **查看官方文档**
   - [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
   - [Cloudflare KV 文档](https://developers.cloudflare.com/workers/runtime-apis/kv/)

2. **检查系统状态**
   - 访问：`https://your-site.pages.dev/api/health`
   - 查看系统健康状态

3. **联系支持**
   - Cloudflare 社区论坛
   - 项目 GitHub 仓库（如有）

## 🎉 部署完成

恭喜！您已经成功将密评考试系统部署到 Cloudflare Pages。

**系统特性**：
- ✅ 4600+ 完整题库
- ✅ 现代化界面设计
- ✅ 多种考试模式
- ✅ 实时答题统计
- ✅ 移动端完美适配
- ✅ 安全认证机制

**访问信息**：
- 网站地址：`https://your-site.pages.dev`
- 登录密码：`Xiaoshan123`（或您设置的密码）
- 管理后台：`https://your-site.pages.dev/api/health`

享受您的在线考试系统吧！🚀