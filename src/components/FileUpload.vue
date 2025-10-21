<!-- src/components/FileUpload.vue -->
<template>
  <div class="file-upload">
    <div class="upload-area" @click="triggerFileSelect" :class="{ dragging, hasFile }">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileSelect"
        accept=".xlsx,.xls,.csv"
        :disabled="isUploading"
      >
      <div class="upload-content">
        <icon-upload class="upload-icon" />
        <p v-if="!selectedFile">点击或拖拽文件到此处上传</p>
        <p v-if="selectedFile" class="file-name">{{ selectedFile.name }}</p>
        <p class="file-info">支持 Excel 和 CSV 格式，最大 10MB</p>
      </div>
    </div>
    <button
      class="upload-btn"
      @click="uploadFile"
      :disabled="!selectedFile || isUploading"
    >
      <span v-if="!isUploading">开始上传</span>
      <span v-if="isUploading">
        <loading-spinner class="spinner" />
        上传中... {{ progress }}%
      </span>
    </button>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios'
import * as XLSX from 'xlsx'
import { ref } from 'vue'

export default {
  name: 'FileUpload',
  emits: ['upload-complete', 'upload-error'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const selectedFile = ref(null)
    const isUploading = ref(false)
    const progress = ref(0)
    const errorMessage = ref('')
    const dragging = ref(false)
    const hasFile = ref(false)

    const triggerFileSelect = () => {
      if (!isUploading.value) fileInput.value.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (!file) return validateFile(null)

      validateFile(file)
    }

    const validateFile = (file) => {
      errorMessage.value = ''

      if (!file) {
        selectedFile.value = null
        hasFile.value = false
        return false
      }

      // 文件类型校验
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ]

      if (!validTypes.includes(file.type) &&
          !file.name.endsWith('.csv') &&
          !file.name.endsWith('.xlsx') &&
          !file.name.endsWith('.xls')) {
        errorMessage.value = '请上传Excel或CSV格式的文件'
        emit('upload-error', errorMessage.value)
        return false
      }

      // 文件大小校验
      if (file.size > 10 * 1024 * 1024) { // 10MB
        errorMessage.value = '文件大小不能超过10MB'
        emit('upload-error', errorMessage.value)
        return false
      }

      selectedFile.value = file
      hasFile.value = true
      return true
    }

    const uploadFile = async () => {
      if (!selectedFile.value) return

      if (!validateFile(selectedFile.value)) return

      isUploading.value = true
      progress.value = 0
      errorMessage.value = ''

      try {
        // 创建FormData
        const formData = new FormData()
        formData.append('file', selectedFile.value)

        // 上传文件到后端
        const response = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            if (e.total) {
              progress.value = Math.round((e.loaded / e.total) * 100)
            }
          }
        })

        // 解析文件数据
        const parsedData = await parseFile(selectedFile.value)

        // 传递结果给父组件
        emit('upload-complete', {
          fileName: selectedFile.value.name,
          rawData: parsedData,
          fileType: selectedFile.value.name.split('.').pop(),
          backendResult: response.data,
          uploadTime: new Date().toISOString()
        })

      } catch (error) {
        errorMessage.value = `上传失败: ${error.response?.data?.message || error.message}`
        emit('upload-error', errorMessage.value)
      } finally {
        isUploading.value = false
        // 重置文件输入，允许重复上传同一文件
        fileInput.value.value = ''
      }
    }

    const parseFile = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result)
            const workbook = XLSX.read(data, { type: 'array' })
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json(firstSheet)
            resolve(jsonData)
          } catch (error) {
            reject('文件解析失败: ' + error.message)
          }
        }

        reader.onerror = () => reject('文件读取失败')
        reader.readAsArrayBuffer(file)
      })
    }

    // 拖拽事件处理
    const handleDragOver = (e) => {
      e.preventDefault()
      dragging.value = true
    }

    const handleDragLeave = () => {
      dragging.value = false
    }

    const handleDrop = (e) => {
      e.preventDefault()
      dragging.value = false

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        validateFile(e.dataTransfer.files[0])
      }
    }

    return {
      fileInput,
      selectedFile,
      isUploading,
      progress,
      errorMessage,
      dragging,
      hasFile,
      triggerFileSelect,
      handleFileSelect,
      uploadFile,
      handleDragOver,
      handleDragLeave,
      handleDrop
    }
  }
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed #ccc;
  border-radius: 6px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 15px;
}

.upload-area.dragging {
  border-color: #3498db;
  background-color: #f0f7ff;
}

.upload-area.hasFile {
  border-color: #2ecc71;
}

.upload-icon {
  font-size: 24px;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.file-name {
  color: #3498db;
  font-weight: 500;
  margin-bottom: 5px;
}

.file-info {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0;
}

input[type="file"] {
  display: none;
}

.upload-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  width: 100%;
}

.upload-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.upload-btn:not(:disabled):hover {
  background-color: #2980b9;
}

.error {
  color: #e74c3c;
  margin-top: 10px;
  font-size: 0.9rem;
  text-align: center;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>