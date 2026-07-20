<template>
    <div class="bg-white dark:bg-[var(--dark-alter-color)] dark:border dark:border-[var(--dark-border-color)] rounded-lg shadow p-6 space-y-6">
      <h2 class="text-xl font-semibold">👤 Users</h2>
  
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div
          v-for="stat in userStats"
          :key="stat.label"
          class="bg-gray-100 dark:bg-[var(--dark-component-color)] p-4 rounded shadow-md"
          ref="statRefs"
        >
          <div class="text-lg font-bold">{{ stat.value }}</div>
          <div class="text-sm text-gray-600">{{ stat.label }}</div>
        </div>
      </div>
  
      <canvas ref="userChart" class="w-full h-64"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import { Chart, registerables } from 'chart.js'
  import gsap from 'gsap'
  
  Chart.register(...registerables)
  
  const userChart = ref(null)
  const statRefs = ref([])
  
  const userStats = [
    { label: 'New Users', value: 122 },
    { label: 'Active Users', value: 378 },
    { label: 'Repeat purchases', value: '47%' }
  ]
  
  onMounted(async () => {
    const chart = new Chart(userChart.value, {
      type: 'bar',
      data: {
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        datasets: [
          {
            label: 'New users',
            data: [12, 19, 3, 5, 20, 30, 24],
            backgroundColor: '#3b82f6',
            borderRadius: 4,
            barThickness: 24
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 5 }
          }
        }
      }
    })
  
    await nextTick()
  
    gsap.from(statRefs.value, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power2.out'
    })
  

    gsap.from(userChart.value, {
      opacity: 0,
      y: 40,
      duration: 1,
      delay: 0.3,
      ease: 'power2.out'
    })
  })
  </script>
  
  <style scoped>
  canvas {
    max-height: 300px;
  }
  </style>
  