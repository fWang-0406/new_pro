<!-- src/components/ExportPanel.vue（修改） -->
<template>
  <div class="export-panel">
    <!-- 保留原有UI -->
    <div class="panel-header">
      <h3>导出数据</h3>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
    <div class="panel-content">
      <div class="export-options">
        <div class="option">
          <label>
            <input type="radio" v-model="exportFormat" value="excel">
            Excel 格式
          </label>
        </div>
        <div class="option">
          <label>
            <input type="radio" v-model="exportFormat" value="csv">
            CSV 格式
          </label>
        </div>
        <div class="option">
          <label>
            <input type="radio" v-model="exportFormat" value="pdf">
            PDF 格式
          </label>
        </div>
      </div>
      <div class="export-action">
        <button class="export-btn" @click="handleExport">导出</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useDataStore } from '../stores/dataStore'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'ExportPanel',
  emits: ['close'],
  data() {
    return {
      exportFormat: 'excel'
    }
  },
  methods: {
    handleExport() {
      const dataStore = useDataStore()
      const exportData = dataStore.analysisResult || dataStore.uploadedData?.rawData

      if (!exportData || !exportData.length) {
        alert('没有可导出的数据')
        return
      }

      switch (this.exportFormat) {
        case 'excel':
          this.exportToExcel(exportData)
          break
        case 'csv':
          this.exportToCsv(exportData)
          break
        case 'pdf':
          this.exportToPdf(exportData)
          break
      }

      this.$emit('close')
    },

    // 导出Excel
    exportToExcel(data) {
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '数据')
      XLSX.writeFile(workbook, `数据分析_${new Date().getTime()}.xlsx`)
    },

    // 导出CSV
    exportToCsv(data) {
      const csvContent = "data:text/csv;charset=utf-8,"
        + data.map(row => Object.values(row).join(',')).join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `数据分析_${new Date().getTime()}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    // 导出PDF
    exportToPdf(data) {
      const doc = new jsPDF()
      doc.text('数据分析报告', 10, 10)
      doc.autoTable({
        startY: 20,
        head: [Object.keys(data[0])],
        body: data.map(row => Object.values(row))
      })
      doc.save(`数据分析_${new Date().getTime()}.pdf`)
    }
  }
}
</script>