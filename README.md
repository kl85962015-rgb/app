# 隐患排查微信小程序

一款专业的安全生产隐患排查管理微信小程序，支持隐患随手拍、依据库选择、企业库查询和任务管理功能。

## 功能特性

### 1. 首页 / 工作台
- 快捷入口：随手拍、任务、企业库、依据库
- 统计概览：本月隐患数、整改率、排查任务数
- 待办事项：待处理隐患和任务提醒
- 最近隐患：快速查看最新上报的隐患

### 2. 隐患随手拍
- 多图上传（最多 9 张）
- 隐患等级选择（一般/重大）
- 依据库关联
- 位置自动获取 + 手动输入
- 责任人指派
- 整改期限设置

### 3. 依据库
- 法规分类浏览（安全生产法、消防安全、电气安全等）
- 关键词搜索
- 收藏功能
- 支持在隐患上报时快速选择

### 4. 企业库
- 企业信息查询
- 行业/区域筛选
- 企业隐患统计
- 历史排查记录

### 5. 任务管理
- 创建排查任务
- 任务状态跟踪（待执行/进行中/已完成）
- 任务进度管理
- 关联隐患查看

### 6. 个人中心
- 我的隐患
- 我的任务
- 消息通知
- 设置

## 技术架构

### 前端
- **框架**: 微信原生小程序
- **语言**: JavaScript + WXML + WXSS
- **设计风格**: 专业严肃（深蓝色主题 #1E3A5F）

### 后端
- **框架**: Node.js + Express
- **数据库**: SQLite (better-sqlite3)
- **文件上传**: Multer

## 项目结构

```
隐患排查小程序/
├── miniprogram/                # 小程序前端
│   ├── pages/                  # 页面
│   │   ├── index/              # 首页
│   │   ├── hazard-report/      # 隐患上报
│   │   ├── hazard-list/        # 隐患列表
│   │   ├── hazard-detail/      # 隐患详情
│   │   ├── regulation/         # 依据库
│   │   ├── enterprise/         # 企业库
│   │   ├── task/               # 任务管理
│   │   ├── task-create/        # 创建任务
│   │   ├── task-detail/        # 任务详情
│   │   └── profile/            # 个人中心
│   ├── assets/                 # 静态资源
│   ├── app.js                  # 小程序入口
│   ├── app.json                # 全局配置
│   └── app.wxss                # 全局样式
├── server/                     # 后端服务
│   ├── routes/                 # API 路由
│   │   ├── auth.js             # 认证
│   │   ├── users.js            # 用户
│   │   ├── enterprises.js      # 企业
│   │   ├── hazards.js          # 隐患
│   │   ├── regulations.js      # 依据库
│   │   └── tasks.js            # 任务
│   ├── models/                 # 数据模型
│   │   └── database.js         # 数据库初始化
│   ├── data/                   # SQLite 数据库文件
│   ├── uploads/                # 上传文件目录
│   ├── index.js                # 服务入口
│   └── package.json            # 依赖配置
└── project.config.json         # 小程序项目配置
```

## 快速开始

### 1. 启动后端服务

```bash
cd server
npm install
npm start
```

服务将在 http://localhost:3000 启动。

### 2. 配置小程序

1. 打开微信开发者工具
2. 导入项目，选择 `隐患排查小程序` 目录
3. 修改 `miniprogram/app.js` 中的 `baseUrl` 为你的后端地址

### 3. 运行小程序

在微信开发者工具中编译运行即可。

## API 接口

### 认证
- `POST /api/auth/login` - 微信登录

### 用户
- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户详情

### 企业
- `GET /api/enterprises` - 获取企业列表
- `GET /api/enterprises/:id` - 获取企业详情
- `POST /api/enterprises` - 创建企业

### 隐患
- `GET /api/hazards` - 获取隐患列表
- `GET /api/hazards/:id` - 获取隐患详情
- `POST /api/hazards` - 创建隐患
- `POST /api/hazards/upload` - 上传图片
- `PUT /api/hazards/:id/status` - 更新隐患状态
- `GET /api/hazards/stats/overview` - 获取统计数据

### 依据库
- `GET /api/regulations` - 获取依据列表
- `GET /api/regulations/categories` - 获取分类
- `GET /api/regulations/:id` - 获取依据详情
- `POST /api/regulations/:id/favorite` - 收藏/取消收藏

### 任务
- `GET /api/tasks` - 获取任务列表
- `GET /api/tasks/counts` - 获取任务统计
- `GET /api/tasks/:id` - 获取任务详情
- `POST /api/tasks` - 创建任务
- `PUT /api/tasks/:id/status` - 更新任务状态

## 设计规范

### 颜色方案
- 主色调: `#1E3A5F` (深蓝色)
- 辅助色: `#2E7D32` (深绿色 - 成功)
- 警示色: `#F57C00` (橙色 - 警告)
- 危险色: `#D84315` (深红色 - 重大隐患)
- 背景色: `#F5F7FA`

### 字体
- 标题: 36rpx, font-weight: 600
- 正文: 28rpx, font-weight: 400
- 辅助文字: 24rpx, color: #666666

## 注意事项

1. **AppID**: 当前使用测试 AppID，正式发布需要替换为真实的 AppID
2. **后端地址**: 开发时使用 localhost，部署时需要更换为 HTTPS 地址并在小程序后台配置域名
3. **图片上传**: 需要配置合法的上传域名

## 后续扩展

- [ ] 与安全生产云台账系统集成
- [ ] 添加用户权限管理
- [ ] 隐患整改流程完善
- [ ] 数据统计报表
- [ ] 消息推送通知
