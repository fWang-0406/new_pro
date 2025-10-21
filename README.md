# 前端数据管理平台

## 项目简介

这是一个基于 Vue 3 构建的现代化前端数据管理平台，提供基础数据管理、分析指标展示、标准表格和自定义表格等功能。平台采用模块化设计，具有友好的用户界面和流畅的交互体验。

![Vue](https://img.shields.io/badge/Vue-3.3.4-green)
![Vite](https://img.shields.io/badge/Vite-4.4.5-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 核心功能

### 数据管理
- **基础数据管理** - 结构化展示基础数据信息
- **分析指标** - 可视化展示关键业务指标和趋势
- **标准表格** - 预定义格式的数据表格展示
- **自定义表格** - 支持动态添加行列的灵活表格

### 实用功能
- **编辑面板** - 提供数据源设置和显示配置选项
- **导出功能** - 支持 Excel、CSV、PDF 多种格式导出
- **响应式设计** - 完美适配桌面端和移动端设备
- **单页面应用** - 流畅的路由切换体验

## 快速开始

### 环境要求

- Node.js 14.0 或更高版本
- npm 6.0 或更高版本
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装步骤

1. **克隆项目**
```bash
git clone <项目地址>
cd frontend-project
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 `http://localhost:5173`

### 其他命令

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

## 📁 项目结构

```
frontend-project/
├── public/                 # 静态资源目录
│   └── favicon.ico        # 网站图标
├── src/                   # 源代码目录
│   ├── components/        # 可复用组件
│   │   ├── Header.vue     # 顶部导航组件
│   │   ├── Navigation.vue # 编辑面板组件
│   │   ├── ExportPanel.vue # 导出面板组件
│   │   ├── DataTable.vue  # 通用表格组件
│   │   ├── ChartControls.vue # 新增：图表控制组件
│   │   └── SheetList.vue  # 新增：表格列表组件
│   ├── views/            # 页面级组件
│   │   ├── BaseData.vue   # 基础数据页面
│   │   ├── AnalysisIndex.vue # 分析指标页面
│   │   ├── StandardTable.vue # 标准表格页面
│   │   ├── CustomTable.vue  # 自定义表格页面
│   │   ├── AllSheets.vue  # 新增：所有表格页面
│   │   └── LineAnalysis.vue # 新增：线路分析页面
│   ├── router/           # 路由配置
│   │   └── index.js      # 路由定义
│   ├── assets/           # 静态资源
│   │   └── styles/       # 样式文件
│   │       ├── global.css # 全局样式
│   │       ├── all-sheets.css # 新增：表格列表样式
│   │       ├── line-analysis.css # 新增：线路分析样式
│   │       └── common.css # 新增：通用样式整合
│   ├── utils/            # 工具函数
│   │   └── chart-utils.js # 新增：图表工具函数
│   ├── App.vue           # 根组件
│   └── main.js           # 应用入口文件
├── index.html            # HTML 模板
├── vite.config.js        # Vite 配置
├── package.json          # 项目配置和依赖
└── README.md            # 项目说明文档
```

## 核心组件详解

### Header.vue - 顶部导航栏
- **功能**: 提供主要导航菜单和操作按钮
- **特性**: 
  - 响应式菜单设计
  - 活动状态高亮显示
  - 集成编辑和导出功能面板

### Navigation.vue - 编辑面板
- **功能**: 提供系统配置选项
- **配置项**:
  - 数据源连接设置
  - 数据表管理
  - 字段映射配置
  - 界面显示设置

### ExportPanel.vue - 导出面板
- **功能**: 数据导出功能
- **支持格式**:
  - Excel (.xlsx)
  - CSV (.csv) 
  - PDF (.pdf)

### DataTable.vue - 通用表格组件
- **功能**: 数据表格展示
- **特性**:
  - 支持动态列配置
  - 鼠标悬停效果
  - 响应式布局

## 页面功能说明

### 基础数据 (`/base-data`)
- **功能**: 展示系统基础数据信息
- **数据结构**:
  - ID、名称、类型、数值等字段
  - 支持多种数据类型展示

### 分析指标 (`/analysis-index`)
- **功能**: 业务指标分析和可视化
- **包含内容**:
  - 指标趋势图表
  - 指标对比分析
  - 变化率统计

### 标准表格 (`/standard-table`)
- **功能**: 标准化数据表格展示
- **适用场景**:
  - 质量标准数据
  - 时间标准数据
  - 数量标准数据

### 自定义表格 (`/custom-table`)
- **功能**: 灵活的数据表格管理
- **特色功能**:
  - 动态添加/删除行列
  - 自定义字段配置
  - 实时数据编辑

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.3.4 | 前端框架 |
| Vue Router | 4.2.4 | 路由管理 |
| Vite | 4.4.5 | 构建工具 |
| JavaScript ES6+ | - | 开发语言 |

## 浏览器兼容性

| 浏览器 | 最低版本 | 状态 |
|--------|----------|------|
| Chrome | 60+ | 完全支持 |
| Firefox | 55+ | 完全支持 |
| Safari | 12+ | 完全支持 |
| Edge | 79+ | 完全支持 |

## 开发指南

### 添加新页面
1. 在 `src/views/` 目录创建新的 Vue 组件
2. 在 `src/router/index.js` 中添加路由配置
3. 在 `Header.vue` 的菜单项中添加导航链接

### 自定义样式
- 修改 `src/assets/styles/global.css` 调整全局样式
- 在各组件 `<style>` 块中编写组件特定样式

### 数据对接
组件通过 `props` 接收数据，可根据实际需求对接后端 API

## 性能优化

- 使用 Vue 3 组合式 API 提高代码复用性
- 组件懒加载减少初始包大小
- 静态资源压缩优化加载速度

## 贡献指南

我们欢迎任何形式的贡献！请遵循以下步骤：

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 常见问题

### Q: 启动时出现端口被占用错误
**A**: 可以修改 `vite.config.js` 中的端口配置，或使用 `npm run dev -- --port 3000`

### Q: 如何修改默认主题颜色？
**A**: 在 `src/assets/styles/global.css` 中修改 CSS 变量定义

### Q: 如何添加新的导出格式？
**A**: 在 `ExportPanel.vue` 组件中添加新的导出选项和处理逻辑
---