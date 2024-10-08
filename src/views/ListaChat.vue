<template>
  <div class="chat-list-container">
    <!-- Intestazione della pagina con titolo, barra di ricerca e icona per la creazione di nuovi gruppi -->
    <div class="header">
      <!-- Titolo della sezione chat -->
      <h1 class='nome'>Chat</h1>

      <!-- Barra di ricerca per filtrare le chat -->
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cerca chat..."
          @input="filterChats"
        /> 
      </div>

      <!-- Icona per creare un nuovo gruppo o chat -->
      <img 
        class="new-group-icon" 
        src= "https://img.icons8.com/?size=80&id=ZBL8mQveY4Pz&format=png" 
        alt="Crea nuovo gruppo" 
        @click="toggleMenu"
    />

    <!-- Menu per la creazione di nuove chat e gruppi, visibile solo se showMenu è true -->
    <div v-if="showMenu" class="menu">
        <button @click="createNewGroup">Crea Nuovo Gruppo</button>
        <button @click="newChat">Nuova Chat</button>
      </div>      
    </div>

    <!-- Lista delle chat filtrate -->
    <ul class="chat-list">
      <li v-for="chat in filteredChats" :key="chat.name" @click="goToChat(chat)">
        <div class="chat-item">

          <!-- Icona dell'utente o del gruppo -->
          <img class="chat-icon" :src="getChatIcon(chat.type)" alt="chat-icon">
          <!-- Informazioni della chat -->
          <div class="chat-info">
            <!-- Nome della chat -->
            <h2>{{ chat.name }}</h2>
            <!-- Ultimo messaggio della chat -->
            <p>{{ chat.lastMessage }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
  
<script>

import axios from 'axios';


export default {
    name: 'ChatList',
    data() {
      return {
      chats: [], // Array per memorizzare le chat
      filteredChats: [], // Array per memorizzare le chat filtrate
      searchQuery: '', // Stringa di ricerca per filtrare le chat
      showMenu: false // Booleano per mostrare o nascondere il menu
      };
    },

    created() {
      // Recupera le chat quando il componente è creato
      this.fetchChats();
    },

    methods: {

      //--- RECUPERA LE CHAT -------------------------------------------------------------------------------------------------------------------
      async fetchChats() {
        /*
          recupera la lista completa delle chat
          chat di gruppo e singole sono considerate insieme
        */
        try {
          const response = await axios.get('http://localhost:8080/api/chats');
          console.log(response.data)
          this.chats = response.data.map(chat => ({
            name: chat.name, // il nome della chat è univoco e usato come id
            type: chat.type,
            lastMessage: chat.lastMessage,
          }));
          this.filteredChats = this.chats;
        } catch (error) {
            console.error('Errore nel recupero dei dati dal DB:', error);
        }
      },
  
    
    //-- Naviga verso la chat selezionata --
    goToChat(chat) {
      this.$router.push({ name: 'interfaccia-chat', params: { chatName: chat.name } });
    },

     //-- Filtra le chat in base alla query di ricerca --
     filterChats() {
      const query = this.searchQuery.toLowerCase();
      this.filteredChats = this.chats.filter(chat => 
        chat.name.toLowerCase().includes(query)
      );
    },

    //-- Naviga verso la pagina di creazione di un nuovo gruppo --
    createNewGroup() {
      this.$router.push({ name: 'crea-nuovo-gruppo' });
    },

    //-- Naviga verso la pagina di selezione utente per una nuova chat vuota con un nuovo utente --
    newChat() {
      this.$router.push({ name: 'seleziona-utente' });
    },

    //-- Funzione per la gestione delle icone delle chat --
    getChatIcon(type) {
      /*
        l'icona della chat viene distinta in base al tipo
        - private
        - group
      */
      if (type === 'private') {
        return 'https://img.icons8.com/?size=200&id=VzoCadwFiwaQ&format=png';
      } else if (type === 'group') {
        return 'https://img.icons8.com/?size=200&id=Xvo1JQO2ujpL&format=png';
      }
    },
      
    // Mostra o nasconde il menu per creare un nuovo gruppo o una nuova chat
    toggleMenu() {
      this.showMenu = !this.showMenu;
    }
  }
};
  </script>
  
  <style scoped>

/* Contenitore principale della lista chat */
.chat-list-container {
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  background-image: url('https://i.pinimg.com/originals/c4/23/12/c4231254ad6f3a92d902a8356212809c.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  box-sizing: border-box;
 
}

/* Intestazione della pagina chat */
.header {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #146ac7;
  box-sizing: border-box;
}

/* Titolo della pagina 'Chat' */
.nome {
  color: #ffffff;
  font-size: 50px;
  font-weight: bold;
  margin: 0; 
  margin-right: 20px; 
}

/* Barra di ricerca per le chat */
.search-bar {
  flex: 1; 
}

.search-bar input {
  width: 100%; 
  padding: 10px;
  background-color: #eabccd;
  border-radius: 25px; 
  border: none;
}

/* Stile lista delle chat */
.chat-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 600px; 
  margin: 0 auto; 
}

/* Elemento della chat */
.chat-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
}

/* Icona dell'utente */
.utente-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%; 
  margin-right: 10px;
}

/* Informazioni della chat: nome della chat (utente o di gruppo) */
.chat-info h2 {
  margin: 0;
  font-size: 18px;
}

/* Informazioni della chat: stile dell'ultimo messaggio mandato/ricevuto */
.chat-info p {
  margin: 0;
  color: #888;
}

/* Stile del placeholder 'cerca chat...' nella barra di ricerca */
.search-bar input::placeholder {
  color: #0a3665; 
  
}

/* Icona per creare nuovi gruppi e chat */
.new-group-icon {
  width: 40px; 
  height: 40px; 
  cursor: pointer; 
  margin-left: 20px; 
  
}

/* Menu per la creazione di nuovi gruppi e chat */
.menu {
  position: absolute;
  right: 20px;
  top: 80px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

/* Pulsanti del menu */
.menu button {
  padding: 10px 20px;
  background-color: #eabccd;
  color: #146ac7;
  font-size: 17px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 5px;  
}


/* Colore del pulsante al passaggio del mouse */
.menu button:hover {
  background-color: #bbe9fc; 
}

/* Stile per le icone delle chat */
.chat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%; 
  margin-right: 10px;
  
}
</style>
