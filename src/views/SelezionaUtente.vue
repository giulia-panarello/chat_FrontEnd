<template>
    <!-- Barra di navigazione con un link per tornare indietro nella pagina principale-->
    <nav>        
        <RouterLink to="/" class="back-link"> 
          <!-- Icona che rappresenta una freccia per tornare indietro -->
          <font-awesome-icon icon="arrow-left" class="icon" />
        </RouterLink>
    </nav>

    <!-- Contenitore principale per la selezione dell'utente -->
    <div class="seleziona-utente-container">

    <!-- Sezione dell'intestazione che contiene il titolo della pagina -->
    <div class="header">
        <img src="https://img.icons8.com/?size=128&id=bkxdvldftiZt&format=png&color=FFFFFF" alt="Icona Selezione Utenti" class="user-icon" />      
        <h1 class="titolo">Seleziona Utente</h1>
        <img src="https://img.icons8.com/?size=96&id=CW3n7ziCEkdG&format=png" alt="Icona Selezione Utenti" class="user-icon" />    </div>
  
    <!-- Lista degli utenti -->
      <ul>
        <!-- Itera su tutti gli utenti e crea un elemento della lista per ciascuno, Ogni elemento della lista è cliccabile e avvia una chat con l'utente selezionato-->
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
        users: []  // Array per memorizzare la lista degli utenti
      };
    },

    created() {
    
    // Recupera gli utenti quando il componente viene creato
    this.fetchUsers();
  },

    methods: {

    // Recupera la lista degli utenti dal server
    fetchUsers() {
      axios.get('/api/users')
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error('Errore nel recupero degli utenti:', error);
        });
    },

    // Avvia una chat con l'utente selezionato
      startChat(user) {
        this.$router.push({ name: 'chat-privata', params: { id: user.id } });
      }
    }
  };
  </script>
  
  <style scoped>

  /* Contenitore principale per la selezione dell'utente */
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
  
  /* Stile della lista di utenti */
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

/* Stile degli elementi della lista di utenti */
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

/* Intestazione della pagina */
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

/* Stile del titolo  */
.titolo{
    font-weight: bold;
    font-size: 30px;
}
  

/* Colore della sezione di ogni chat al passaggio del mouse */
  .seleziona-utente-container li:hover {
    background-color: #eabccd; 
  }

  /* Stile dell'icona per tornare indietro */
  .back-link {
    position: fixed; 
    left: 25px; 
    top: 5%; 
    z-index: 1000; 
    font-size: 24px; 
    color: #ffffff; 
}

/* Grandezza icone */
.user-icon {
  width: 60px; 
  height: 60px; 
  
}  
  
</style>
  
