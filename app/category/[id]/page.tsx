import { getBlogPostsByCategory, categories } from '@/lib/blog'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CategoryContent from './CategoryContent'

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = params
  const category = categories.find(cat => cat.id === id)
  
  if (!category) {
    notFound()
  }

  // 获取该分类的所有文章
  const allPosts = await getBlogPostsByCategory(id)

  return (
    <div className="max-w-4xl mx-auto">
      {/* 分类头部 */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">{category.icon}</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {category.name}
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          {category.description}
        </p>
      </div>

      {/* 返回首页链接 */}
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          ← 返回首页
        </Link>
      </div>

      {/* 客户端组件处理子分类过滤 */}
      <CategoryContent category={category} allPosts={allPosts} />
    </div>
  )
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }))
} 