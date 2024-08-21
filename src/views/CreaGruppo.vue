<template>
  <!-- Contenitore di navigazione, include link e pulsante di conferma -->
  <nav>  
        <!-- Link per tornare alla pagina principale, usa un'icona di freccia a sinistra -->    
    <RouterLink to="/" class="back-link"> 
      <font-awesome-icon icon="arrow-left" class="icon" />
    </RouterLink>

    <!-- Pulsante con icona di spunta per confermare e creare il gruppo -->
    <button @click="createGroup" class="submit-icon-button">
      <img src="https://img.icons8.com/?size=96&id=HYBOklwPSqKD&format=png" alt="Conferma" class="submit-icon" />
    </button>
  </nav>


  <!-- Contenitore principale per il modulo di creazione del gruppo -->
  <div class="create-group-container">
     <!-- Contenitore per la disposizione orizzontale di due sezioni -->
    <div class="main-container">
        <!-- Contenitore per il titolo e le due sezioni principali (eventi e partecipanti) -->
      <div class="title-container">
         <!-- Intestazione fissa con il titolo del modulo -->
        <div class="header">
          <h1>Crea Nuovo Gruppo</h1>
        </div>
       
       
        <!-- Sezione per aggiungere eventi -->
        <div class="events-container">
          <h2 class="events-title">
            Aggiungi Evento
            <!-- Icona accanto al titolo della sezione degli eventi -->
            <img src="https://img.icons8.com/?size=96&id=KPXIRLDghgMh&format=png&color=228BE6" alt="Icona Aggiungi Eventi" class="events-icon" />
          </h2>
           <!-- Lista di eventi filtrati basata sulla query di ricerca -->
          <div class="events-list">
            <!-- Campo di ricerca per filtrare gli eventi -->
            <input 
              type="text" 
              v-model="searchEventQuery" 
              placeholder="Cerca eventi..."
              class="search-bar"
            />
            <div v-for="event in filteredEvents" :key="event.id" class="event-item">
              <span>{{ event.name }}</span>
              <button 
                type="button" 
                @click="selectEvent(event)" 
                class="add-button"
                :disabled="isEventPresent()"
              >
                Aggiungi
              </button>
            </div>
          </div>
        
          <!-- Sezione per mostrare gli eventi selezionati -->
          <div class="selected-events">
            <ul>
              <!-- Itera attraverso gli eventi selezionati e mostra ogni evento con un pulsante per rimuovere -->
              <li v-for="event in this.selectedEvent" :key="event.name">
                {{ event.name }}
                <button 
                  type="button" 
                  @click="resetEvent(event)" 
                  class="remove-button"
                >
                  Rimuovi
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Sezione per aggiungere membri -->
        <div class="members-container">
          <h2 class="members-title">
            Aggiungi Partecipanti
            <!-- Icona accanto al titolo della sezione dei membri -->
            <img src="https://img.icons8.com/?size=96&id=YyRIIad5m8iy&format=png&color=228BE6" alt="Icona Aggiungi Partecipanti" class="members-icon" />
          </h2>
          <!-- Lista di utenti filtrati basata sulla query di ricerca -->
          <div class="members-list">
            <!-- Campo di ricerca per filtrare gli utenti -->
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Cerca utenti..."
              class="search-bar"
            />
            <!-- Itera attraverso gli utenti filtrati e mostra ogni utente con un pulsante per aggiungere -->
            <div v-for="user in filteredUsers" :key="user.username" class="user-item">
              <span>{{ user.name }}</span>
              <button 
                type="button" 
                @click="addMember(user)" 
                class="add-button"
                :disabled="isUserAdded(user)"
              >
                Aggiungi
              </button>
            </div>
          </div>
      
          <!-- Sezione per mostrare i membri selezionati -->
          <div class="selected-members">
            <ul>
                <!-- Itera attraverso i partecipanti selezionati e mostra ogni membro con un pulsante per rimuovere -->
              <li v-for="user in selectedMembers" :key="user.username">
                {{ user.name }}
                <button 
                  type="button" 
                  @click="removeMember(user)" 
                  class="remove-button"
                >
                  Rimuovi
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

import axios from 'axios';

export default {
  name: 'CreateGroup',
  data() {
    return {
      searchQuery: '', // Query di ricerca per utenti
      searchEventQuery: '', // Query di ricerca per eventi
      users: [],
      events: [],

      selectedMembers: [], // Lista di membri selezionati
      selectedEvent: [] // Lista di eventi selezionati
    };
  },

  computed: {

    // Filtra gli utenti in base alla query di ricerca
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(user => 
        user.name.toLowerCase().includes(query)
      );
    },

     // Filtra gli eventi in base alla query di ricerca
    filteredEvents() {
      const query = this.searchEventQuery.toLowerCase();
      return this.events.filter(event => 
        event.name.toLowerCase().includes(query)
      );
    }
  },


  created() {
    this.getAvailableEvents();
    this.getAvailableUsers();
  },

  methods: {

    //-- recupera gli utenti dal BE
    async getAvailableUsers(){
      try{
        const respose = await axios.get('http://localhost:8080/api/available-users');
        console.log('Response: ', respose.data);
        this.users = respose.data;
        console.log('Users: ', this.users);
      
      } catch(error){
        console.error('Errore nel recupero degli utenti');
      }
    },

    //-- recupera gli eventi dal BE
    async getAvailableEvents(){
      try{
        const respose = await axios.get('http://localhost:8080/api/available-events');
        this.events = respose.data;
        console.log('Events: ', this.events);
      } catch(error){
        console.error('Errore nel recupero degli eventi');
      }
    },

    // Crea un nuovo gruppo e naviga alla pagina del gruppo
    async createGroup() {

      // Controllo se ci sono membri selezionati
      if (this.selectedMembers.length === 0) {
        alert('Aggiungi almeno un membro prima di creare il gruppo.');
        return;
      }

      // Controllo se il numero di eventi selzionati è corretto
      if (this.selectedEvent.length !== 1) {
        alert('Seleziona solo un evento!');
        return;
      }
      
      // Crea un oggetto di gruppo con ID, messaggio iniziale, tipo, membri ed eventi
      const selfuser = {
        username: 'selfuser',
        name: 'Tu',
        surname: 'Tu',
        birthDate: null,
        deleted: false,
        admin: true,
      };

      //-- conversione utenti in MemberDTOs
      const membersToAdd = [];
      membersToAdd.push(selfuser);
      for(var i=0; i<this.selectedMembers.length; i++){
        const newMember = {
          username: this.selectedMembers[i].username,
          name: this.selectedMembers[i].name,
          surname: this.selectedMembers[i].surname,
          birthDate: this.selectedMembers[i].birthDate.split('T')[0],
          deleted: false,
          admin: false,
        };

        membersToAdd.push(newMember);

      }

      console.log('Members to add: ', membersToAdd);

      const today = new Date();

      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Mese parte da 0, quindi aggiungiamo 1
      const day = String(today.getDate()).padStart(2, '0');

      const currentDate = `${year}-${month}-${day}`;


      const newGroup = {
        chatName: Reflect.get(this.selectedEvent[0], 'name'),
        type: 'group',
        creationDate: currentDate,
        members: membersToAdd,
        messages: null,
        event: null
      };
      
      console.log('event:', this.selectedEvent)
      console.log('group: ', newGroup.name)
      
      //-- salvattaggio dul DB
      await axios.post(`http://localhost:8080/api/chats/create`, newGroup);

      this.$router.push({ name: 'lista-chat'});
    },

    // Aggiungi un partecipante alla lista dei selezionati
    addMember(user) {
      if (!this.isUserAdded(user)) { // Verifica se l'utente è già stato aggiunto
        this.selectedMembers.push(user); // Aggiunge l'utente alla lista dei membri selezionati
      }
    },

    // Verifica se un utente è già stato aggiunto
    isUserAdded(user) {
      return this.selectedMembers.some(member => member.username === user.username);
    },

    // Rimuove un partecipante dalla lista dei selezionati
    removeMember(user) {
      this.selectedMembers = this.selectedMembers.filter(member => member.username !== user.username);
    },

    // Aggiungi un evento alla lista degli eventi selezionati
    selectEvent(event) {
      if (!this.isEventPresent()) { // Verifica se l'evento è già stato aggiunto
        this.selectedEvent.push(event);  // Aggiunge l'evento alla lista degli eventi selezionati
      }
    },


    // Verifica se un evento è già stato aggiunto
    isEventPresent() {
      return this.selectedEvent.length === 1; // Restituisce true se l'evento è già nella lista degli eventi selezionati
    },

    // Rimuove un evento dalla lista degli eventi selezionati
    resetEvent() {
      this.selectedEvent = []; // Filtra l'evento da rimuovere
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

/* Contenitore per la disposizione orizzontale delle sezioni */
.main-container {
  display: flex;
  width: 100%;
  max-width: 1200px; /* Limita la larghezza massima del contenitore principale */
  gap: 40px; /* Spazio tra i due quadranti */
}

/* Contenitore per il titolo e le sezioni principali */
.title-container {
  flex: 1;
  display: flex;
  justify-content: space-between;
  gap: 50px; /* Posiziona i quadranti a sinistra e a destra */
}

/* Intestazione della pagina, fissa in cima alla pagina con un colore di sfondo e un layout centrato per il titolo */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 10vh;
  background-color: #146ac7;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Stile del titolo nella testata */
h1 {
 margin: 0;                
 color: #ffffff;
 font-size: 30px;
 font-weight: bold;
}

/* Stile per i quadranti "Aggiungi Eventi" e "Aggiungi Partecipanti" */
.events-container,
.members-container {
  flex: 1;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  width: 100%; 
}

/* Titoli nelle sezioni degli eventi e partecipanti */
.events-title,
.members-title {
  font-size: 24px;
  font-weight: bold;
  color: #0a3665; 
  text-align: center;
  font-style: italic;
}

/* Icone nelle sezioni degli eventi e partecipanti */
.events-icon,
.members-icon {
  width: 50px; 
  height: 50px; 
  margin-left: 10px;
}

/* Campo di ricerca per utenti e eventi */
.search-bar {
  width: 90%; 
  padding: 10px;
  border: 2px solid #0a3665;
  border-radius: 4px;
  margin-bottom: 10px;

}

/* Stile per le liste selezionate di membri ed eventi */
.selected-members,
.selected-events {
  max-height: 150px;
  overflow-y: auto;
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  background-color: #fff;
  list-style-type: none;
  padding: 0;
}

/* Stile per ogni elemento delle liste selezionate */
.selected-members li,
.selected-events li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

/* Rimuove il bordo inferiore dell'ultimo elemento della lista */
.selected-members li:last-child,
.selected-events li:last-child {
  border-bottom: none;
}


/* Stile icona (freccia) per link di ritorno alla pagina precedente */
.back-link {
  position: fixed; 
  left: 25px; 
  top: 3%; 
  z-index: 1000; 
  font-size: 24px; 
  color: #ffffff; 
}


/* Pulsante per aggiungere elementi (eventi o membri) */
.add-button {
  padding: 5px 10px;
  background-color: #14c765;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

/* Tasto 'aggiungi' disabilitato dopo averlo cliccato con un colore di sfondo grigio */
.add-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Cambia il colore di sfondo quando passo con il mouse sul pulsante ed esso non è disabilitato */
.add-button:hover:not(:disabled) {
  background-color: #b2ecd5;
}

/* Stile per il pulsante di rimozione */
.remove-button {
  background-color: #e74c3c;
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: #fff;
}

/* Cambia il colore di sfondo quando passo con il mouse sul pulsante */
.remove-button:hover {
  background-color: #c0392b;
}


/* Posizionamento e visibilità dell'icona di conferma */
.submit-icon {
  width: 50px; 
  height: 50px; 
  
}

.submit-icon-button {
  position: fixed; 
  top: 10px; 
  right: 10px; 
  background: none; 
  border: none; 
  z-index: 1000; 
}

/* Effetto hover per l'icona di conferma: quando passo sull'icona si vede un'ombra trasparente */
.submit-icon-button:hover .submit-icon {
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
  transition: box-shadow 0.3s ease; 
}

/* Contenitore per la lista di utenti */
.members-list,
.events-list {
  max-height: 350px; 
  height: 250px; 
  overflow-y: auto; 
  border: 1px solid #ccc; 
  padding: 10px;
  border-radius: 4px;
  background-color: #fff;
  margin-top: 10px; 
}

/* Stili per gli elementi di lista nella sezione degli utenti e degli eventi */
.user-item,
.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.user-item:last-child,
.event-item:last-child {
  border-bottom: none;
}



</style>