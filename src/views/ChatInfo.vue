<template>
  <div class="container">
     <!-- Barra di navigazione: link per tornare alla pagina principale -->
      <nav> 
      <!-- RouterLink per navigare alla home page (chat di gruppo) -->     
      <RouterLink :to="{ name: 'chat-gruppo', params: { chatName: this.chat.name }}" class="back-link">
        <!-- Icona di ritorno indietro (freccia)-->
        <font-awesome-icon icon="arrow-left" class="icon" />
      </RouterLink>
     </nav>

    <!-- Informazioni gruppo -->
    <div class="group-info">
      <!-- Icona del gruppo -->
      <img class="group-icon" src="https://img.icons8.com/?size=200&id=Xvo1JQO2ujpL&format=png" alt="group-icon">              
        <div class="group-details">
        <!-- Titolo dell'evento -->
          <h2 class="event-title">{{ this.chat.name || 'Titolo Evento' }}</h2>
            
        <!-- Descrizione del gruppo -->
    <div class="description-container">
          <!-- Visualizzazione della descrizione -->
        <div>
            <p class="event-description">
              <img src="https://img.icons8.com/?size=96&id=L4aSSPqifOyh&format=png" alt="description-icon" style="width: 40px; height: 40px; margin-right: 8px;">
            <strong>Descrizione:</strong> {{ event.description || 'Descrizione non disponibile' }}</p>
            <p class="event-type">
              <img src="https://img.icons8.com/?size=96&id=HkwvpNAN5QKv&format=png" alt="type-icon" style="width: 45px; height: 45px; margin-right: 8px;">
              <strong>Tipologia:</strong> {{ event.type || 'Tipo non disponibile' }}</p>
            <p class="event-min-age">
              <img src="https://img.icons8.com/?size=96&id=hoaVvHdJgXL4&format=png" alt="age-icon" style="width: 50px; height: 50px; margin-right: 8px;">
              <strong>Età minima:</strong> {{ event.minAge || 'Età minima non disponibile' }}</p>
            <p class="event-start">
              <img src="https://img.icons8.com/?size=96&id=QPvXANafTBwG&format=png" alt="start-icon" style="width: 50px; height: 50px; margin-right: 8px; "> 
              <strong>Inizio:</strong> {{ event.start || 'Inizio non disponibile' }}</p>
            <p class="event-end">
              <img src="https://img.icons8.com/?size=96&id=rPdbSKH2ODQR&format=png" alt="end-icon" style="width: 50px; height: 50px; margin-right: 8px;"> 
              <strong>Fine:</strong> {{ event.end || 'Fine non disponibile' }}</p>

          </div>        
        </div>
    </div>
  </div>


    <!-- Lista dei membri del gruppo -->
    <div class="group-members">
        <div>
          <!-- Titolo del modale -->
          <h2 class="membri">Membri Gruppo</h2>
          <!-- Campo di ricerca per i membri -->
        <input
          type="text"
          v-model="searchQueryMembers"
          placeholder="Cerca membro..."
          class="search-bar"
        />          
        <!-- Pulsante per aprire il modale di aggiunta partecipanti -->
          <button class="add-member-btn" @click="openAddMemberModal">+</button>
        </div>
        
        <div class="members-list">
        <ul>
          <li v-for="member in this.chat.members" :key="member.username" class="member-item">
            <div v-if="member.username === 'selfuser'">
              <ul>{{ member.name }}</ul>
              <span v-if="member.admin === true">admin</span>
            </div>
          </li>
           <!-- Iterazione sui partecipanti per mostrarli in una lista -->
          <li v-for="member in filteredMembers" :key="member.username" class="member-item">
              <!-- RouterLink per aprire la chat privata con il partecipante selezionato -->
              <router-link :to="{ name: 'chat-gruppo', params: { chatName: member.username }}" class="member-item" v-if="member.username !== 'selfuser'">{{ member.name }} {{member.surname}}</router-link>
              <span v-if="member.admin === true">admin</span>
              <!-- Pulsante per rimuovere il partecipante -->
              <button class="remove-btn" @click="removeMember(member.username)" v-if="member.username !== 'selfuser'">Rimuovi</button>
            
          </li>
        </ul>
    </div>
  </div>

    <!-- Modale per aggiunta partecipanti -->
    <div v-if="isAddMemberModalOpen" class="modal">
      <div class="modal-content">
        <h2 class="aggiungi">Aggiungi membri</h2>

      <!-- Barra di ricerca -->
      <input
          type="text"
          v-model="searchQueryUsers"
          placeholder="Cerca utente..."
          class="search-bar"
          @input="fetchAvailableUsers"
      />
        <div class="available-users-list">
        <ul>
          <!-- Iterazione sugli utenti disponibili per mostrarli in una lista -->
          <li v-for="user in filteredUsers" :key="user.username" class="member-item">
            {{ user.name }} {{ user.surname }}
            <!-- Pulsante per aggiungere un partecipante -->
            <button class="add-btn" @click="addMember(user)">Aggiungi</button>
          </li>
        </ul>
      </div>
         <!-- Pulsante per chiudere il modale -->
        <button class="chiudi" @click="closeAddMemberModal">Chiudi</button>
      </div>
    </div>
  </div>
</template>


<script>

import axios from 'axios';

export default {
  data() {
    return {

        availableUsers: [], // Lista degli utenti disponibili per essere aggiunti al gruppo
        isAddMemberModalOpen: false, // Stato del modale per aggiungere partecipanti
        chat: {
          name: this.$route.params.chatName, // Titolo del gruppo
          members: [], // Lista dei partecipanti al gruppo
          type: [],
          creationdate: [],
          event: []
        },

        searchQueryUsers: '', // Query di ricerca per gli utenti disponibili
        searchQueryMembers: '' // Query di ricerca per i partecipanti

    };
  },

  computed: {

    filteredMembers() {
      return this.chat.members.filter(member => member.name.toLowerCase().includes(this.searchQueryMembers.toLowerCase())
      );
    },

    filteredUsers() {
      return this.availableUsers.filter(user => user.name.toLowerCase().includes(this.searchQueryUsers.toLowerCase())
      );
    },

  },
  
  created() {
    this.fetchChatData();
    this.fetchAvailableUsers();
  },

  methods: {

    // recupera le info della chat dal BE
    async fetchChatData() {
      try {
        const response = await axios.get(`http://localhost:8080/api/chats/${this.chat.name}`);
        this.chat.type = response.data.type;
        this.chat.creationDate = response.data.creationDate;
        this.chat.members = response.data.members;
        this.chat.event = response.data.event;

      } catch (error) {
        console.error('Errore durante il recupero delle informazioni:', error);
      }
    },

  
    // Recupera gli utenti disponibili
    async fetchAvailableUsers() {
      try {
        const response = await axios.get(`http://localhost:8080/api/available-users`);
        console.log(response.data);
        this.availableUsers = response.data;
      } catch (error) {
        console.error('Error fetching available users:', error);
      }
    },

    


  // Apertura del modale di aggiunta partecipanti
  openAddMemberModal() {
    this.isAddMemberModalOpen = true;
  },

  // Chiusura del modale di aggiunta membri
  closeAddMemberModal() {
    this.isAddMemberModalOpen = false;
  },

  // Rimuove un membro dal gruppo
  async removeMember(username) {
    /*
      Input:
            username:  username dell'utente da rimuovere
                       gli utenti hanno un username univoco --> l'username è il loro id 
                        
      - recupera l'utente dalla lista membri
      - manda l'utente al BE
      - rimuove l'utente dalla lista membri sul FE
    */
    try {
        const memberToRemove = this.members.find(member => member.username === username);
        await axios.post('/api/remove-member', memberToRemove);
        this.members = this.members.filter(member => member.username !== username);
    } catch (error) {
        console.error('Errore nella rimozione del memberse:', error);
    }
},

    // Aggiunge un partecipante al gruppo
    async addMember(username) {
      /*
        Input:
              username:  username dell'utente da aggiungere
                           gli utenti hanno un username univoco --> l'username è il loro id

        - Cerca l'utente nella lista di utenti disponibili
        - passa l'oggetto utente trovato al BE
        - aggiunge l'oggetto trovato alla lista dei membri
      */
      try {
        const memberToAdd = this.availableUsers.find(user => user.username === username);
        await axios.post('/api/add-member', memberToAdd, this.chat);
        this.members.push(memberToAdd);
      } catch (error) {
          console.error('Errore nell\'aggiunta del partecipante:', error);
      }
    },
  }
};
</script>

<style>


/* Contenitore principale: centra il contenuto e utilizza l'intero spazio disponibile */
.container{
  
  display: flex;
  justify-content: center;
  align-items: flex-start; 
  flex-direction: row;
  position: fixed;
  margin-top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  background-image: url('https://i.pinimg.com/originals/c4/23/12/c4231254ad6f3a92d902a8356212809c.jpg');
  background-size: cover;
  background-position: center; 
}

/* Modifiche di stile sul pulsante "chiudi" */
.chiudi{
    padding: 10px;
    font-weight: bold;
    font-size: 1rem;
    margin-top: 15px;
    border: 2px solid #083b71;
    color: #083b71;
    background-color: #9cc7f4;
  
}


/* Modifiche di stile sul pulsante "aggiungi" per aggiungere i partecipanti */
.aggiungi{
    color:#146ac7;
    font-weight: bold;
}

/* Modifiche di stile per "Membri Gruppo" nel riquadro della lista dei partecipanti */
.membri{
    color: #146ac7;
    font-weight: bold;
}

/* Modifiche di stile per il riquadro in cui c'è il titolo del gruppo e i dettagli */
.group-info {
  background-color: #146ac7;
  border: 1px solid #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 15px;
  border-radius: 10px;
  width: 70%; 
  max-width: 700px;
  margin-left: 20px;
  margin-top: 100px;  
}

/* Modifiche di stile per l'icona del gruppo */
.group-icon {
  width: 150px; 
  height: 150px; 
  border-radius: 50%; 
  margin-bottom: 10px; 
}

/* Modifiche di stile per il titolo "Organizzazione Evento" */
.group-details h2 {
  margin: 0;
  font-size: 2.5rem;
  color: #ffffff;
  font-weight: bold;
}

/* Modifiche di stile per le informazioni dell'evento */
.group-details p {
  margin: 0;
  color: #ffffff;
  font-size: 1.33rem;
  font-style: italic;}

/* Modifiche di stile per la modale sulle informazioni gruppo */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modifiche di stile per il riquadro contenente la lista */
.modal-content {
  background: #ffffff;
  padding: 50px;
  border-radius: 5px;
  font-size: 1.5rem;
}

/* Modifiche di stile per i nomi dei partecipanti */
.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  color: #083b71;
  max-height: 100px; 
  overflow-y: auto;
}


/* Modifiche di stile sul pulsante "rimuovi" */
.remove-btn {
  background-color: #f44336;
  border: 1px solid #f44336;
  color: white;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  padding: 5px 10px;
  border-radius: 5px;
}

/* Modifiche di stile sul pulsante "aggiungi" */
.add-btn {
  background: none;
  border: none;
  color: rgb(16, 131, 68);
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}

/* Modifiche di stile sul pulsante "+" */
.add-member-btn {
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #083b71;
  font-weight: bold;
  margin-left: 20px;
}

/* Modifiche di stile sull'icona con la freccia per tornare nella pagina principale */
.back-link {
  position: fixed; 
  left: 10px; 
  top: 4%; 
  z-index: 1000; 
  font-size: 24px; 
  color: #0e56a3
}


/* Stile per permettere lo scroll della lista dei membri da aggiungere */
.available-users-list {
  max-height: 200px; 
  overflow-y: auto;  
  margin-top: 10px;
}

/* Contenitore per la descrizione del gruppo */
.description-container {
  margin: 20px 0;
}

/* Stile per la descrizione dell'evento */
.event-description {
  font-size: 1.2rem;
  margin: 10px 0;
}


/* Stile della barra di ricerca dei membri e degli utenti */
.search-bar {
  width: 400px;
  padding: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
  font-size: 1rem;
  background-color: #bbe9fc;
  border-radius: 5px;
  margin-left: 25px;}

/* Stile per la lista dei membri del gruppo */
.group-members {
  padding: 10px;
  background-color: #ffffff;
  border: 2px solid #0e56a3;
  border-radius: 8px;
  margin-top: 100px;
  margin-right: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 120px); 
  margin-left: 30px;
  width: 70%; 
  max-width: 500px; 
  height: 568px;
}

/* Titolo 'Membri del gruppo' */
.group-members h2 {
  font-size: 25px;
  color: #0e56a3;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;}

/* Stile nomi dei membri */
.group-members ul {
  list-style: none;
  padding: 0;
}

.group-members li {
  padding: 5px 0;
  font-size: 20px;
}

.members-list {
  overflow-y: auto;  
  max-height: 400px; 
  padding: 10px;    
}

</style>







