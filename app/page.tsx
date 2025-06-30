import { getBlogPosts, getBlogPostsByCategory, categories } from '@/lib/blog'
import Link from 'next/link'

export default async function Home() {
  const allPosts = await getBlogPosts()
  const recentPosts = allPosts.slice(0, 3)

  // 预先计算每个分类的文章数量
  const categoryStats = await Promise.all(
    categories.map(async (category) => {
      const categoryPosts = await getBlogPostsByCategory(category.id)
      return {
        ...category,
        count: categoryPosts.length
      }
    })
  )

  return (
    <div className="max-w-6xl mx-auto">
      {/* 欢迎区域 */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          欢迎来到我的博客
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          在这里分享我的技术见解、生活感悟和学习笔记。探索不同的内容分区，发现你感兴趣的话题。
        </p>
      </div>

      {/* 分区导航 */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">内容分区</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.id}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 最新文章 */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">最新文章</h2>
          <Link 
            href="/blog"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            查看全部 →
          </Link>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <article 
              key={post.slug} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 group"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">
                  {categories.find(cat => cat.id === post.category)?.icon || '📖'}
                </span>
                <span className="text-sm text-blue-600 font-medium">
                  {categories.find(cat => cat.id === post.category)?.name || '未分类'}
                </span>
              </div>
              
              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </Link>
              
              <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <time dateTime={post.date}>{post.date}</time>
                <span>{post.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryStats.map((category) => (
            <div key={category.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl mb-1">{category.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{category.count}</div>
              <div className="text-sm text-gray-600">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 