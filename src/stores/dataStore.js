// src/stores/dataStore.js
import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', {
  state: () => ({
    uploadedData: null, // 存储上传的文件数据
    analysisResult: null, // 存储分析结果
    generatedReport: null, // 存储生成的报告
    reportConfig: { // 报告个性化配置
      title: '数据分析报告',
      description: '',
      showCharts: true,
      showTable: true,
      showSummary: true,
      chartType: 'line',
      style: 'default'
    }
  }),
  actions: {
    setUploadedData(data) {
      this.uploadedData = data
    },
    setAnalysisResult(result) {
      this.analysisResult = result
    },
    setGeneratedReport(report) {
      this.generatedReport = report
    },
    updateReportConfig(config) {
      this.reportConfig = { ...this.reportConfig, ...config }
    },
    clearData() {
      this.uploadedData = null
      this.analysisResult = null
      this.generatedReport = null
    },
    // 分析数据并生成结果
    analyzeData(rawData) {
      if (!rawData || !rawData.length) return null

      // 进行数据分析
      const result = rawData.map((item, index) => {
        // 这里可以根据实际需求添加更复杂的分析逻辑
        const current = item.value || Math.floor(Math.random() * 100)
        const previous = Math.floor(Math.random() * 100)
        const change = ((current - previous) / previous * 100).toFixed(2)

        return {
          ...item,
          index: `指标${index + 1}`,
          current,
          previous,
          change: `${change}%`,
          status: change >= 0 ? '正常' : '异常'
        }
      })

      this.setAnalysisResult(result)
      return result
    }
  },
  getters: {
    hasData: (state) => {
      return !!state.uploadedData || !!state.analysisResult
    },
    reportReady: (state) => {
      return !!state.generatedReport
    }
  }
})