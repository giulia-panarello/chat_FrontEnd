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
        <!-- Sezione per il nome del gruppo -->
        <div class="form-group">
          <label for="groupName" class="group-name-label">Nome del Gruppo</label>
          <input v-model="groupName" type="text" id="groupName" required />
        </div>

         <!-- Sezione per la selezione dei partecipanti -->
        <div class="form-group">
          <button type="button" @click="showParticipants = !showParticipants">
            Aggiungi Partecipanti
          </button>

          <!-- Lista dei partecipanti che viene mostrata/ nascosta -->
          <div v-if="showParticipants" class="participants-list">
            <div v-for="user in users" :key="user.id" class="user-item">

              <!-- Caselle di controllo per selezionare i partecipanti. Ogni casella di controllo è associata a un utente e modifica l'array selectedParticipants -->
              <input 
                type="checkbox" 
                :id="`user-${user.id}`" 
                :value="user" 
                v-model="selectedParticipants" 
              />
              <label :for="`user-${user.id}`">{{ user.name }}</label>
            </div>
          </div>
        </div>

        <!-- Lista dei partecipanti selezionati che viene mostrata sotto il modulo -->
        <ul class="selected-participants">
          <li v-for="user in selectedParticipants" :key="user.id">
            {{ user.name }}
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
      showParticipants: false, // Flag per mostrare/nascondere i partecipanti
      users: [], // Lista degli utenti disponibili
      selectedParticipants: [] // Partecipanti selezionati
      };
    },

    created() {
    this.fetchUsers(); // Recupera la lista degli utenti quando il componente viene creato
    },

    methods: {

    // Recupera la lista degli utenti dal backend
    fetchUsers() {
        axios.get('/api/users')
            .then(response => {
            this.users = response.data;
            })
            .catch(error => {
            console.error('Errore nel recupero degli utenti:', error);
            });
    },

    // Crea un nuovo gruppo
    createGroup() {
      const newGroup = {
        name: this.groupName,
        participants: this.selectedParticipants.map(p => p.id)
      };
      axios.post('/api/groups', newGroup)
        .then(response => {
          const createdGroup = response.data;
          
          this.$emit('groupCreated', createdGroup);
          
          this.$router.push({ name: 'chat-gruppo', params: { id: createdGroup.id } });
        })
        .catch(error => {
          console.error('Errore nella creazione del gruppo:', error);
        });
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
  .participants-list {
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
.selected-participants {
  max-height: 150px; 
  overflow-y: auto; 
  margin-top: 20px;
  border: 1px solid #ccc; 
  padding: 10px;
  border-radius: 4px;
  background-color: #fff; 
}

/* Stile per la lista non ordinata dei partecipanti selezionati. */
.selected-participants ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
}

/* Stile per gli elementi della lista dei partecipanti selezionati, con padding e bordo inferiore */
.selected-participants li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.selected-participants li:last-child {
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
  
