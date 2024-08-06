<template>

      <!-- Contenitore principale dell'applicazione -->
    <div id="app">
       <router-view />
    </div>
  </template>
  
  <script>
  export default {
      // Nome del componente principale
    name: 'App'
  };
  </script>
  
  <style>
  /* Stili globali dell'applicazione */
  /* Stile applicato al corpo della pagina */
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f0f0;
  }
  
  </style>
  
  
