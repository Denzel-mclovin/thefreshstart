<template>
    <div class="bg-white dark:bg-[var(--dark-alter-color)] dark:border dark:border-[var(--dark-border-color)] rounded-lg shadow p-6 space-y-6">
      <h2 class="text-xl font-semibold">📈 Sales funnel</h2>
  
      <canvas ref="funnelChart" class="w-full h-64"></canvas>
  
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div
          v-for="step in funnelSteps"
          :key="step.label"
          class="bg-gray-100 dark:bg-[var(--dark-component-color)] rounded p-4 text-center shadow-sm"
          ref="stepRefs"
        >
          <p class="text-lg font-semibold">{{ step.count }}</p>
          <p class="text-sm text-gray-600">{{ step.label }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import { Chart, registerables } from 'chart.js'
  import gsap from 'gsap'
  
  Chart.register(...registerables)
  
  const funnelChart = ref(null)
  const stepRefs = ref([])
  
  const funnelSteps = [
    { label: 'Added to cart', count: 820 },
    { label: 'Proceeded to the checkout', count: 470 },
    { label: 'Paid', count: 260 }
  ]
  
  onMounted(async () => {
    new Chart(funnelChart.value, {
      type: 'bar',
      data: {
        labels: funnelSteps.map(s => s.label),
        datasets: [
          {
            label: 'Пользователи',
            data: funnelSteps.map(s => s.count),
            backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
            borderRadius: 8,
            barThickness: 40
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
            beginAtZero: true
          }
        }
      }
    })
  
    await nextTick()
  
    gsap.from(funnelChart.value, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power2.out'
    })
  
    gsap.from(stepRefs.value, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power2.out'
    })
  })
  </script>
  
  <style scoped>
  canvas {
    max-height: 300px;
  }
  </style>
  