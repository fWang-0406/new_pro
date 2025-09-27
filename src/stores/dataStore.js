import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', {
  state: () => ({
    uploadedData: null,
    analysisResult: null,
    reportConfig: {
      title: '数据分析报告',
      showCharts: true,
      showTable: true
    },
    // 添加报告内容存储
    reportContent: ''
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
    // 添加报告内容设置方法
    setReportContent(content) {
      this.reportContent = content
    },
    clearData() {
      this.uploadedData = null
      this.analysisResult = null
      this.reportContent = ''
    }
  }
})