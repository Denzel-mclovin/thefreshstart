<template>
    <div class="bg-white dark:bg-[var(--dark-alter-color)] dark:border dark:border-[var(--dark-border-color)] rounded-lg shadow p-6 space-y-6">
      <h2 class="text-xl font-semibold">📅 Period comparison</h2>
  
      <canvas ref="comparisonChart" class="w-full h-64"></canvas>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div
          v-for="metric in comparison"
          :key="metric.label"
          class="bg-gray-100 dark:bg-[var(--dark-component-color)] rounded p-4 text-center shadow-sm"
          ref="metricRefs"
        >
          <p class="text-lg font-semibold">{{ metric.current }}</p>
          <p class="text-sm text-gray-600">
            {{ metric.label }} <span class="text-xs">({{ metric.prev }})</span>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import { Chart, registerables } from 'chart.js'
  import gsap from 'gsap'
  
  Chart.register(...registerables)
  
  const comparisonChart = ref(null)
  const metricRefs = ref([])
  
  const comparison = [
    { label: 'Today vs Tomorrow', current: 1340, prev: 1200 },
    { label: 'This month vs Last month', current: 30120, prev: 28800 }
  ]
  
  onMounted(async () => {
    new Chart(comparisonChart.value, {
      type: 'line',
      data: {
        labels: ['Tomorrow', 'Today', 'Last month', 'This month'],
        datasets: [
          {
            label: 'Sales',
            data: [comparison[0].prev, comparison[0].current, comparison[1].prev, comparison[1].current],
            fill: false,
            borderColor: '#3b82f6',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    })
  
    await nextTick()
  
    gsap.from(comparisonChart.value, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    })
  
    gsap.from(metricRefs.value, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out'
    })
  })
  </script>
  
  <style scoped>
  canvas {
    max-height: 300px;
  }
  </style>
  