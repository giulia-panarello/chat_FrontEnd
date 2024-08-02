<template>
    <nav>        
          <RouterLink to="/" class="back-link"> 
            <font-awesome-icon icon="arrow-left" class="icon" />
          </RouterLink>
    </nav>
    <div class="create-group-container">
        <div class="header">
      <h1>Crea Nuovo Gruppo</h1>
      </div>
      <form @submit.prevent="createGroup">
        <div class="form-group">
          <label for="groupName" class="group-name-label">Nome del Gruppo</label>
          <input v-model="groupName" type="text" id="groupName" required />
        </div>
        <div class="form-group">
          <button type="button" @click="showParticipants = !showParticipants">
            Aggiungi Partecipanti
          </button>
          <div v-if="showParticipants" class="participants-list">
            <div v-for="user in users" :key="user.id" class="user-item">
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
        <ul class="selected-participants">
          <li v-for="user in selectedParticipants" :key="user.id">
            {{ user.name }}
          </li>
        </ul>
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
        groupName: '',
        showParticipants: false,
        users: [],
        selectedParticipants: []
      };
    },

    created() {
    this.fetchUsers();
    },

    methods: {

    fetchUsers() {
        axios.get('/api/users')
            .then(response => {
            this.users = response.data;
            })
            .catch(error => {
            console.error('Errore nel recupero degli utenti:', error);
            });
    },

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


  .header {
  display: flex;
  justify-content: center;  /* Centra orizzontalmente */
  align-items: center;      /* Centra verticalmente */
  height: 10vh;            /* Altezza del viewport */
  width: 100vw;             /* Larghezza del viewport */
  background-color: #146ac7;
  top:0;
  position: fixed;
  
}

h1 {
  margin: 0;                /* Rimuove il margine predefinito */
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
 
}

  form {

  display: flex;
  flex-direction: column;
  width: 700px;  /* Usa tutta la larghezza disponibile */

  height: 700px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.9);  /* Sfondo semi-trasparente per il modulo */
  padding: 20px;  /* Spaziatura interna */
  border-radius: 8px;  /* Angoli arrotondati */
  margin-top: 100px;

}
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    
  }
  
  .form-group input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
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
  
  button:hover {
    background-color: #0a3665;
  }
  
  .participants-list {
    margin-top: 20px;
  }
  
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

.selected-participants {
  max-height: 150px; /* Altezza massima per la lista dei partecipanti */
  overflow-y: auto; /* Aggiunge lo scroll verticale */
  margin-top: 20px;
  border: 1px solid #ccc; /* Aggiunge un bordo per distinguere l'area */
  padding: 10px;
  border-radius: 4px;
  background-color: #fff; /* Sfondo bianco per la lista */
}

.selected-participants ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.selected-participants li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.selected-participants li:last-child {
  border-bottom: none; /* Rimuove il bordo dall'ultimo elemento */
}

.form-group button[type="button"] {
  margin-bottom: 50px; /* Aggiunge spazio tra i due bottoni */
}

.group-name-label {
  font-size: 18px;  /* Dimensione del carattere */
  font-weight: bold;  /* Spessore del carattere */
  color: #146ac7;  /* Colore del testo */
  margin-bottom: 10px;  /* Spazio inferiore */
  display: block;  /* Display del blocco */
}

 
  </style>
  
