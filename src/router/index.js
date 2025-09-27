import { createRouter, createWebHistory } from 'vue-router'

const BaseData = () => import('../views/BaseData.vue')
const AnalysisIndex = () => import('../views/AnalysisIndex.vue')
const StandardTable = () => import('../views/StandardTable.vue')
const CustomTable = () => import('../views/CustomTable.vue')
// 添加新路由
const ReportEditor = () => import('../views/ReportEditor.vue')

const routes = [
  { path: '/', redirect: '/base-data' },
  { path: '/base-data', component: BaseData },
  { path: '/analysis-index', component: AnalysisIndex },
  { path: '/standard-table', component: StandardTable },
  { path: '/custom-table', component: CustomTable },
  // 注册报告编辑路由
  { path: '/report-editor', component: ReportEditor }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router