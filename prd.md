# 无限空间画布桌面软件 PRD

> 产品代号：Infinite Canvas
> 产品类型：本地优先无限空间画布桌面应用
> 技术栈：Vue 3 + TypeScript + Tauri 2 + Rust + SQLite
> 平台：Windows 优先，架构兼容 macOS / Linux
> 数据模式：Local First / 全托管 Workspace
> PRD 版本：v1.0

---

# 1. 产品概述

## 1.1 产品背景

传统文件管理依赖：

```text
磁盘
└── 文件夹
    └── 子文件夹
        └── 文件
```

随着图片、视频、音频、网页链接、文档等内容越来越多，层级式文件夹逐渐难以表达内容之间的空间关系和逻辑关系。

本产品希望提供一种新的内容组织方式：

> 文件不再只属于文件夹，也可以属于空间。

用户可以创建无限大小的画布，并将：

* 文字
* 图片
* 视频
* 音频
* 任意文件
* 网页链接

放置在画布中的任意位置。

用户通过位置、分组、区域、连线等方式建立内容之间的关系。

---

# 2. 产品定位

产品定位为：

> 一个本地优先、支持任意数字内容的无限空间画布桌面软件。

它同时具有：

* 无限白板
* 素材管理
* 文件管理
* 知识整理
* 灵感收集
* 项目资料管理

等能力。

核心不是“绘画”，而是：

> 在无限二维空间中组织自己的数字内容。

---

# 3. 产品目标

## 3.1 核心目标

用户能够：

1. 创建多个 Workspace。
2. 在 Workspace 中创建多个无限画布。
3. 将任意内容拖入画布。
4. 自由移动、缩放和组织内容。
5. 使用空间位置表达内容关系。
6. 使用连线表达逻辑关系。
7. 使用 Frame 管理不同内容区域。
8. 快速搜索并定位任何内容。
9. 完全离线使用。
10. 将整个 Workspace 迁移到其他电脑。

---

# 4. 产品原则

## 4.1 Local First

核心功能必须完全离线运行。

包括：

* 创建画布
* 编辑文字
* 导入图片
* 播放视频
* 播放音频
* 管理文件
* 搜索
* 自动保存
* 数据恢复

除网页链接信息抓取外，不依赖网络服务。

---

## 4.2 全托管 Workspace

本产品不提供“引用外部文件”模式。

任何文件进入画布：

```text
原始文件
↓
复制
↓
Workspace Assets
↓
创建 Asset
↓
创建 Node
```

画布绝不直接依赖：

```text
C:\Users\xxx\Downloads\a.png
D:\Photos\a.jpg
```

等外部路径。

用户删除或者移动原始文件，不影响 Workspace。

---

## 4.3 非破坏性管理

导入文件后：

* 不修改原文件
* 不移动原文件
* 不删除原文件

只复制一份进入 Workspace。

---

## 4.4 自动保存

原则上不设置传统：

```text
文件 → 保存
```

操作。

所有修改自动保存。

---

## 4.5 操作优先

尽量减少：

```text
点击工具
→
选择类型
→
选择文件
→
创建
```

这种操作链。

优先支持：

```text
拖进去就能用
```

例如：

```text
拖图片 → 图片节点

拖视频 → 视频节点

拖 PDF → 文件节点

粘贴 URL → 链接节点

双击空白 → 文字节点
```

---

# 5. 产品信息架构

```text
Application
│
├── Workspace
│   │
│   ├── Canvas
│   │   ├── Text Node
│   │   ├── Image Node
│   │   ├── Video Node
│   │   ├── Audio Node
│   │   ├── File Node
│   │   ├── Link Node
│   │   ├── Frame
│   │   └── Group
│   │
│   ├── Asset Library
│   │   ├── Images
│   │   ├── Videos
│   │   ├── Audios
│   │   └── Files
│   │
│   ├── Tags
│   │
│   ├── Search
│   │
│   └── Trash
│
└── Settings
```

---

# 6. Workspace 系统

## 6.1 创建 Workspace

首页提供：

```text
+ 创建工作区

打开工作区

最近使用
```

创建时填写：

* Workspace 名称
* 保存位置

例如：

```text
D:\InfiniteCanvas\MyProject
```

---

# 7. Workspace 文件结构

推荐：

```text
MyProject/
│
├── workspace.db
│
├── assets/
│   ├── images/
│   ├── videos/
│   ├── audios/
│   └── files/
│
├── thumbnails/
│
├── cache/
│
├── recovery/
│
└── trash/
```

其中：

### workspace.db

SQLite 数据库。

保存：

* Canvas
* Node
* Asset
* Edge
* Frame
* Group
* Tag
* 设置
* 历史记录

---

# 8. Asset 系统

Asset 是 Workspace 内实际保存的资源。

例如用户拖入：

```text
D:\Downloads\cat.png
```

系统执行：

```text
cat.png
↓
计算 SHA-256
↓
检查是否已经存在
↓
复制到 Workspace
↓
生成 Asset
↓
生成 Thumbnail
↓
创建 Node
```

---

# 9. 文件去重

所有文件导入前计算：

```text
SHA-256
```

例如：

```text
cat.png

SHA256:
7F4A81C29D...
```

数据库发现已经存在相同 Hash：

```text
不再次复制文件
```

直接使用已有 Asset。

因此：

```text
Canvas A
 └─ cat.png

Canvas B
 └─ cat.png

Canvas C
 └─ cat.png
```

实际上只有：

```text
assets/images/7f4a81c29d.png
```

一个物理文件。

---

# 10. Asset 数据模型

```text
Asset

id
type
original_name
storage_name
extension
mime_type
size
hash
width
height
duration
thumbnail_path
created_at
updated_at
```

---

# 11. 内部文件命名

禁止直接使用：

```text
assets/images/cat.png
```

推荐：

```text
assets/images/
7f4a81c29d82c7137....png
```

数据库保存：

```text
original_name:
cat.png

storage_name:
7f4a81c29d82c7137....png
```

避免：

* 文件重名
* 特殊字符
* 超长文件名
* 路径冲突

---

# 12. Canvas 系统

## 12.1 无限空间

Canvas 没有固定宽度和高度。

内部使用：

```text
World Coordinate System
```

例如：

```text
Node A
x = -23892
y = 58120

Node B
x = 182932
y = -38210
```

Viewport 只负责显示世界坐标的一部分。

---

# 13. Canvas 操作

## 平移

支持：

```text
鼠标中键拖动

Space + 左键拖动

触控板移动
```

---

## 缩放

支持：

```text
Ctrl + 鼠标滚轮

触控板 Pinch
```

推荐：

```text
5% ~ 800%
```

---

## 快速操作

```text
双击空白
→
创建文字

拖入文件
→
创建对应 Node

Ctrl + V
→
粘贴内容

Delete
→
删除

Ctrl + Z
→
Undo

Ctrl + Shift + Z
→
Redo

Ctrl + A
→
全选

Ctrl + G
→
Group

Ctrl + K
→
搜索
```

---

# 14. Node 系统

所有画布内容统一抽象为：

```text
Node
```

基础模型：

```text
Node

id
canvas_id
type

x
y

width
height

rotation
z_index

title

content_json
style_json

created_at
updated_at
```

---

# 15. Node 类型

MVP 支持：

```text
text
image
video
audio
file
link
frame
```

后续扩展：

```text
pdf
markdown
code
table
webpage
shape
portal
```

---

# 16. 文字节点

## 创建

用户：

```text
双击空白
```

直接进入文字输入状态。

---

## 功能

支持：

* 普通文本
* 标题
* 粗体
* 斜体
* 删除线
* 列表
* Checkbox
* 超链接
* 字号
* 字体颜色
* 背景颜色
* 文本对齐

后续可以支持 Markdown。

---

# 17. 图片节点

支持：

```text
PNG
JPG
JPEG
GIF
WebP
AVIF
SVG
BMP
```

功能：

* 拖入创建
* 剪贴板粘贴
* 缩放
* 旋转
* 裁剪
* 查看原图
* 导出原图
* 复制图片
* 查看文件信息

---

# 18. 图片缩略图

禁止画布一直加载原图。

例如：

```text
原图

8000 × 6000
30 MB
```

导入后生成：

```text
256px
512px
1024px
```

不同等级缩略图。

根据 Zoom Level 动态选择。

---

# 19. 视频节点

支持常见视频格式：

```text
MP4
WebM
MOV
MKV
AVI
```

具体播放能力取决于系统和媒体解码方案。

---

## 视频节点 UI

```text
┌───────────────────────┐
│                       │
│                       │
│         ▶             │
│                       │
│                       │
├───────────────────────┤
│ demo.mp4        03:42 │
└───────────────────────┘
```

---

## 视频功能

支持：

* 播放
* 暂停
* 进度
* 音量
* 倍速
* 全屏
* 查看文件信息
* 导出原文件

导入视频时自动提取：

* 时长
* 分辨率
* 封面

---

# 20. 音频节点

支持：

```text
MP3
WAV
FLAC
AAC
M4A
OGG
```

UI：

```text
meeting.mp3

▶ ━━━━━╱╲━━╱╲━━━━━━

01:32 / 04:23
```

支持：

* 播放
* 暂停
* 拖动进度
* 音量
* 倍速
* 波形
* 导出

---

# 21. 普通文件节点

允许用户拖入任意文件。

例如：

```text
PDF
DOCX
XLSX
PPTX
ZIP
RAR
PSD
BLEND
EXE
TXT
JSON
源码
```

无法预览时显示文件卡片。

例如：

```text
┌────────────────────────┐
│ 📦                     │
│                        │
│ project-source.zip     │
│                        │
│ ZIP · 136 MB           │
│                        │
│      [打开] [导出]      │
└────────────────────────┘
```

支持：

* 使用系统默认程序打开
* 导出文件
* 查看信息
* 重命名显示名称

注意：

系统程序打开的应该是：

```text
Workspace 内部 Asset
```

而不是用户原文件。

---

# 22. 链接节点

用户可以：

```text
Ctrl + V
```

粘贴：

```text
https://example.com
```

系统自动创建 Link Node。

---

## Link Preview

联网情况下抓取：

```text
title
description
favicon
preview image
```

显示：

```text
┌────────────────────────┐
│       Preview          │
├────────────────────────┤
│ Example Website        │
│ Website description... │
│                        │
│ example.com            │
└────────────────────────┘
```

离线或抓取失败：

```text
🔗 example.com

https://example.com
```

链接节点本身不属于外部文件引用机制。

---

# 23. Frame

Frame 用于划分画布区域。

例如：

```text
┌────────── UI 参考 ──────────┐
│                            │
│ [图片] [图片] [图片]        │
│                            │
│ [网站]       [说明]         │
│                            │
└────────────────────────────┘
```

Frame 支持：

* 标题
* 背景
* 边框
* 移动
* Resize
* 折叠
* 锁定

移动 Frame 时，可以移动内部所有 Node。

---

# 24. Group

用户框选多个 Node：

```text
Ctrl + G
```

创建 Group。

Group 支持：

* 整体移动
* 整体缩放
* 整体删除
* 解散 Group

---

# 25. Edge 连线

任意 Node 之间可以建立 Edge。

例如：

```text
需求
 │
 ↓
设计稿
 │
 ↓
开发
 │
 ↓
测试视频
```

支持：

* 直线
* 曲线
* 箭头
* 双向箭头
* 无箭头
* 标签

---

# 26. 多选

支持：

```text
Shift + Click

框选
```

选中多个 Node 后可以：

* 移动
* 删除
* Group
* 对齐
* 平均分布
* 复制
* 剪切

---

# 27. 对齐功能

支持：

```text
左对齐
右对齐
顶部对齐
底部对齐
水平居中
垂直居中

水平平均分布
垂直平均分布
```

---

# 28. 图层

每个 Node 保存：

```text
z_index
```

右键支持：

```text
置于顶层
置于底层
上移一层
下移一层
```

---

# 29. Mini Map

右下角提供 Mini Map。

例如：

```text
┌──────────────────┐
│  ■               │
│        ■■■       │
│                  │
│             ■    │
│      ┌───┐       │
│      │当前│       │
│      └───┘       │
└──────────────────┘
```

点击 Mini Map：

直接跳转对应区域。

---

# 30. Zoom To

提供：

```text
Zoom to All

Zoom to Selection

100%

Fit Frame
```

---

# 31. 搜索系统

快捷键：

```text
Ctrl + K
```

打开全局搜索。

搜索：

* Canvas 名称
* Node 文字
* 文件名
* 图片名称
* 视频名称
* 音频名称
* Link 标题
* Tag

---

## 搜索结果

例如：

```text
Search: API Design

Canvas
────────────────

Backend Architecture

Nodes
────────────────

📄 API Design.md
🔗 FastAPI Documentation
📝 API Design Notes
```

点击结果：

```text
打开 Canvas
↓
Camera 自动移动
↓
定位 Node
↓
高亮 Node
```

---

# 32. Asset Library

Workspace 提供统一素材库。

分类：

```text
All

Images

Videos

Audios

Files
```

显示：

```text
Thumbnail

名称

类型

大小

创建时间

使用次数
```

---

# 33. Asset 重复使用

一个 Asset 可以存在于多个 Canvas。

例如：

```text
Asset #102
cat.png

↓
Canvas A / Node #23

↓
Canvas B / Node #91

↓
Canvas C / Node #210
```

不会重复保存物理文件。

---

# 34. 删除机制

删除 Node：

```text
Node
↓
Trash
```

不要立即删除 Asset。

---

## Asset 垃圾回收

只有：

```text
Asset
↓
没有任何 Node 使用
↓
没有历史记录需要
↓
用户清空回收站
```

才允许删除实际文件。

---

# 35. 回收站

回收站包含：

* Canvas
* Node
* Asset

支持：

```text
恢复

永久删除

清空回收站
```

---

# 36. Undo / Redo

采用 Command Pattern。

例如：

```text
CreateNodeCommand

MoveNodeCommand

ResizeNodeCommand

DeleteNodeCommand

CreateEdgeCommand

DeleteEdgeCommand

GroupCommand
```

统一：

```text
execute()

undo()

redo()
```

---

# 37. 自动保存

Node 移动过程中：

不要持续写 SQLite。

采用：

```text
UI State
↓
Debounce
↓
300~500ms
↓
SQLite Transaction
```

鼠标释放时立即进行一次最终保存。

---

# 38. Crash Recovery

维护：

```text
recovery/
```

发生：

* 软件崩溃
* 系统关机
* SQLite 写入异常

时，下次启动检测恢复信息。

提示：

```text
检测到上次未正常关闭

[恢复工作区]

[忽略]
```

---

# 39. 性能架构

无限画布必须重点解决性能问题。

目标场景：

```text
10,000 Nodes

3,000 Images

300 Videos

大型 Canvas
```

---

# 40. Viewport Culling

禁止渲染全部 Node。

假设：

```text
Viewport

X:
10000 ~ 13000

Y:
5000 ~ 8000
```

只渲染：

```text
Viewport
+
预加载区域
```

中的 Node。

其他 Node：

```text
不创建完整 DOM
```

---

# 41. Spatial Index

Node 数量增加后，不能每帧：

```text
遍历全部 Node
```

推荐使用：

```text
R-Tree
```

或类似空间索引。

查询：

```text
Viewport Rectangle
↓
Spatial Index
↓
Visible Node IDs
```

---

# 42. LOD

Level Of Detail。

例如：

## Zoom < 10%

只显示：

```text
Node 色块
```

## 10% ~ 30%

显示：

```text
Thumbnail
Title
```

## > 30%

显示完整内容。

---

# 43. 视频性能

禁止：

```text
300 个 Video Node
=
300 个 video 同时加载
```

默认只显示：

```text
Video Thumbnail
```

用户点击播放时才初始化播放器。

同时限制活动播放器数量。

---

# 44. 图片性能

图片使用多级 Thumbnail：

```text
256
512
1024
Original
```

根据节点屏幕尺寸动态加载。

---

# 45. Canvas 渲染方案

MVP 推荐：

```text
Vue DOM
+
CSS Transform
+
Viewport Culling
+
Spatial Index
```

原因：

文字、视频、音频等天然适合 DOM。

---

## 后续架构

节点数量进一步增加后可以升级为：

```text
WebGL / WebGPU
        +
DOM Overlay
```

其中：

```text
WebGL
├── Edge
├── Shape
├── Background
└── Thumbnail

DOM
├── Text Editor
├── Video
├── Audio
└── Active Node
```

MVP 不要求实现。

---

# 46. SQLite 数据库设计

## workspaces

```sql
id
name
created_at
updated_at
```

---

## canvases

```sql
id
name
camera_x
camera_y
zoom
created_at
updated_at
```

---

## nodes

```sql
id
canvas_id
asset_id
type

x
y
width
height

rotation
z_index

title

content_json
style_json

created_at
updated_at
deleted_at
```

---

## assets

```sql
id

type

original_name
storage_name

extension
mime_type

size
hash

width
height
duration

thumbnail_path

created_at
updated_at
deleted_at
```

---

## edges

```sql
id

canvas_id

source_node_id
target_node_id

type
label

style_json

created_at
updated_at
```

---

## groups

```sql
id
canvas_id
name
created_at
```

---

## group_nodes

```sql
group_id
node_id
```

---

## tags

```sql
id
name
color
```

---

## node_tags

```sql
node_id
tag_id
```

---

# 47. 桌面端架构

推荐：

```text
Vue 3
+
TypeScript
+
Tauri 2
+
Rust
+
SQLite
```

整体：

```text
┌──────────────────────────┐
│          Vue 3           │
│                          │
│ Canvas                   │
│ Nodes                    │
│ Inspector                │
│ Sidebar                  │
│ Search                   │
└─────────────┬────────────┘
              │
          Tauri IPC
              │
┌─────────────▼────────────┐
│           Rust           │
│                          │
│ Workspace Manager        │
│ Asset Manager            │
│ File Importer            │
│ Thumbnail Generator      │
│ Media Metadata           │
│ Search                   │
│ SQLite                   │
│ Recovery                 │
└─────────────┬────────────┘
              │
        Local File System
```

---

# 48. 前端模块

推荐：

```text
src/
│
├── canvas/
│   ├── camera/
│   ├── renderer/
│   ├── selection/
│   ├── spatial/
│   ├── commands/
│   └── edges/
│
├── nodes/
│   ├── text/
│   ├── image/
│   ├── video/
│   ├── audio/
│   ├── file/
│   └── link/
│
├── workspace/
│
├── assets/
│
├── search/
│
├── history/
│
├── components/
│
├── stores/
│
└── utils/
```

---

# 49. Rust 模块

推荐：

```text
src-tauri/src/

workspace/

database/

assets/
├── importer
├── hash
├── thumbnail
└── metadata

files/

search/

recovery/

commands/
```

---

# 50. 主界面

```text
┌────────────────────────────────────────────────────────┐
│ ← →  Project / Inspiration                 🔍    ⚙     │
├──────────────┬─────────────────────────────────────────┤
│              │                                         │
│ WORKSPACE    │                                         │
│              │                                         │
│ Canvas       │               Infinite                  │
│              │                Canvas                   │
│ ○ Home       │                                         │
│ ○ Research   │        ┌──────────┐                     │
│ ○ Design     │        │  Image   │                     │
│ ○ Backend    │        └──────────┘                     │
│              │              │                          │
│ ASSETS       │              ↓                          │
│              │        ┌──────────┐                     │
│ Images       │        │   Note   │                     │
│ Videos       │        └──────────┘                     │
│ Audios       │                                         │
│ Files        │                                         │
│              │                                         │
│ Trash        │                           ┌───────────┐   │
│              │                           │ Mini Map  │   │
├──────────────┴───────────────────────────┴───────────┴───┤
│                                                63%      │
└────────────────────────────────────────────────────────┘
```

---

# 51. Inspector

选中 Node 后右侧出现属性面板。

例如：

```text
┌─────────────────────┐
│ Image               │
├─────────────────────┤
│                     │
│ Position            │
│ X    1820           │
│ Y    930            │
│                     │
│ Size                │
│ W    640            │
│ H    480            │
│                     │
│ Rotation            │
│ 0°                  │
│                     │
│ Appearance          │
│ Opacity   100%      │
│ Radius     8        │
│                     │
│ File                │
│ cat.png             │
│ 4.3 MB              │
│                     │
│ [Export Original]   │
└─────────────────────┘
```

---

# 52. 右键菜单

Node：

```text
打开

重命名

复制

剪切

删除

────────

置于顶层

置于底层

────────

Group

Add to Frame

────────

导出原文件

文件信息
```

Canvas：

```text
创建文字

导入文件

粘贴

创建 Frame

全选

Zoom to All
```

---

# 53. 文件导入体验

支持：

## Drag & Drop

从 Windows Explorer：

```text
选中 100 个文件
↓
拖入 Canvas
```

系统自动：

```text
导入
↓
去重
↓
生成 Asset
↓
生成 Thumbnail
↓
创建 Nodes
↓
自动排列
```

---

# 54. 批量导入布局

多个文件同时拖入时，不要重叠。

自动采用：

```text
Grid Layout
```

例如：

```text
[1] [2] [3] [4]

[5] [6] [7] [8]

[9] [10]
```

用户之后可以自由调整。

---

# 55. 剪贴板

支持：

```text
Ctrl + C
Ctrl + V
```

处理：

### 文字

创建 Text Node。

### 图片

导入 Workspace 并创建 Image Node。

### URL

创建 Link Node。

### 文件

导入 Asset 并创建对应 Node。

---

# 56. Workspace 迁移

由于所有资源都托管在 Workspace：

```text
MyProject/
```

因此整个文件夹可以直接：

```text
复制
↓
移动到另一台电脑
↓
打开
```

所有内容保持完整。

---

# 57. Workspace 打包

后续提供：

```text
File
↓
Export Workspace
```

生成：

```text
MyProject.canvaspack
```

本质可以采用 ZIP 容器。

包含：

```text
workspace.db
assets/
thumbnails/
```

不包含：

```text
cache/
recovery/
```

---

# 58. Workspace 导入

用户双击：

```text
MyProject.canvaspack
```

系统：

```text
选择保存目录
↓
解包
↓
校验数据库
↓
校验 Assets
↓
打开 Workspace
```

---

# 59. 大文件导入

视频等可能达到数 GB。

导入必须：

```text
异步执行
```

不能阻塞 UI。

显示：

```text
正在导入

video.mp4

██████████████░░░  82%

2.3 GB / 2.8 GB
```

支持取消。

---

# 60. 导入失败处理

可能出现：

```text
磁盘空间不足

文件被占用

文件读取失败

权限不足

文件损坏
```

失败时：

```text
不创建无效 Asset
不留下半成品文件
```

临时文件统一进入：

```text
cache/import/
```

导入成功后执行原子移动。

---

# 61. 数据完整性

Workspace 启动时可以执行快速检查：

```text
SQLite
↓
Asset Table
↓
检查实际文件
```

发现：

```text
Asset 记录存在
但文件不存在
```

标记：

```text
Missing Asset
```

并允许：

```text
从备份恢复
删除无效节点
```

---

# 62. 快捷键

| 操作         | 快捷键              |
| ---------- | ---------------- |
| 搜索         | Ctrl + K         |
| Undo       | Ctrl + Z         |
| Redo       | Ctrl + Shift + Z |
| Copy       | Ctrl + C         |
| Paste      | Ctrl + V         |
| Cut        | Ctrl + X         |
| Delete     | Delete           |
| Select All | Ctrl + A         |
| Group      | Ctrl + G         |
| Ungroup    | Ctrl + Shift + G |
| Duplicate  | Ctrl + D         |
| Zoom In    | Ctrl + +         |
| Zoom Out   | Ctrl + -         |
| Zoom 100%  | Ctrl + 0         |
| 移动画布       | Space + Drag     |

---

# 63. MVP 范围

第一版本重点实现：

### Workspace

* 创建 Workspace
* 打开 Workspace
* 最近 Workspace
* 自动保存

### Canvas

* 创建
* 删除
* 重命名
* 无限平移
* 无限坐标
* Zoom
* Mini Map

### Node

* Text
* Image
* Video
* Audio
* File
* Link

### 操作

* Drag & Drop
* Move
* Resize
* Rotate
* Multi Select
* Copy
* Paste
* Delete
* Undo
* Redo

### 组织

* Group
* Frame
* Edge
* Layer

### Asset

* 全托管导入
* SHA-256 去重
* Thumbnail
* Asset Library
* 导出原文件

### Search

* Canvas 搜索
* 文字搜索
* 文件名搜索
* Link 搜索

### 数据

* SQLite
* 自动保存
* Crash Recovery
* Trash

---

# 64. MVP 明确不做

第一版本不实现：

* 用户系统
* 云同步
* 多人协作
* AI
* OCR
* 音频转写
* 在线账户
* 插件市场
* 移动端
* Web 版
* 外部文件引用
* 实时文件同步

保证核心：

> Infinite Canvas + Asset Management

足够稳定以后再扩展。

---

# 65. V1.1

增加：

* PDF 内置阅读
* Markdown Node
* Code Node
* 文件全文搜索


# 68. 性能指标

MVP 建议制定以下目标：

### 启动

普通 Workspace：

```text
< 2 秒
```

### Canvas

目标支持：

```text
10,000 Nodes
```

仍可以正常浏览。

### 平移

目标：

```text
60 FPS
```

普通画布下保持流畅。

### Zoom

缩放过程中：

```text
目标 60 FPS
```

### 大图片

禁止因为超大图片导致 Canvas 明显卡顿。

### 视频

未播放 Video Node：

```text
不得初始化完整播放器
```

---

# 69. 数据安全指标

必须保证：

```text
软件崩溃
≠
Workspace 损坏

Node 删除
≠
立即删除 Asset

导入失败
≠
产生损坏 Asset

原文件删除
≠
Canvas 文件丢失
```

数据库重要写操作必须使用：

```text
SQLite Transaction
```

---

# 70. 核心用户流程

## 第一次使用

```text
启动软件
↓
创建 Workspace
↓
创建 Canvas
↓
进入无限画布
↓
拖入图片/视频/文件
↓
自动导入 Workspace
↓
自动创建 Node
↓
自由排列
↓
自动保存
```

整个过程中用户不需要理解：

```text
Asset
Hash
SQLite
Workspace 内部路径
```

这些属于底层实现。

---

# 71. 核心体验要求

整个产品开发过程中优先保证以下体验：

### 第一优先级

```text
Canvas 平移和缩放必须极其流畅
```

### 第二优先级

```text
任何文件拖进去都应该有反馈
```

### 第三优先级

```text
文件绝不能莫名其妙丢失
```

### 第四优先级

```text
1000+ Node 后依然可以正常使用
```

### 第五优先级

```text
搜索后必须能够瞬间找到内容
```

---

# 72. 验收场景

## 场景 A：图片资料整理

用户一次拖入：

```text
100 张图片
```

系统：

* 成功导入
* 自动生成缩略图
* 自动创建 Node
* 自动排列
* Canvas 保持流畅

---

## 场景 B：大型视频

拖入：

```text
5 GB MP4
```

系统：

* 后台复制
* 显示进度
* UI 不冻结
* 完成后生成封面
* 可以播放
* 原视频删除后仍可播放

---

## 场景 C：重复文件

用户将相同图片拖入：

```text
Canvas A

Canvas B

Canvas C
```

Workspace：

```text
只保存一份 Asset
```

---

## 场景 D：原文件删除

用户：

```text
拖入 cat.png
↓
导入成功
↓
删除电脑原始 cat.png
```

Canvas：

```text
图片仍然正常显示
```

---

## 场景 E：迁移

用户：

```text
复制 Workspace
↓
另一台电脑
↓
打开
```

所有：

* Canvas
* Node
* 图片
* 视频
* 音频
* 文件
* 连线
* Frame

全部正常。

---

# 73. 最终产品架构

```text
                    Infinite Canvas
                          │
             ┌────────────┴────────────┐
             │                         │
          Canvas                    Workspace
             │                         │
     ┌───────┼────────┐          ┌─────┴─────┐
     │       │        │          │           │
    Node    Frame    Edge       SQLite      Assets
     │                              │           │
 ┌───┼──────────────┐               │      ┌────┼────┐
 │   │    │    │    │               │      │    │    │
Text Img Video Audio File           Data   Img Video File
 │
Link
```

其中：

**Canvas 负责空间。**

**Node 负责内容。**

**Asset 负责文件。**

**SQLite 负责关系和状态。**

**Workspace 负责把所有东西完整地装在一起。**

---

# 74. 产品核心原则总结

整个项目开发过程中坚持以下原则：

1. **无限空间，而不是固定页面。**
2. **所有内容统一抽象为 Node。**
3. **所有文件必须导入 Workspace。**
4. **禁止引用电脑上的外部文件。**
5. **同一文件通过 Hash 自动去重。**
6. **文件与 Node 分离，一个 Asset 可以被多个 Node 使用。**
7. **所有操作自动保存。**
8. **删除 Node 不立即删除 Asset。**
9. **大图片只加载缩略图。**
10. **视频默认只加载封面。**
11. **屏幕外 Node 不进行完整渲染。**
12. **空间索引负责大规模 Node 查询。**
13. **Workspace 必须能够完整迁移和备份。**
14. **任何时候优先保证用户数据安全。**
15. **第一版不被 AI、云同步和协作功能拖慢。**

最终希望形成的核心体验是：

> **把任何东西拖进来，放到你想放的位置，然后再也不用担心它在哪里。**
