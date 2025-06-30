---
title: "美化后的代码显示效果演示"
date: "2025-01-30"
excerpt: "展示博客中各种编程语言的代码块美化效果，包括语法高亮、行号显示等功能。"
category: "demo"
---

# 美化后的代码显示效果演示

这篇文章展示了博客中各种编程语言的代码块美化效果。

## JavaScript 代码示例

```javascript
// ES6+ 现代 JavaScript 特性演示
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`)
    const userData = await response.json()
    
    // 使用解构赋值和默认值
    const { name = 'Unknown', email, profile = {} } = userData
    
    // 模板字符串和三元运算符
    const greeting = `Hello, ${name}! ${email ? 'Email verified' : 'Please verify email'}`
    
    return {
      ...userData,
      greeting,
      isActive: profile.active ?? false
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    throw new Error('User not found')
  }
}

// 使用 Promise.all 并行处理
Promise.all([
  fetchUserData(1),
  fetchUserData(2),
  fetchUserData(3)
]).then(users => {
  console.log('All users loaded:', users)
})
```

## TypeScript 代码示例

```typescript
interface User {
  id: number
  name: string
  email: string
  profile?: {
    avatar?: string
    bio?: string
    active: boolean
  }
}

interface ApiResponse<T> {
  data: T
  status: 'success' | 'error'
  message?: string
}

class UserService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async fetchUser(id: number): Promise<ApiResponse<User>> {
    const response = await fetch(`${this.baseUrl}/users/${id}`)
    
    if (!response.ok) {
      return {
        data: {} as User,
        status: 'error',
        message: `HTTP ${response.status}: ${response.statusText}`
      }
    }

    const user = await response.json()
    return {
      data: user,
      status: 'success'
    }
  }

  async updateUser(id: number, updates: Partial<User>): Promise<ApiResponse<User>> {
    // 实现更新逻辑
    return this.fetchUser(id)
  }
}
```

## React 组件示例

```jsx
import React, { useState, useEffect, useCallback } from 'react'

interface BlogPostProps {
  postId: string
  onLike?: (postId: string) => void
}

const BlogPost: React.FC<BlogPostProps> = ({ postId, onLike }) => {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  const handleLike = useCallback(() => {
    setLiked(prev => !prev)
    onLike?.(postId)
  }, [postId, onLike])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`)
        const postData = await response.json()
        setPost(postData)
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  if (loading) {
    return <div className="animate-pulse">Loading...</div>
  }

  return (
    <article className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-4">{post?.title}</h1>
      <div className="prose max-w-none">
        {post?.content}
      </div>
      <button
        onClick={handleLike}
        className={`mt-4 px-4 py-2 rounded ${
          liked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
        } hover:opacity-80 transition-opacity`}
      >
        {liked ? '❤️ Liked' : '🤍 Like'}
      </button>
    </article>
  )
}

export default BlogPost
```

## Python 代码示例

```python
from typing import List, Dict, Optional
from dataclasses import dataclass
import asyncio
import aiohttp

@dataclass
class User:
    id: int
    name: str
    email: str
    active: bool = True
    
    def __post_init__(self):
        if not self.name:
            raise ValueError("Name cannot be empty")
        if "@" not in self.email:
            raise ValueError("Invalid email format")

class UserRepository:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def get_users(self, limit: int = 10) -> List[User]:
        """获取用户列表"""
        if not self.session:
            raise RuntimeError("Repository not initialized")
            
        async with self.session.get(
            f"{self.base_url}/users",
            params={"limit": limit}
        ) as response:
            if response.status == 200:
                data = await response.json()
                return [User(**user_data) for user_data in data]
            else:
                raise Exception(f"API Error: {response.status}")

    async def create_user(self, user_data: Dict) -> User:
        """创建新用户"""
        user = User(**user_data)
        
        async with self.session.post(
            f"{self.base_url}/users",
            json=user_data
        ) as response:
            if response.status == 201:
                created_user = await response.json()
                return User(**created_user)
            else:
                raise Exception("Failed to create user")

# 使用示例
async def main():
    async with UserRepository("https://api.example.com") as repo:
        users = await repo.get_users(limit=5)
        for user in users:
            print(f"User: {user.name} ({user.email})")

if __name__ == "__main__":
    asyncio.run(main())
```

## CSS 样式示例

```css
/* 现代 CSS 特性演示 */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --text-color: #1f2937;
  --background-color: #f9fafb;
  --border-radius: 0.5rem;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card {
  background: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  /* CSS Grid 布局 */
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

/* CSS 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeInUp 0.6s ease-out;
}

/* 现代选择器 */
.button:is(:hover, :focus) {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.input:not(:placeholder-shown):valid {
  border-color: #10b981;
}

.input:not(:placeholder-shown):invalid {
  border-color: #ef4444;
}
```

## 行内代码示例

在文本中使用 `const variable = 'value'` 这样的行内代码，或者引用函数名如 `getUserData()` 和 API 端点 `/api/users/123`。

## 组合示例

结合使用各种格式：

1. **配置文件**：`package.json`
2. **命令行**：`npm install react-syntax-highlighter`
3. **环境变量**：`NEXT_PUBLIC_API_URL=https://api.example.com`

### 表格中的代码

| 语言 | 文件扩展名 | 示例代码 |
|------|------------|----------|
| JavaScript | `.js` | `console.log('Hello')` |
| TypeScript | `.ts` | `const msg: string = 'Hello'` |
| Python | `.py` | `print("Hello")` |
| CSS | `.css` | `.class { color: red; }` |

## 总结

通过这些改进，博客中的代码显示效果得到了显著提升：

- ✅ **语法高亮**：不同语言的关键字、字符串、注释都有不同颜色
- ✅ **行号显示**：方便引用和调试
- ✅ **语言标识**：代码块右上角显示编程语言
- ✅ **美观样式**：圆角、阴影、渐变顶部装饰条
- ✅ **响应式**：在移动设备上也有良好显示效果
- ✅ **行内代码**：区别于代码块的独特样式

享受更美观的代码阅读体验！🎨✨ 