export default function About() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">关于我</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-6">
          你好！欢迎来到我的个人博客。
        </p>
        
        <p className="text-gray-700 mb-4">
          我是一名热爱技术的开发者，专注于前端开发和用户体验设计。
          在这个博客中，我会分享我的技术见解、项目经验和生活感悟。
        </p>
        
        <p className="text-gray-700 mb-4">
          我相信通过分享知识和经验，我们可以一起成长，一起进步。
          如果你对我的文章有任何问题或建议，欢迎与我交流。
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">技能领域</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>前端开发：React, Vue.js, Next.js</li>
          <li>后端开发：Node.js, Python</li>
          <li>数据库：MongoDB, PostgreSQL</li>
          <li>云服务：AWS, Vercel</li>
          <li>其他：TypeScript, Tailwind CSS, Git</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">联系方式</h2>
        <p className="text-gray-700">
          如果你想和我交流，可以通过以下方式联系我：
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
          <li>邮箱: your.email@example.com</li>
          <li>GitHub: github.com/yourusername</li>
          <li>Twitter: @yourusername</li>
        </ul>
      </div>
    </div>
  )
} 