<!-- src/components/ExportPanel.vue -->
<template>
  <div class="export-panel">
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
        <div class="option"> <!-- 新增 -->
          <label>
            <input type="radio" v-model="exportFormat" value="word">
            Word 格式
          </label>
        </div>
      </div>
      <div class="export-action">
        <button class="export-btn" @click="handleExport">保存并导出</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useDataStore } from '../stores/dataStore'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import axios from 'axios' // 新增

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
      const exportData = {
        content: dataStore.reportContent,
        text: dataStore.reportText,
        title: dataStore.reportConfig.title
      }

      if (!exportData.content) {
        alert('没有可导出的报告内容')
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
        case 'word': // 新增
          this.exportToWord(exportData)
          break
      }

      this.$emit('close')
    },

    // 导出Excel
    exportToExcel(data) {
      // 实现Excel导出逻辑
      const worksheet = XLSX.utils.json_to_sheet(data.content.flatMap(table => table.data))
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '报告数据')
      XLSX.writeFile(workbook, `${data.title}_${new Date().getTime()}.xlsx`)
    },

    // 导出CSV
    exportToCsv(data) {
      // 实现CSV导出逻辑
      const allData = data.content.flatMap(table => table.data)
      const csvContent = "data:text/csv;charset=utf-8,"
        + allData.map(row => Object.values(row).join(',')).join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `${data.title}_${new Date().getTime()}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    // 导出PDF
    exportToPdf(data) {
      // 实现PDF导出逻辑
      const doc = new jsPDF()
      doc.text(data.title, 10, 10)
      doc.text(data.text, 10, 20)

      let yPosition = 40
      data.content.forEach((table, index) => {
        doc.text(`表格 ${index + 1}: ${table.name}`, 10, yPosition)
        yPosition += 10
        doc.autoTable({
          startY: yPosition,
          head: [Object.keys(table.data[0])],
          body: table.data.map(row => Object.values(row))
        })
        yPosition = doc.lastAutoTable.finalY + 10
      })

      doc.save(`${data.title}_${new Date().getTime()}.pdf`)
    },

    // 新增：导出Word
    exportToWord(data) {
      // 调用后端API生成Word文件
      axios.post('/api/export/word', data)
        .then(response => {
          // 创建下载链接
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${data.title}_${new Date().getTime()}.docx`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
        .catch(error => {
          console.error('导出Word失败:', error)
          alert('导出Word失败，请重试')
        })
    }
  }
}
</script>

<style scoped>
.export-panel {
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

.export-options {
  margin-bottom: 20px;
}

.option {
  margin-bottom: 10px;
}

.export-btn {
  width: 100%;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.export-btn:hover {
  background-color: #2980b9;
}
</style>