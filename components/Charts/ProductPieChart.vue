
   <template>
    <div class="relative w-full max-w-md mx-auto p-4 bg-bg-color dark:bg-dark-component-color rounded-2xl shadow-lg">
      <canvas ref="pieChart" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'
//   import { useThemeStore } from '#imports'
  import gsap from 'gsap'
  
  Chart.register(PieController, ArcElement, Tooltip, Legend)
  
  const pieChart = ref(null)
  const chartInstance = ref(null)

//   const themeStore = useThemeStore();

  const fontColor = ref('')
  
  const lightColors = [
    '#FF9A6A',  // Теплый оранжевый
    '#82BFFF',  // Нежный голубой
    '#A2E6AC',  // Светло-зелёный
    '#A5BDD3',  // Светло-синий
    '#C9A9FF',  // Светло-фиолетовый
  ]


const baseColors = [
  '#FF9A6A',
  '#82BFFF',
  '#A2E6AC',
  '#A5BDD3',
  '#C9A9FF',
]


const transparentColors = baseColors.map(hex => hexToRGBA(hex, 0.6))

function hexToRGBA(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const chartData = {
  labels: ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'],
  datasets: [
    {
      data: [45, 25, 15, 10, 5],
      backgroundColor: transparentColors, 
      borderColor: baseColors,           
      borderWidth: 2,                    
    },
  ],
}
  
  onMounted(() => {

//    !themeStore.darkMode ? fontColor.value = '#1C2E40' : fontColor.value = 'rgb(226 227 230)'
    const ctx = pieChart.value.getContext('2d')
    chartInstance.value = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: fontColor.value,
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            bodyColor: 'black',
            backgroundColor: 'white',
            titleColor: 'black',
          },
        },
        animation: {
          onComplete: () => {
            gsap.fromTo(
              pieChart.value,
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }
            )
          },
        },
      },
    })
  })
  </script>
  
  <style scoped>
  canvas {
    transition: all 0.3s ease;
  }
  </style>
  