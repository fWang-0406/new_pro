<template>
  <div class="page-report-generator">
    <h2>生成报告 - 选择表格</h2>

    <div v-if="!dataStore.uploadedData" class="empty-state">
      请先上传数据文件才能生成报告
      <button class="upload-btn" @click="$router.push('/data-processing')">去上传</button>
    </div>

    <div v-else class="content">
      <div class="table-selection">
        <h3>可选表格</h3>
        <div class="table-options">
          <div
            v-for="table in dataStore.availableTables"
            :key="table.id"
            class="table-option"
            :class="{ selected: isSelected(table.id) }"
            @click="toggleSelection(table.id)"
          >
            <input
              type="checkbox"
              :id="table.id"
              :checked="isSelected(table.id)"
              class="checkbox"
            >
            <label :for="table.id">{{ table.name }}</label>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button
          class="generate-btn"
          @click="generateReport"
          :disabled="dataStore.selectedTables.length === 0"
        >
          生成报告
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useDataStore } from '../stores/dataStore'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  name: 'ReportGenerator',
  setup() {
    const dataStore = useDataStore()
    const router = useRouter()

    const isSelected = (tableId) => {
      return dataStore.selectedTables.includes(tableId)
    }

    const toggleSelection = (tableId) => {
      if (isSelected(tableId)) {
        dataStore.setSelectedTables(
          dataStore.selectedTables.filter(id => id !== tableId)
        )
      } else {
        dataStore.setSelectedTables([...dataStore.selectedTables, tableId])
      }
    }

    const generateReport = async () => {
      try {
        // 向后端发送请求，生成选中的表格
        const response = await axios.post('/api/generate-report', {
          tableIds: dataStore.selectedTables,
          dataId: dataStore.uploadedData.backendResult?.id
        })

        // 保存后端返回的报告内容
        dataStore.setReportContent(response.data.tables)
        // 设置初始报告文本
        dataStore.updateReportText('请在此处输入分析文本...')

        // 跳转到报告编辑页面
        router.push('/report-editor')
      } catch (error) {
        console.error('生成报告失败:', error)
        alert('生成报告失败，请重试')
      }
    }

    return {
      dataStore,
      isSelected,
      toggleSelection,
      generateReport
    }
  }
}
</script>

<style scoped>
.page-report-generator {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  background: #f9f9f9;
  border-radius: 4px;
}

.upload-btn {
  margin-top: 15px;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.table-selection {
  margin-bottom: 20px;
}

.table-options {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
}

.table-option {
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.table-option:last-child {
  border-bottom: none;
}

.table-option:hover {
  background-color: #f5f5f5;
}

.table-option.selected {
  background-color: #e8f4fd;
}

.checkbox {
  margin-right: 10px;
}

.action-buttons {
  text-align: center;
}

.generate-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.generate-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.generate-btn:hover:not(:disabled) {
  background-color: #2980b9;
}
</style>