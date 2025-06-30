import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '个人博客',
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
              <p>&copy; 2025 个人博客. 保留所有权利.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 