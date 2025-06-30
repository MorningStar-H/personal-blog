# Cursor 多项目协同工作区指南

> 🚀 使用 Cursor Workspace 功能管理多个相关项目，提升开发效率

---

## 🎯 什么是工作区（Workspace）

工作区允许你将多个相关的项目文件夹组合在一起，在同一个 Cursor 窗口中进行管理和开发。这对于微服务架构、前后端分离项目或相关模块开发特别有用。

### ✨ 主要优势

- 🔗 **统一管理**：在一个窗口中管理多个项目
- 🤖 **AI 上下文共享**：AI 可以跨项目理解代码关系
- 🔍 **全局搜索**：跨项目搜索文件和代码
- ⚙️ **共享配置**：统一的设置和插件配置
- 🔄 **快速切换**：在不同项目间快速导航

---

## 🛠️ 创建工作区的方法

### 方法一：通过菜单创建

1. 📁 **File** → **Save Workspace As...**
2. 💾 选择保存位置并命名（如：`my-project.code-workspace`）
3. 🎯 Cursor 会生成工作区配置文件

### 方法二：手动创建配置文件

创建一个 `.code-workspace` 文件，添加以下配置：

```json
{
  "folders": [
    {
      "name": "前端项目",
      "path": "./frontend"
    },
    {
      "name": "后端API",
      "path": "./backend"
    },
    {
      "name": "共享库",
      "path": "./shared"
    }
  ],
  "settings": {
    "cursor.ai.context.includeAllProjects": true,
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll": true
    }
  },
  "extensions": {
    "recommendations": [
      "ms-vscode.vscode-typescript-next",
      "esbenp.prettier-vscode",
      "bradlc.vscode-tailwindcss"
    ]
  }
}
```

---

## ⚙️ 详细配置选项

### 📂 文件夹配置 (folders)

```json
{
  "folders": [
    {
      "name": "显示名称",           // 可选：文件夹显示名称
      "path": "./相对路径",         // 必须：文件夹路径
      "uri": "file:///绝对路径"     // 可选：绝对路径URI
    }
  ]
}
```

### 🎛️ 重要设置项 (settings)

| 设置项 | 说明 | 推荐值 |
|--------|------|--------|
| `cursor.ai.context.includeAllProjects` | AI 包含所有项目上下文 | `true` |
| `files.exclude` | 排除特定文件/文件夹 | `{"**/node_modules": true}` |
| `search.exclude` | 搜索时排除文件 | `{"**/dist": true}` |
| `editor.formatOnSave` | 保存时自动格式化 | `true` |

### 🔌 插件推荐 (extensions)

```json
{
  "extensions": {
    "recommendations": [
      "ms-vscode.vscode-typescript-next",
      "esbenp.prettier-vscode",
      "bradlc.vscode-tailwindcss",
      "ms-python.python",
      "rust-lang.rust-analyzer"
    ],
    "unwantedRecommendations": [
      "ms-vscode.vscode-json"
    ]
  }
}
```

---

## 🎯 最佳实践

### 📁 项目组织结构

```
my-workspace/
├── my-project.code-workspace    # 工作区配置文件
├── frontend/                    # 前端项目
│   ├── src/
│   └── package.json
├── backend/                     # 后端项目
│   ├── src/
│   └── requirements.txt
└── shared/                      # 共享代码
    ├── types/
    └── utils/
```

### 💡 使用技巧

1. **🏷️ 合理命名**
   - 为文件夹设置有意义的 `name` 属性
   - 使用清晰的工作区文件名

2. **🔍 优化搜索**
   - 排除不必要的文件夹（`node_modules`, `dist`, `.git`）
   - 使用 `files.exclude` 和 `search.exclude`

3. **🤖 AI 优化**
   - 启用 `cursor.ai.context.includeAllProjects`
   - 保持项目结构清晰，便于 AI 理解

4. **⚙️ 统一配置**
   - 在工作区级别设置通用的编辑器配置
   - 推荐必要的插件给团队成员

---

## 🚀 高级用法

### 条件配置

```json
{
  "settings": {
    "[typescript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[python]": {
      "editor.defaultFormatter": "ms-python.black-formatter"
    }
  }
}
```

### 任务配置

```json
{
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "构建全部项目",
        "type": "shell",
        "command": "npm run build:all",
        "group": "build"
      }
    ]
  }
}
```

---

## 🔧 常见问题解决

### ❓ AI 无法跨项目理解代码
**解决方案**：确保设置了 `"cursor.ai.context.includeAllProjects": true`

### ❓ 搜索结果太多
**解决方案**：配置 `search.exclude` 排除不需要的文件夹

### ❓ 工作区加载缓慢
**解决方案**：排除大型文件夹，如 `node_modules`、`dist` 等

---

*💡 提示：合理配置工作区可以显著提升多项目开发的效率和体验*
