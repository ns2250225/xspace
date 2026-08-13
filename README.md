# Infinite Canvas（无限空间画布）

Infinite Canvas 是一款基于 Vue 3、TypeScript、Tauri 2、Rust 和 SQLite 构建的本地优先桌面应用。它将文字、图片、音视频、文档、网页链接及任意文件统一组织在可无限平移和缩放的二维画布中。

## 核心特性

- 创建、打开、迁移多个本地 Workspace
- 无限画布平移、缩放、Mini Map、视口裁剪及 LOD 渲染
- 文字、图片、视频、音频、文件、链接、PDF、Markdown、Code、Frame 节点
- 文件拖放导入、批量网格排列、SHA-256 自动去重
- 图片大图预览、视频和音频播放、PDF 内置阅读
- Markdown 排版预览和代码语法高亮
- 多选、框选、移动、缩放、旋转、分组、对齐和图层管理
- 节点连线、连线选择与删除
- SQLite 事务自动保存、软删除、回收站和崩溃状态检测
- 画布、节点、文件名及文件正文全文搜索
- 所有资源完整托管在 Workspace 内，不依赖原始文件路径

## 技术栈

| 模块 | 技术 |
| --- | --- |
| 前端 | Vue 3、TypeScript、Pinia、Vite |
| 桌面框架 | Tauri 2 |
| 后端 | Rust |
| 数据库 | SQLite（WAL） |
| 空间索引 | RBush |
| 文档渲染 | markdown-it、highlight.js |
| PDF 文本提取 | pdf-extract |

## 环境要求

- Node.js 20 或更高版本
- Rust stable 工具链
- Windows 10/11
- Visual Studio 2022 Build Tools
  - Desktop development with C++
  - Windows SDK

## 安装依赖

项目已配置 npm 国内镜像：

```powershell
npm install
```

Cargo 可在 `%USERPROFILE%\.cargo\config.toml` 中配置 rsproxy：

```toml
[source.crates-io]
replace-with = "rsproxy-sparse"

[source.rsproxy-sparse]
registry = "sparse+https://rsproxy.cn/index/"
```

## 开发运行

```powershell
npm run tauri -- dev
```

仅预览前端界面：

```powershell
npm run dev
```

浏览器预览模式使用 localStorage 降级存储，不支持完整的文件托管能力。文件导入、SQLite 和系统程序调用需要在 Tauri 桌面模式下运行。

## Windows Release 构建

仅构建单一裸 EXE（不生成安装程序）：

```powershell
$env:Path="$env:USERPROFILE\.cargo\bin;$env:Path"
npm run tauri -- build --no-bundle
```

构建结果：

```text
src-tauri/target/release/infinite-canvas.exe
```

正式版使用 Windows GUI 子系统，启动时不会显示控制台黑框。

## Workspace 目录结构

```text
MyWorkspace/
├── workspace.db
├── assets/
│   ├── images/
│   ├── videos/
│   ├── audios/
│   └── files/
├── thumbnails/
├── cache/
├── recovery/
└── trash/
```

文件导入后会被复制到 Workspace，并以 SHA-256 命名。移动或删除原始文件不会影响画布内容。复制整个 Workspace 目录即可完成迁移和备份。

## 常用操作

| 操作 | 快捷键/方式 |
| --- | --- |
| 创建文字 | 双击画布空白处或点击工具栏文字按钮 |
| 平移画布 | 鼠标中键拖动或 `Space + 左键` |
| 缩放 | `Ctrl + 鼠标滚轮` |
| 搜索 | `Ctrl + K` |
| 全选 | `Ctrl + A` |
| 删除 | `Delete` |
| 复制节点 | `Ctrl + D` |
| 隐藏/呼出软件 | `Ctrl + Shift + Space`（全局快捷键） |
| 粘贴链接 | 复制 URL 后按 `Ctrl + V`，自动创建链接卡片 |
| 粘贴文字 | 复制文字后按 `Ctrl + V`，自动创建文字卡片 |
| 粘贴图片/截图 | 复制图片或截图后按 `Ctrl + V`，自动托管并创建图片卡片 |
| 重命名文件 | 右键文件卡片，选择“重命名文件名” |
| 图片预览 | 双击图片 |
| 打开链接 | 双击链接卡片 |
| 打开文件 | 双击文件卡片 |

`Ctrl + Shift + Space` 使用系统级全局快捷键注册，因此软件窗口隐藏后仍可再次呼出。如果该组合已被其他软件占用，需要先释放冲突的快捷键。

## 数据安全

- 资源导入先写入 `cache/import`，成功后执行原子移动
- SQLite 使用 WAL 和事务写入
- 删除节点不会立即删除物理资源
- 相同 SHA-256 的文件只保存一份
- Workspace 关闭状态通过 `recovery/dirty` 检测

## 项目结构

```text
src/                       Vue 前端
├── components/            画布、节点和应用界面
├── canvas/                历史记录等画布逻辑
├── services/              Tauri IPC 封装
└── stores/                Pinia 状态管理

src-tauri/                 Tauri/Rust 后端
├── src/db.rs              SQLite Schema 与数据读取
├── src/lib.rs             Workspace、文件和搜索命令
├── src/models.rs          数据模型
└── capabilities/          Tauri 权限配置
```

## 验证命令

```powershell
npx vue-tsc --noEmit
cargo check --manifest-path src-tauri\Cargo.toml
npm run build
```

## 开源协议

当前仓库暂未声明开源许可证。如需分发或二次使用，请先联系项目维护者。
