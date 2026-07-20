<template>
    <div class="bg-white dark:bg-[var(--dark-alter-color)] dark:border dark:border-[var(--dark-border-color)] rounded-lg shadow p-6 space-y-6">
      <h2 class="text-xl font-semibold">📦 Products</h2>
    <div class="top-row flex justify-between items-start gap-2">
        <div>
        <h3 class="text-lg font-medium mb-2">Top sales products</h3>
        <canvas ref="topProductsChart" class="w-full h-64"></canvas>
      </div>
  
      <div>
        <h3 class="text-lg font-medium mb-2">Products with low stock</h3>
        <ul class="list-disc list-inside space-y-1">
          <li v-for="item in lowStockItems" :key="item.name" class="text-red-600">
            {{ item.name }} — {{ item.stock }} шт.
          </li>
        </ul>
      </div>

    </div>
    
  
      <div>
        <h3 class="text-lg font-medium mb-2">Products in wishlist</h3>
        <div class="flex flex-wrap gap-4">
      <div
  v-for="item in favorites"
  :key="item.id"
  ref="favoriteRefs"
  class="bg-gray-100 dark:bg-[var(--dark-component-color)] p-4 rounded shadow w-full sm:w-48 text-center"
>
  <p class="font-semibold text-sm">{{ item.name }}</p>
  <p class="text-xs text-gray-500 mt-1">{{ item.count }} added</p>
</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import { Chart, registerables } from 'chart.js'
  import gsap from 'gsap'
  
  Chart.register(...registerables)
  
  const topProductsChart = ref(null)
const favoriteRefs = ref([])
  
  const topSelling = [
    { name: 'Item A', sales: 120 },
    { name: 'Item B', sales: 95 },
    { name: 'Item C', sales: 88 },
    { name: 'Item D', sales: 75 }
  ]
  
  const lowStockItems = [
    { name: 'Item X', stock: 3 },
    { name: 'Item Y', stock: 5 },
    { name: 'Item Z', stock: 1 }
  ]
  
  const favorites = [
    { id: 1, name: 'Item D', count: 52 },
    { id: 2, name: 'Item B', count: 41 },
    { id: 3, name: 'Item A', count: 33 }
  ]
  
  onMounted(async () => {
    new Chart(topProductsChart.value, {
      type: 'bar',
      data: {
        labels: topSelling.map(p => p.name),
        datasets: [
          {
            label: 'Sales',
            data: topSelling.map(p => p.sales),
            backgroundColor: '#10b981',
            borderRadius: 6,
            barThickness: 32
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
  
    gsap.from(topProductsChart.value, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power2.out'
    })
  
    gsap.from(favoriteRefs.value, {
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
  