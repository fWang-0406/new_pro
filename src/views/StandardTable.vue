<template>
  <div class="page-standard-table">
    <h2>标准表格</h2>
    <div class="content">
      <DataTable :columns="columns" :data="data" />
    </div>
  </div>
</template>

<script>
import DataTable from '../components/DataTable.vue'

export default {
  name: 'StandardTable',
  components: {
    DataTable
  },
  data() {
    return {
      columns: [
        { key: 'code', title: '编码' },
        { key: 'category', title: '类别' },
        { key: 'standard', title: '标准值' },
        { key: 'unit', title: '单位' }
      ],
      data: [
        { code: 'STD001', category: '质量标准', standard: '≥95%', unit: '百分比' },
        { code: 'STD002', category: '时间标准', standard: '≤24小时', unit: '小时' },
        { code: 'STD003', category: '数量标准', standard: '≥1000', unit: '个' }
      ]
    }
  }
}
</script>

<style scoped>
.page-standard-table {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>
