<template>
  <div class="page-custom-table">
    <h2>自定义表格</h2>
    <div class="toolbar">
      <button class="toolbar-btn" @click="addColumn">添加列</button>
      <button class="toolbar-btn" @click="addRow">添加行</button>
      <button class="toolbar-btn" @click="resetTable">重置</button>
    </div>
    <div class="content">
      <DataTable :columns="columns" :data="data" />
    </div>
  </div>
</template>

<script>
import DataTable from '../components/DataTable.vue'

export default {
  name: 'CustomTable',
  components: {
    DataTable
  },
  data() {
    return {
      columns: [
        { key: 'field1', title: '字段1' },
        { key: 'field2', title: '字段2' }
      ],
      data: [
        { field1: '自定义数据1', field2: '自定义数据2' }
      ],
      columnCount: 2,
      rowCount: 1
    }
  },
  methods: {
    addColumn() {
      this.columnCount++
      this.columns.push({
        key: `field${this.columnCount}`,
        title: `字段${this.columnCount}`
      })

      // 为所有现有行添加新字段
      this.data.forEach(row => {
        row[`field${this.columnCount}`] = `数据${this.columnCount}`
      })
    },
    addRow() {
      this.rowCount++
      const newRow = {}
      for (let i = 1; i <= this.columnCount; i++) {
        newRow[`field${i}`] = `行${this.rowCount}数据${i}`
      }
      this.data.push(newRow)
    },
    resetTable() {
      this.columns = [
        { key: 'field1', title: '字段1' },
        { key: 'field2', title: '字段2' }
      ]
      this.data = [
        { field1: '自定义数据1', field2: '自定义数据2' }
      ]
      this.columnCount = 2
      this.rowCount = 1
    }
  }
}
</script>

<style scoped>
.page-custom-table {
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
