<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  employee: { type: Object, required: true },
  isTop: { type: Boolean, default: false },
})

const emit = defineEmits(['swiped'])

const startX = ref(0)
const startY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
const isDragging = ref(false)
const showDetails = ref(false)
const swipeDecision = ref(null)

const SWIPE_THRESHOLD = 100

const cardStyle = computed(() => {
  if (!isDragging.value) return {}
  const rotate = currentX.value * 0.1
  return {
    transform: `translate(${currentX.value}px, ${currentY.value}px) rotate(${rotate}deg)`,
    transition: 'none',
  }
})

const overlayOpacity = computed(() => {
  return Math.min(Math.abs(currentX.value) / SWIPE_THRESHOLD, 1)
})

const swipeDirection = computed(() => {
  if (Math.abs(currentX.value) < 30) return null
  return currentX.value > 0 ? 'right' : 'left'
})

function onTouchStart(e) {
  if (!props.isTop) return
  isDragging.value = true
  const touch = e.touches[0]
  startX.value = touch.clientX
  startY.value = touch.clientY
  currentX.value = 0
  currentY.value = 0
}

function onTouchMove(e) {
  if (!isDragging.value) return
  const touch = e.touches[0]
  currentX.value = touch.clientX - startX.value
  currentY.value = touch.clientY - startY.value
}

function onTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false

  if (Math.abs(currentX.value) > SWIPE_THRESHOLD) {
    const direction = currentX.value > 0 ? 'right' : 'left'
    swipeDecision.value = direction
    setTimeout(() => {
      emit('swiped', direction)
    }, 300)
  } else {
    currentX.value = 0
    currentY.value = 0
  }
}

function onMouseDown(e) {
  if (!props.isTop) return
  isDragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  currentX.value = 0
  currentY.value = 0

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e) {
  if (!isDragging.value) return
  currentX.value = e.clientX - startX.value
  currentY.value = e.clientY - startY.value
}

function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  onTouchEnd()
}

function swipeViaButton(direction) {
  swipeDecision.value = direction
  currentX.value = direction === 'right' ? 300 : -300
  setTimeout(() => {
    emit('swiped', direction)
  }, 350)
}

function toggleDetails() {
  showDetails.value = !showDetails.value
}

defineExpose({ swipeViaButton, toggleDetails, showDetails })
</script>

<template>
  <div
    class="swipe-card"
    :class="{
      'is-top': isTop,
      'swiping-left': swipeDecision === 'left',
      'swiping-right': swipeDecision === 'right',
    }"
    :style="isTop ? cardStyle : {}"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
  >
    <div v-if="isTop && swipeDirection === 'right'" class="stamp stamp-like" :style="{ opacity: overlayOpacity }">
      J'ADORE
    </div>
    <div v-if="isTop && swipeDirection === 'left'" class="stamp stamp-nope" :style="{ opacity: overlayOpacity }">
      BOF
    </div>

    <div class="card-inner">
      <transition name="flip" mode="out-in">
        <div v-if="!showDetails" key="profile" class="view-profile">
          <div class="avatar-section">
            <img :src="employee.image" :alt="employee.name" class="avatar" />
          </div>
          <div class="info-section">
            <h2 class="name">{{ employee.name }}</h2>
            <p class="role">{{ employee.role }}</p>
            <p class="tagline">« {{ employee.tagline }} »</p>
          </div>
        </div>

        <div v-else key="facts" class="view-facts">
          <div class="info-section">
            <h2 class="name">{{ employee.name }}</h2>
            <p class="role">{{ employee.role }}</p>
            <p class="tagline detail">{{ employee.tagline }}</p>
          </div>
          <div class="fun-facts">
            <div v-for="(fact, i) in employee.funFacts" :key="i" class="fact-item">
              <span>{{ fact }}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.swipe-card {
  position: absolute;
  width: 100%;
  max-width: 320px;
  left: 50%;
  transform: translateX(-50%);
  user-select: none;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  touch-action: none;
  will-change: transform;
}

.swipe-card.is-top {
  z-index: 10;
  cursor: grab;
}

.swipe-card.is-top:active {
  cursor: grabbing;
}

.swipe-card.swiping-left {
  transform: translateX(-150%) rotate(-30deg) !important;
  transition: transform 0.35s ease-in !important;
  opacity: 0;
}

.swipe-card.swiping-right {
  transform: translateX(150%) rotate(30deg) !important;
  transition: transform 0.35s ease-in !important;
  opacity: 0;
}

.card-inner {
  height: 420px;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

.view-profile,
.view-facts {
  display: flex;
  flex-direction: column;
}

.avatar-section {
  display: flex;
  justify-content: center;
}

.avatar {
  width: 100%;
  height: 300px;
  max-height: 300px;
  object-fit: cover;
}

.info-section {
  padding: 1.25rem 1.5rem 0.75rem;
}

.view-profile .info-section {
  padding-bottom: 1.5rem;
}

.name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: #2d3436;
}

.role {
  font-size: 0.95rem;
  background: linear-gradient(77deg, #bf3eff, #ff9941);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-weight: 600;
  margin: 0.25rem 0;
}

.tagline {
  font-size: 0.9rem;
  color: #636e72;
  font-style: italic;
  margin: 0.5rem 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tagline.detail {
  white-space: wrap;
  overflow: visible;
  text-overflow: visible;
}

.fun-facts {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0 1.5rem 1.5rem;
}

.fact-item {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  font-size: 0.85rem;
  color: #2d3436;
  background: #f8f9fa;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  line-height: 1.4;
}

.fact-bullet {
  flex-shrink: 0;
}

.flip-enter-active,
.flip-leave-active {
  transition: opacity 0.2s ease;
}
.flip-enter-from,
.flip-leave-to {
  opacity: 0;
}

.stamp {
  position: absolute;
  top: 2rem;
  z-index: 20;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 2px;
  transform: rotate(-15deg);
  pointer-events: none;
}

.stamp-like {
  right: 1rem;
  border: 4px solid #00b894;
  color: #00b894;
  transform: rotate(15deg);
}

.stamp-nope {
  left: 1rem;
  border: 4px solid #e17055;
  color: #e17055;
  transform: rotate(-15deg);
}

</style>
