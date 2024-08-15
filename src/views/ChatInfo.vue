<template>
  <div class="container">
     <!-- Barra di navigazione: link per tornare alla pagina principale -->
      <nav> 
      <!-- RouterLink per navigare alla home page (chat di gruppo) -->     
      <RouterLink to="/chat-gruppo" class="back-link"> 
        <!-- Icona di ritorno indietro (freccia)-->
        <font-awesome-icon icon="arrow-left" class="icon" />
      </RouterLink>
     </nav>

    <!-- Informazioni gruppo -->
    <div class="group-info">
      <!-- Icona del gruppo -->
      <img class="group-icon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8GaWwlQtPhY4LVhaahYOB8wS4qTmGO6sB_g&s alt="group-icon>
      <div class="group-details">
        <!-- Titolo dell'evento -->
          <h2 class="event-title">{{ this.chat.name || 'Titolo Evento' }}</h2>
            
        <!-- Descrizione del gruppo -->
        <div class="description-container">
          <!-- Visualizzazione della descrizione -->
          <p v-if="!isEditing" class="event-description">{{ this.chat.description || 'Descrizione non disponibile' }}</p>
        
          <!-- Modifica della descrizione -->
          <div v-if="isEditing">
            <textarea v-model="newDescription" placeholder="Inserisci nuova descrizione..."></textarea>
            <button class="save-description-btn" @click="updateDescription">Salva</button>
            <button class="cancel-description-btn" @click="toggleEditMode">Annulla</button>
          </div>
        </div>

        <!-- Pulsante per modificare la descrizione -->
        <button v-if="!isEditing" class="edit-description-btn" @click="toggleEditMode">Modifica Descrizione</button>
        </div>
    </div>

    <!-- Modale informazioni gruppo -->
    <div v-if="isGroupInfoModalOpen" class="modal">
      <div class="modal-content">
          <div style="display: flex; justify-content: space-between; align-items: center;">
          <!-- Titolo del modale -->
          <h2 class="membri">Membri Gruppo</h2>
          <!-- Pulsante per aprire il modale di aggiunta partecipanti -->
          <button class="add-member-btn" @click="openAddMemberModal">+</button>
        </div>
        
        <div class="members-list">
        <ul>
           <!-- Iterazione sui partecipanti per mostrarli in una lista -->
          <li v-for="member in members" :key="member.username" class="member-item">
              <!-- RouterLink per aprire la chat privata con il partecipante selezionato -->
              <router-link :to="{ name: 'chat-privata', params: { memberUsername: member.username }}" class="member-item">{{ member.username }}</router-link>
             <!-- Pulsante per rimuovere il partecipante -->
            <button class="remove-btn" @click="removeMember(member.username)">Rimuovi</button>
          </li>
        </ul>
      </div>
          <!-- Pulsante per chiudere il modale -->
        <button class="chiudi" @click="closeGroupInfoModal">Chiudi</button>
      </div>
    </div>

    <!-- Modale per aggiunta partecipanti -->
    <div v-if="isAddMemberModalOpen" class="modal">
      <div class="modal-content">
        <h2 class="aggiungi">Aggiungi membri</h2>

      <!-- Barra di ricerca -->
      <input
          type="text"
          v-model="username"
          placeholder="Cerca utente..."
          class="search-bar"
          @input="fetchAvailableUsers"
      />
        <div class="available-users-list">
        <ul>
          <!-- Iterazione sugli utenti disponibili per mostrarli in una lista -->
          <li v-for="user in this.availableUsers" :key="user.id" class="member-item">
            {{ user.username }}
            <!-- Pulsante per aggiungere un partecipante -->
            <button class="add-btn" @click="addMember(user)">Aggiungi</button>
          </li>
        </ul>
      </div>
         <!-- Pulsante per chiudere il modale -->
        <button class="chiudi" @click="closeAddMemberModal">Chiudi</button>
      </div>
    </div>

    <!-- Pulsante per aprire il modale per informazioni dei membri partecipanti o da aggiungere -->
    <button class="info-part" @click="openGroupInfoModal">Info partecipanti</button>
  </div>
</template>


<script>

import axios from 'axios';

export default {
data() {
  return {
    
      availableUsers: [], // Lista degli utenti disponibili per essere aggiunti al gruppo
      isGroupInfoModalOpen: false, // Stato del modale con le informazioni del gruppo
      isAddMemberModalOpen: false, // Stato del modale per aggiungere partecipanti
      chat: {
        name: this.$route.params.chatName, // Titolo del gruppo
        members: this.$route.params.chatMembers, // Lista dei partecipanti al gruppo
        type: this.$route.params.chatType,
        creationdate: this.$route.params.chatCreationdate,
  
        description: '', // PER ORA LA DESCZIONE NON LA PASSO COME PARAMETRO PERCHÉ VA GESTITA IN UN ALTRO MODO (DA VALUTARE)
      },
      isEditing: false, // Stato della modalità di modifica della descrizione
      newDescription: '', // Nuova descrizione del gruppo in fase di modifica
      searchQueryUsers: '', // Query di ricerca per gli utenti disponibili
      searchQueryMembers: '' // Query di ricerca per i partecipanti
   
  };
},



methods: {

  
    // Recupera gli utenti disponibili
    async fetchAvailableUsers(username) {
      try {
        const response = await axios.get('/api/available-users', username);
        this.availableUsers = response.data;
      } catch (error) {
        console.error('Error fetching available users:', error);
      }
    },


  // Apertura del modale delle informazioni del gruppo
  openGroupInfoModal() {
    this.isGroupInfoModalOpen = true;
  },

  // Chiusura del modale delle informazioni del gruppo sui partecipanti
  closeGroupInfoModal() {
    this.isGroupInfoModalOpen = false;
  },

  // Apertura del modale di aggiunta partecipanti
  openAddMemberModal() {
    this.isAddMemberModalOpen = true;
  },

  // Chiusura del modale di aggiunta membersi
  closeAddMemberModal() {
    this.isAddMemberModalOpen = false;
  },

  // Rimuove un memberse dal gruppo
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
async addMember(user) {
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



// Attiva/disattiva la modalità di modifica della descrizione
    toggleEditMode() {
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        this.newDescription = this.group.description; // Carica la descrizione corrente per modifica
      }
    },
    

    // Salva la nuova descrizione --> IN FASE DI VALUTAZIONE
    async updateDescription() {
      try {
        await axios.put(`/api/groups/${this.group.id}`, {
          description: this.newDescription
        });
        this.group.description = this.newDescription;
        this.isEditing = false;
      } catch (error) {
        console.error('Errore nell\'aggiornamento della descrizione del gruppo:', error);
      }
    }
  }
};
</script>

<style>


/* Contenitore principale: centra il contenuto e utilizza l'intero spazio disponibile */
.container{
  
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-direction: column; 
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

/* Modifiche di stile sul pulsante "info partecipanti" */
.info-part{
    color: #083b71; 
    padding: 15px;
    font-size: 1.5rem;
    margin-top: 20px;
    width: 50%;
    margin-left: 25%;
    border: 2px solid #083b71;
    color: #083b71;
    background-color: #ffffff;

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
  padding: 20px;
  border-radius: 10px;
  margin: 20px;
  
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
  font-size: 2rem;
  color: #ffffff;
  font-weight: bold;
}

/* Modifiche di stile per le informazioni dell'evento */
.group-details p {
  margin: 0;
  color: #81e8ff;
  font-size: 1.5rem;
}

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
  background: none;
  border: none;
  color: rgb(209, 28, 28);
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
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
  color: #146ac7;
}

/* Stile per permettere lo scroll della lista dei partecipanti */
.members-list {
  max-height: 200px; 
  overflow-y: auto;  
  margin-top: 10px;
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

/* Stile per la textarea della descrizione (in modalità di modifica della descrizione) */
textarea {
  width: 100%;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

/* Pulsante per attivare la modifica della descrizione */
.edit-description-btn {
  background-color: #efa8ed;
  color: #083b71;
  font-weight: bold;
  font-size: 15px;
  margin: 5px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
}

/* Pulsante per salvare la nuova descrizione */
.save-description-btn {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
  margin: 5px;
  cursor: pointer;
  padding: 10px;
  border: none;
  border-radius: 5px;
}

/* Pulsante per annullare la modifica della descrizione */
.cancel-description-btn {
  background-color: #f44336;
  color: white;
  font-weight: bold;
  margin: 5px;
  cursor: pointer;
  padding: 10px;
  border: none;
  border-radius: 5px;
}


</style>







