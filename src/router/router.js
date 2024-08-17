import { createWebHistory, createRouter } from 'vue-router';
import ChatGruppo from '@/views/ChatGruppo.vue';
import ChatPrivata from '@/views/ChatPrivata.vue';
import ListaChat from '@/views/ListaChat.vue';
import CreaGruppo from '@/views/CreaGruppo.vue';
import SelezionaUtente from '@/views/SelezionaUtente.vue'
import ChatInfo from "@/views/ChatInfo.vue";

const routes = [
  { path: '/', component: ListaChat, name: 'lista-chat' },
  { path: '/chat-gruppo/:chatName', component: ChatGruppo, name: 'chat-gruppo' },
  { path: '/chat-gruppo/:chatName/chat-info', component: ChatInfo, name: 'chat-info' },
  { path: '/chat-privata', component: ChatPrivata, name: 'chat-privata' },
  { path: '/crea-nuovo-gruppo', name: 'crea-nuovo-gruppo', component: CreaGruppo },
  { path: '/seleziona-utente', name: 'seleziona-utente', component: SelezionaUtente },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
