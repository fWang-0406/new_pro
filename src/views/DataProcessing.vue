<template>
  <div class="page-data-processing">
    <h2>数据处理页面</h2>
    <div class="toolbar">
      <!-- 可以在这里添加其他工具按钮 -->
    </div>
    <div class="content">
      <FileUpload @upload-complete="handleUpload" />
    </div>
  </div>
</template>

<script>
import FileUpload from '../components/FileUpload.vue'
import { useDataStore } from '../stores/dataStore'

export default {
  name: 'DataProcessing',
  components: { FileUpload },
  methods: {
    handleUpload(fileData) {
      const dataStore = useDataStore()
      dataStore.setUploadedData(fileData)
      // 可自动跳转到分析页面
      this.$router.push('/analysis-index')
    }
  }
}
</script>

<style scoped>
.page-data-processing {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.toolbar {
  margin-bottom: 15px;
}

.toolbar-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.toolbar-btn:hover {
  background-color: #2980b9;
}
</style>