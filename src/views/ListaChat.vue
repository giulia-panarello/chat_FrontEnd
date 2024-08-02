<template>
  <div class="chat-list-container">
    <div class="header">
      <h1 class='nome'>Chat</h1>
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cerca chat..."
          @input="filterChats"
   
        />
        
      </div>
      <img 
        class="new-group-icon" 
        src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png" 
        alt="Crea nuovo gruppo" 
        @click="toggleMenu"
    />
    <div v-if="showMenu" class="menu">
        <button @click="createNewGroup">Crea Nuovo Gruppo</button>
        <button @click="newChat">Nuova Chat</button>
      </div>      
    </div>
    <ul class="chat-list">
      <li v-for="chat in filteredChats" :key="chat.id" @click="goToChat(chat)">
        <div class="chat-item">
          <img class="utente-icon" src="https://static.vecteezy.com/ti/vettori-gratis/p3/24191738-profilo-icona-o-simbolo-nel-rosa-e-blu-colore-vettoriale.jpg" alt="utente-icon">
          <div class="chat-info">
            <h2>{{ chat.name }}</h2>
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
        chats: [],
        users: [],
        filteredChats: [],
        searchQuery: '',
        showMenu: false
      };
    },

    created() {
    // Recupera gli utenti e le chat quando il componente è creato
    this.fetchUsers().then(() => {
      this.fetchChats();
    });
  },

    methods: {

    
      async fetchChats() {
      try {
        const response = await axios.get('/api/chats');
        this.chats = response.data.map(chat => ({
          id: chat.id,
          name: chat.name,
          lastMessage: chat.lastMessage,
          type: chat.type,
          participantIds: chat.participantIds
        }));
        this.updatePrivateChatNames();
        this.filterChats(); // Filtra i dati appena recuperati
      } catch (error) {
        console.error('Errore nel recupero dei dati dal DB:', error);
      }
    },
    
    async fetchUsers() {
      try {
        const response = await axios.get('/api/users');
        this.users = response.data.reduce((acc, user) => {
          acc[user.id] = user.name;
          return acc;
        }, {});
      } catch (error) {
        console.error('Errore nel recupero degli utenti:', error);
      }
    },
    
    updatePrivateChatNames() {
      this.chats.forEach(chat => {
    if (chat.type === 'private' && chat.participantIds.length > 0) {
      chat.name = this.users[chat.participantIds[0]] || 'Nome sconosciuto'; // Imposta il nome dell'utente per le chat private
    }
    });
  },
    
    goToChat(chat) {
      if (chat.type === 'private') {
        const participantName = this.users[chat.participantIds[0]] || 'Nome sconosciuto';
        this.$router.push({ name: 'chat-privata', params: { id: chat.id, userName: participantName } });
      } else if (chat.type === 'group') {
        this.$router.push({ name: 'chat-gruppo', params: { id: chat.id } });
      }
    },

     filterChats() {
      const query = this.searchQuery.toLowerCase();
      this.filteredChats = this.chats.filter(chat => 
        chat.name.toLowerCase().includes(query)
      );
    },

    createNewGroup() {
      // Naviga verso la pagina di creazione di un nuovo gruppo
      this.$router.push({ name: 'crea-nuovo-gruppo' });
    },

    newChat() {
      this.$router.push({ name: 'seleziona-utente' });
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    }
  }
};
  </script>
  
  <style scoped>

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

.header {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #146ac7;
  box-sizing: border-box;
}

.nome {
  color: #ffffff;
  font-size: 50px;
  font-weight: bold;
  margin: 0; /* Rimuove il margine per un allineamento preciso */
  margin-right: 20px; /* Spazio tra il titolo e la barra di ricerca */
}

.search-bar {
  flex: 1; /* Occupa tutto lo spazio rimanente a destra del titolo */
}

.search-bar input {
  width: 100%; /* Occupa tutta la larghezza disponibile */
  padding: 10px;
  background-color: #eabccd;
  border-radius: 25px; /* Arrotonda i bordi dell'input */
  border: 5px solid #0a3665; /* Bordo dell'input */
  box-sizing: border-box; /* Includi padding e border nella larghezza totale */
}

.chat-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 600px; /* Larghezza massima della lista delle chat */
  margin: 0 auto; /* Centra orizzontalmente */
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
}

.utente-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%; /* Arrotonda i bordi dell'icona dell'utente */
  margin-right: 10px;
}

.chat-info h2 {
  margin: 0;
  font-size: 18px;
}

.chat-info p {
  margin: 0;
  color: #888;
}

/* Colore del placeholder */
.search-bar input::placeholder {
  color: #0a3665; 
  
}

.new-group-icon {
  width: 40px; /* Larghezza dell'icona */
  height: 40px; /* Altezza dell'icona */
  cursor: pointer; /* Mostra il cursore a forma di mano quando si passa sopra l'icona */
  margin-left: 20px; /* Spazio tra l'icona e la barra di ricerca */
  
}

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

.menu button {
  padding: 10px 20px;
  background-color: #eabccd;; /* Rosa */
  color: #0a3665;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 5px;
  
}

.menu button:hover {
  background-color: #f97daa;; /* Colore rosa intenso leggermente più scuro per l'hover */
}

</style>
