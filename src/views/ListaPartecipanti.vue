<template>
    <div class="container">
       <!-- Barra di navigazione: link per tornare alla pagina principale -->
        <nav> 
        <!-- RouterLink per navigare alla home page (chat di gruppo) -->     
        <RouterLink to="/" class="back-link"> 
          <!-- Icona di ritorno indietro (freccia)-->
          <font-awesome-icon icon="arrow-left" class="icon" />
        </RouterLink>
       </nav>

      <!-- Informazioni gruppo -->
      <div class="group-info">
        <!-- Icona del gruppo -->
        <img class="group-icon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvoX2HbQn78YpCfCeyV6oqkp1lQbjQOG2kNn2gKzHbPPTkamA2" alt="group-icon">
        <div class="group-details">
          <!-- Titolo dell'evento -->
            <h2 class="event-title">Organizzazione Evento</h2>
            <!-- Dettagli dell'evento -->
            <div class="event-info">
          <p><strong>📍Posizione:</strong> Ferrara</p>
          <p><strong>📆 Data:</strong> 15/08/2024</p>
          <p><strong>💵 Ingresso:</strong> 10€</p>
        </div>
        </div>
      </div>
  
      <!-- Modale informazioni gruppo -->
      <div v-if="isGroupInfoModalOpen" class="modal">
        <div class="modal-content">
            <div style="display: flex; justify-content: space-between; align-items: center;">
            <!-- Titolo del modale -->
            <h2 class="membri">Membri Gruppo</h2>
            <!-- Pulsante per aprire il modale di aggiunta partecipanti -->
            <button class="add-participant-btn" @click="openAddParticipantModal">+</button>
          </div>
          <div class="participants-list">
          <ul>
             <!-- Iterazione sui partecipanti per mostrarli in una lista -->
            <li v-for="(participant, index) in chat.participants" :key="index" class="participant-item">
                <!-- RouterLink per aprire la chat privata con il partecipante selezionato -->
                <router-link :to="{ name: 'chat-privata', params: { participant: participant }}" class="participant-item">{{ participant }}</router-link>
               <!-- Pulsante per rimuovere il partecipante -->
              <button class="remove-btn" @click="removeParticipant(index)">Rimuovi</button>
            </li>
          </ul>
        </div>
            <!-- Pulsante per chiudere il modale -->
          <button class="chiudi" @click="closeGroupInfoModal">Chiudi</button>
        </div>
      </div>
  
      <!-- Modale per aggiunta partecipanti -->
      <div v-if="isAddParticipantModalOpen" class="modal">
        <div class="modal-content">
          <h2 class="aggiungi">Aggiungi membri</h2>
          <div class="available-users-list">
          <ul>
            <!-- Iterazione sugli utenti disponibili per mostrarli in una lista -->
            <li v-for="(user, index) in availableUsers" :key="index" class="participant-item">
              {{ user }}
              <!-- Pulsante per aggiungere un partecipante -->
              <button class="add-btn" @click="addParticipant(user)">Aggiungi</button>
            </li>
          </ul>
        </div>
           <!-- Pulsante per chiudere il modale -->
          <button class="chiudi" @click="closeAddParticipantModal">Chiudi</button>
        </div>
      </div>
  
      <!-- Pulsante per aprire il modale per informazioni dei membri partecipanti o da aggiungere -->
      <button class="info-part" @click="openGroupInfoModal">Info partecipanti</button>
    </div>
  </template>
  

  <script>
export default {
  data() {
    return {
      
      
      chat: {
        participants: ['Mario', 'Luigi', 'Peach'],
        messages: []
      },
      availableUsers: ['Edoardo', 'Giulia', 'Francesco'],
      isGroupInfoModalOpen: false,
      isAddParticipantModalOpen: false,
      currentUser: 'Mario',
      
    };
  },
  methods: {
    
    // Apertura del modale delle informazioni del gruppo
    openGroupInfoModal() {
      this.isGroupInfoModalOpen = true;
    },

    // Chiusura del modale delle informazioni del gruppo sui partecipanti
    closeGroupInfoModal() {
      this.isGroupInfoModalOpen = false;
    },

    // Apertura del modale di aggiunta partecipanti
    openAddParticipantModal() {
      this.isAddParticipantModalOpen = true;
    },

    // Chiusura del modale di aggiunta partecipanti
    closeAddParticipantModal() {
      this.isAddParticipantModalOpen = false;
    },

    removeParticipant(index) {
      // Rimozione di un partecipante dalla lista
      this.chat.participants.splice(index, 1);
      this.updateAvailableUsers(); // Aggiornamento della lista degli utenti disponibili
    },
    addParticipant(user) {
       // Aggiunta di un partecipante alla lista
      this.chat.participants.push(user);
      this.updateAvailableUsers(); // Aggiornamento della lista degli utenti disponibili
    },
    updateAvailableUsers() {
      // Aggiornamento della lista degli utenti disponibili per l'aggiunta
      const allUsers = ['Mario', 'Luigi', 'Peach', 'Edoardo', 'Giulia', 'Francesco'];
      // Filtraggio degli utenti già presenti nella lista
      this.availableUsers = allUsers.filter(user => !this.chat.participants.includes(user)); 
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
  display: flex;
  flex-direction: column;
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
.participant-item {
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
.add-participant-btn {
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
  top: 9%; 
  z-index: 1000; 
  font-size: 24px; 
  color: #146ac7;
}

/* Stile per permettere lo scroll della lista dei partecipanti */
.participants-list {
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


</style>




