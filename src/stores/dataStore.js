// src/stores/dataStore.js
import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', {
  state: () => ({
    uploadedData: null, // 存储上传的文件数据
    analysisResult: null, // 存储分析结果
    reportConfig: { // 报告个性化配置
      title: '数据分析报告',
      showCharts: true,
      showTable: true
    }
  }),
  actions: {
    setUploadedData(data) {
      this.uploadedData = data
    },
    setAnalysisResult(result) {
      this.analysisResult = result
    },
    updateReportConfig(config) {
      this.reportConfig = { ...this.reportConfig, ...config }
    },
    clearData() {
      this.uploadedData = null
      this.analysisResult = null
    }
  }
})