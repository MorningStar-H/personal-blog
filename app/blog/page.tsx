import { getBlogPosts, categories } from '@/lib/blog'
import Link from 'next/link'

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="max-w-6xl mx-auto">
      {/* 页面头部 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          所有文章
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          探索我的技术见解、工具分享和生活感悟
        </p>
        
        {/* 分类过滤器 */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link 
            href="/blog"
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            全部 ({posts.length})
          </Link>
          {categories.map((category) => {
            const categoryPosts = posts.filter(post => post.category === category.id)
            return (
              <Link 
                key={category.id}
                href={`/category/${category.id}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {category.icon} {category.name} ({categoryPosts.length})
              </Link>
            )
          })}
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const category = categories.find(cat => cat.id === post.category)
            return (
              <article 
                key={post.slug} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">
                    {category?.icon || '📖'}
                  </span>
                  <span className="text-sm text-blue-600 font-medium">
                    {category?.name || '未分类'}
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
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            暂无文章
          </h3>
          <p className="text-gray-600 mb-6">
            还没有发布任何文章，请稍后再来查看。
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