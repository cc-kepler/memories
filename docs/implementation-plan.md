# 执行步骤

## 阶段总览

| Phase | 名称 | 依赖 | 预计文件数 |
|-------|------|------|-----------|
| 0 | 项目基础设施 | 无 | ~15 |
| 1 | 认证系统 | Phase 0 | ~3 |
| 2 | 开场页 | Phase 1 | ~1 |
| 3 | 主页双入口 | Phase 1 | ~4 |
| 4 | 时间轴页 | Phase 1 + Supabase 建表 | ~6 |
| 5 | 城市地图页 | Phase 1 + Supabase 建表 | ~5 |
| 6 | 收尾部署 | Phase 2-5 全部完成 | ~2 |

---

## Phase 0：项目基础设施 ✅

**入口条件：** 无
**完成标准：** `npm run dev` 能启动，页面显示正确
**任务列表：**
- [x] 0.1 用 Vite 创建 React + TypeScript 项目
- [x] 0.2 安装依赖
- [x] 0.3 创建标准文件夹结构
- [x] 0.4 创建 CLAUDE.md
- [x] 0.5 创建 docs/ 下 5 份标准文件
- [x] 0.6 创建 devlog/ 文件夹
- [x] 0.7 配置 Tailwind CSS、React Router
- [x] 0.8 初始化 Supabase 客户端 + .env 模板
- [ ] 0.9 验证：npm run dev 能启动

---

## Phase 1：认证系统

**入口条件：** Phase 0 完成
**完成标准：** 能注册账号 → 登录 → 进入主页骨架
**任务列表：**
- [ ] 1.1 用户手动创建 Supabase 项目
- [ ] 1.2 用户填写 .env 配置
- [ ] 1.3 Supabase Dashboard 启用 Email Auth
- [ ] 1.4 AuthContext 已完成
- [ ] 1.5 /login 页面已完成
- [ ] 1.6 ProtectedRoute 已完成
- [ ] 1.7 验证：完整注册登录流程

## Phase 2：开场页

**入口条件：** Phase 1 完成
**完成标准：** 开场 Loading → Enter → 登录/主页 流程走通
**任务列表：**
- [ ] 2.1 OpeningPage 组件已完成
- [ ] 2.2 进度条动画
- [ ] 2.3 Loading Memories 文字
- [ ] 2.4 Enter 按钮淡入+呼吸发光
- [ ] 2.5 Enter 后登录检查
- [ ] 2.6 验证完整流程

## Phase 3：主页双入口

**入口条件：** Phase 1 完成（无需等 Phase 2）
**完成标准：** 主页 TIME 信封 + MAP 3D 地球正常展示和跳转
**任务列表：**
- [ ] 3.1 /home 页面骨架（左右分栏）
- [ ] 3.2 EnvelopePanel（TIME 艺术字 + CSS 3D 信封 + 火漆）
- [ ] 3.3 GlobePanel（MAP 艺术字 + Three.js 3D 地球 + 星光）
- [ ] 3.4 点击信封 → /timeline
- [ ] 3.5 点击地球 → /map
- [ ] 3.6 响应式适配
- [ ] 3.7 验证

## Phase 4：时间轴页

**入口条件：** Supabase 建表 + Phase 1
**完成标准：** 日志 CRUD + 照片 CRUD + 日期联动
**任务列表：**
- [ ] 4.1 Supabase 创建 logs 和 photos 表
- [ ] 4.2 Supabase 创建 Storage bucket
- [ ] 4.3 DateSelector（只列有内容的日期）
- [ ] 4.4 LogList + LogEditor
- [ ] 4.5 PhotoGrid
- [ ] 4.6 图片压缩上传
- [ ] 4.7 默认展示最早记录
- [ ] 4.8 响应式
- [ ] 4.9 验证

## Phase 5：城市地图页

**入口条件：** Supabase 建表 + Phase 1
**完成标准：** SVG 地图 + 城市激活 + 照片画廊
**任务列表：**
- [ ] 5.1 ChinaMap SVG 组件（71 个城市）
- [ ] 5.2 激活/未激活视觉
- [ ] 5.3 点击城市 → 照片画廊浮层
- [ ] 5.4 照片 CRUD（关联城市+日期）
- [ ] 5.5 取消选中
- [ ] 5.6 响应式
- [ ] 5.7 验证

## Phase 6：收尾部署

**入口条件：** Phase 2-5 全部完成
**完成标准：** 网站上线，另一设备可访问
**任务列表：**
- [ ] 6.1 全流程走查
- [ ] 6.2 UI 细节打磨
- [ ] 6.3 npm run build
- [ ] 6.4 部署 GitHub Pages
- [ ] 6.5 另一设备验证
