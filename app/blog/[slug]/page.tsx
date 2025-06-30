import { getBlogPost, getBlogPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '')
              const language = match ? match[1] : ''
              
              if (!inline && language) {
                return (
                  <div className="relative">
                    {/* 语言标签 */}
                    <div className="absolute top-0 right-0 px-3 py-1 text-xs font-mono text-gray-400 bg-gray-800 rounded-bl-lg z-10">
                      {language}
                    </div>
                    <SyntaxHighlighter
                      style={oneDark}
                      language={language}
                      PreTag="div"
                      className="rounded-lg !bg-gray-900 !mt-0 !mb-6"
                      showLineNumbers={true}
                      lineNumberStyle={{
                        minWidth: '3em',
                        paddingRight: '1em',
                        color: '#6b7280',
                        borderRight: '1px solid #374151',
                        marginRight: '1em',
                        textAlign: 'right',
                        userSelect: 'none'
                      }}
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.6'
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                )
              }
              
              // 行内代码
              return (
                <code 
                  className="bg-blue-50 text-blue-800 px-2 py-1 rounded-md text-sm font-mono border border-blue-200"
                  {...props}
                >
                  {children}
                </code>
              )
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  )
} 