import { getBlogPostsByCategory, categories } from '@/lib/blog'
import Link from 'next/link'

export default async function CategoryPage({ 
  params 
}: { 
  params: { category: string } 
}) {
  const posts = await getBlogPostsByCategory(params.category)
  const category = categories.find(c => c.id === params.category)
  
  if (!category) {
    return <div>分类不存在</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <span className="text-4xl">{category.icon}</span>
        {category.name}
      </h1>
      <p className="text-gray-600 mb-8">{category.description}</p>
      
      {/* 子分类导航 */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">子分类</h2>
          <div className="flex flex-wrap gap-2">
            {category.subcategories.map(subcategory => (
              <Link
                key={subcategory.id}
                href={`/category/${params.category}/${subcategory.id}`}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {subcategory.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{post.date}</span>
              <span className="text-sm text-blue-600">{post.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return [
    { category: 'tech' }
  ]
}