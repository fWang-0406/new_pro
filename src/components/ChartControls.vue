<template>
  <div class="chart-controls">
    <h3>图表控制</h3>
    <button @click="$emit('show-bar-chart')" class="btn btn-primary">
      显示柱状图
    </button>
    <button @click="$emit('show-pie-chart')" class="btn btn-success">
      显示饼图
    </button>
    <button @click="$emit('hide-charts')" class="btn btn-secondary">
      隐藏图表
    </button>
  </div>
</template>

<script>
export default {
  name: 'ChartControls',
  emits: ['show-bar-chart', 'show-pie-chart', 'hide-charts']
}
</script>

<style scoped>
.chart-controls {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}
</style>