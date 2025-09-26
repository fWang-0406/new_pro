<template>
  <div class="page-base-data">
    <h2>基础数据</h2>
    <div class="content">
      <DataTable :columns="columns" :data="data" />
    </div>
  </div>
</template>

<script>
import DataTable from '../components/DataTable.vue'

export default {
  name: 'BaseData',
  components: {
    DataTable
  },
  data() {
    return {
      columns: [
        { key: 'id', title: 'ID' },
        { key: 'name', title: '名称' },
        { key: 'type', title: '类型' },
        { key: 'value', title: '数值' }
      ],
      data: [
        { id: 1, name: '数据项1', type: '数值型', value: 100 },
        { id: 2, name: '数据项2', type: '文本型', value: '文本数据' },
        { id: 3, name: '数据项3', type: '日期型', value: '2023-01-01' }
      ]
    }
  }
}
</script>

<style scoped>
.page-base-data {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>
