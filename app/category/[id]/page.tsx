import { getBlogPostsByCategory, categories } from '@/lib/blog'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: {
    id: string
  }
  searchParams: {
    subcategory?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { id } = params
  const { subcategory: selectedSubcategory } = searchParams
  const category = categories.find(cat => cat.id === id)
  
  if (!category) {
    notFound()
  }

  const posts = await getBlogPostsByCategory(id, selectedSubcategory)

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
        {category.subcategories && (
          <div className="flex justify-center space-x-2 mb-4">
            <Link
              href={`/category/${id}`}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                !selectedSubcategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              全部
            </Link>
            {category.subcategories.map(sub => (
              <Link
                key={sub.id}
                href={`/category/${id}?subcategory=${sub.id}`}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedSubcategory === sub.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          共 {posts.length} 篇文章
        </div>
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

      {/* 文章列表 */}
      {posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <article 
              key={post.slug} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {post.title}
                      </h2>
                    </Link>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <time dateTime={post.date}>{post.date}</time>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                {post.excerpt}
              </p>
              
              <Link 
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                阅读全文 →
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            暂无文章
          </h3>
          <p className="text-gray-600 mb-6">
            这个分类下还没有文章，请稍后再来查看。
          </p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      )}
    </div>
  )
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }))
} 