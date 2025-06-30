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