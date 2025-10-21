import Chart from 'chart.js/auto';

export const chartUtils = {
  // 创建柱状图
  createBarChart(canvas, labels, datasets, options = {}) {
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options
      }
    });
  },

  // 创建饼图
  createPieChart(canvas, labels, datasets, options = {}) {
    return new Chart(canvas, {
      type: 'pie',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...options
      }
    });
  },

  // 销毁图表
  destroyChart(chartInstance) {
    if (chartInstance) {
      chartInstance.destroy();
    }
  }
};

export const exportUtils = {
  // 导出为 Excel
  exportToExcel(data, filename = 'data.xlsx') {
    // 这里需要实现 Excel 导出逻辑
    console.log('Exporting to Excel:', data);
  },

  // 导出为 CSV
  exportToCSV(data, filename = 'data.csv') {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, filename);
  },

  // 导出为 PDF
  exportToPDF(data, filename = 'data.pdf') {
    // 这里需要实现 PDF 导出逻辑
    console.log('Exporting to PDF:', data);
  },

  convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ];

    return csvRows.join('\n');
  },

  downloadBlob(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
};