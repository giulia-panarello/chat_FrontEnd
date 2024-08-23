<template>
  <div class="container">
     <!-- Barra di navigazione: link per tornare alla pagina principale -->
      <nav> 
      <!-- RouterLink per navigare alla home page (chat di gruppo) -->     
      <RouterLink :to="{ name: 'interfaccia-chat', params: { chatName: this.chat.name }}" class="back-link">
        <!-- Icona di navigazione per tornare indietro: rappresentata da una freccia -->
        <font-awesome-icon icon="arrow-left" class="icon" />
      </RouterLink>
     </nav>


    <!-- Sezione per le informazioni dettagliate del gruppo/chat -->
    <div class="group-info">
      <!-- Icona del gruppo se il tipo di chat è 'group' -->
      <img class="group-icon" src="https://img.icons8.com/?size=200&id=Xvo1JQO2ujpL&format=png" alt="group-icon" v-if="this.chat.type === 'group'"> 
       <!-- Icona alternativa se il tipo di chat è 'private' -->
      <img class='group-icon' src="https://img.icons8.com/?size=200&id=VzoCadwFiwaQ&format=png" alt="group-icon" v-if="this.chat.type === 'private'">
      <!-- Contenitore per i dettagli del gruppo/chat -->
      <div class="group-details">
         <!-- Titolo dell'evento/chat: visualizza il nome della chat se disponibile -->
         <h2 class="event-title" v-if="this.chat.type == 'group'">{{ this.chat.name || 'Titolo Evento' }}</h2>
         <h2 class="event-title" v-else>{{  this.otherUser.name }} {{ this.otherUser.surname }}</h2>
            
        <!-- Descrizione del gruppo -->
    <div class="description-container" v-if="this.chat.type === 'group'">
          <!-- Visualizzazione della descrizione -->
        
          <p class="event-description">
            <img src="https://img.icons8.com/?size=96&id=L4aSSPqifOyh&format=png" alt="description-icon" style="width: 40px; height: 40px; margin-right: 8px;">
          <strong>Descrizione:</strong> {{ this.chat.event.description || 'Descrizione non disponibile' }}</p>

          <!-- Tipologia dell'evento/chat -->
          <p class="event-type">
            <img src="https://img.icons8.com/?size=96&id=HkwvpNAN5QKv&format=png" alt="type-icon" style="width: 45px; height: 45px; margin-right: 8px;">
            <strong>Tipologia:</strong> {{ this.chat.event.type || 'Tipo non disponibile' }}</p>

           <!-- Età minima per partecipare all'evento/chat -->
          <p class="event-min-age">
            <img src="https://img.icons8.com/?size=96&id=hoaVvHdJgXL4&format=png" alt="age-icon" style="width: 50px; height: 50px; margin-right: 8px;">
            <strong>Età minima:</strong> {{ this.chat.event.minAge || 'Età minima non disponibile' }}</p>

          <!-- Data e ora di inizio dell'evento/chat -->
          <p class="event-start">
            <img src="https://img.icons8.com/?size=96&id=QPvXANafTBwG&format=png" alt="start-icon" style="width: 50px; height: 50px; margin-right: 8px; "> 
            <strong>Inizio:</strong> {{ this.chat.event.start || 'Inizio non disponibile' }}</p>

           <!-- Data e ora di fine dell'evento/chat -->
          <p class="event-end">
            <img src="https://img.icons8.com/?size=96&id=rPdbSKH2ODQR&format=png" alt="end-icon" style="width: 50px; height: 50px; margin-right: 8px;"> 
            <strong>Fine:</strong> {{ this.chat.event.end || 'Fine non disponibile' }}</p>
    </div>

      <!-- Sezione per la descrizione e i dettagli dell'evento per chat di tipo 'private' -->
      <div class="description-container" v-if="this.chat.type === 'private'">    

            <p class="event-description">
            <img src="https://img.icons8.com/?size=96&id=L4aSSPqifOyh&format=png" alt="description-icon" style="width: 40px; height: 40px; margin-right: 8px;">
            <strong>@</strong>{{ this.chat.name ||'Descrizione non disponibile' }}</p>
          <p class="event-type">
            <img src="https://img.icons8.com/?size=96&id=HkwvpNAN5QKv&format=png" alt="type-icon" style="width: 45px; height: 45px; margin-right: 8px;">
            <strong>Data di nascita:</strong> {{  this.otherUser.birthDate ||'Tipo non disponibile' }}</p>
      </div>
  </div>
</div>


    <!-- Lista dei membri del gruppo -->
    <div class="group-members">
        <div>
          <!-- Titolo del modale -->
          <h2 class="membri">Membri Chat</h2>
          <!-- Campo di ricerca per i membri -->
        <input
          type="text"
          v-model="searchQueryMembers"
          placeholder="Cerca membro..."
          class="search-bar" v-if="this.chat.type === 'group'"
        />          
        <!-- Pulsante per aprire il modale di aggiunta partecipanti -->
          <button class="add-member-btn" @click="openAddMemberModal" v-if="this.chat.type === 'group'">+</button>
        </div>
        
        <div class="members-list">
        <ul>
          <li v-for="member in this.chat.members" :key="member.username" class="member-item">
            <div v-if="member.username === 'selfuser'">
              <ul>{{ member.name }}</ul>
              <span v-if="member.admin === true" class="admin-label">
                <img src="https://img.icons8.com/?size=96&id=6RmLEldWK5Wj&format=png&color=737373" alt="admin-icon" class="admin-icon">
                  Amministratore
              </span>
            </div>
          </li>
           <!-- Iterazione sui partecipanti per mostrarli in una lista -->
          <li v-for="member in filteredMembers" :key="member.username" class="member-item">

              <!-- RouterLink per aprire la chat privata con il partecipante selezionato -->
              <router-link :to="{ name: 'interfaccia-chat', params: { chatName: member.username }}" class="member-item" v-if="member.username !== 'selfuser'">{{ member.name }} {{member.surname}}</router-link>

              <!-- Visualizza la scritta e l'icona se il partecipante è un amministratore -->
              <span v-if="member.admin === true && member.username !== 'selfuser'" class="admin-label">
                <img src="https://img.icons8.com/?size=96&id=6RmLEldWK5Wj&format=png&color=737373" alt="admin-icon" class="admin-icon">
                  Amministratore
              </span>
              <button class="admin-btn" @click="makeAdmin(member)" v-else-if="this.loggedUser.admin === true && member.username !== 'selfuser'">
                Aggiungi amministratore
              </button>              
              <!-- Pulsante per rimuovere il partecipante -->
              <button class="remove-btn" @click="removeMember(member.username)" v-if="member.username !== 'selfuser' && this.loggedUser.admin === true">Rimuovi</button>
            
          </li>
        </ul>
    </div>
  </div>

    <!-- Modale per aggiunta partecipanti -->
    <div v-if="isAddMemberModalOpen" class="modal">
      <div class="modal-content">
        <h2 class="aggiungi" v-if="this.loggedUser.admin === true">Aggiungi membri</h2>

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
            <!-- Pulsante che permette di abbandonare il gruppo -->
        <div class="exit-group-container">
      <button class="exit-group-btn" @click="leaveGroup" v-if="this.chat.type === 'group'">
        <img class="exit-icon" src="https://img.icons8.com/?size=96&id=frR9lkKcDWV8&format=png&color=FFFFFF" alt="exit-icon">
        Abbandona gruppo</button>
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
      // Oggetto chat che contiene dettagli sulla chat
      chat: {
          name: this.$route.params.chatName, // Titolo del gruppo
          members: [], // Lista dei partecipanti al gruppo
          type: [],    // Tipo di chat (es. group, private)
          creationdate: [],
          event: []  // Dettagli dell'evento associato alla chat
        },

        loggedUser: '', // Nome dell'utente attualmente loggato
        otherUser: '',
        searchQueryUsers: '', // Query di ricerca per gli utenti disponibili
        searchQueryMembers: '' // Query di ricerca per i partecipanti

    };
  },

  computed: {

    // Filtra i membri della chat in base alla query di ricerca
    filteredMembers() {
      return this.chat.members.filter(member => member.name.toLowerCase().includes(this.searchQueryMembers.toLowerCase())
      );
    },

    // Filtra gli utenti disponibili in base alla query di ricerca
    filteredUsers() {
      return this.availableUsers.filter(user => user.name.toLowerCase().includes(this.searchQueryUsers.toLowerCase())
      );
    },

  },

     // Recupera i dati della chat e gli utenti disponibili quando il componente viene creato
  created() {
    this.fetchChatData();
    this.fetchAvailableUsers();
  },

  methods: {


    //--- RECUPERA LE INFO DELLA CHAT ---
    async fetchChatData() {
      try {
        const response = await axios.get(`http://localhost:8080/api/chats/${this.chat.name}`);
        this.chat.type = response.data.type;
        this.chat.creationDate = response.data.creationDate;
        this.chat.members = response.data.members;
        this.chat.event = response.data.event;
  
        if (this.chat.members.length === 2){
            this.selfUser = this.chat.members.find(member => member.username === 'selfuser');
            this.otherUser = this.chat.members.find(member => member.username !== 'selfuser');
          }
        
        this.reformatDate(this.chat.members);

      } catch (error) {
        console.error('Errore durante il recupero delle informazioni:', error);
      }
    },


    // Riformatta la data di nascita degli utenti nel formato 'YYYY-MM-DD'
    reformatDate(users){
      for(var i=0; i<users.length; i++){
        //console.log(users[i]);
        const data = Reflect.get(users[i], 'birthDate');
        //console.log(data);

        // Split della stringa sulla "T"
        const dataFormattata = data.split('T')[0];
        
        // Aggiorniamo la proprietà birthDate con il nuovo formato
        users[i].birthDate = dataFormattata;
      }
      console.log("Utenti con date nuove: ", users)
    },
  
    // Recupera gli utenti disponibili dal backend
    async fetchAvailableUsers() {
      try {
        const response = await axios.get(`http://localhost:8080/api/${this.chat.mame}/available-users`);
        console.log(response.data);
        this.availableUsers = response.data;
        this.reformatDate(this.availableUsers);
      } catch (error) {
        console.error('Error fetching available users:', error);
      }
    },


    //--- RIMUOVE UN MEMBRO DAL GRUPPO ---
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
          const memberToRemove = this.chat.members.find(member => member.username === username);
          await axios.post(`http://localhost:8080/api/chats/${this.chat.name}/remove-member`, memberToRemove);
          this.chat.members = this.chat.members.filter(member => member.username !== username);
      } catch (error) {
          console.error('Errore nella rimozione del memberse:', error);
      }
    },


    //--- AGGIUNGE UN MEMBRO ---
    async addMember(userToFind) {
      /*
        Input:
              username:  username dell'utente da aggiungere
                           gli utenti hanno un username univoco --> l'username è il loro id

        - Cerca l'utente nella lista di utenti disponibili
        - passa l'oggetto utente trovato al BE
        - aggiunge l'oggetto trovato alla lista dei membri
      */
      try {
        console.log('userToFind:', userToFind);
        const memberToAdd = this.availableUsers.find(user => user.username === Reflect.get(userToFind, 'username'));
        if (!memberToAdd) {
          console.error(`User not found: ${username}`);
          return;
        }
        console.log("member to add", memberToAdd)
        const requestBody = {
          username: memberToAdd.username,
          name: memberToAdd.name,
          surname: memberToAdd.surname,
          birthDate: memberToAdd.birthDate,
          deleted: false,
          deleted: false,
          admin:  false
        }
        
        const chatName = this.chat.name;
        console.log(`URL: http://localhost:8080/api/chats/${chatName}/add-member`);
        console.log('requestBody:', requestBody)
        await axios.post(`http://localhost:8080/api/chats/${chatName}/add-member`, requestBody);
        this.chat.members.push(memberToAdd);
      } catch (error) {
          console.error('Errore nell\'aggiunta del partecipante:', error);
      }
    },


    //--- RENDE UN MEMBRO AMMINISTRATORE ---
    async makeAdmin(member) {
      try{
        await axios.push(`http://localhost:8080/api/chats/${this.chat.name}/new-admin`, member);
      } catch(error){
        console.error('Errore nel rednere admin il membro: ', member);
      }
      
    },    


    //--- LASCIA IL GRUPPO ---
    async leaveGroup() {

      await axios.push(`http://localhost:8080/api/chats/${this.chat.name}/leave-chat`);
      // Logica per uscire dal gruppo
      alert("Hai lasciato il gruppo.");
      this.$router.push('/chat-gruppo');
    },



    //--- Riformatta la data ---
    reformatDate(users){
      for(var i=0; i<users.length; i++){
        //console.log(users[i]);
        const data = Reflect.get(users[i], 'birthDate');
        //console.log(data);

        // Split della stringa sulla "T"
        const dataFormattata = data.split('T')[0];
        
        // Aggiorniamo la proprietà birthDate con il nuovo formato
        users[i].birthDate = dataFormattata;
      }
      console.log("Utenti con date nuove: ", users)
    },
  

    // Apertura del modale di aggiunta partecipanti
    openAddMemberModal() {
      this.isAddMemberModalOpen = true;
    },


    // Chiusura del modale di aggiunta membri
    closeAddMemberModal() {
      this.isAddMemberModalOpen = false;
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

/* Stile per la scritta "Amministratore" */
.admin-label {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #0000008d;
  font-weight: bold;
  margin-right: 10px;
  font-style: italic;
}

/* Stile per l'icona dell'amministratore, in particolare gestione della dimensione */
.admin-icon {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}

/* Stile per il pulsante "Rendi Amministratore" */
.admin-btn {
  background: none;
  border: none;
  color: #0000008d;
  font-style: italic;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  margin-right: 10px;
}

/* Contenitore del pulsante "Abbandona gruppo" (posizione di esso nella pagina) */
.exit-group-container {
  position: fixed;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Stile per il pulsante "Abbandona gruppo" */
.exit-group-btn {
  padding: 20px 20px;
  background-color: #146ac7;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}

/* Quando passo con il mouse sul tasto 'Abbandona gruppo' cambia colore */
.exit-group-btn:hover {
  background-color: #c0392b;
}

/* Stile dell'icona all'interno del tasto Abbandona Gruppo, dimensione in particolare */
.exit-icon {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}
</style>







