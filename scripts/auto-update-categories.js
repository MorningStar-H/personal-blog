#!/usr/bin/env node

/**
 * 自动更新分类脚本
 * 当添加新文章时，自动检查并更新分类系统
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 项目根目录
const ROOT_DIR = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT_DIR, 'posts');
const APP_DIR = path.join(ROOT_DIR, 'app');
const BLOG_TS_PATH = path.join(ROOT_DIR, 'lib', 'blog.ts');

/**
 * 获取所有文章的分类信息
 */
function getAllCategories() {
  const posts = fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { data } = matter(content);
      return {
        file,
        category: data.category,
        subcategory: data.subcategory
      };
    });

  // 统计分类
  const categories = {};
  posts.forEach(post => {
    if (!post.category) return;
    
    if (!categories[post.category]) {
      categories[post.category] = new Set();
    }
    
    if (post.subcategory) {
      categories[post.category].add(post.subcategory);
    }
  });

  // 转换为数组格式
  const result = {};
  Object.keys(categories).forEach(category => {
    result[category] = Array.from(categories[category]);
  });

  return result;
}

/**
 * 读取现有的分类定义
 */
function getExistingCategories() {
  if (!fs.existsSync(BLOG_TS_PATH)) {
    return {};
  }

  const content = fs.readFileSync(BLOG_TS_PATH, 'utf8');
  const categoriesMatch = content.match(/export const categories: Category\[\] = \[([\s\S]*?)\]\s*$/m);
  
  if (!categoriesMatch) {
    return {};
  }

  // 更完善的解析逻辑
  const existing = {};
  const categoryText = categoriesMatch[1];
  
  // 使用更精确的正则匹配每个分类对象
  const categoryRegex = /\{\s*id:\s*['"]([^'"]+)['"],[\s\S]*?(?=\}\s*(?:,\s*\{|$))/g;
  let categoryMatch;
  
  while ((categoryMatch = categoryRegex.exec(categoryText)) !== null) {
    const categoryId = categoryMatch[1];
    const categoryBlock = categoryMatch[0];
    existing[categoryId] = [];
    
    // 提取子分类
    const subcategoriesMatch = categoryBlock.match(/subcategories:\s*\[([\s\S]*?)\]/);
    if (subcategoriesMatch) {
      const subcategoryRegex = /id:\s*['"]([^'"]+)['"]/g;
      let subMatch;
      while ((subMatch = subcategoryRegex.exec(subcategoriesMatch[1])) !== null) {
        existing[categoryId].push(subMatch[1]);
      }
    }
  }

  return existing;
}

/**
 * 生成分类页面
 */
function generateCategoryPage(categoryId, subcategoryId = null) {
  const targetDir = subcategoryId 
    ? path.join(APP_DIR, 'category', categoryId, subcategoryId)
    : path.join(APP_DIR, 'category', categoryId);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const pageContent = subcategoryId 
    ? generateSubcategoryPageContent(categoryId, subcategoryId)
    : generateMainCategoryPageContent(categoryId);

  fs.writeFileSync(path.join(targetDir, 'page.tsx'), pageContent);
  console.log(`✅ 已创建页面: ${targetDir}/page.tsx`);
}

/**
 * 生成主分类页面内容
 */
function generateMainCategoryPageContent(categoryId) {
  return `import { getBlogPostsByCategory, categories } from '@/lib/blog'
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
                href={\`/category/\$\{params.category\}/\$\{subcategory.id\}\`}
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
            href={\`/blog/\$\{post.slug\}\`}
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
    { category: '${categoryId}' }
  ]
}`;
}

/**
 * 生成子分类页面内容
 */
function generateSubcategoryPageContent(categoryId, subcategoryId) {
  return `import { getBlogPostsByCategory, categories } from '@/lib/blog'
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
        <Link href={\`/category/\$\{params.category\}\`} className="text-blue-600 hover:underline">
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
            href={\`/blog/\$\{post.slug\}\`}
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
    { category: '${categoryId}', subcategory: '${subcategoryId}' }
  ]
}`;
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始自动更新分类系统...');
  
  // 获取所有分类
  const allCategories = getAllCategories();
  const existingCategories = getExistingCategories();
  
  console.log('📊 发现的分类:', Object.keys(allCategories));
  console.log('📚 现有分类:', Object.keys(existingCategories));
  
  // 检查新分类
  const newCategories = [];
  const newSubcategories = [];
  
  Object.keys(allCategories).forEach(categoryId => {
    if (!existingCategories[categoryId]) {
      newCategories.push(categoryId);
    } else {
      // 检查子分类
      allCategories[categoryId].forEach(subcategoryId => {
        if (!existingCategories[categoryId].includes(subcategoryId)) {
          newSubcategories.push({ category: categoryId, subcategory: subcategoryId });
        }
      });
    }
  });
  
  if (newCategories.length > 0) {
    console.log('🆕 发现新分类:', newCategories);
    console.log('⚠️  请手动更新 lib/blog.ts 中的 categories 数组');
  }
  
  if (newSubcategories.length > 0) {
    console.log('🆕 发现新子分类:', newSubcategories);
    console.log('⚠️  请手动更新 lib/blog.ts 中的对应分类');
  }
  
  // 检查是否存在动态路由 [id]
  const dynamicRouteExists = fs.existsSync(path.join(APP_DIR, 'category', '[id]', 'page.tsx'));
  
  if (dynamicRouteExists) {
    console.log('ℹ️  检测到动态路由 [id]，跳过静态路由生成以避免冲突');
    console.log('💡 动态路由将自动处理所有分类页面');
  } else {
    // 只有在没有动态路由时才生成静态页面
    console.log('📁 生成静态分类页面...');
    Object.keys(allCategories).forEach(categoryId => {
      // 生成主分类页面
      generateCategoryPage(categoryId);
      
      // 生成子分类页面
      allCategories[categoryId].forEach(subcategoryId => {
        generateCategoryPage(categoryId, subcategoryId);
      });
    });
  }
  
  console.log('✅ 分类系统更新完成！');
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = { main, getAllCategories, getExistingCategories }; 