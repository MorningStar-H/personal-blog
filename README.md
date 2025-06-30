# 我的个人博客

这是一个使用 Next.js、React 和 Tailwind CSS 构建的现代化个人博客。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **内容管理**: Markdown + gray-matter
- **部署**: Vercel

## 功能特点

- ✅ 响应式设计，适配各种设备
- ✅ 支持 Markdown 写作
- ✅ 自动生成文章摘要和阅读时间
- ✅ SEO 友好
- ✅ 快速静态生成
- ✅ 现代化的 UI 设计

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

然后在浏览器中访问 [http://localhost:3000](http://localhost:3000)

### 3. 构建生产版本

```bash
npm run build
npm run start
```

## 写作指南

### 添加新文章

1. 在 `posts` 目录下创建新的 `.md` 文件
2. 在文件开头添加 front matter：

```markdown
---
title: "文章标题"
date: "2024-01-25"
excerpt: "文章摘要"
---

# 文章标题

这里是文章内容...
```

### Front Matter 字段说明

- `title`: 文章标题（必填）
- `date`: 发布日期，格式为 YYYY-MM-DD（必填）
- `excerpt`: 文章摘要，用于首页展示（可选，不填会自动生成）

### Markdown 语法支持

博客支持标准的 Markdown 语法，包括：

- 标题 (`#`, `##`, `###`)
- 段落和换行
- **粗体** 和 *斜体*
- 列表（有序和无序）
- 链接和图片
- 代码块和行内代码
- 引用
- 表格（通过 remark-gfm 插件）

## 自定义配置

### 修改网站信息

在 `app/layout.tsx` 中修改网站标题和描述：

```typescript
export const metadata: Metadata = {
  title: '你的博客名称',
  description: '你的博客描述',
}
```

### 修改导航栏

在 `app/layout.tsx` 中修改导航栏内容：

```jsx
<a href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
  你的博客名称
</a>
```

### 修改关于页面

编辑 `app/about/page.tsx` 文件来自定义关于页面的内容。

## 部署

### 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 上导入项目
3. 点击部署即可

### 部署到其他平台

由于使用了静态导出配置，你也可以部署到任何支持静态网站的平台：

```bash
npm run build
```

构建完成后，`out` 目录包含了所有静态文件。

## 目录结构

```
├── app/                    # Next.js App Router 目录
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── about/             # 关于页面
│   └── blog/              # 博客文章页面
├── lib/                   # 工具函数
│   └── blog.ts           # 博客数据处理
├── posts/                 # Markdown 文章目录
├── package.json          # 项目配置
├── tailwind.config.js    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
└── next.config.js        # Next.js 配置
```

## 许可证

MIT License

## 联系方式

如果你有任何问题或建议，欢迎通过以下方式联系：

- 邮箱: your.email@example.com
- GitHub: [你的 GitHub 用户名](https://github.com/yourusername)

---

感谢使用这个博客模板！希望它能帮助你开始你的写作之旅。 