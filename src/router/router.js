import { createWebHistory, createRouter } from 'vue-router';
import ChatGruppo from '@/views/ChatGruppo.vue';
import ListaPartecipanti from '@/views/ListaPartecipanti.vue';
import ChatPrivata from '@/views/ChatPrivata.vue';
import ListaChat from '@/views/ListaChat.vue';

const routes = [
  { path: '/', component: ListaChat, name: 'lista-chat' },
  { path: '/chat-gruppo/:id', component: ChatGruppo, name: 'chat-gruppo' },
  { path: '/lista-partecipanti', component: ListaPartecipanti, name: 'lista-partecipanti' },
  { path: '/chat-privata/:id/:userName', component: ChatPrivata, name: 'chat-privata' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
