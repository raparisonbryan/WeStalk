import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Swipe from "../views/Swipe.vue";
import ChatPage from "../views/ChatPage.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/swipe", name: "Swipe", component: Swipe },
  { path: "/chat", name: "Chat", component: ChatPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
