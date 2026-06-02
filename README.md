# 词伴 Lyrics Mate

> 跨平台歌词写作助手 — 填词模式 & 原创模式，让每句歌词都有章可循。

| macOS | Windows | v1.1.0 |
|---|---|---|
| Electron + React | Tailwind CSS | MIT |

---

## 功能特性

| 核心功能 | 说明 |
|---|---|
| **填词模式** | 粘贴原歌词 → 自动拆分逐行，设定每句字数上限，逐行改写 |
| **原创模式** | 自由创作区，纯净编辑器，专注写词 |
| **用户系统** | 用户名+密码注册登录，bcrypt加密，JWT鉴权，跨设备云端同步 |
| **社区广场** | 发布歌词作品，浏览他人创作，点赞互动 |
| **约稿中心** | 发布/承接歌词创作需求，应征出价，状态流转 |
| **意象填写区** | 关键词标签 + 10种情感基调选择 |
| **查资料区** | 搜索歌词素材、诗词典故、押韵词库、流行歌曲参考 |
| **最终歌词区** | 实时预览 + 一键复制 + 导出 TXT |

---

## 安装使用

### 方式一：下载安装包

| 平台 | 下载 |
|---|---|
| macOS | 从 [Releases](https://github.com/stellartraveler5162-SLCG/lyrics-mate/releases) 下载 `.dmg`，双击挂载后拖入 **Applications** |
| Windows | 下载 `Lyrics.Mate.Setup.1.0.0.exe` 安装包，双击安装；或下载 `.zip` 解压即用 |

### 方式二：源码运行

```bash
git clone https://github.com/stellartraveler5162-SLCG/lyrics-mate.git
cd lyrics-mate
npm install
npm run electron:dev
```

### 环境要求

- Node.js >= 18
- macOS / Windows (Electron 桌面模式)
- 浏览器预览模式跨平台 (`npm run dev`)

---

## 使用教程

### 注册登录

1. 打开应用，点击左侧栏底部的 **登录** 按钮
2. 切换到「注册」标签，输入用户名和密码
3. 注册成功后自动登录，用户名显示在侧边栏底部
4. 登录后社区、约稿功能可用，数据跨设备云端同步
5. JWT Token 30天有效，关闭重开自动恢复登录状态

### 填词模式

1. 在左侧 **意象填写区** 添加关键词标签（如「月光」「离别」），选择情感基调（如「伤感」）
2. 在 **查资料区** 搜索相关素材、典故、韵脚，获取灵感
3. 将原歌词复制粘贴到中间的粘贴区，点击 **解析** 或直接 `Cmd+V`
4. 歌词自动拆分为逐行，每行输入框可编辑修改
5. 右侧 **字数上限** 可逐行调整（1-20字），**剩余字数计数器** 颜色提示（灰→橙→红）
6. 编辑结果实时显示在右侧 **最终歌词区**
7. 点击 **复制** 或 **导出 TXT** 保存

### 原创模式

1. 设定意象标签和情感基调
2. 在查资料区搜索灵感素材
3. 在原创编辑区自由创作
4. 实时预览 → 导出

### 社区广场

1. 点击左侧 **社区** 进入
2. 浏览他人作品，点击爱心点赞
3. 登录后点击 **发布作品**，填写标题和歌词内容即可发布
4. 只能删除自己发布的作品

### 约稿中心

1. 点击左侧 **约稿** 进入
2. 登录后点击 **发布需求**，填写标题、描述和预算
3. 对进行中的需求可点击 **应征** 提交出价（留言 + 歌词样例）
4. 或点击 **承接** 直接将需求状态改为"已承接"
5. 需求发布者可点击 **完成** 结束需求
6. 只能删除自己发布的需求

---

## 项目架构

```
lyrics-mate/
├── electron/
│   ├── main.ts              # Electron 主进程
│   └── preload.ts           # IPC 桥接
├── server/
│   ├── index.js             # 后端 API (Express + SQLite + JWT)
│   └── package.json
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx          # 侧边导航（含用户状态）
│   │   ├── ImageryPanel.tsx     # 意象填写区
│   │   ├── ResearchPanel.tsx    # 查资料区
│   │   ├── FillModeEditor.tsx   # 填词模板编辑器
│   │   ├── FreeModeEditor.tsx   # 原创编辑器
│   │   └── LyricsPreview.tsx    # 最终歌词预览
│   ├── pages/
│   │   ├── HomePage.tsx         # 创作主页
│   │   ├── CommunityPage.tsx    # 社区广场
│   │   ├── CommissionPage.tsx   # 约稿中心
│   │   └── AuthPage.tsx         # 登录注册
│   ├── services/
│   │   ├── api.ts               # 云端 API 层
│   │   └── ai.ts                # AIAC 搜索服务
│   ├── store/
│   │   ├── index.ts             # 创作状态管理 (Zustand)
│   │   └── auth.ts              # 用户认证状态
│   ├── types/index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### 技术栈

| 层 | 技术 |
|---|---|
| 桌面壳 | Electron 28 |
| 前端框架 | React 18 + TypeScript |
| 样式 | Tailwind CSS（墨韵设计系统） |
| 路由 | React Router v6 (Hash) |
| 状态管理 | Zustand |
| 图标 | Lucide React |
| 构建 | Vite + vite-plugin-electron |
| 打包 | electron-builder → DMG / EXE / ZIP |
| 后端 | Express + better-sqlite3 |
| 鉴权 | bcryptjs + jsonwebtoken (JWT) |
| 部署 | Ubuntu + PM2 (156.239.236.41:3001) |

---

## API 一览

| 端点 | 方法 | 鉴权 | 说明 |
|---|---|---|---|
| `/api/auth/register` | POST | 否 | 注册 {username, password} |
| `/api/auth/login` | POST | 否 | 登录 |
| `/api/auth/me` | GET | 是 | 获取当前用户 |
| `/api/community` | GET | 否 | 作品列表（分页） |
| `/api/community` | POST | 是 | 发布作品 |
| `/api/community/:id` | DELETE | 是 | 删除作品（仅自己） |
| `/api/community/:id/like` | POST | 是 | 点赞 |
| `/api/commissions` | GET | 否 | 约稿列表（分页） |
| `/api/commissions` | POST | 是 | 发布约稿 |
| `/api/commissions/:id` | PATCH | 是 | 更新状态/信息 |
| `/api/commissions/:id` | DELETE | 是 | 删除约稿（仅自己） |
| `/api/commissions/:id/bids` | POST | 是 | 应征出价 |

---

## 路线图

- [x] 填词模式 — 粘贴原曲、逐行编辑、字数限制
- [x] 原创模式 — 自由编辑区
- [x] 意象填写区 — 标签 + 情感基调
- [x] 查资料区 — 搜索素材/典故/韵脚
- [x] 最终歌词区 — 预览/复制/导出
- [x] 墨韵设计系统 — 宣纸底色 + 焦墨 + 朱砂
- [x] 用户注册登录 — bcrypt + JWT
- [x] 社区广场 — 发布作品/点赞/删除
- [x] 约稿中心 — 需求/应征/状态流转
- [x] Mac DMG 打包
- [x] Windows exe / zip 打包
- [ ] 接入真实 AI API
- [ ] 暗色模式
- [ ] 评论功能
- [ ] Linux 打包支持

---

## 贡献

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'feat: 添加某功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

---

MIT
