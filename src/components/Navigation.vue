<!-- src/components/Navigation.vue -->
<template>
  <div class="navigation-panel">
    <div class="panel-header">
      <h3>报告编辑</h3>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
    <div class="panel-content">
      <div class="form-group">
        <label>报告标题 <span class="required">*</span></label>
        <input
          type="text"
          v-model="reportConfig.title"
          @input="updateConfig"
          :class="{ 'invalid': !reportConfig.title }"
          placeholder="请输入报告标题"
        >
        <p class="hint" v-if="!reportConfig.title">标题不能为空</p>
      </div>

      <div class="form-group">
        <label>报告描述</label>
        <textarea
          v-model="reportConfig.description"
          @input="updateConfig"
          rows="3"
          placeholder="请输入报告描述（可选）"
        ></textarea>
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
          <label>
            <input
              type="checkbox"
              v-model="reportConfig.showSummary"
              @change="updateConfig"
            >
            显示摘要统计
          </label>
        </div>
      </div>

      <div class="form-group" v-if="reportConfig.showCharts">
        <label>图表类型</label>
        <select
          v-model="reportConfig.chartType"
          @change="updateConfig"
        >
          <option value="line">折线图</option>
          <option value="bar">柱状图</option>
          <option value="pie">饼图</option>
          <option value="radar">雷达图</option>
          <option value="scatter">散点图</option>
        </select>
      </div>

      <div class="form-group">
        <label>报告样式</label>
        <select
          v-model="reportConfig.style"
          @change="updateConfig"
        >
          <option value="default">默认样式</option>
          <option value="professional">专业样式</option>
          <option value="minimal">简约样式</option>
        </select>
      </div>

      <div class="form-actions">
        <button
          class="btn generate-btn"
          @click="generateReport"
          :disabled="!reportConfig.title"
        >
          生成报告
        </button>
        <button
          class="btn reset-btn"
          @click="resetConfig"
        >
          重置
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useDataStore } from '../stores/dataStore'
import { useRouter } from 'vue-router'

export default {
  name: 'Navigation',
  emits: ['close', 'report-generated'],
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
    },
    resetConfig() {
      const dataStore = useDataStore()
      this.reportConfig = {
        title: '数据分析报告',
        description: '',
        showCharts: true,
        showTable: true,
        showSummary: true,
        chartType: 'line',
        style: 'default'
      }
      this.updateConfig()
    },
    generateReport() {
      const dataStore = useDataStore()
      const router = useRouter()

      // 验证是否有数据可生成报告
      if (!dataStore.uploadedData && !dataStore.analysisResult) {
        alert('请先上传并分析数据后再生成报告')
        return
      }

      // 保存配置
      this.updateConfig()

      // 生成报告数据
      const reportData = {
        config: this.reportConfig,
        data: dataStore.analysisResult || dataStore.uploadedData.rawData,
        generatedAt: new Date().toISOString()
      }

      // 存储报告数据
      dataStore.setGeneratedReport(reportData)

      // 通知父组件报告已生成
      this.$emit('report-generated', reportData)

      // 关闭面板并跳转到报告页面
      this.$emit('close')
      router.push('/report-viewer')
    }
  }
}
</script>

<style scoped>
/* 保留原有样式，添加以下样式 */
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  border: none;
  flex: 1;
}

.generate-btn {
  background-color: #2ecc71;
  color: white;
}

.generate-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.reset-btn {
  background-color: #ecf0f1;
  color: #34495e;
}

.required {
  color: #e74c3c;
}

.invalid {
  border-color: #e74c3c !important;
}

.hint {
  margin: 5px 0 0 0;
  font-size: 0.85rem;
  color: #e74c3c;
}
</style>