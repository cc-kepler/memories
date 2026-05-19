# 设计规范

## 色彩方案

| 用途 | 颜色名称 | 色值 | Tailwind 变量 |
|------|---------|------|-------------|
| 主色调 | 暖粉→珊瑚渐变 | `#e88d8d` → `#d4a5a5` | `--color-warm-pink` / `--color-coral` |
| 艺术字 | 玫瑰金渐变 | `#c9a87c` → `#e8c9a0` | `--color-rose-gold` / `--color-rose-gold-light` |
| 已激活城市 | 暖珊瑚 | `#e8917e` | `--color-coral-active` |
| 未激活城市 | 半透明灰 | `rgba(180,170,160,0.3)` | `--color-city-inactive` |
| 背景（深色） | 暗蓝黑 | `#1a1a2e` | `--color-bg-dark` |
| 背景（暖白） | 暖白 | `#fdf8f4` | `--color-bg-warm` |
| 信封 | 奶油纸色 | `#f5f0e8` | `--color-envelope-cream` |
| 火漆印章 | 玫瑰红 | `#c44569` | `--color-wax-seal` |
| 3D 地球海洋 | 深蓝 | `#1a3a5c` | `--color-ocean-deep` |

## 字体

| 用途 | 字体 | CSS |
|------|------|-----|
| 艺术字（TIME/MAP） | Playfair Display / Cormorant Garamond | `font-family: var(--font-artistic)` |
| 正文中文 | 系统默认 | `font-family: system-ui, -apple-system, sans-serif` |

## 动效清单

| 位置 | 动效 | 实现方式 |
|------|------|---------|
| 进度条 | 平滑过渡 | CSS `transition: width 100ms ease-linear` |
| Enter 按钮 | 呼吸发光 | CSS `animate-breath` (box-shadow pulse, 3s) |
| 按钮/组件入场 | 淡入上移 | CSS `animate-fade-in` (0.8s) |
| 信封 | 呼吸式微开合 | CSS `animate-envelope-breathe` (rotateX, 4s) |
| 3D 地球 | 缓慢自转 | Three.js `useFrame` 旋转 |
| 页面切换 | 淡入淡出 | Framer Motion `AnimatePresence` |
| 城市 hover | 放大+发光 | CSS `scale` + `filter: drop-shadow` |
| 浮层弹出 | 弹性动画 | Framer Motion `spring` transition |

## 布局规范

### 断点
| 名称 | 宽度 | 布局 |
|------|------|------|
| 手机 | < 768px | 全屏上下堆叠 |
| 平板 | 768px - 1024px | 适量缩小，部分分栏 |
| 桌面 | ≥ 1024px | 左右分栏 |

### 页面布局细节

**主页（/home）**
- 桌面：左右各 50%，居中 max-w-5xl
- 手机：上下堆叠，各占约 50vh

**时间轴（/timeline）**
- 桌面：左侧日志 40% + 右侧照片 60%
- 手机：上方日期选择器，下方日志+照片上下堆叠

**城市地图（/map）**
- 桌面：地图居中占 60% 宽度，照片画廊在右侧或浮层
- 手机：地图全屏，照片画廊从底部弹出

## 组件间距规范
- 页面 padding：`px-4 md:px-8 lg:px-16`
- 卡片间距：`gap-4 md:gap-6`
- 区块间距：`space-y-6 md:space-y-10`
