import { createRouter, createWebHistory } from 'vue-router'

// 使用相对路径导入
const BaseData = () => import('../views/BaseData.vue')
const AnalysisIndex = () => import('../views/AnalysisIndex.vue')
const StandardTable = () => import('../views/StandardTable.vue')
const CustomTable = () => import('../views/CustomTable.vue')

const routes = [
  { path: '/', redirect: '/base-data' },
  { path: '/base-data', component: BaseData },
  { path: '/analysis-index', component: AnalysisIndex },
  { path: '/standard-table', component: StandardTable },
  { path: '/custom-table', component: CustomTable }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router