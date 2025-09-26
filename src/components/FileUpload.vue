<!-- src/components/FileUpload.vue -->
<template>
  <div class="file-upload">
    <input
      type="file"
      @change="handleFileSelect"
      accept=".xlsx,.xls,.csv"
      :disabled="isUploading"
    >
    <button
      @click="uploadFile"
      :disabled="!selectedFile || isUploading"
    >
      {{ isUploading ? '上传中...' : '上传' }}
    </button>
    <div v-if="progress > 0 && progress < 100" class="progress-bar">
      <div :style="{ width: progress + '%' }" class="progress"></div>
    </div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios'
import * as XLSX from 'xlsx'

export default {
  name: 'FileUpload',
  data() {
    return {
      selectedFile: null,
      isUploading: false,
      progress: 0,
      errorMessage: ''
    }
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (!file) return

      // 文件校验
      const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
      if (!validTypes.includes(file.type)) {
        this.errorMessage = '请上传Excel或CSV文件'
        return
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB限制
        this.errorMessage = '文件大小不能超过10MB'
        return
      }

      this.selectedFile = file
      this.errorMessage = ''
    },
    async uploadFile() {
      if (!this.selectedFile) return

      this.isUploading = true
      this.progress = 0

      const formData = new FormData()
      formData.append('file', this.selectedFile)

      try {
        // 1. 上传文件到后端
        const response = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            this.progress = Math.round((e.loaded / e.total) * 100)
          }
        })

        // 2. 解析文件数据供前端预览（也可直接使用后端返回的解析结果）
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet)

          // 传递解析后的数据给父组件
          this.$emit('upload-complete', {
            fileName: this.selectedFile.name,
            rawData: jsonData,
            backendResult: response.data
          })
        }
        fileReader.readAsArrayBuffer(this.selectedFile)

      } catch (error) {
        this.errorMessage = '上传失败：' + (error.response?.data?.message || error.message)
      } finally {
        this.isUploading = false
      }
    }
  }
}
</script>

<style scoped>
.progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  margin: 10px 0;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #3498db;
  transition: width 0.3s;
}

.error {
  color: #e74c3c;
  margin-top: 10px;
  font-size: 0.9rem;
}
</style>