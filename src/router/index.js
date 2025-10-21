import { createRouter, createWebHistory } from 'vue-router';
import BaseData from '../views/BaseData.vue';
import AnalysisIndex from '../views/AnalysisIndex.vue';
import StandardTable from '../views/StandardTable.vue';
import CustomTable from '../views/CustomTable.vue';
import AllSheets from '../views/AllSheets.vue'; // 新增
import LineAnalysis from '../views/LineAnalysis.vue'; // 新增

const routes = [
  {
    path: '/',
    name: 'BaseData',
    component: BaseData
  },
  {
    path: '/analysis-index',
    name: 'AnalysisIndex',
    component: AnalysisIndex
  },
  {
    path: '/standard-table',
    name: 'StandardTable',
    component: StandardTable
  },
  {
    path: '/custom-table',
    name: 'CustomTable',
    component: CustomTable
  },
  { // 新增路由
    path: '/all-sheets',
    name: 'AllSheets',
    component: AllSheets
  },
  { // 新增路由
    path: '/line-analysis',
    name: 'LineAnalysis',
    component: LineAnalysis
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;