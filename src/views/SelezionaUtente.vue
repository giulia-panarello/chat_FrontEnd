<template>

    <nav>        
        <RouterLink to="/" class="back-link"> 
            <font-awesome-icon icon="arrow-left" class="icon" />
        </RouterLink>
    </nav>
    <div class="seleziona-utente-container">

    <div class="header">
      <h1 class="titolo">Seleziona Utente</h1>
    </div>
  
      <ul>
        <li v-for="user in users" :key="user.id" @click="startChat(user)">
          {{ user.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>

import axios from 'axios';

  export default {
    name: 'SelezionaUtente',
    data() {
      return {
        users: []
      };
    },

    created() {
    this.fetchUsers();
  },

    methods: {

        fetchUsers() {
      axios.get('/api/users')
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error('Errore nel recupero degli utenti:', error);
        });
    },

      startChat(user) {
        this.$router.push({ name: 'chat-privata', params: { id: user.id } });
      }
    }
  };
  </script>
  
  <style scoped>

  .seleziona-utente-container {
    padding: 20px;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    padding: 20px;
    box-sizing: border-box;
    background-image: url('https://i.pinimg.com/originals/c4/23/12/c4231254ad6f3a92d902a8356212809c.jpg');
    background-size: cover;
    background-position: center;

  
  }
  
  .seleziona-utente-container ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 600px; /* Larghezza massima della lista */
  max-height: 500px;
  margin: 0 auto; /* Centra orizzontalmente */
  overflow-y: auto;
}

.seleziona-utente-container li {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff; /* Colore di sfondo degli elementi */
  border-radius: 8px; /* Angoli arrotondati */
  margin-bottom: 10px;
  cursor: pointer;
  border: 1px solid #ccc; /* Bordo sottile per gli elementi della lista */
}

  .header {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #146ac7;
  color: #fff;
  position: fixed;
  top:0;
  right:0;
  left: 0;
  box-sizing: border-box;
  text-align: center;
  justify-content: center;
  
}

.titolo{
    font-weight: bold;
    font-size: 30px;
}
  
  .seleziona-utente-container li:hover {
    background-color: #eabccd; 
  }

  .back-link {
    position: fixed; 
    left: 25px; 
    top: 5%; 
    z-index: 1000; 
    font-size: 24px; 
    color: #ffffff; 
}
  </style>
  
