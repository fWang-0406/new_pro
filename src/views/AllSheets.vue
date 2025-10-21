<template>
  <div class="all-sheets-container">
    <div class="layout">
      <SheetList
        :sheets="sheets"
        :currentSheet="currentSheet"
        @sheet-selected="loadSheetData"
      />

      <div class="content">
        <div class="header-title">
          <h1>数据表格管理</h1>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">加载中...</span>
          </div>
        </div>

        <div v-else>
          <div v-if="currentSheet" class="sheet-info">
            <h3 id="sheetName">{{ currentSheet }}</h3>
            <p id="sheetDescription">共 {{ tableData.length }} 条记录</p>
          </div>

          <div class="table-container">
            <div class="table-responsive">
              <table class="table">
                <thead id="tableHead">
                  <tr>
                    <th v-for="column in columns" :key="column">
                      {{ column }}
                    </th>
                  </tr>
                </thead>
                <tbody id="tableBody">
                  <tr v-for="(row, index) in tableData" :key="index">
                    <td v-for="column in columns" :key="column">
                      {{ row[column] || '' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import SheetList from '@/components/SheetList.vue'

export default {
  name: 'AllSheets',
  components: {
    SheetList
  },
  setup() {
    const sheets = ref([])
    const currentSheet = ref('')
    const tableData = ref([])
    const loading = ref(false)

    const columns = computed(() => {
      if (tableData.value.length === 0) return []
      return Object.keys(tableData.value[0])
    })

    const loadSheetList = async () => {
      try {
        // 这里替换为实际的 API 调用
        // const response = await fetch('/api/sheets')
        // sheets.value = await response.json()

        // 模拟数据
        sheets.value = ['表格1', '表格2', '表格3']
        if (sheets.value.length > 0) {
          await loadSheetData(sheets.value[0])
        }
      } catch (error) {
        console.error('加载表格列表失败:', error)
      }
    }

    const loadSheetData = async (sheetName) => {
      loading.value = true
      currentSheet.value = sheetName

      try {
        // 这里替换为实际的 API 调用
        // const response = await fetch(`/api/sheet/${encodeURIComponent(sheetName)}`)
        // const data = await response.json()

        // 模拟数据
        await new Promise(resolve => setTimeout(resolve, 1000))
        tableData.value = [
          { id: 1, name: '项目A', value: 100, status: '正常' },
          { id: 2, name: '项目B', value: 200, status: '警告' },
          { id: 3, name: '项目C', value: 150, status: '正常' }
        ]
      } catch (error) {
        console.error('加载表格数据失败:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadSheetList()
    })

    return {
      sheets,
      currentSheet,
      tableData,
      loading,
      columns,
      loadSheetData
    }
  }
}
</script>

<style scoped>
.all-sheets-container {
  font-family: "Microsoft YaHei", sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.layout {
  display: flex;
}

.content {
  flex: 1;
  margin-left: 280px;
  padding: 20px;
}

.header-title {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: center;
}

.sheet-info {
  background: #e9ecef;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>