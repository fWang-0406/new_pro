<!-- src/views/AnalysisIndex.vue -->
<template>
  <div class="page-analysis-index">
    <h2>分析指标</h2>
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
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import DataTable from '../components/DataTable.vue'
import { useDataStore } from '../stores/dataStore' // 后面会实现

export default {
  name: 'AnalysisIndex',
  components: { DataTable },
  setup() {
    const trendChart = ref(null)
    const comparisonChart = ref(null)
    const dataStore = useDataStore()

    // 分析后的数据
    const analysisData = ref([])
    const columns = [
      { key: 'index', title: '指标名称' },
      { key: 'current', title: '当前值' },
      { key: 'previous', title: '上期值' },
      { key: 'change', title: '变化率' },
      { key: 'status', title: '状态' }
    ]

    // 监听上传的数据变化，进行分析
    watch(
      () => dataStore.uploadedData,
      (newData) => {
        if (newData && newData.rawData.length) {
          analyzeData(newData.rawData)
        }
      }
    )

    // 数据分析逻辑（示例）
    const analyzeData = (rawData) => {
      // 这里根据实际业务逻辑处理原始数据
      analysisData.value = rawData.slice(0, 5).map((item, index) => ({
        index: `指标${index + 1}`,
        current: item.value || Math.floor(Math.random() * 100),
        previous: Math.floor(Math.random() * 100),
        change: `${((Math.random() * 20 - 5) / 100).toFixed(2)}%`,
        status: Math.random() > 0.5 ? '正常' : '异常'
      }))
      renderCharts()
    }

    // 渲染图表
    const renderCharts = () => {
      // 趋势图
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

      // 对比图
      const comparisonInstance = echarts.init(comparisonChart.value)
      comparisonInstance.setOption({
        xAxis: { type: 'category', data: analysisData.value.map(item => item.index) },
        yAxis: { type: 'value' },
        series: [
          { name: '当前值', data: analysisData.value.map(item => item.current), type: 'bar' },
          { name: '上期值', data: analysisData.value.map(item => item.previous), type: 'bar' }
        ]
      })

      // 响应窗口大小变化
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
      columns
    }
  }
}
</script>

<style scoped>
/* 保留原有样式，新增：*/
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