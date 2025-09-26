<!-- src/components/Navigation.vue（修改） -->
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

export default {
  name: 'Navigation',
  emits: ['close'],
  data() {
    const dataStore = useDataStore()
    return {
      reportConfig: { ...dataStore.reportConfig }
    }
  },
  methods: {
    updateConfig() {
      const dataStore = useDataStore()
      dataStore.updateReportConfig(this.reportConfig)
    }
  }
}
</script>

<style scoped>
/* 新增样式 */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>