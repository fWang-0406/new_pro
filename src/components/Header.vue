<template>
  <header class="header">
    <div class="logo">数据管理平台</div>
    <nav class="nav">
      <ul class="nav-list">
        <li v-for="item in menuItems" :key="item.path" class="nav-item">
          <router-link
            :to="item.path"
            class="nav-link"
            :class="{ active: $route.path === item.path }"
          >
            {{ item.title }}
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="header-actions">
      <button class="action-btn" @click="goToReportGenerator">生成报告</button>
      <button class="action-btn" @click="toggleEditPanel">编辑报告</button>
      <button class="action-btn" @click="toggleExportPanel">导出</button>
    </div>
  </header>

  <!-- 编辑面板 -->
  <Navigation v-if="showEditPanel" @close="showEditPanel = false" />

  <!-- 导出面板 -->
  <ExportPanel v-if="showExportPanel" @close="showExportPanel = false" />
</template>

<script>
import Navigation from './Navigation.vue'
import ExportPanel from './ExportPanel.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Header',
  components: {
    Navigation,
    ExportPanel
  },
  data() {
    return {
      showEditPanel: false,
      showExportPanel: false,
      menuItems: [
        { title: '基础数据', path: '/base-data' },
        { title: '数据上传', path: '/data-processing' },
        { title: '分析指标', path: '/analysis-index' },
        { title: '标准表格', path: '/standard-table' },
        { title: '自定义表格', path: '/custom-table' },
        { title: '所有数据表', path: '/all-sheets' }, // 新增：所有数据表页面
        { title: '线路负载分析', path: '/line-analysis' }, // 新增：线路负载分析页面
        { title: '生成报告', path: '/report-generator' }
      ]
    }
  },
  setup() {
    const router = useRouter()

    const goToReportGenerator = () => {
      router.push('/report-generator')
    }

    return {
      goToReportGenerator
    }
  },
  methods: {
    toggleEditPanel() {
      this.showEditPanel = !this.showEditPanel
      this.showExportPanel = false
    },
    toggleExportPanel() {
      this.showExportPanel = !this.showExportPanel
      this.showEditPanel = false
    }
  }
}
</script>

<style scoped>
/* 保持原有样式不变 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2c3e50;
  color: white;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0 10px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover, .nav-link.active {
  background-color: #34495e;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background-color: #2980b9;
}
</style>