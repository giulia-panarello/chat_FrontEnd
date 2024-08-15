<template>
   <!-- Barra di navigazione con un link per tornare indietro -->
    <nav>        
          <RouterLink to="/" class="back-link"> 
            <!-- Icona che rappresenta una freccia per tornare indietro -->
            <font-awesome-icon icon="arrow-left" class="icon" />
          </RouterLink>
    </nav>

    <!-- Contenitore principale per la creazione del gruppo -->
    <div class="create-group-container">
       <!-- Intestazione della pagina -->
        <div class="header">
      <h1>Crea Nuovo Gruppo</h1>
      </div>

      <!-- Modulo per la creazione del gruppo -->
      <form @submit.prevent="createGroup">
        <!-- Sezione di ricerca dell'evento a cui collegare la chat di gruppo -->
        <div class="form-group">
          <label for="eventSearch" class="event-search-label">Cerca Evento</label>
          <input
              v-model="searchQuery"
              @input="searchEvent"
              type="text"
              id="eventSearch"
              placeholder="Inserisci nome dell'evento..."
              required
          />
          <ul v-if="availableEvents.length" class="search-results">
            <li
                v-for="event in availableEvents"
                :key="event.name"
                @click="selectEvent(event)"
                class="search-result-item"
            >
              {{ event.name }}
            </li>
          </ul>
        </div>

         <!-- Sezione per la selezione dei partecipanti -->
        <div class="form-group">
          <label for="userSearch" class="user-search-label">Cerca Partecipanti</label>
          <input
              v-model="searchQuery"
              @input="searchUsers"
              type="text"
              id="userSearch"
              placeholder="Cerca utente da aggiungere..."
          />
          <ul v-if="availableUsers.length" class="search-results">
            <li
                v-for="user in availableUsers"
                :key="user.username"
                @click="selectUser(user)"
                class="search-result-item"
            >
              {{ user.name}} {{user.surname}}
            </li>
          </ul>
        </div>

        <!-- Lista dei partecipanti selezionati che viene mostrata sotto il modulo -->
        <ul class="selected-Members">
          <li v-for="user in selectedMembers" :key="user.username">
            {{ user.name }} {{user.surname}}
            <button @click="removeUser(user)" class="remove-button">Rimuovi</button>
          </li>
        </ul>

        <!-- Pulsante per inviare il modulo e creare il gruppo -->
        <button type="submit">Crea Gruppo</button>
      </form>
    </div>
  </template>
  
  <script>

import axios from 'axios';

  export default {
    name: 'CreateGroup',
    data() {
      return {
        groupName: '', // Nome del gruppo
        showMembers: false, // Flag per mostrare/nascondere i partecipanti
        availableUsers: [], // Lista degli utenti disponibili
        selectedMembers: [], // Partecipanti selezionati

        searchQuery: '',
        availableEvents: [],
        selectedEvent: ''
      };
    },


    methods: {

      //-- recupera gli eventi dal backend
      async searchEvent() {
          const response = await axios.get('/api/available-events', this.searchQuery);
          this.availableEvents = response.data
      },

      selectEvent(event) {
        this.selectedEvent = event;
        this.searchQuery = event.name;
        this.searchQuery = '';
        this.availableEvents = []; // Nascondi i risultati della ricerca dopo la selezione
      },

      // Recupera la lista degli utenti dal backend
      async searchUsers() {
          const response = await axios.get('/api/available-users', this.searchQuery);
          this.availableUsers = response.data;
      },

      selectUser(user) {
        if (!this.selectedMembers.includes(user)) {
          this.selectedMembers.push(user);
        }
        this.searchQuery = ''; // Resetta il campo di ricerca
        this.availableUsers = []; // Nascondi i risultati della ricerca
      },

      removeUser(user) {
        this.selectedMembers = this.selectedMembers.filter(member => member !== user);
      },

      // Crea un nuovo gruppo
      createGroupTemp() {
        const newGroup = {
          name: this.groupName,
          members: this.selectedMembers.map(p => p.id)
        };
        axios.post('/api/groups', newGroup)
          .then(response => {
            const createdGroup = response.data;

          })
          .catch(error => {
            console.error('Errore nella creazione del gruppo:', error);
          });
      },

      async createGroup() {
        if (!this.selectedEvent) {
          alert('Seleziona un evento prima di creare il gruppo.');
          return;
        }
        if (this.selectedMembers.length === 0) {
          alert('Aggiungi almeno un partecipante.');
          return;
        }

        const today = new Date();
        const chatDTO = {
          name: this.selectedEvent.name,
          type: 'group',
          creationDate: today.getFullYear() + today.getMonth() + today.getDate(),
          members: this.selectedMembers,
          messages: null,
          event: this.selectedEvent
        }

        const response = await axios.post('/api/chats/create', chatDTO);
        const createdGroup = response.data;
        this.$emit('groupCreated', createdGroup);
        this.$router.push({ name: 'chat-gruppo', params: { name: createdGroup.name } });

      }
    }
  };


  </script>
  
  <style scoped>

/* Contenitore principale del modulo di creazione del gruppo, con uno sfondo fisso e centrato, e layout a colonna */
  .create-group-container {
   
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

/* Intestazione della pagina, fissa in cima alla pagina con un colore di sfondo e un layout centrato per il titolo */
  .header {
  display: flex;
  justify-content: center; 
  align-items: center;     
  height: 10vh;            
  width: 100vw;           
  background-color: #146ac7;
  top:0;
  position: fixed;
  
}

/* Stile del titolo nella testata */
h1 {
  margin: 0;                
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
 
}

/* Stile per il modulo di creazione del gruppo, con uno sfondo semi-trasparente, angoli arrotondati e una larghezza fissa */
form {

  display: flex;
  flex-direction: column;
  width: 700px;  
  height: 700px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.9);  
  padding: 20px;  
  border-radius: 8px;  
  margin-top: 100px;

}
  
/* Spaziatura tra i vari gruppi di campi all'interno del modulo. */
  .form-group {
    margin-bottom: 20px;
  }
  
  /* Stile per le etichette dei campi del modulo, con margine inferiore per separare i testi */
  .form-group label {
    display: block;
    margin-bottom: 5px;
    
  }
  

/* Stile per i campi di input di tipo testo (Campo di input per il nome del gruppo, con una larghezza completa, padding e bordo arrotondato) */
  .form-group input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  /* Stile per i pulsanti, inclusi il colore di sfondo, il colore del testo e le proprietà del cursore. */
  button {
    padding: 10px 20px;
    background-color: #146ac7;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 15px;
    font-weight: bold;
    
  }
  
  /* Cambia il colore di sfondo dei pulsanti quando il cursore è sopra di essi. */
  button:hover {
    background-color: #0a3665;
  }
  
  /* Sezione per la lista dei partecipanti che viene visualizzata sotto la selezione dei partecipanti */
  .members-list {
    margin-top: 20px;
  }
  

/* Stile per ciascun elemento della lista degli utenti */
  .user-item {
    margin-bottom: 10px;
  }

  /* Stile per l'icona con la freccia che porta alla pagina precedente */
  .back-link {
  position: fixed; 
  left: 25px; 
  top: 3%; 
  z-index: 1000; 
  font-size: 24px; 
  color: #ffffff; 
}

/* Stile per la lista dei partecipanti selezionati, con altezza massima e scroll verticale */
.selected-members {
  max-height: 150px; 
  overflow-y: auto; 
  margin-top: 20px;
  border: 1px solid #ccc; 
  padding: 10px;
  border-radius: 4px;
  background-color: #fff; 
}

/* Stile per la lista non ordinata dei partecipanti selezionati. */
.selected-members ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
}

/* Stile per gli elementi della lista dei partecipanti selezionati, con padding e bordo inferiore */
.selected-members li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.selected-members li:last-child {
  border-bottom: none; 
}

/* Spazio inferiore tra i pulsanti nella sezione di aggiunta dei partecipanti */ 
.form-group button[type="button"] {
  margin-bottom: 50px; 
}

/*Stile per l'etichetta del campo del nome del gruppo, con una dimensione e colore specifici */ 
.group-name-label {
  font-size: 18px;  
  font-weight: bold;  
  color: #146ac7;  
  margin-bottom: 10px;  
  display: block;  
}

 
  </style>
  
