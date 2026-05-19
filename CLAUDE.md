# Memories - 周年纪念网站

> 情侣周年纪念网站（2023.06.11 — 2026.06.11），电脑/手机/平板适配，两人共用账号。

---

## 文档索引

| 文档 | 路径 | 用途 |
|------|------|------|
| 开发需求 | [docs/requirements.md](docs/requirements.md) | 功能需求清单、用户画像 |
| 技术规范 | [docs/tech-spec.md](docs/tech-spec.md) | 技术栈、数据库设计、路由表、组件树 |
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) | 色彩、字体、动效、布局断点、线框图 |
| 执行步骤 | [docs/implementation-plan.md](docs/implementation-plan.md) | 分阶段任务清单、入口条件、完成标准 |
| 变更记录 | [docs/changelog.md](docs/changelog.md) | 每次代码变更记录 |
| 开发日志 | [devlog/](devlog/) | 每次对话自动记录完成事项和待办 |

---

## 工作约定

每次开发遵循以下流程：

1. **读取 devlog** — 查看 `devlog/` 下最近日期的日志，了解上次进度和待办
2. **核对 plan** — 参考 `docs/implementation-plan.md` 确认当前 Phase 和任务
3. **查阅规范** — 开发前先看对应文档（tech-spec 看表结构，design-spec 看色值/动效）
4. **逐步开发** — 每次只完成当前 Phase 的任务，不过度推进
5. **记录日志** — 每次对话结束前在 `devlog/` 新建日期文件，记录：
   - 完成事项
   - 待办事项
   - 遇到的问题
6. **验证** — 每阶段完成后对照验证清单检查

---

## 技术栈速查

```bash
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run preview  # 预览生产构建
```

- **框架**: React 18 + Vite + TypeScript
- **样式**: Tailwind CSS 4.x (CSS-first config)
- **动画**: Framer Motion
- **3D**: Three.js / @react-three/fiber / @react-three/drei
- **路由**: react-router-dom v6
- **后端**: Supabase (PostgreSQL + Storage + Auth)

### Tailwind v4 特殊说明
- 无需 `tailwind.config.js`，配置在 `src/index.css` 中通过 `@theme` 指令完成
- 自定义颜色使用 CSS 变量：`bg-[var(--color-bg-dark)]`
- Vite 插件 `@tailwindcss/vite` 已在 `vite.config.ts` 中配置

---

## 当前阶段

**Phase 0 — 项目基础设施** ✅ 已完成（2026-05-12）
**Phase 1 — 认证系统** ✅ 已完成（2026-05-13）
**Phase 2 — 开场页** ✅ 已完成（2026-05-13）
**Phase 3 — 主页双入口** ✅ 已完成（2026-05-13）

**Phase 4 — 时间轴页** ⬅️ 下一步

下一步：Phase 1 — 认证系统
