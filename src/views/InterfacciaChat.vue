
<template>

    <!-- Input per selezionare un file immagine -->
    <input ref="fileInput" type="file" accept="image/*" capture="camera" style="display: none;" @change="handleFileInputChange">
    <!-- Contenitore principale della chat: contiene l'intera chat, strutturata in diverse sezioni: intestazione, messaggi e input.-->
    <div class="chat-container">
  
      <!-- Intestazione del gruppo di chat -->
      <div class="group-container">
        <!-- La chat header include un'icona del gruppo (o dell'utente nel caso di chat private) e un titolo che mostra il nome del gruppo o il nome del contatto. v-if viene usato per visualizzare l'elemento corretto a seconda del tipo di chat (group o private).-->
        <div class="chat-header">
  
          <!-- Icona del gruppo -->
          <img class="group-icon" src="https://img.icons8.com/?size=200&id=Xvo1JQO2ujpL&format=png" alt=group-icon v-if="this.chat.type === 'group'">
          <img class="group-icon" src="https://img.icons8.com/?size=200&id=VzoCadwFiwaQ&format=png" alt=group-icon v-if="this.chat.type === 'private'">
         <!-- Titolo del gruppo -->
          <nav>
            <RouterLink to="/" class="back-link">
              <font-awesome-icon icon="arrow-left" class="icon" />
            </RouterLink>
          </nav>
            <button @click="goToChatInfo" v-if="this.chat.type === 'group'"><h1 class="titolo" >{{ this.chat.name }}</h1></button>
            <button @click="goToChatInfo" v-if="this.chat.type === 'private'"><h1 class="titolo" >{{ this.otherUser.name }} {{ this.otherUser.surname }}</h1></button>
       
        </div>
      </div>
  
      
       <!-- Contenitore della data -->
        <div class="message-date-container" v-if="this.chat.messages.length > 0">
          <div class="message-date-header">{{ formatDate(this.chat.messages[this.chat.messages.length - 1].timestamp) || null }}</div>
        </div>
  
    
      <!-- Contenitore dei messaggi di chat: Qui viene gestito il rendering dei messaggi. v-for itera attraverso l'array this.chat.messages, e in base al mittente (selfuser o un altro), il messaggio viene visualizzato con una classe CSS diversa -->
      <div class="chat-messages">
     
        <div v-for="message in this.chat.messages" :class="{'sent-message': message.sender === 'selfuser', 'received-message': message.sender !== 'selfuser'}">
        <!-- Icona del mittente -->
          <div class="user-icon">
            <i class="fas fa-user-circle user icon"></i>
          </div>
  
          <!-- Nome del mittente -->
          <div class="sender">{{ (this.chat.members.find(member => member.username === message.sender) || {}).name || 'Unknown' }}</div>
  
          <!-- Contenuto del messaggio -->
          <div class="message-content">
      
           <!-- Se il messaggio è di testo, mostra il testo e l'orario -->
            <div v-if="message.type === 'text'" class="message-content">
              <div class="text">{{ message.text }}</div>
            <div class="timestamp">{{ formatTime(new Date(message.timestamp)) }}</div>

          </div>

        </div>
  
  
      </div>
    </div>
  
    
    <!--Questa sezione include un campo di input per scrivere nuovi messaggi e un pulsante per inviarli. -->
    <div class="chat-input">
      
        <!-- Barra di input per scrivere un nuovo messaggio -->
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Scrivi un messaggio...">
        <button class="invia" @click="sendMessage">Invia</button>
        
        </div>
    </div>
  
  </template>
  
  
  <script>
  
  import axios from 'axios';

  export default {
  
    // Definizione dei dati della componente
    data() {
      return {
        // tutte le info riguardo la chat
        chat: {
          name: this.$route.params.chatName, // prende il nome della chat dalla lista chat
          creationDate: '',
          messages: [],
          members: [],
          type: ''
        },

        showAdditionalOptions: false,
        newMessage: '',

        selfUser: '',
        otherUser: '',
      };
    },

    // Questo metodo viene eseguito quando la componente è creata e richiama fetchChatData per ottenere i dati della chat dal backend
      created() {
      this.fetchChatData();
    },


    // Definizione dei metodi della componente
    methods: {
  
      // Metodo per ottenere l'ora corrente
      getCurrentTime() {
       return new Date();
      },
  
      // Metodo per ottenere la data corrente formattata
      getCurrentDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return now.toLocaleDateString(undefined, options); // Restituisci la data formattata
      },
  
      // Formato dell'orario
      formatTime(timestamp) {
            const date = new Date(timestamp);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
      },
  
      // Metodo per ottenere la data formattata da un timestamp
      formatDate(timestamp) {
        let date;
        let options;
        if (timestamp === null) {
          date = new Date();
          options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        } else {
          date = new Date(timestamp); // Crea un oggetto Date dal timestamp
          options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        }
        
        return date.toLocaleDateString(undefined, options); // Formatta la data come desiderato
      },
  
   
      // Questo metodo invia un nuovo messaggio di testo al server, lo aggiunge all'array dei messaggi della chat, e svuota il campo di input.
        async sendMessage() {
        if (this.newMessage.trim() !== '') {
          const timestamp = this.getCurrentTime();
          const message = {
            type: 'text', // Assuming all messages are text for now
            content: this.newMessage.trim(),
            sender: 'selfuser',
            timestamp: timestamp,
            isExpanded: false // Add this property for image expansion
          };

          try {
            this.chat.messages.push(message);
            await axios.post(`http://localhost:8080/api/chats/${this.chat.name}/new-message`, message);
          } catch (error) {
            console.error('Errore durante l\'invio del messaggio:', error);
          }

          this.newMessage = '';
        }
      },
  
      
      // Metodo per nascondere o mostrare il contenitore della data
      hideDateContainer(hide) {
        const dateContainer = document.querySelector('.message-date-container');
        if (dateContainer) {
          if (hide) {
            dateContainer.classList.add('hide-date-container');
          } else {
            dateContainer.classList.remove('hide-date-container');
          }
        }
      },


      // Metodo per attivare o disattivare le opzioni aggiuntive
      toggleAdditionalOptions() {
        this.showAdditionalOptions = !this.showAdditionalOptions;
      },
  


      // Recupera le info della chat dal BE  
      async fetchChatData() {
        try {
          const response = await axios.get(`http://localhost:8080/api/chats/${this.chat.name}`);
          this.chat.type = response.data.type;
          this.chat.creationDate = response.data.creationDate;
          console.log("Members:", response.data.members)
          this.chat.members = response.data.members;

          if (this.chat.members.length === 2){
            this.selfUser = this.chat.members.find(member => member.username === 'selfuser');
            this.otherUser = this.chat.members.find(member => member.username !== 'selfuser');
          }

          if(response.data.messages !== undefined) {
            console.log('Messages:', response.data.messages); // Add this line
            response.data.messages.forEach(message => {
              this.chat.messages.push({
                type: 'text',
                text: message.content,
                sender: message.sender,
                timestamp: message.timestamp,
                
              });
            });
          } else {
            this.chat.messages = [];
          }
        } catch (error) {
          console.error('Errore durante il recupero delle informazioni:', error);
        }
      },

      // naviga fino alla pagina della lista partecipanti
      async goToChatInfo(){
        /*
            chiamo un metodo che permette di passare all'altra pagina informazioni già in tuo possesso in questa
            in questo modo non devi fare due chiamate al BE!
        */
        try{
            this.$router.push({ name: 'chat-info', params: { chatName: this.chat.name }});
        } catch(error){
            console.error("Errore durante l'apertura della lista partecipanti:", error);
        }
    },
},
        
  };
  
  </script>
  
  <style scoped>
  
  /* Modifiche di stile del contenitore principale della chat */
  .chat-container {
   
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
  

  
  /* Stile per il titolo del gruppo */
  .titolo {
  
    max-width: 100%;
    color: #146ac7;
    font-size: 30px;
    font-weight: bold;
    
  } 
  
  
  /* Stile per il contenitore dell'intestazione contenente il titolo e l'icona */
  .group-container {
    
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #146ac7;
    justify-content: flex-start;
    color: white;
  }
  

  
  /* Stile dell'icona del gruppo */
  .group-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
   
  /* Stile per l'intestazione della chat */
  .chat-header {
    
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px auto;
    max-width: 300px;
  }
  
  /* Stile per la visualizzazione dei messaggi nel contenitore della chat */
  .chat-messages {
    max-height: 700px;
    overflow-y: auto;
    flex-grow: 1;
  
  }
  
  /* Stile per i messaggi */
  .message {
    margin-bottom: 10px;
  }
  
  /* Stile per il mittente del messaggio */
  .sender {
   font-weight: bold;
   color: #0b4c92;
  }
  
  
  /* Stile per l'area di input della chat contenente la barra per scrivere un messaggio, il pulsante di invio e delle opzioni aggiuntive */
  .chat-input {
    position: fixed; 
    bottom: 0; 
    left: 0;
    right: 0;
    background-color: #146ac7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100; 
  }
  
    /* Stile per la barra di input per scrivere un messaggio */
    .chat-input input {
   
    width: 100%;
    padding: 10px;
    border-radius: 5px;
  }
  
  
  /* Stile per il pulsante di invio */
  .invia {
   
    width: 100px;
    padding: 20px;
    margin-left: 0;
    border: none;
    border-radius: 5px;
    background-color: #146ac7;
    color: white;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
  }
  
  
  /* Stile per i messaggi inviati dall'utente */
  .sent-message {
    
    display: flex;
    justify-content: flex-end;
  }
  
   
  /* Stile per il contenitore con messaggi inviati dall'utente */
  .sent-message .message-content {
   
   background-color: #c3fd99;
    max-width: 100%;
    margin: 10px;
    padding: 0px;
    border-radius: 10px;
    margin-bottom: 10px;
    position: relative;
   
 }

  /* Stile per i messaggi ricevuti */
  .received-message {
    display: flex;
    
  }
  
  /* Stile per il contenitore dei messaggi ricevuti */
  .received-message .message-content {
    
    max-width: 100%;
    margin: 10px;
    padding: 0px;
    border-radius: 10px;
    background-color: #efb5f1;
    margin-bottom: 10px;
    position: relative;
    
  }
  
  /* Stile per le immagini all'interno dei messaggi, qunado mando delle immagini da galleria */
  .message-content img {
    
    display: block;
    width: 100px;
    max-width: 100%;
    border-radius: 5px;
    cursor: pointer;
  }
  
  
 
  /* Stile per il testo dei messaggi */
  .text {
    font-size: 16px;
  }
  
  /* Stile per l'orario in cui vengono mandati i messaggi */
  .timestamp {
   
    font-size: 12px;
    color: #3c3c3c;
  }
  
  /* Stile per l'icona dell'utente */
  .user-icon {
   
    font-size: 20px;
    color: #0e56a3;
    padding: 10px;
  }
  
  /* Stile per il pulsante delle opzioni aggiungive '+' */
  .additional-features {
    
    background-color: #146ac7;
    color: #fff;
    width: 30px;
    height: 56px;
    padding: 18px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    z-index: 1;
    font-size: 20px;
    
  }
  
  
  
  /* Stile per l'opzione aggiuntiva "Galleria" */
  .additional-options {
   
    position: absolute;
    bottom: calc(100% + 10px);
    left: 10px;
    bottom: 60px;
    background-color: #ffffff;
    color: #0e4c8e;
    font-size: 20px;
    border: 3px solid #0e4c8e;
    border-radius: 5px;
    padding: 10px;
    padding-left: 45px;
    padding-right: 120px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    z-index: 1;
  
  }
  
  
  
  /* Stile per l'immagine espansa nel messaggio quando mando un'immagine */
  .expanded-message-image {
   
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
  }
  
  /* Stili per l'overlay dell'immagine espansa, ovvero lo sfondo trasparente sotto l'immagine espansa quando la clicco dal messaggio per ingrandirla  */
  .overlay {
    
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  
  /* Stili per l'immagine all'interno dell'overlay (quando clicco l'immagine e si espande nello schermo) */
  .overlay img {
    max-width: 90%;
    max-height: 90vh;
  }
  
  /* Stili per il contenitore della data */
  .message-date-container {
    position: fixed; 
    bottom: 380px; 
    left: 50%; 
    transform: translateX(-50%); 
    z-index: 1000;
    padding: 10px 20px; 
    border-radius: 8px; 
    top: 43%;
  }
  
  /* Stili per la visualizzazione della data nell'intestazione */
  .message-date-header {
   
    background-color: rgb(255, 255, 255);
    border: 2px solid #0e56a3;
    padding: 8px 20px;
    font-size: 16px;
    color: #0e56a3;
    border-radius: 20px;
    margin-top: -130px;
   
  }
  
  /* Nascondi il contenitore della data quando apro un'immagine*/
.hide-date-container {
  display: none;
}

/* Stile per l'icona con la freccia che porta alla pagina precedente */
.back-link {
position: fixed; 
left: 10px; 
top: 9%; 
z-index: 1000; 
font-size: 24px; 
color: #ffffff; 
}

</style>














