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
  category: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
}

export const categories: Category[] = [
  {
    id: 'tech',
    name: '技术文章',
    description: '技术见解、教程和最佳实践',
    icon: '💻'
  },
  {
    id: 'tools',
    name: '工具与配置',
    description: '开发工具、配置指南和效率提升',
    icon: '🛠️'
  },
  {
    id: 'demo',
    name: '代码演示',
    description: '实际代码示例和项目展示',
    icon: '🚀'
  },
  {
    id: 'bec',
    name: '商务英语',
    description: '初级商务英语备考',
    icon: '📖'
  }
]

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
        category: data.category || 'life',
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return posts
}

export async function getBlogPostsByCategory(categoryId: string): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts()
  return allPosts.filter(post => post.category === categoryId)
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
    category: data.category || 'life',
  }
}

function calculateReadTime(content: string): string {
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / 200) // 假设每分钟阅读200字
  return `${minutes} 分钟阅读`
} 