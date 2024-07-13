<template>
    <div class="container">
        <nav>        
        <RouterLink to="/" class="back-link"> 
          <font-awesome-icon icon="arrow-left" class="icon" />
        </RouterLink>
       </nav>

      <!-- Informazioni gruppo -->
      <div class="group-info">
        <img class="group-icon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvoX2HbQn78YpCfCeyV6oqkp1lQbjQOG2kNn2gKzHbPPTkamA2" alt="group-icon">
        <div class="group-details">
            <h2 class="event-title">Organizzazione Evento</h2>
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
            <h2 class="membri">Membri Gruppo</h2>
            <button class="add-participant-btn" @click="openAddParticipantModal">+</button>
          </div>
          <ul>
            <li v-for="(participant, index) in chat.participants" :key="index" class="participant-item">
                <router-link :to="{ name: 'chat-privata', params: { participant: participant }}">{{ participant }}</router-link>

              <button class="remove-btn" @click="removeParticipant(index)">Rimuovi</button>
            </li>
          </ul>
          <button class="chiudi" @click="closeGroupInfoModal">Chiudi</button>
        </div>
      </div>
  
      <!-- Modale aggiunta partecipanti -->
      <div v-if="isAddParticipantModalOpen" class="modal">
        <div class="modal-content">
          <h2 class="aggiungi">Aggiungi membri</h2>
          <ul>
            <li v-for="(user, index) in availableUsers" :key="index" class="participant-item">
              {{ user }}
              <button class="add-btn" @click="addParticipant(user)">Aggiungi</button>
            </li>
          </ul>
          <button class="chiudi" @click="closeAddParticipantModal">Chiudi</button>
        </div>
      </div>
  
      <!-- Pulsante per aprire il modale informazioni gruppo -->
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
    
    openGroupInfoModal() {
      this.isGroupInfoModalOpen = true;
    },
    closeGroupInfoModal() {
      this.isGroupInfoModalOpen = false;
    },
    openAddParticipantModal() {
      this.isAddParticipantModalOpen = true;
    },
    closeAddParticipantModal() {
      this.isAddParticipantModalOpen = false;
    },
    removeParticipant(index) {
      this.chat.participants.splice(index, 1);
      this.updateAvailableUsers();
    },
    addParticipant(user) {
      this.chat.participants.push(user);
      this.updateAvailableUsers();
    },
    updateAvailableUsers() {
      const allUsers = ['Mario', 'Luigi', 'Peach', 'Edoardo', 'Giulia', 'Francesco'];
      this.availableUsers = allUsers.filter(user => !this.chat.participants.includes(user));
    }
  }
};
</script>


<style>


/* Allineamento al centro e utilizzo dello spazio intero */
.container{
  
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-direction: column; /* Centra il contenuto verticalmente */
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

.chiudi{
    padding: 10px;
    font-weight: bold;
    font-size: 1rem;
    margin-top: 15px;
    border: 2px solid #146ac7;
    color: #146ac7;
}

.info-part{
    color: #083b71; 
    padding: 15px;
    font-size: 1.5rem;
    margin-top: 20px;
    width: 50%;
    margin-left: 25%;
    border: 2px solid #146ac7;

}

.aggiungi{
    color:#146ac7;
    font-weight: bold;
}

.membri{
    color:#146ac7;
    font-weight: bold;
}
.group-info {
  background-color: #146ac7;
  border: 1px solid #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center; /* Centra il testo */
  
}

.group-icon {
  width: 150px; /* Modifica la larghezza come desiderato */
  height: 150px; /* Modifica l'altezza come desiderato */
  border-radius: 50%; /* Aggiunge bordi arrotondati per l'icona */
  margin-bottom: 10px; /* Spazio sotto l'icona */
}

.group-details h2 {
  margin: 0;
  font-size: 2rem;
  color: #ffffff;
  font-weight: bold;
}

.group-details p {
  margin: 0;
  color: #81e8ff;
  font-size: 1.5rem;
}

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

.modal-content {
  background: #96c6f9;
  padding: 50px;
  border-radius: 5px;
  font-size: 1.5rem;
}

.participant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.remove-btn {
  background: none;
  border: none;
  color: rgb(209, 28, 28);
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}

.add-btn {
  background: none;
  border: none;
  color: rgb(15, 143, 64);
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}

.add-participant-btn {
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #083b71;
  font-weight: bold;
  margin-left: 20px;
}

.back-link {
  position: fixed; /* Posiziona l'elemento in modo fisso rispetto alla finestra del browser */
  left: 10px; /* Distanza dal margine sinistro della pagina */
  top: 9%; /* Posiziona l'icona verticalmente al centro */
  z-index: 1000; /* Assicura che l'icona sia sopra gli altri contenuti, se necessario */
  font-size: 24px; /* Dimensione dell'icona */
  color: #146ac7; /* Colore dell'icona */
}
</style>


