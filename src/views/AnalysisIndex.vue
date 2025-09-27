<template>
  <div class="page-analysis-index">
    <h2>分析指标</h2>
    <div class="toolbar">
      <!-- 添加生成报告按钮 -->
      <button
        class="toolbar-btn"
        @click="generateReport"
        :disabled="!analysisData.length"
      >
        生成报告
      </button>
    </div>
    <!-- 原有内容保持不变 -->
    <div v-if="!analysisData.length" class="empty-state">
      请先上传数据文件进行分析
    </div>
    <div v-else class="content">
      <div class="charts-container">
        <div class="chart-card">
          <h3>指标趋势图</h3>
          <div ref="trendChart" class="chart-container"></div>
        </div>
        <div class="chart-card">
          <h3>指标对比</h3>
          <div ref="comparisonChart" class="chart-container"></div>
        </div>
      </div>
      <DataTable :columns="columns" :data="analysisData" />
    </div>
  </div>
</template>

<script>
// 原有导入保持不变
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import DataTable from '../components/DataTable.vue'
import { useDataStore } from '../stores/dataStore'
// 导入路由
import { useRouter } from 'vue-router'

export default {
  name: 'AnalysisIndex',
  components: { DataTable },
  setup() {
    // 原有代码保持不变
    const trendChart = ref(null)
    const comparisonChart = ref(null)
    const dataStore = useDataStore()
    const router = useRouter() // 添加路由实例

    const analysisData = ref([])
    const columns = [
      { key: 'index', title: '指标名称' },
      { key: 'current', title: '当前值' },
      { key: 'previous', title: '上期值' },
      { key: 'change', title: '变化率' },
      { key: 'status', title: '状态' }
    ]

    // 添加生成报告方法
    const generateReport = () => {
      dataStore.setAnalysisResult(analysisData.value)
      // 跳转到报告编辑页面
      router.push('/report-editor')
    }

    // 原有分析逻辑保持不变
    watch(
      () => dataStore.uploadedData,
      (newData) => {
        if (newData && newData.rawData.length) {
          analyzeData(newData.rawData)
        }
      }
    )

    const analyzeData = (rawData) => {
      analysisData.value = rawData.slice(0, 5).map((item, index) => ({
        index: `指标${index + 1}`,
        current: item.value || Math.floor(Math.random() * 100),
        previous: Math.floor(Math.random() * 100),
        change: `${((Math.random() * 20 - 5) / 100).toFixed(2)}%`,
        status: Math.random() > 0.5 ? '正常' : '异常'
      }))
      renderCharts()
    }

    const renderCharts = () => {
      // 原有图表渲染逻辑保持不变
      const trendInstance = echarts.init(trendChart.value)
      trendInstance.setOption({
        xAxis: { type: 'category', data: analysisData.value.map(item => item.index) },
        yAxis: { type: 'value' },
        series: [{
          data: analysisData.value.map(item => item.current),
          type: 'line',
          smooth: true
        }]
      })

      const comparisonInstance = echarts.init(comparisonChart.value)
      comparisonInstance.setOption({
        xAxis: { type: 'category', data: analysisData.value.map(item => item.index) },
        yAxis: { type: 'value' },
        series: [
          { name: '当前值', data: analysisData.value.map(item => item.current), type: 'bar' },
          { name: '上期值', data: analysisData.value.map(item => item.previous), type: 'bar' }
        ]
      })

      window.addEventListener('resize', () => {
        trendInstance.resize()
        comparisonInstance.resize()
      })
    }

    onMounted(() => {
      if (dataStore.uploadedData?.rawData?.length) {
        analyzeData(dataStore.uploadedData.rawData)
      }
    })

    return {
      trendChart,
      comparisonChart,
      analysisData,
      columns,
      generateReport // 导出新方法
    }
  }
}
</script>

<style scoped>
/* 原有样式保持不变，添加工具栏样式 */
.toolbar {
  margin-bottom: 15px;
}

.toolbar-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.toolbar-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.chart-container {
  height: 200px;
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  background: #f9f9f9;
  border-radius: 4px;
}
</style>