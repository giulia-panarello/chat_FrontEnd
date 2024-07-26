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
      </div>
      <ul class="chat-list">
        <li v-for="chat in filteredChats" :key="chat.id" @click="goToChat(chat)">
          <div class="chat-item">
            <img class="utente-icon" src="https://cdn.icon-icons.com/icons2/2760/PNG/512/profile_icon_176363.png" alt="utente-icon">
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
  export default {
    name: 'ChatList',
    data() {
      return {
        chats: [
          { id: 1, name: 'Alice', lastMessage: 'Hi there!', type: 'private' },
          { id: 2, name: 'Bob', lastMessage: 'How are you?', type: 'private' },
          { id: 2, name: 'Organizzazione Evento', icon : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvoX2HbQn78YpCfCeyV6oqkp1lQbjQOG2kNn2gKzHbPPTkamA2', lastMessage: 'How are you?', type: 'group' },
          // Altri oggetti chat

        ],
        filteredChats: []
      };
    },

    created() {
    this.filteredChats = this.chats; // Imposta l'iniziale lista delle chat filtrate
  },
    methods: {
      goToChat(chat) {
        if (chat.type === 'private') {
          this.$router.push({ name: 'chat-privata', params: { id: chat.id } });
        } else if (chat.type === 'group') {
          this.$router.push({ name: 'chat-gruppo', params: { id: chat.id } });
        }
     },
     filterChats() {
      const query = this.searchQuery.toLowerCase();
      this.filteredChats = this.chats.filter(chat => 
        chat.name.toLowerCase().includes(query)
      );
    }

    }
  };
  </script>
  
  <style scoped>

.chat-list-container {
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  padding: 0;
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
  background-color: #f1d1f2;
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
  color: #0a3665; /* Cambia il colore del placeholder */
  
}
</style>
