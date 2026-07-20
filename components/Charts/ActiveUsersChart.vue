
<template>
 
  <div
    class="p-4 rounded-2xl shadow-lg transition-colors duration-300 bg-white dark:bg-[var(--dark-alter-color)]"
  >
    <canvas ref="lineChart" class="w-full h-64" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'
// import { useThemeStore } from '#imports'

// const themeStore = useThemeStore();
const background = ref('');

const isDark = ref(false)

Chart.register(...registerables)

const chartInstance = ref(null)
const lineChart = ref(null)

const chartData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [
    {
      label: 'Active now',
      data: [5, 8, 6, 12, 10, 15, 9],
      borderColor: '#3C91E6',
      backgroundColor: 'rgba(60, 145, 230, 0.2)',
      tension: 0.4,
      borderWidth: 3,
      fill: true,
    },
    {
      label: 'Active today',
      data: [15, 20, 18, 25, 30, 28, 22],
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      tension: 0.4,
      borderWidth: 3,
      fill: true,
    },
  ],
}

// onMounted(() => {
//   const ctx = lineChart.value.getContext('2d')
//   const isDark = !themeStore.darkMode

//   ctx.fillStyle = isDark ? '#222222' : '#ffffff'
//   ctx.fillRect(0, 0, lineChart.value.width, lineChart.value.height)

//   chartInstance.value = new Chart(ctx, {
//     type: 'line',
//     data: chartData,
//     options: {
//       responsive: true,
//       plugins: {
//         legend: {
//           labels: {
//             color: isDark ? '#E2E3E6' : '#1C2E40',
//           },
//         },
//         tooltip: {
//           bodyColor: isDark ? '#E2E3E6' : '#1C2E40',
//           titleColor: isDark ? '#F6F6F6' : '#1C2E40',
//           backgroundColor: isDark ? '#222' : '#fff',
//           borderColor: isDark ? '#444' : '#ccc',
//           borderWidth: 1,
//         },
//       },
//       layout: {
//         padding: 20,
//       backgroundColor: '#000'

//       },
//       scales: {
//         x: {
//           ticks: {
//             color: isDark ? '#E2E3E6' : '#1C2E40',
//           },
//           grid: {
//             color: isDark ? '#2A3B4A' : '#D9DBE0',
//           },
//         },
//         y: {
//           ticks: {
//             color: isDark ? '#E2E3E6' : '#1C2E40',
//           },
//           grid: {
//             color: isDark ? '#2A3B4A' : '#D9DBE0',
//           },
//         },
//       },


//     },
//   })
// })
onMounted(() => {
  const ctx = lineChart.value.getContext('2d')
//   const isDark = themeStore.darkMode 

  // Задать фон вручную
  ctx.fillStyle = isDark ? '#222222' : '#ffffff'
  ctx.fillRect(0, 0, lineChart.value.width, lineChart.value.height)

  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: isDark ? '#E2E3E6' : '#1C2E40',
          },
        },
        tooltip: {
          bodyColor: isDark ? '#E2E3E6' : '#1C2E40',
          titleColor: isDark ? '#F6F6F6' : '#1C2E40',
          backgroundColor: isDark ? '#222' : '#fff',
          borderColor: isDark ? '#444' : '#ccc',
          borderWidth: 1,
        },
      },
      layout: {
        padding: 20,
      },
      scales: {
        x: {
          ticks: {
            color: isDark ? '#E2E3E6' : '#1C2E40',
          },
          grid: {
            color: isDark ? '#2A3B4A' : '#D9DBE0',
          },
        },
        y: {
          ticks: {
            color: isDark ? '#E2E3E6' : '#1C2E40',
          },
          grid: {
            color: isDark ? '#2A3B4A' : '#D9DBE0',
          },
        },
      },
    },
  })
})
</script>



<style scoped>
canvas {
  max-height: 400px;
}
</style>
