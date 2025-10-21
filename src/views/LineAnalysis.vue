<template>
  <div class="line-analysis-container">
    <div class="layout">
      <div class="sidebar">
        <h2>线路分析</h2>
        <ul>
          <li
            v-for="item in menuItems"
            :key="item.id"
            :class="['menu-item', { active: activeMenu === item.id }]"
            @click="selectMenu(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>

      <div class="content">
        <div class="main-view">
          <div v-if="loading" class="loading">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">加载中...</span>
            </div>
          </div>

          <div v-else-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div v-else class="table-content">
            <h3 class="table-title">问题线路分析</h3>

            <ChartControls
              @show-bar-chart="showBarChart"
              @show-pie-chart="showPieChart"
              @hide-charts="hideCharts"
            />

            <div v-if="showChart" class="chart-container">
              <h4 id="chartTitle">{{ chartTitle }}</h4>
              <canvas ref="chartCanvas"></canvas>
            </div>

            <div class="table-container">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th v-for="header in tableHeaders" :key="header">
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row, index) in tableData"
                      :key="index"
                      :class="getRowClass(row)"
                    >
                      <td v-for="header in tableHeaders" :key="header">
                        {{ row[header] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="analysis-panel" v-if="activePanel">
          <h3>列控制</h3>
          <button
            v-for="header in tableHeaders"
            :key="header"
            :class="{ active: isColumnVisible(header) }"
            @click="toggleColumn(header)"
          >
            {{ header }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import ChartControls from '@/components/ChartControls.vue'
import { chartUtils } from '@/utils/chart-utils'

export default {
  name: 'LineAnalysis',
  components: {
    ChartControls
  },
  setup() {
    const loading = ref(false)
    const errorMessage = ref('')
    const tableData = ref([])
    const showChart = ref(false)
    const chartTitle = ref('')
    const chartInstance = ref(null)
    const chartCanvas = ref(null)
    const activeMenu = ref('problem-lines')
    const activePanel = ref(true)
    const visibleColumns = ref(new Set())

    const tableHeaders = [
      '序号', '变电站名称', '线路名称', '限额电流（A）',
      '2024年最大电流（A）', '2024年线路最大负载率（%）', '重载/轻载原因'
    ]

    const menuItems = [
      { id: 'problem-lines', name: '问题线路', panel: 'column-control' },
      { id: 'load-analysis', name: '负载分析', panel: 'column-control' },
      { id: 'trend-analysis', name: '趋势分析', panel: 'column-control' }
    ]

    const fetchData = async () => {
      loading.value = true
      errorMessage.value = ''

      try {
        // 这里替换为实际的 API 调用
        // const response = await fetch('/api/problem-lines')
        // const result = await response.json()

        // 模拟数据
        await new Promise(resolve => setTimeout(resolve, 1500))
        tableData.value = [
          {
            序号: '1',
            变电站名称: '变电站A',
            线路名称: '线路001',
            限额电流: '500',
            '2024年最大电流': '480',
            '2024年线路最大负载率': '96',
            重载原因: '负荷增长'
          },
          {
            序号: '2',
            变电站名称: '变电站B',
            线路名称: '线路002',
            限额电流: '400',
            '2024年最大电流': '80',
            '2024年线路最大负载率': '20',
            轻载原因: '新建设备'
          }
        ]

        // 初始化所有列可见
        tableHeaders.forEach(header => visibleColumns.value.add(header))

      } catch (error) {
        errorMessage.value = '数据加载失败: ' + error.message
      } finally {
        loading.value = false
      }
    }

    const getRowClass = (row) => {
      const loadRate = parseFloat(row['2024年线路最大负载率'])
      if (loadRate >= 90) return 'high-load'
      if (loadRate <= 25) return 'low-load'
      return ''
    }

    const showBarChart = async () => {
      if (!chartCanvas.value) return

      const top10 = [...tableData.value]
        .sort((a, b) => b['2024年线路最大负载率'] - a['2024年线路最大负载率'])
        .slice(0, 10)

      const labels = top10.map(r => r['线路名称'])
      const values = top10.map(r => r['2024年线路最大负载率'])

      chartUtils.destroyChart(chartInstance.value)

      chartInstance.value = chartUtils.createBarChart(
        chartCanvas.value,
        labels,
        [{
          label: '负载率(%)',
          data: values,
          backgroundColor: '#0d6efd'
        }]
      )

      showChart.value = true
      chartTitle.value = '前10条线路负载率情况'
    }

    const showPieChart = async () => {
      if (!chartCanvas.value) return

      const heavy = tableData.value.filter(r => r['2024年线路最大负载率'] >= 90).length
      const light = tableData.value.filter(r => r['2024年线路最大负载率'] <= 25).length

      chartUtils.destroyChart(chartInstance.value)

      chartInstance.value = chartUtils.createPieChart(
        chartCanvas.value,
        ['重载', '轻载'],
        [{
          data: [heavy, light],
          backgroundColor: ['#dc3545', '#198754']
        }]
      )

      showChart.value = true
      chartTitle.value = '重载/轻载占比'
    }

    const hideCharts = () => {
      chartUtils.destroyChart(chartInstance.value)
      showChart.value = false
    }

    const selectMenu = (item) => {
      activeMenu.value = item.id
      // 这里可以根据不同的菜单项加载不同的数据
      fetchData()
    }

    const isColumnVisible = (header) => {
      return visibleColumns.value.has(header)
    }

    const toggleColumn = (header) => {
      if (visibleColumns.value.has(header)) {
        visibleColumns.value.delete(header)
      } else {
        visibleColumns.value.add(header)
      }
    }

    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      errorMessage,
      tableData,
      showChart,
      chartTitle,
      chartCanvas,
      activeMenu,
      activePanel,
      menuItems,
      tableHeaders,
      visibleColumns,
      fetchData,
      getRowClass,
      showBarChart,
      showPieChart,
      hideCharts,
      selectMenu,
      isColumnVisible,
      toggleColumn
    }
  }
}
</script>

<style scoped>
.line-analysis-container {
  font-family: "Noto Sans SC", "Source Han Sans SC", sans-serif;
  background: #f0f3fb;
  min-height: 100vh;
}

.layout {
  display: flex;
  height: 100vh;
}

.content {
  flex: 1;
  padding: 20px;
  display: flex;
  gap: 20px;
}

.main-view {
  flex: 4;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  padding: 20px;
}

.table-content {
  width: 100%;
}
</style>