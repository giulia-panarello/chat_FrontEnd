<template>
 
  <!-- Input per selezionare un file immagine -->
  <input ref="fileInput" type="file" accept="image/*" capture="camera" style="display: none;" @change="handleFileInputChange">
 
  <!-- Contenitore principale della chat -->
  <div class="chat-container">
  
    <!-- Intestazione del gruppo di chat -->
    <div class="group-container">
      <div class="chat-header">

        <!-- Icona del gruppo -->
        <img class="utente-icon" src="https://cdn.icon-icons.com/icons2/2760/PNG/512/profile_icon_176363.png" alt="utente-icon">
       <!-- Titolo del gruppo -->
       <nav>        
      <RouterLink to="/lista-partecipanti" class="back-link"> 
        <font-awesome-icon icon="arrow-left" class="icon" />
      </RouterLink>
     </nav>
      <h1 class="text-titolo">{Utente}</h1>
      <div class="phone-icon-container">
          <font-awesome-icon icon="phone" @click="showPhoneNumber" style="cursor: pointer;" />
        </div>
      </div>
    </div>

      
    
     <!-- Contenitore della data -->
      <div class="message-date-container">
        <div class="message-date-header">{{ formatDate(messages[messages.length - 1].timestamp) }}</div>
      </div>

  
    <!-- Contenitore dei messaggi di chat -->
    <div class="chat-messages">

   
    <!-- Iterazione attraverso i messaggi -->
      <div v-for="(message, index) in messages" :key="index" :class="{'sent-message': message.sender === 'Tu', 'received-message': message.sender !== 'Tu'}">
      <!-- Icona del mittente -->
        


      <!-- Contenuto del messaggio -->
      <div class="message-content">
        <!-- Se il messaggio è un'immagine, mostra l'anteprima -->
        <img v-if="message.type === 'image' && !message.isExpanded" :src="message.text" class="message-image" @click="handleMessageClick(message)" />
        <!-- Se il messaggio è un'immagine espansa, mostra l'immagine ingrandita -->
        <img v-if="message.type === 'image' && message.isExpanded" :src="message.text" class="expanded-message-image" @click="handleMessageClick(message)" />
    
      
         <!-- Se il messaggio è di testo, mostra il testo e l'orario -->
        <div v-if="message.type === 'text'" class="message-content">
          <div class="text">{{ message.text }}</div>
          <div class="timestamp">{{ formatTime(new Date(message.timestamp)) }}</div>
        </div>
      </div>

      <!-- Overlay per visualizzare l'immagine ingrandita -->
      <div v-if="message.type === 'image' && message.isExpanded" class="overlay" @click="handleMessageClick(message)">
        <img :src="message.text" class="expanded-image" />
      </div>
    </div>
  </div>

  
  <!-- Barra di input per inviare messaggi -->
  <div class="chat-input">
      <!-- Icona per aprire le opzioni aggiuntive -->
      <div class="additional-features" @click="toggleAdditionalOptions">
        <i class="fas fa-plus"></i>
      </div>
      <!-- Opzioni aggiuntive -->
      <div v-if="showAdditionalOptions" class="additional-options">
        <div @click="openImageGallery">
          <i class="fas fa-images"></i> Galleria
        </div>
      </div>
      <!-- Barra di input per scrivere un nuovo messaggio -->
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Scrivi un messaggio...">

      <button class="invia" @click="sendMessage">Invia</button>
      
      </div>
  </div>

</template>


<script>



  export default {

  // Definizione dei dati della componente
    data() {
      return {
        
        userName: '', // Nome dell'utente da recuperare dal backend
        // Array di messaggi iniziali
        messages: [
        { sender: 'Tu', text: 'Ciao!', timestamp: this.getCurrentTime(), type: 'text' }
      ],
        // Nuovo messaggio inserito dall'utente
        newMessage: '',
        // Flag per mostrare o nascondere le opzioni aggiuntive
        showAdditionalOptions: false,
        // Data predefinita per i messaggi
        date: '2024-05-16' // Aggiungi il campo data al messaggio
        
      };
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
    const date = new Date(timestamp); // Crea un oggetto Date dal timestamp
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options); // Formatta la data come desiderato
  },

 
  // Metodo per inviare un nuovo messaggio di testo
      sendMessage() {
        if (this.newMessage.trim() !== '') {
          const timestamp = this.getCurrentTime(); // Ottieni l'orario corrente
          this.messages.push({
            sender: 'Tu',
            text: this.newMessage.trim(),
            timestamp: timestamp,
            type: 'text'
          });
        this.newMessage = '';
      }
    },

    

      // Metodo per gestire il cambio di un file immagine
      handleFileInputChange(event) {
      const file = event.target.files[0];
      if (file) {
        console.log('Immagine selezionata:', file);

        // Leggi il file come URL dati
        const reader = new FileReader();
        reader.onload = () => {
          // Aggiungi un nuovo messaggio con l'immagine
          this.messages.push({
            sender: 'Tu',
            text: reader.result, // Usa il risultato del caricamento del file come testo
            timestamp: this.getCurrentTime(),
            type: 'image'
          });
        };
        reader.readAsDataURL(file);
      }
    }, 


      // Metodo per gestire il clic su un messaggio
      handleMessageClick(message) {
        if (message.type === 'image') {
          // Se il messaggio è un'immagine e non è già espansa, espandilo
          if (!message.isExpanded) {
            message.isExpanded = true;
          } else {
            // Se il messaggio è già espanso, riducilo
            message.isExpanded = false;
          }
        }
      },

      // Metodo per attivare o disattivare le opzioni aggiuntive
      toggleAdditionalOptions() {
      this.showAdditionalOptions = !this.showAdditionalOptions;
      },

      openImageGallery() {
      this.$refs.fileInput.click();
    },

    showPhoneNumber() {
      // Metodo per mostrare il numero di telefono
      const phoneNumber = '+1234567890';
      alert(`Phone number: ${phoneNumber}`);
    }
  

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
 

 
 /* Stili per il titolo del gruppo */
 .titolo {
 
   max-width: 100%;
   color: #fff;
   font-size: 30px;
   font-weight: bold;
   
 } 
 
 
 /* Stili per il contenitore dell'intestazione contenente il titolo e l'icona */
 .group-container {
   
   display: flex;
   align-items: center;
   padding: 10px;
   background-color: #146ac7;
   justify-content: flex-start;
   color: white;
 }
 

 
 /* Stile dell'icona del gruppo */
 .utente-icon {
   width: 80px;
   height: 80px;
   border-radius: 50%;
   margin-right: 10px;
 }
 
  
 /* Stili per l'intestazione della chat */
 .chat-header {
   
   display: flex;
   align-items: center;
   justify-content: space-between;
   margin: 20px auto;
   max-width: 300px;
 }
 
 /* Stili per la visualizzazione dei messaggi nel contenitore della chat */
 .chat-messages {
   max-height: 700px;
   overflow-y: auto;
   flex-grow: 1;
 
 }
 
 /* Stili per i messaggi */
 .message {
   margin-bottom: 10px;
 }
 
 /* Stili per il mittente del messaggio */
 .sender {
  font-weight: bold;
  color: #0b4c92;
 }
 
 
 /* Stili per l'area di input della chat */
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
 
   /* Stili per la barra di input per scrivere un messaggio */
   .chat-input input {
  
   width: 100%;
   padding: 10px;
   border-radius: 5px;
 }
 
 
 /* Stili per il pulsante di invio */
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
 
 
 /* Stili per i messaggi inviati dall'utente */
 .sent-message {
   
   display: flex;
   justify-content: flex-end;
 }
 
  
 /* Stili per il contenitore con messaggi inviati dall'utente */
 .sent-message .message-content {
  
  background-color: #c3fd99;
   max-width: 100%;
   margin: 10px;
   padding: 0px;
   border-radius: 10px;
   margin-bottom: 10px;
   position: relative;
  
}

 /* Stili per i messaggi ricevuti */
 .received-message {
   display: flex;
   
 }
 
 /* Stili per il contenitore dei messaggi ricevuti */
 .received-message .message-content {
   
   max-width: 100%;
   margin: 10px;
   padding: 0px;
   border-radius: 10px;
   background-color: #f8b17e;
   margin-bottom: 10px;
   position: relative;
   
 }
 
 /* Stili per le immagini all'interno dei messaggi, qunado mando delle immagini da galleria */
 .message-content img {
   
   display: block;
   width: 100px;
   max-width: 100%;
   border-radius: 5px;
   cursor: pointer;
 }
 
 

 /* Stili per il testo dei messaggi */
 .text {
   font-size: 16px;
 }
 
 /* Stili per l'orario in cui vengono mandati i messaggi */
 .timestamp {
  
   font-size: 12px;
   color: #3c3c3c;
 }
 
 /* Stili per l'icona dell'utente */
 .user-icon {
  
   font-size: 20px;
   color: #0e56a3;
   padding: 10px;
 }
 
 /* Stili per il pulsante delle opzioni aggiungive '+' */
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
 
 
 
 /* Stili per l'opzione aggiuntiva "Galleria" */
 .additional-options {
  
   position: absolute;
   bottom: calc(100% + 10px);
   left: 10px;
   bottom: 60px;
   background-color: #c0e1f5;
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
 
 
 
 /* Stile per l'immagine espansa nel messaggio */
 .expanded-message-image {
  
   max-width: 100%;
   max-height: 100%;
   cursor: pointer;
 }
 
 /* Stile per l'overlay dell'immagine espansa */
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
 
 
 /* Stile per l'immagine all'interno dell'overlay */
 .overlay img {
   max-width: 90%;
   max-height: 90vh;
 }
 
 /* Stile per il contenitore della data */
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
 
 /* Stile per la visualizzazione della data nell'intestazione */
 .message-date-header {
  
   background-color: rgb(255, 255, 255);
   border: 2px solid #0e56a3;
   padding: 8px 20px;
   font-size: 16px;
   color: #0e56a3;
   border-radius: 20px;
   margin-top: -160px;
  
 }
 
 /* Stile per l'icona che visualizza il numero di cellulare dell'utente */
.phone-icon-container {
  position: absolute;
  top: 10%;
  right: 35px;
  font-size: 24px; 
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
