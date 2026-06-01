# 🎵 词伴 Lyrics Mate

> 跨平台歌词写作助手 — 填词模式 & 原创模式，让每句歌词都有章可循。

![](https://img.shields.io/badge/platform-macOS%20%7C%20Windows-9cf)
![](https://img.shields.io/badge/built%20with-Electron%20%2B%20React-61DAFB)
![](https://img.shields.io/badge/license-MIT-green)

---

## 功能特性

| 核心功能 | 说明 |
|---|---|
| **填词模式** | 粘贴原歌词 → 自动拆分逐行，设定每句字数上限，逐行改写 |
| **原创模式** | 自由创作区，纯净编辑器，专注写词 |
| **意象填写区** | 关键词标签 + 10种情感基调选择 |
| **查资料区 (AIAC)** | AI 辅助搜索歌词素材、诗词典故、押韵词库、流行歌曲参考 |
| **最终歌词区** | 实时预览 + 一键复制 + 导出 TXT |
| **社区广场** | ⏳ 即将推出 — 分享作品、交流灵感 |
| **约稿中心** | ⏳ 即将推出 — 发布/承接歌词创作需求 |

---

## 界面预览

```
┌──────────────┬────────────────────────┬──────────────┐
│              │   [填词模式] [原创模式]  │              │
│  意象填写区   │                        │   最终歌词    │
│  ┌──────────┐│   ┌──────────────────┐ │  ┌──────────┐│
│  │ 标签输入  ││   │  粘贴原歌词到这 →  │ │  │   歌名    ││
│  │ 🌞温暖   ││   │  [粘贴] [解析]    │ │  │          ││
│  │ 🌧️伤感   ││   │                  │ │  │ 第一行... ││
│  │ 🔥激昂   ││   │ 1 [____输入___] 余│ │  │ 第二行... ││
│  └──────────┘│   │ 2 [____输入___] 余│ │  │          ││
│              │   │ + 添加行          │ │  │ [复制][导出]│
│  查资料区     │   └──────────────────┘ │  └──────────┘│
│  ┌──────────┐│                        │              │
│  │ AI 搜索  ││                        │              │
│  │ 结果列表  ││                        │              │
│  │ 备忘笔记  ││                        │              │
│  └──────────┘│                        │              │
└──────────────┴────────────────────────┴──────────────┘
```

---

## 安装使用

### 方式一：下载安装包

| 平台 | 下载 |
|---|---|
| macOS | 从 [Releases](https://github.com/stellartraveler5162-SLCG/lyrics-mate/releases) 下载 `.dmg`，双击挂载后拖入 **Applications** |
| Windows | 下载 `词伴 Lyrics Mate Setup 1.0.0.exe` 安装包，双击安装；或下载 `.zip` 解压即用 |

### 方式二：源码运行

```bash
# 克隆仓库
git clone https://github.com/stellartraveler5162-SLCG/lyrics-mate.git
cd lyrics-mate

# 安装依赖
npm install

# 启动开发服务器（浏览器预览）
npm run dev

# 启动 Electron 桌面应用
npm run electron:dev

# 打包 DMG 安装包
npm run build:dmg

# 打包 Windows 安装包
npm run build:win
```

### 环境要求

- Node.js >= 18
- macOS (Electron 桌面模式)
- 浏览器预览模式跨平台

---

## 使用教程

### 填词模式（有原歌词）

1. 在左侧 **意象填写区** 添加关键词标签（如「月光」「离别」），选择情感基调（如「伤感」）
2. 在 **查资料区** 搜索相关素材、典故、韵脚，获取灵感
3. 将原歌词复制粘贴到中间的粘贴区，点击 **解析** 或直接 `⌘V`
4. 歌词自动拆分为逐行，每行输入框可编辑修改
5. 右侧 **字数上限** 可逐行调整（1-20字）
6. 右侧 **剩余字数计数器** 用颜色提示：灰→橙→红
7. 编辑结果实时显示在右侧 **最终歌词区**
8. 点击 **复制** 或 **导出 TXT** 保存

### 原创模式（从零创作）

1. 设定意象标签和情感基调
2. 在查资料区搜索灵感素材
3. 在原创编辑区自由创作
4. 实时预览 → 导出

---

## 项目架构

```
lyrics-mate/
├── electron/
│   ├── main.ts            # Electron 主进程
│   └── preload.ts         # IPC 桥接
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx        # 侧边导航
│   │   ├── ImageryPanel.tsx   # 意象填写区
│   │   ├── ResearchPanel.tsx  # 查资料区 (AIAC)
│   │   ├── FillModeEditor.tsx # 填词模板编辑器
│   │   ├── FreeModeEditor.tsx # 原创编辑器
│   │   └── LyricsPreview.tsx  # 最终歌词预览
│   ├── pages/
│   │   ├── HomePage.tsx       # 创作主页
│   │   ├── CommunityPage.tsx  # 社区 (预留)
│   │   └── CommissionPage.tsx # 约稿 (预留)
│   ├── services/
│   │   └── ai.ts             # AIAC 搜索服务
│   ├── store/
│   │   └── index.ts          # Zustand 状态管理
│   ├── types/
│   │   └── index.ts          # TypeScript 类型
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── .gitignore
```

### 技术栈

| 层 | 技术 |
|---|---|
| 桌面壳 | Electron 28 |
| 前端框架 | React 18 + TypeScript |
| 样式 | Tailwind CSS |
| 路由 | React Router v6 |
| 状态管理 | Zustand |
| 图标 | Lucide React |
| 构建 | Vite + vite-plugin-electron |
| 打包 | electron-builder → DMG / ZIP |

---

## 路线图

- [x] 填词模式 — 粘贴原曲、逐行编辑、字数限制
- [x] 原创模式 — 自由编辑区
- [x] 意象填写区 — 标签 + 情感基调
- [x] 查资料区 — AIAC 搜索素材/典故/韵脚
- [x] 最终歌词区 — 预览/复制/导出
- [x] Mac DMG 打包
- [x] Windows exe / zip 打包
- [ ] 社区广场 — 分享作品、评论互动
- [ ] 约稿中心 — 发布/承接歌词创作需求
- [ ] 接入真实 AI API
- [ ] 多曲目项目管理
- [ ] 暗色模式

---

## 贡献

欢迎提交 Issue 和 Pull Request！如果你有任何想法或建议，请：

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'feat: 添加某功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

---

## License

MIT © stellartraveler
