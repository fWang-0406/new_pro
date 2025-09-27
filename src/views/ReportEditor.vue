<template>
  <div class="report-editor">
    <h2>报告编辑</h2>
    <div class="toolbar">
      <button class="toolbar-btn" @click="saveReport">保存报告</button>
      <button class="toolbar-btn" @click="exportReport">导出报告</button>
      <button class="toolbar-btn" @click="$router.go(-1)">返回</button>
    </div>
    <QuillEditor
      v-model:content="reportContent"
      :options="editorOptions"
      class="editor-container"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useDataStore } from '../stores/dataStore'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  name: 'ReportEditor',
  components: { QuillEditor },
  setup() {
    const dataStore = useDataStore()
    const reportContent = ref('')

    // 配置富文本编辑器
    const editorOptions = {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'align': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'color': [] }, { 'background': [] }],
          ['link', 'image', 'video'],
          ['clean']
        ]
      }
    }

    // 初始化报告内容
    onMounted(() => {
      if (dataStore.analysisResult) {
        // 基于分析结果生成初始报告内容
        reportContent.value = generateInitialReport(dataStore.analysisResult)
      } else {
        reportContent.value = '<h1>新报告</h1><p>请在此开始编辑您的报告...</p>'
      }
    })

    // 生成初始报告内容
    const generateInitialReport = (analysisData) => {
      let content = `<h1>${dataStore.reportConfig.title || '数据分析报告'}</h1>`
      content += `<p>报告生成时间: ${new Date().toLocaleString()}</p>`
      content += '<h2>分析摘要</h2>'
      content += '<p>以下是基于最新数据的分析结果摘要：</p>'
      content += '<ul>'
      analysisData.forEach(item => {
        content += `<li>${item.index}: 当前值 ${item.current}，变化率 ${item.change}</li>`
      })
      content += '</ul>'
      content += '<h2>详细分析</h2>'
      content += '<p>请在此处添加详细分析内容...</p>'
      return content
    }

    // 保存报告
    const saveReport = () => {
      dataStore.setReportContent(reportContent.value)
      alert('报告已保存')
    }

    // 导出报告为PDF
    const exportReport = () => {
      const doc = new jsPDF()
      const editorElement = document.querySelector('.ql-editor')

      html2canvas(editorElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 210 // A4宽度，单位mm
        const pageHeight = 295 // A4高度，单位mm
        const imgHeight = canvas.height * imgWidth / canvas.width
        let heightLeft = imgHeight

        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        heightLeft -= pageHeight

        while (heightLeft > 0) {
          doc.addPage()
          doc.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }

        doc.save(`报告_${new Date().getTime()}.pdf`)
      })
    }

    return {
      reportContent,
      editorOptions,
      saveReport,
      exportReport
    }
  }
}
</script>

<style scoped>
.report-editor {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  min-height: calc(100vh - 60px);
}

.toolbar {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}

.toolbar-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.toolbar-btn:hover {
  background-color: #2980b9;
}

.editor-container {
  height: 600px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>