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
        <RouterLink to="/" class="back-link"> 
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
  
        <button @click="sendMessage">Invia</button>
        
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
        // Simulazione del numero di telefono, puoi sostituire con il valore reale dal backend
        const phoneNumber = '+1234567890';
        alert(`Phone number: ${phoneNumber}`);
      }
    
  
    },
  };
  
  </script>
  
  <style scoped>
  
  .chat-container {
    /* Fissa la posizione della chat */
    position: fixed;
    /* Sposta la chat sotto la barra "Scrivi un messaggio" */
    margin-top: 80px;
    /* Occupa l'intero spazio disponibile in larghezza */
    left: 0;
    right: 0;
    
    /* Fissa la chat in basso */
    bottom: 0;
    /* Imposta l'altezza massima della chat pari all'altezza della finestra */
    height: 100vh;
    /* Imposta un'immagine di sfondo per la chat */
    background-image: url('https://i.pinimg.com/originals/c4/23/12/c4231254ad6f3a92d902a8356212809c.jpg');
    /* Ridimensiona l'immagine di sfondo per coprire l'intera area */
    background-size: cover;
    /* Posiziona l'immagine di sfondo al centro */
    background-position: center;
    display: flex;
    flex-direction: column;
    
  }
  
  
  
  
  /* Stili per il titolo del gruppo */
  .text-titolo {
    /* Imposta lo stile del testo come corsivo */
    font-style: italic;
    /* Permette al titolo di espandersi per riempire lo spazio disponibile */
    flex-grow: 1;
    /* Imposta la larghezza massima del titolo al 100% */
    max-width: 100%;
    
  } 
  
  
  /* Stili per il l'intestazione del gruppo */
  .group-container {
    /* Imposta il display come flex per allineare gli elementi in riga */
    display: flex;
    /* Allinea verticalmente gli elementi al centro */
    align-items: center;
    /* Aggiunge padding intorno al contenitore */
    padding: 10px;
    /* Imposta il colore di sfondo del contenitore */
    background-color: #146ac7;
    /* Allinea il contenuto del contenitore all'inizio */
    justify-content: flex-start;
    /* Imposta il colore del testo su bianco */
    color: white;
  }
  
  .group-name {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
  }
  
  .group-container img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  /* Stili per l'intestazione della chat */
  .chat-header {
    /* Imposta il display come flex per allineare gli elementi in riga */
    display: flex;
    /* Allinea verticalmente gli elementi al centro */
    align-items: center;
    /* Distribuisci uniformemente lo spazio tra gli elementi */
    justify-content: space-between;
    /* Aggiunge margine sopra e sotto all'intestazione */
    margin: 20px auto;
    /* Aggiunge spazio intorno all'intestazione */
    padding: 10px;
    /* Imposta la larghezza massima dell'intestazione */
    max-width: 300px;
  }
  
  
  /* Stili per le immagini nell'intestazione della chat */
  .chat-header img {
    /* Rimpicciolisce l'immagine dell'icona */
    width: 80px;
    height: 80px;
    /* Arrotonda i bordi dell'icona */
    border-radius: 50%;
  }
  
  /* Stili per la visualizzazione dei messaggi */
  .chat-messages {
    /* Imposta l'altezza massima dei messaggi */
    max-height: 700px;
    /* Abilita lo scorrimento verticale quando i messaggi diventano più lunghi */
    overflow-y: auto;
    flex-grow: 1;
  
    
  }
  
  /* Stili per i messaggi */
  .message {
    /* Aggiunge margine inferiore ai messaggi per separarli */
    margin-bottom: 10px;
  }
  
  /* Stili per il mittente del messaggio */
  .sender {
    /* Imposta il testo in grassetto */
    font-weight: bold;
  }
  
  .message-sender {
    font-weight: bold;
  }
  
  
  /* Stili per il contenitore dell'input */
  .input-wrapper {
    /* Imposta il display come flex per allineare gli elementi in riga */
    display: flex;
    /* Allinea verticalmente gli elementi al centro */
    align-items: center;
    /* Imposta la posizione come relativa per consentire il posizionamento assoluto */
    position: relative;
  }
  
  /* Stili per l'input dell'utente */
  .input-wrapper input {
    /* Imposta il flessibile per occupare lo spazio rimanente */
    flex: 1;
  }
  
  
  /* Stili per l'icona nell'input */
  .input-wrapper i {
    /* Aggiunge margine a sinistra per separare l'icona dall'input */
    margin-left: 10px;
  }
  
  
  /* Stili per l'area di input della chat */
  .chat-input {
    position: fixed; /* Fissa la barra di input in basso rispetto alla finestra */
    bottom: 0; /* Posiziona la barra di input alla fine della finestra */
    left: 0;
    right: 0;
    background-color: white;
   
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100; /* Assicura che la barra di input sia sopra i messaggi */
  }
  
  
  
  /* Stili per l'input dell'utente */
  .chat-input input {
    /* Imposta la larghezza dell'input meno quella del pulsante Invia */
    width: calc(100% - 100px);
    /* Aggiunge padding all'input */
    padding: 10px;
    /* Imposta lo stile del bordo */
   
    border: 10px solid #146ac7;
    /* Arrotonda i bordi dell'input */
    border-radius: 5px;
  }
  
  /* Stili per il pulsante di invio */
  .chat-input button {
    /* Imposta la larghezza del pulsante */
    width: 100px;
    /* Aggiunge padding al pulsante */
    padding: 20px;
    /* Rimuove il margine sinistro per separare il pulsante dall'input */
    margin-left: 0;
    /* Rimuove lo stile del bordo */
    border: none;
    /* Arrotonda i bordi del pulsante */
    border-radius: 5px;
    /* Imposta il colore di sfondo del pulsante */
    background-color: #146ac7;
    /* Imposta il colore del testo su bianco */
    color: white;
    /* Cambia il cursore quando ci si passa sopra */
    cursor: pointer;
  }
  
  
  
  /* Stili per i messaggi inviati dall'utente */
  .sent-message {
    /* Imposta il display come flex per allineare gli elementi in riga */
    display: flex;
    /* Allinea gli elementi alla fine del contenitore */
    justify-content: flex-end;
  }
  
  /* Stili per i messaggi ricevuti */
  .received-message {
    /* Imposta il display come flex per allineare gli elementi in riga */
    display: flex;
  }
  
  /* Stili per il contenitore del messaggio */
  .message-content {
    /* Imposta la larghezza massima del contenitore del messaggio */
    max-width: 100%;
    /* Aggiunge margine intorno al contenitore del messaggio */
    margin: 10px;
    /* Imposta il padding del contenitore del messaggio */
    padding: 0px;
    /* Arrotonda i bordi del contenitore del messaggio */
    border-radius: 10px;
    /* Imposta il colore di sfondo del contenitore del messaggio */
    background-color: #f0f0f0;
    /* Aggiunge margine inferiore al contenitore del messaggio */
    margin-bottom: 10px;
    /* Imposta la posizione come relativa per consentire il posizionamento assoluto */
    position: relative;
  }
  
  /* Stili per le immagini all'interno dei messaggi */
  .message-content img {
    /* Imposta l'immagine come elemento block */
    display: block;
    /* Imposta la larghezza dell'immagine al 100% del contenitore */
    width: 100px;
    /* Imposta la larghezza massima dell'immagine */
    max-width: 100%;
    /* Arrotonda i bordi dell'immagine */
    border-radius: 5px;
    /* Cambia il cursore quando ci si passa sopra */
    cursor: pointer;
  }
  
  
  
  /* Stili per i messaggi inviati dall'utente */
  .sent-message .message-content {
    /* Imposta il colore di sfondo del contenitore del messaggio inviato */
    background-color: #DCF8C6;
    /* Imposta il colore del testo su bianco */
    color: rgb(0, 0, 0);
  }
  
  /* Stili per il testo dei messaggi */
  .text {
    /* Imposta la dimensione del testo */
    font-size: 16px;
  }
  
  /* Stili per il timestamp dei messaggi */
  .timestamp {
    /* Imposta la dimensione del testo */
    font-size: 12px;
    /* Imposta il colore del testo su grigio */
    color: #888;
  }
  
  /* Stili per l'icona dell'utente */
  .user-icon {
    /* Imposta la dimensione dell'icona */
    font-size: 50px;
    /* Imposta il colore dell'icona */
    color: #007bff;
    /* Imposta il colore di riempimento di sfondo dell'icona */
    background-color: #24517e;
    /* Imposta lo spessore e lo stile del bordo dell'icona */
    border: 2px solid #146ac7;
    /* Arrotonda i bordi dell'icona */
    border-radius: 50%;
    /* Aggiunge padding intorno all'icona */
    padding: 10px;
  }
  
  /* Stili per le opzioni aggiuntive */
  .additional-features {
    /* Imposta il colore di sfondo */
    background-color: #146ac7;
    /* Imposta il colore del testo su bianco */
    color: #fff;
    /* Imposta la larghezza dell'elemento */
    width: 30px;
    /* Imposta l'altezza dell'elemento */
    height: 56px;
    /* Aggiunge padding all'elemento */
    padding: 18px;
    padding-left: 20px;
    padding-right: 20px;
    
    /* Arrotonda i bordi dell'elemento */
    border-radius: 5px;
    /* Imposta il display come flex per allineare gli elementi in colonna */
    display: flex;
    /* Allinea gli elementi al centro orizzontalmente */
    justify-content: center;
    /* Allinea gli elementi al centro verticalmente */
    align-items: center;
    /* Cambia il cursore quando ci si passa sopra */
    cursor: pointer;
    /* Imposta la posizione come relativa per consentire il posizionamento assoluto */
    position: relative;
    /* Imposta lo z-index per sovrapporre l'icona "+" alla galleria */
    z-index: 1;
    /* Imposta la dimensione dell'icona */
    font-size: 15px;
  }
  
  
  
  /* Stili per le opzioni aggiuntive */
  .additional-options {
    /* Imposta la posizione come assoluta */
    position: absolute;
    /* Posiziona l'elemento sopra l'input */
    bottom: calc(100% + 10px);
    /* Allinea l'elemento alla sinistra */
    left: 0;
    /* Allinea l'elemento alla destra */
    right: 0;
    /* Imposta l'altezza dell'elemento */
    bottom: 60px;
    /* Imposta il colore di sfondo */
    background-color: #fff;
    /* Aggiunge una leggera ombra al bordo */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    /* Arrotonda i bordi dell'elemento */
    border-radius: 5px;
    /* Aggiunge padding all'elemento */
    padding: 10px;
    /* Imposta il display come flex per allineare gli elementi in colonna */
    display: flex;
    /* Imposta la direzione dei flex in colonna */
    flex-direction: column;
    z-index: 1;
  }
  
  /* Stili per le opzioni aggiuntive */
  .additional-options > div {
    /* Aggiunge padding all'elemento */
    padding: 10px;
    /* Cambia il cursore quando ci si passa sopra */
    cursor: pointer;
  }
  
  .additional-options > div:hover {
    background-color: #f0f0f0;
  }
  
  
  /* Stili per l'immagine espansa nel messaggio */
  .expanded-message-image {
    /* Imposta la larghezza massima dell'immagine */
    max-width: 100%;
    /* Imposta l'altezza massima dell'immagine */
    max-height: 100%;
    /* Cambia il cursore quando ci si passa sopra */
    cursor: pointer;
  }
  
  /* Stili per l'overlay dell'immagine espansa */
  .overlay {
    /* Imposta la posizione come fissa */
    position: fixed;
    /* Posiziona l'elemento in cima a tutti gli altri elementi */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* Aggiunge un colore di sfondo semi-trasparente */
    background-color: rgba(0, 0, 0, 0.7);
    /* Imposta il display come flex per allineare gli elementi al centro */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  
  /* Stili per l'immagine all'interno dell'overlay */
  .overlay img {
    /* Imposta la larghezza massima dell'immagine */
    max-width: 90%;
    /* Imposta l'altezza massima dell'immagine */
    max-height: 90vh;
  }
  
  /* Stili per il contenitore della data */
  .message-date-container {
    position: fixed; /* Fissa la posizione del contenitore della data */
    bottom: 380px; /* Distanza dal bordo inferiore della finestra */
    left: 50%; /* Allinea il contenitore della data a metà della larghezza della finestra */
    transform: translateX(-50%); /* Centra il contenitore rispetto alla larghezza della finestra */
    z-index: 1000; /* Imposta un valore alto per lo z-index per assicurarsi che sia sopra altri elementi */
    padding: 10px 20px; /* Spaziatura interna del contenitore della data */
    border-radius: 8px; /* Bordi arrotondati */
  }
  
  /* Stili per la visualizzazione della data nell'intestazione */
  .message-date-header {
   
    /* Imposta uno sfondo bianco per la data */
    background-color: rgb(255, 255, 255);
    /* Aggiunge ombra al bordo */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* Imposta il padding */
    padding: 8px 20px;
    /* Imposta la dimensione del testo */
    font-size: 16px;
    /* Imposta il colore del testo su grigio */
    color: #146ac7;
    /* Arrotonda i bordi */
    border-radius: 20px;
    /* Aggiunge margine sopra per separare la data dal resto dell'intestazione */
    margin-top: -130px;
   
  }
  .phone-icon-container {
    position: absolute;
    top: 15%;
    right: 35px; /* Distanza dal margine destro */
    font-size: 24px; /* Dimensione dell'icona */
  }
  
    
  .back-link {
  position: fixed; /* Posiziona l'elemento in modo fisso rispetto alla finestra del browser */
  left: 10px; /* Distanza dal margine sinistro della pagina */
  top: 9%; /* Posiziona l'icona verticalmente al centro */
  z-index: 1000; /* Assicura che l'icona sia sopra gli altri contenuti, se necessario */
  font-size: 24px; /* Dimensione dell'icona */
  color: #ffffff; /* Colore dell'icona */
  }
  
  
  </style>
