import { createWebHistory, createRouter } from 'vue-router';
import ChatGruppo from '@/views/ChatGruppo.vue';
import ListaPartecipanti from '@/views/ListaPartecipanti.vue';

const routes = [
  { path: '/', component: ChatGruppo, name: 'chat-gruppo' },
  { path: '/lista-partecipanti', component: ListaPartecipanti, name: 'lista-partecipanti' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
