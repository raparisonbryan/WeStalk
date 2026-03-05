<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function start() {
  router.push('/swipe')
}
</script>

<template>
  <div class="home">
    <div class="home-content">
      <div class="logo-area">
        <h1 class="app-title"><span class="highlight">We</span>Stalk</h1>
        <img src="../assets/logo.avif" alt="logo" class="logo">
        <p class="tagline">Découvre tes collègues comme jamais</p>
      </div>

      <div class="buttons">
        <button class="cta-button" @click="start">
          <span>C'est parti</span>
          <span class="arrow">→</span>
        </button>
        <button class="cta-button chat-button" @click="router.push('/chat')">
          <span>💬</span>
          <span>Chat</span>
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background: black;
  position: relative;
  overflow: hidden;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  max-width: 400px;
  width: 100%;
}

.logo-area {
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 100px;
  object-fit: contain;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.app-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.5px;
}

.highlight {
  background: linear-gradient(77deg, #bf3eff, #ff9941);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.tagline {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  margin-top: 0.5rem;
  font-weight: 400;
}

.cta-button {
  padding: 10px 16px;
  font-size: 1.2rem;
  font-weight: 700;
  border: none;
  border-radius: 999px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: transform 0.2s;
}

.cta-button:active {
  transform: scale(0.97);
}

.cta-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.arrow {
  transition: transform 0.2s;
}

.cta-button:hover .arrow {
  transform: translateX(4px);
}

.buttons {
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}

.chat-button {
  border-color: #6c5ce7;
  color: #a29bfe;
}

.chat-button:hover {
  background: rgba(108, 92, 231, 0.15);
}
</style>
