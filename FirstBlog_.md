# 如何创建个人博客
_Exported on 6/30/2025 at 13:28:41 GMT+8 from Cursor (0.50.5)_

---

**User**

怎么创建一个个人博客

---

**Cursor**

我来帮您创建一个个人博客！首先让我查看一下您当前的工作空间情况。

看到您的工作空间是空的，我来为您创建一个现代化的个人博客！我会使用 Next.js + React + Tailwind CSS 技术栈，这样可以创建一个美观、响应式且性能优异的博客。

让我开始创建博客的基础结构：

```json
{
  "name": "personal-blog",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "gray-matter": "^4.0.3",
    "next": "14.0.4",
    "postcss": "^8",
    "react": "^18",
    "react-dom": "^18",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

```jsonc
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

现在让我创建博客的核心文件和目录结构：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: #fafafa;
  color: #1f2937;
}

.prose {
  max-width: none;
}

.prose h1 {
  @apply text-3xl font-bold text-gray-900 mb-4;
}

.prose h2 {
  @apply text-2xl font-semibold text-gray-800 mb-3 mt-8;
}

.prose h3 {
  @apply text-xl font-semibold text-gray-800 mb-2 mt-6;
}

.prose p {
  @apply text-gray-700 leading-relaxed mb-4;
}

.prose a {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.prose code {
  @apply bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm;
}

.prose pre {
  @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic text-gray-600;
}
```

```typescriptreact
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '我的个人博客',
  description: '分享技术、生活和思考',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <nav className="flex justify-between items-center">
                <a href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                  我的博客
                </a>
                <div className="space-x-6">
                  <a href="/" className="text-gray-600 hover:text-blue-600">首页</a>
                  <a href="/about" className="text-gray-600 hover:text-blue-600">关于</a>
                </div>
              </nav>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-white border-t mt-16">
            <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-600">
              <p>&copy; 2024 我的个人博客. 保留所有权利.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
```

```typescriptreact
import { getBlogPosts } from '@/lib/blog'
import Link from 'next/link'

export default async function Home() {
  const posts = await getBlogPosts()

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          欢迎来到我的博客
        </h1>
        <p className="text-xl text-gray-600">
          在这里分享我的技术见解、生活感悟和学习笔记
        </p>
      </div>

      <div className="grid gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 mb-3">{post.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <time dateTime={post.date}>{post.date}</time>
              <span>{post.readTime}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
```

```typescriptreact
import { getBlogPost, getBlogPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="bg-white rounded-lg shadow-sm p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 text-sm">
          <time dateTime={post.date}>{post.date}</time>
          <span className="mx-2">•</span>
          <span>{post.readTime}</span>
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
```

```typescriptreact
export default function About() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">关于我</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-6">
          你好！欢迎来到我的个人博客。
        </p>
        
        <p className="text-gray-700 mb-4">
          我是一名热爱技术的开发者，专注于前端开发和用户体验设计。
          在这个博客中，我会分享我的技术见解、项目经验和生活感悟。
        </p>
        
        <p className="text-gray-700 mb-4">
          我相信通过分享知识和经验，我们可以一起成长，一起进步。
          如果你对我的文章有任何问题或建议，欢迎与我交流。
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">技能领域</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>前端开发：React, Vue.js, Next.js</li>
          <li>后端开发：Node.js, Python</li>
          <li>数据库：MongoDB, PostgreSQL</li>
          <li>云服务：AWS, Vercel</li>
          <li>其他：TypeScript, Tailwind CSS, Git</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">联系方式</h2>
        <p className="text-gray-700">
          如果你想和我交流，可以通过以下方式联系我：
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
          <li>邮箱: your.email@example.com</li>
          <li>GitHub: github.com/yourusername</li>
          <li>Twitter: @yourusername</li>
        </ul>
      </div>
    </div>
  )
}
```

现在让我创建博客数据处理逻辑和一些示例文章：

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readTime: string
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const slug = name.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, name)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString().split('T')[0],
        excerpt: data.excerpt || content.substring(0, 150) + '...',
        content,
        readTime: calculateReadTime(content),
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return posts
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString().split('T')[0],
    excerpt: data.excerpt || content.substring(0, 150) + '...',
    content,
    readTime: calculateReadTime(content),
  }
}

function calculateReadTime(content: string): string {
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / 200) // 假设每分钟阅读200字
  return `${minutes} 分钟阅读`
}
```

```markdown
---
title: "欢迎来到我的博客"
date: "2024-01-15"
excerpt: "这是我的第一篇博客文章，介绍了为什么我要开始写博客，以及我计划分享的内容。"
---

# 欢迎来到我的博客

你好！欢迎来到我的个人博客。这是我的第一篇文章，我想在这里分享一下为什么我决定开始写博客。

## 为什么要写博客？

写博客对我来说有几个重要意义：

1. **记录学习过程** - 通过写作来整理和巩固我学到的知识
2. **分享经验** - 希望我的经验能够帮助到其他人
3. **持续学习** - 写博客让我保持学习的动力
4. **建立连接** - 通过分享想法与志同道合的人建立联系

## 我会分享什么内容？

在这个博客中，我计划分享以下类型的内容：

### 技术文章
- 前端开发技巧和最佳实践
- React、Vue.js、Next.js 等框架的使用经验
- JavaScript 和 TypeScript 深度解析
- 性能优化和用户体验改进

### 项目分享
- 个人项目的开发过程和思考
- 开源项目的贡献经验
- 技术选型和架构设计

### 学习笔记
- 新技术的学习记录
- 读书笔记和思考
- 会议和讲座的总结

### 生活感悟
- 关于工作和生活平衡的思考
- 个人成长的心得体会
- 对行业趋势的观察和思考

## 期待与你的交流

我希望这个博客不仅仅是我单向的输出，更是一个交流的平台。如果你对我的文章有任何想法、问题或建议，欢迎通过各种方式与我联系。

让我们一起学习，一起成长！

---

*这篇文章标志着我博客写作之旅的开始。感谢你的阅读，期待在后续的文章中与你分享更多有价值的内容。*
```

```markdown
---
title: "使用 Next.js 构建现代化博客的完整指南"
date: "2024-01-20"
excerpt: "详细介绍如何使用 Next.js、React 和 Tailwind CSS 从零开始构建一个现代化的个人博客网站。"
---

# 使用 Next.js 构建现代化博客的完整指南

在这篇文章中，我将分享如何使用 Next.js、React 和 Tailwind CSS 创建一个现代化的个人博客。这个技术栈不仅性能优异，还提供了出色的开发体验。

## 为什么选择 Next.js？

Next.js 是构建现代 Web 应用的绝佳选择，特别适合博客类网站：

### 主要优势

1. **优秀的 SEO 支持** - 服务端渲染确保搜索引擎能够正确索引内容
2. **出色的性能** - 自动代码分割和优化
3. **开发体验友好** - 热重载、TypeScript 支持
4. **部署简单** - 与 Vercel 完美集成

## 技术栈选择

```json
{
  "framework": "Next.js 14",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "content": "Markdown + gray-matter",
  "deployment": "Vercel"
}
```

## 项目结构

一个典型的 Next.js 博客项目结构如下：

```
blog/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   │   └── page.tsx
│   └── blog/
│       └── [slug]/
│           └── page.tsx
├── lib/
│   └── blog.ts
├── posts/
│   ├── hello-world.md
│   └── nextjs-guide.md
├── package.json
├── tailwind.config.js
└── next.config.js
```

## 核心功能实现

### 1. Markdown 文章处理

使用 `gray-matter` 处理带有前置元数据的 Markdown 文件：

```typescript
import matter from 'gray-matter'

const { data, content } = matter(fileContents)
```

### 2. 静态页面生成

利用 Next.js 的 `generateStaticParams` 生成静态页面：

```typescript
export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

### 3. 响应式设计

使用 Tailwind CSS 创建响应式布局：

```jsx
<div className="max-w-4xl mx-auto px-4 py-8">
  <article className="bg-white rounded-lg shadow-sm p-8">
    {/* 文章内容 */}
  </article>
</div>
```

## 性能优化技巧

### 1. 图片优化
使用 Next.js 的 `Image` 组件自动优化图片：

```jsx
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="博客封面"
  width={800}
  height={400}
  priority
/>
```

### 2. 字体优化
使用 Next.js 字体优化：

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
```

### 3. 代码分割
Next.js 自动进行代码分割，确保只加载必要的代码。

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中连接仓库
3. 配置环境变量（如果需要）
4. 点击部署

```bash
npm run build
npm run start
```

## 扩展功能

可以考虑添加以下功能来增强博客：

- **评论系统** - 集成 Giscus 或 Disqus
- **搜索功能** - 使用 Algolia 或 Fuse.js
- **RSS 订阅** - 自动生成 RSS feed
- **网站分析** - 集成 Google Analytics
- **暗色模式** - 使用 next-themes

## 总结

使用 Next.js 构建博客是一个绝佳的选择。它不仅提供了现代化的开发体验，还确保了网站的性能和 SEO 表现。

通过这个技术栈，你可以：
- 快速搭建专业的博客网站
- 享受优秀的开发体验
- 获得出色的性能表现
- 轻松部署和维护

如果你正在考虑创建自己的博客，强烈推荐尝试这个技术栈。它将为你的写作之旅提供坚实的技术基础。

---

*希望这篇指南对你有帮助！如果有任何问题，欢迎在评论区留言交流。*
```

```markdown
---
title: "10 个实用的 JavaScript 小技巧"
date: "2024-01-25"
excerpt: "分享 10 个在日常开发中非常实用的 JavaScript 技巧，帮助你写出更简洁、更高效的代码。"
---

# 10 个实用的 JavaScript 小技巧

在日常的 JavaScript 开发中，掌握一些实用的小技巧可以让我们的代码更简洁、更高效。今天我来分享 10 个我经常使用的 JavaScript 技巧。

## 1. 使用解构赋值简化变量声明

```javascript
// 传统方式
const user = { name: 'Alice', age: 25, email: 'alice@example.com' }
const name = user.name
const age = user.age

// 使用解构赋值
const { name, age } = user

// 数组解构
const [first, second] = ['hello', 'world']
```

## 2. 使用模板字符串进行字符串拼接

```javascript
// 传统方式
const message = 'Hello, ' + name + '! You are ' + age + ' years old.'

// 使用模板字符串
const message = `Hello, ${name}! You are ${age} years old.`
```

## 3. 使用短路运算符设置默认值

```javascript
// 使用 || 设置默认值
const username = user.name || 'Guest'

// 使用 ?? 处理 null 和 undefined（空值合并运算符）
const theme = user.theme ?? 'light'

// 使用 ||= 进行条件赋值
user.name ||= 'Anonymous'
```

## 4. 使用扩展运算符处理数组和对象

```javascript
// 数组合并
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]
const merged = [...arr1, ...arr2]

// 对象合并
const defaults = { theme: 'light', lang: 'en' }
const userPrefs = { theme: 'dark' }
const config = { ...defaults, ...userPrefs }

// 数组去重
const uniqueArray = [...new Set([1, 2, 2, 3, 3, 4])]
```

## 5. 使用数组方法进行函数式编程

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// 链式调用
const result = numbers
  .filter(n => n % 2 === 0)    // 筛选偶数
  .map(n => n * 2)             // 每个数乘以2
  .reduce((sum, n) => sum + n, 0) // 求和

console.log(result) // 60
```

## 6. 使用对象方法进行数据处理

```javascript
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
  { id: 3, name: 'Charlie', active: true }
]

// Object.fromEntries 和 Object.entries
const activeUsers = Object.fromEntries(
  Object.entries(users)
    .filter(([_, user]) => user.active)
)

// Object.groupBy (ES2024)
const groupedByStatus = Object.groupBy(users, user => 
  user.active ? 'active' : 'inactive'
)
```

## 7. 使用可选链操作符安全访问属性

```javascript
const user = {
  profile: {
    social: {
      twitter: '@alice'
    }
  }
}

// 传统方式（容易出错）
const twitter = user && user.profile && user.profile.social && user.profile.social.twitter

// 使用可选链操作符
const twitter = user?.profile?.social?.twitter

// 可选链也适用于方法调用
user?.profile?.updateInfo?.()
```

## 8. 使用异步函数处理 Promise

```javascript
// 使用 async/await 替代 Promise 链
async function fetchUserData(userId) {
  try {
    const user = await fetch(`/api/users/${userId}`).then(res => res.json())
    const posts = await fetch(`/api/users/${userId}/posts`).then(res => res.json())
    
    return { user, posts }
  } catch (error) {
    console.error('获取用户数据失败:', error)
    throw error
  }
}

// 并行执行异步操作
async function fetchAllData() {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users').then(res => res.json()),
    fetch('/api/posts').then(res => res.json()),
    fetch('/api/comments').then(res => res.json())
  ])
  
  return { users, posts, comments }
}
```

## 9. 使用动态导入进行代码分割

```javascript
// 动态导入模块
async function loadChart() {
  const { Chart } = await import('./chart.js')
  return new Chart()
}

// 条件导入
async function loadPolyfill() {
  if (!window.IntersectionObserver) {
    await import('intersection-observer-polyfill')
  }
}
```

## 10. 使用现代 JavaScript 特性优化代码

```javascript
// 使用 at() 方法访问数组元素
const arr = [1, 2, 3, 4, 5]
const lastItem = arr.at(-1) // 5
const secondLast = arr.at(-2) // 4

// 使用 structuredClone 进行深拷贝
const originalObj = { a: { b: { c: 1 } } }
const deepClone = structuredClone(originalObj)

// 使用 Array.from 和 Map 进行数据转换
const doubled = Array.from({ length: 5 }, (_, i) => i * 2)
// [0, 2, 4, 6, 8]

// 使用正则表达式命名捕获组
const pattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
const match = '2024-01-25'.match(pattern)
console.log(match.groups) // { year: '2024', month: '01', day: '25' }
```

## 总结

这些 JavaScript 技巧可以帮助你：

1. **提高代码可读性** - 使用现代语法让代码更直观
2. **减少样板代码** - 用简洁的方式实现常见功能
3. **避免常见错误** - 使用安全的访问模式
4. **提升性能** - 利用原生方法和优化技巧

掌握这些技巧需要在实际项目中不断练习和应用。建议你选择几个最感兴趣的技巧，在下一个项目中尝试使用它们。

随着 JavaScript 的不断发展，新的特性和技巧层出不穷。保持学习的心态，关注最新的 ECMAScript 提案，让我们的代码始终保持现代化！

---

*你还知道哪些实用的 JavaScript 技巧？欢迎在评论区分享你的经验！*
```

现在让我创建一些补充文件来完善博客：

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

```json
{
  "name": "personal-blog",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "gray-matter": "^4.0.3",
    "next": "14.0.4",
    "postcss": "^8",
    "react": "^18",
    "react-dom": "^18",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "tailwindcss": "^3.3.0",
    "@tailwindcss/typography": "^0.5.10",
    "typescript": "^5"
  }
}
```

```markdown
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
```

```ignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

让我重新创建 .gitignore 文件：

```ignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

让我删除空白的 .gitignore 文件并重新创建：

让我重新创建 .gitignore 文件：

```ignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

让我检查一下当前的目录结构，然后为您演示如何运行这个博客：

太好了！您的个人博客已经创建完成了！🎉 

## 您的博客包含了什么：

### 📁 项目结构
- **Next.js 14** 框架（使用最新的 App Router）
- **TypeScript** 支持，提供类型安全
- **Tailwind CSS** 现代化样式系统
- **Markdown** 文章支持，方便写作
- **三篇示例文章** 已经为您准备好

### 🎨 功能特点
- ✅ 响应式设计，手机和电脑都完美适配
- ✅ 美观的现代化 UI 界面
- ✅ 自动生成文章摘要和阅读时间
- ✅ SEO 友好，搜索引擎优化
- ✅ 快速的静态网站生成

## 🚀 如何运行您的博客：

### 1. 安装依赖包

### 2. 启动开发服务器

完美！🎉 您的个人博客现在已经启动了！

## 🌐 访问您的博客

打开浏览器，访问：**http://localhost:3000**

您将看到：
- **首页**：展示所有博客文章的列表
- **文章页面**：点击文章标题即可查看完整内容
- **关于页面**：介绍您自己的页面

## ✍️ 如何写博客文章

1. **在 `posts` 文件夹中创建新的 `.md` 文件**
2. **使用以下格式开头**：
```markdown
---
title: "您的文章标题"
date: "2024-01-25"
excerpt: "文章摘要"
---

# 您的文章标题

这里写您的文章内容...
```

## 🎨 如何自定义

- **修改网站标题**：编辑 `app/layout.tsx` 文件
- **修改关于页面**：编辑 `app/about/page.tsx` 文件
- **添加新页面**：在 `app` 文件夹中创建新文件夹

## 📤 如何部署

### 部署到 Vercel（推荐）
1. 将代码推送到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入项目
3. 自动部署完成！

### 构建静态版本
```bash
npm run build
```

## 📝 已经为您准备的示例文章

1. **"欢迎来到我的博客"** - 博客介绍文章
2. **"使用 Next.js 构建现代化博客的完整指南"** - 技术教程
3. **"10 个实用的 JavaScript 小技巧"** - 编程技巧分享

## 🛠️ 技术特点

- **现代化技术栈**：Next.js 14 + TypeScript + Tailwind CSS
- **优秀性能**：静态生成，加载速度快
- **SEO 友好**：搜索引擎优化
- **响应式设计**：适配所有设备
- **易于维护**：清晰的代码结构

您的个人博客已经完全准备好了！现在您可以开始您的写作之旅了。如果您有任何问题，请随时告诉我！ 📝✨

```markdown
---
title: "您的文章标题"
date: "2024-01-25"
excerpt: "文章摘要"
---

# 您的文章标题

这里写您的文章内容...
```

```shellscript
npm run build
```

