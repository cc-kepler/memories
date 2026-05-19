# 技术规范

## 技术栈

| 层 | 技术 | 选型理由 |
|---|------|---------|
| 前端框架 | React 18 + Vite + TypeScript | 类型安全、快速开发 |
| UI 样式 | Tailwind CSS 4.x | 原子化 CSS、响应式便捷 |
| 动画 | Framer Motion | React 原生动效库 |
| 3D 渲染 | Three.js / @react-three/fiber / @react-three/drei | 轻量 3D 地球 |
| 路由 | react-router-dom v6 | SPA 路由 |
| 数据库 | Supabase PostgreSQL | 免费 500MB、国内可访问 |
| 图片存储 | Supabase Storage | 免费 1GB、公开访问 |
| 认证 | Supabase Auth | 邮箱密码、免费 5万月活 |
| 托管 | GitHub Pages | 免费、国内可访问 |

## 数据库设计

### 表 `logs`

```sql
CREATE TABLE logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  content     TEXT        DEFAULT '',
  log_date    DATE        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all_access" ON logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

### 表 `photos`

```sql
CREATE TABLE photos (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  city        TEXT        NOT NULL,
  photo_date  DATE        NOT NULL,
  image_url   TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all_access" ON photos FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

## Storage 结构

```
bucket: memories (public)
└── photos/
    └── {uuid}.jpg
```

创建 bucket 后需在 Supabase Dashboard → Storage → Policies 中设置为公开访问。

## 路由表

| 路径 | 页面 | 组件 | 权限 |
|------|------|------|------|
| `/` | 开场页 | OpeningPage | 公开 |
| `/login` | 登录页 | LoginPage | 公开 |
| `/home` | 主页 | HomePage | 需登录 |
| `/timeline` | 时间轴 | TimelinePage | 需登录 |
| `/map` | 城市地图 | MapPage | 需登录 |
| `*` | 重定向 | → `/` | 公开 |

## 组件树

```
App
├── AuthProvider (context)
├── BrowserRouter
│   ├── / → OpeningPage
│   ├── /login → LoginPage
│   ├── /home → ProtectedRoute → HomePage
│   │   ├── EnvelopePanel (TIME 信封)
│   │   └── GlobePanel (MAP 3D 地球)
│   ├── /timeline → ProtectedRoute → TimelinePage
│   │   ├── DateSelector
│   │   ├── LogList
│   │   │   └── LogEditor (modal)
│   │   └── PhotoGrid
│   └── /map → ProtectedRoute → MapPage
│       ├── ChinaMap (SVG)
│       │   └── CityMarker ×71
│       └── PhotoGallery (浮层)
```

## 关键 API 查询

### 获取有内容的日期列表
```sql
SELECT DISTINCT log_date AS date FROM logs
UNION
SELECT DISTINCT photo_date AS date FROM photos
ORDER BY date DESC;
```

### 获取某日期的日志
```sql
SELECT * FROM logs WHERE log_date = '2023-06-11' ORDER BY created_at DESC;
```

### 获取某日期的照片
```sql
SELECT * FROM photos WHERE photo_date = '2023-06-11' ORDER BY created_at DESC;
```

### 获取某城市的照片
```sql
SELECT * FROM photos WHERE city = '广州' ORDER BY photo_date DESC;
```

### 获取所有已激活城市
```sql
SELECT DISTINCT city FROM photos;
```
