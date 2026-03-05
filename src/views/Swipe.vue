<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SwipeCard from '../components/SwipeCard.vue'
import { employees as allEmployees } from '../data/employees.js'

const router = useRouter()

const shuffled = ref([])
const currentIndex = ref(0)
const topCardRef = ref(null)
const likes = ref(0)
const nopes = ref(0)
const isFinished = computed(() => currentIndex.value >= shuffled.value.length)

const visibleCards = computed(() => {
  return shuffled.value.slice(currentIndex.value, currentIndex.value + 2)
})

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

onMounted(() => {
  shuffled.value = shuffle(allEmployees)
})

function onSwiped(direction) {
  if (direction === 'right') likes.value++
  else nopes.value++
  currentIndex.value++
}

function swipeLeft() {
  topCardRef.value?.swipeViaButton('left')
}

function swipeRight() {
  topCardRef.value?.swipeViaButton('right')
}

function toggleDetails() {
  topCardRef.value?.toggleDetails()
}

function restart() {
  shuffled.value = shuffle(allEmployees)
  currentIndex.value = 0
  likes.value = 0
  nopes.value = 0
}
</script>

<template>
  <div class="swipe-page">
    <header class="top-bar">
      <button class="back-btn" @click="router.push('/')" aria-label="Retour">←</button>
      <h1 class="page-title"><span class="highlight">We</span>Stalk</h1>
      <div class="counter">
        <span class="counter-like">❤️ {{ likes }}</span>
        <span class="counter-nope">💔 {{ nopes }}</span>
      </div>
    </header>

    <div class="card-area" v-if="!isFinished">
      <SwipeCard
        v-for="(emp, i) in visibleCards"
        :key="emp.id"
        :employee="emp"
        :is-top="i === 0"
        :ref="el => { if (i === 0) topCardRef = el }"
        @swiped="onSwiped"
      />
    </div>

    <div class="finished" v-else>
      <div class="finished-card">
        <div class="finished-emoji">🎉</div>
        <h2>C'est fini !</h2>
        <p class="finished-stats">
          Tu as adoré <strong>{{ likes }}</strong> collègue{{ likes > 1 ? 's' : '' }}
          et bofé <strong>{{ nopes }}</strong> collègue{{ nopes > 1 ? 's' : '' }}.
        </p>
        <p class="finished-comment" v-if="likes > nopes">
          On dirait que tu aimes bien ton équipe ! 😍
        </p>
        <p class="finished-comment" v-else-if="nopes > likes">
          Ambiance glaciale au bureau ? 🥶
        </p>
        <p class="finished-comment" v-else>
          Parfaitement équilibré, comme toute chose. ⚖️
        </p>
        <div class="finished-actions">
          <button class="restart-btn" @click="restart">Recommencer 🔄</button>
          <button class="home-btn" @click="router.push('/')">Accueil</button>
        </div>
      </div>
    </div>

    <div class="action-buttons" v-if="!isFinished">
      <button class="action-btn nope-btn" @click="swipeLeft" aria-label="Bof">
        <span>👎</span>
      </button>
      <button class="action-btn details-btn" @click="toggleDetails" aria-label="Toggle vue">
        <span>{{ topCardRef?.showDetails ? '👤' : '❔' }}</span>
      </button>
      <button class="action-btn like-btn" @click="swipeRight" aria-label="J'adore">
        <span>❤️</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.swipe-page {
  min-height: 100dvh;
  background: #f5f6fa;
  display: flex;
  flex-direction: column;
  padding-bottom: env(safe-area-inset-bottom);
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: #2d3436;
}

.page-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0;
  color: #2d3436;
}

.page-title .highlight {
  background: linear-gradient(77deg, #bf3eff, #ff9941);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.counter {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.card-area {
  flex: 1;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.5rem 1rem;
  min-height: 500px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1rem 2rem;
}

.action-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: scale(0.9);
}

.nope-btn {
  background: #fff;
  border: 3px solid #e17055;
  width: 52px;
  height: 52px;
}

.details-btn {
  background: #fff;
  border: 3px solid #6c5ce7;
  width: 52px;
  height: 52px;
  font-size: 1.4rem;
}

.like-btn {
  background: #fff;
  border: 3px solid #00b894;
  width: 52px;
  height: 52px;
}

.finished {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
}

.finished-card {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  max-width: 360px;
  width: 100%;
}

.finished-emoji {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.finished-card h2 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  color: #2d3436;
}

.finished-stats {
  font-size: 1rem;
  color: #636e72;
  margin: 0.5rem 0;
}

.finished-comment {
  font-size: 1.1rem;
  font-weight: 600;
  color: #6c5ce7;
  margin: 1rem 0 1.5rem;
}

.finished-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.restart-btn {
  padding: 0.85rem 2rem;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #ee5a24, #f0932b);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s;
}

.restart-btn:active {
  transform: scale(0.97);
}

.home-btn {
  padding: 0.75rem 2rem;
  border: 2px solid #dfe6e9;
  border-radius: 14px;
  background: transparent;
  color: #636e72;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}
</style>
