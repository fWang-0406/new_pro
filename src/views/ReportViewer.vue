<!-- src/views/ReportViewer.vue -->
<template>
  <div class="page-report-viewer">
    <div class="report-header">
      <h1>{{ report.config.title }}</h1>
      <p class="report-meta">
        生成时间: {{ formatDate(report.generatedAt) }}
      </p>
      <p class="report-description" v-if="report.config.description">
        {{ report.config.description }}
      </p>
      <div class="report-actions">
        <button class="btn edit-btn" @click="goToEdit">
          编辑报告
        </button>
        <button class="btn export-btn" @click="openExportPanel">
          导出报告
        </button>
      </div>
    </div>

    <div class="report-content">
      <!-- 摘要统计部分 -->
      <div class="report-section" v-if="report.config.showSummary">
        <h2>数据摘要</h2>
        <div class="summary-stats">
          <div class="stat-card">
            <p class="stat-label">记录总数</p>
            <p class="stat-value">{{ report.data.length }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">字段数量</p>
            <p class="stat-value">{{ getFieldCount() }}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">数据完整性</p>
            <p class="stat-value">{{ calculateCompleteness() }}%</p>
          </div>
        </div>
      </div>

      <!-- 图表部分 -->
      <div class="report-section" v-if="report.config.showCharts && report.data.length">
        <h2>数据可视化</h2>
        <div class="chart-container" ref="chartContainer"></div>
      </div>

      <!-- 表格部分 -->
      <div class="report-section" v-if="report.config.showTable && report.data.length">
        <h2>详细数据</h2>
        <DataTable :columns="tableColumns" :data="report.data" />
      </div>

      <!-- 无数据状态 -->
      <div class="empty-state" v-if="!report.data || !report.data.length">
        <p>报告中没有可显示的数据</p>
        <button class="btn upload-btn" @click="goToUpload">
          上传数据
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { useDataStore } from '../stores/dataStore'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import DataTable from '../components/DataTable.vue'
import ExportPanel from '../components/ExportPanel.vue'

export default {
  name: 'ReportViewer',
  components: { DataTable, ExportPanel },
  setup() {
    const dataStore = useDataStore()
    const router = useRouter()
    const chartContainer = ref(null)
    const showExportPanel = ref(false)
    const report = ref({})
    const tableColumns = ref([])

    // 初始化报告数据
    const initReport = () => {
      const generatedReport = dataStore.generatedReport

      if (!generatedReport) {
        router.push('/analysis-index')
        return
      }

      report.value = generatedReport
      setupTableColumns()
    }

    // 设置表格列
    const setupTableColumns = () => {
      if (report.value.data && report.value.data.length) {
        const firstRow = report.value.data[0]
        tableColumns.value = Object.keys(firstRow).map(key => ({
          key,
          title: key.charAt(0).toUpperCase() + key.slice(1) // 首字母大写作为标题
        }))
      }
    }

    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString()
    }

    // 获取字段数量
    const getFieldCount = () => {
      if (report.value.data && report.value.data.length) {
        return Object.keys(report.value.data[0]).length
      }
      return 0
    }

    // 计算数据完整性
    const calculateCompleteness = () => {
      if (!report.value.data || !report.value.data.length) return 0

      let total = 0
      let complete = 0

      report.value.data.forEach(row => {
        Object.values(row).forEach(value => {
          total++
          if (value !== null && value !== undefined && value !== '') {
            complete++
          }
        })
      })

      return Math.round((complete / total) * 100)
    }

    // 渲染图表
    const renderChart = () => {
      if (!chartContainer.value || !report.value.data || !report.value.data.length) return

      const chart = echarts.init(chartContainer.value)
      const chartType = report.value.config.chartType || 'line'

      // 准备图表数据
      const keys = Object.keys(report.value.data[0])
      const categories = report.value.data.map((_, index) => `项 ${index + 1}`)

      // 根据选择的图表类型设置不同的配置
      let series = []

      if (chartType === 'pie' && keys.length > 0) {
        // 饼图特殊处理
        series = [{
          type: 'pie',
          data: report.value.data.map((item, index) => ({
            name: `项 ${index + 1}`,
            value: item[keys[0]]
          }))
        }]
      } else {
        // 其他图表类型
        series = keys.slice(0, 5).map(key => ({
          name: key,
          type: chartType,
          data: report.value.data.map(item => item[key])
        }))
      }

      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: keys.slice(0, 5),
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        },
        xAxis: chartType !== 'pie' ? {
          type: 'category',
          data: categories
        } : undefined,
        yAxis: chartType !== 'pie' ? {
          type: 'value'
        } : undefined,
        series
      }

      chart.setOption(option)

      // 响应窗口大小变化
      window.addEventListener('resize', () => {
        chart.resize()
      })
    }

    // 跳转到编辑页面
    const goToEdit = () => {
      router.push('/analysis-index')
    }

    // 跳转到上传页面
    const goToUpload = () => {
      router.push('/data-processing')
    }

    // 打开导出面板
    const openExportPanel = () => {
      showExportPanel.value = true
    }

    onMounted(() => {
      initReport()
      watch(report, () => {
        renderChart()
      })
    })

    return {
      report,
      chartContainer,
      showExportPanel,
      tableColumns,
      formatDate,
      getFieldCount,
      calculateCompleteness,
      goToEdit,
      goToUpload,
      openExportPanel
    }
  }
}
</script>

<style scoped>
.page-report-viewer {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.report-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.report-meta {
  color: #7f8c8d;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.report-description {
  font-style: italic;
  color: #555;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.report-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.report-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.report-section h2 {
  margin-bottom: 15px;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
  display: inline-block;
}

.summary-stats {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 150px;
  background-color: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-label {
  color: #7f8c8d;
  margin: 0 0 5px 0;
  font-size: 0.9rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #3498db;
  margin: 0;
}

.chart-container {
  height: 400px;
  width: 100%;
  background-color: white;
  border-radius: 6px;
  padding: 10px;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #7f8c8d;
}

.btn {
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  border: none;
  transition: all 0.3s;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.export-btn {
  background-color: #2ecc71;
  color: white;
}

.export-btn:hover {
  background-color: #27ae60;
}

.upload-btn {
  background-color: #f39c12;
  color: white;
  margin-top: 15px;
}

.upload-btn:hover {
  background-color: #e67e22;
}
</style>