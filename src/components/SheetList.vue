<template>
  <div class="sidebar">
    <h2>数据表格</h2>
    <ul class="sheet-list">
      <li
        v-for="(sheet, index) in sheets"
        :key="index"
        :class="['sheet-item', { active: currentSheet === sheet }]"
        @click="$emit('sheet-selected', sheet)"
      >
        {{ sheet }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SheetList',
  props: {
    sheets: {
      type: Array,
      default: () => []
    },
    currentSheet: {
      type: String,
      default: ''
    }
  },
  emits: ['sheet-selected']
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: #343a40;
  color: white;
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
}

.sheet-list {
  list-style: none;
  padding: 0;
}

.sheet-item {
  padding: 12px 15px;
  margin-bottom: 5px;
  background-color: #495057;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.sheet-item:hover {
  background-color: #6c757d;
  transform: translateX(5px);
}

.sheet-item.active {
  background-color: #0d6efd;
}
</style>