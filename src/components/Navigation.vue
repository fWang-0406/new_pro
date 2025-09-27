<!-- src/components/Navigation.vue -->
<template>
  <div class="navigation-panel">
    <div class="panel-header">
      <h3>报告编辑</h3>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
    <div class="panel-content">
      <div class="form-group">
        <label>报告标题</label>
        <input
          type="text"
          v-model="reportConfig.title"
          @input="updateConfig"
        >
      </div>

      <div class="form-group">
        <label>显示设置</label>
        <div class="checkbox-group">
          <label>
            <input
              type="checkbox"
              v-model="reportConfig.showCharts"
              @change="updateConfig"
            >
            显示图表
          </label>
          <label>
            <input
              type="checkbox"
              v-model="reportConfig.showTable"
              @change="updateConfig"
            >
            显示表格
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>图表类型</label>
        <select
          v-model="reportConfig.chartType"
          @change="updateConfig"
        >
          <option value="line">折线图</option>
          <option value="bar">柱状图</option>
          <option value="pie">饼图</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { useDataStore } from '../stores/dataStore'
import { onMounted, ref } from 'vue'

export default {
  name: 'Navigation',
  emits: ['close'],
  setup(props, { emit }) {
    const dataStore = useDataStore()
    const reportConfig = ref({})

    onMounted(() => {
      reportConfig.value = { ...dataStore.reportConfig }
    })

    const updateConfig = () => {
      dataStore.updateReportConfig(reportConfig.value)
    }

    return {
      reportConfig,
      updateConfig
    }
  }
}
</script>

<style scoped>
.navigation-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 300px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  padding: 20px;
  z-index: 100;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>