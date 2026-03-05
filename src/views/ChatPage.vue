<script setup>
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.js";

const router = useRouter();

const newMessage = ref("");
const messages = ref([]);
const sending = ref(false);

const messagesQuery = query(
  collection(db, "messages"),
  orderBy("createdAt", "desc")
);

const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
  messages.value = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
});

onUnmounted(() => unsubscribe());

async function sendMessage() {
  const text = newMessage.value.trim();
  if (!text || sending.value) return;
  sending.value = true;
  try {
    await addDoc(collection(db, "messages"), {
      text,
      createdAt: serverTimestamp(),
    });
    newMessage.value = "";
  } finally {
    sending.value = false;
  }
}

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "";
  return timestamp.toDate().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div class="chat-page">
    <header class="top-bar">
      <button class="back-btn" @click="router.push('/')" aria-label="Retour">
        ←
      </button>
      <h1 class="page-title"><span class="highlight">We</span>Stalk</h1>
      <div class="spacer" />
    </header>

    <div class="chat-content">
      <h2 class="chat-heading">Tout ce qui te vient en tête pour Bryan</h2>

      <form class="chat-form" @submit.prevent="sendMessage">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Ecris ton message..."
          class="chat-input"
          maxlength="280"
        />
        <button
          type="submit"
          class="send-btn"
          :disabled="sending || !newMessage.trim()"
        >
          {{ sending ? "..." : "Envoyer" }}
        </button>
      </form>

      <div class="messages-list">
        <p v-if="messages.length === 0" class="empty-state">
          Aucun message pour l'instant. Sois le premier !
        </p>
        <div v-for="msg in messages" :key="msg.id" class="message-item">
          <p class="message-text">{{ msg.text }}</p>
          <span class="message-date">{{ formatDate(msg.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-page {
  min-height: 100dvh;
  background: #f5f6fa;
  display: flex;
  flex-direction: column;
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

.highlight {
  background: linear-gradient(77deg, #bf3eff, #ff9941);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.spacer {
  width: 2rem;
}

.chat-content {
  flex: 1;
  padding: 1.25rem 1rem;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
}

.chat-heading {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3436;
  margin: 0 0 1.25rem;
  text-align: center;
}

.chat-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.chat-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #dfe6e9;
  border-radius: 14px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: #6c5ce7;
}

.send-btn {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.2s;
}

.send-btn:active {
  transform: scale(0.95);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  text-align: center;
  color: #b2bec3;
  font-size: 0.95rem;
  padding: 2rem 0;
}

.message-item {
  background: #fff;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.message-text {
  margin: 0;
  font-size: 0.95rem;
  color: #2d3436;
  line-height: 1.4;
}

.message-date {
  display: block;
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: #b2bec3;
}
</style>
