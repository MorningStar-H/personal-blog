import { getBlogPostsByCategory, categories } from '@/lib/blog'
import Link from 'next/link'

export default async function SubcategoryPage({ 
  params 
}: { 
  params: { category: string; subcategory: string } 
}) {
  const posts = await getBlogPostsByCategory(params.category, params.subcategory)
  const category = categories.find(c => c.id === params.category)
  const subcategory = category?.subcategories?.find(s => s.id === params.subcategory)
  
  if (!category || !subcategory) {
    return <div>分类不存在</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link href={`/category/${params.category}`} className="text-blue-600 hover:underline">
          {category.name}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-900">{subcategory.name}</span>
      </nav>
      
      <h1 className="text-3xl font-bold mb-8">{subcategory.name}</h1>
      
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
    { category: 'demo', subcategory: 'showcase' }
  ]
}