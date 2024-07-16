<template>
    <div id="app">
       <router-view />
    </div>
  </template>
  
  <script>
  export default {
    name: 'App',
    methods: {
      goToChat() {
        this.$router.push({ name: 'chat-gruppo' });
      },
    },
  };
  </script>
  
  <style>
  /* Stili globali dell'applicazione */
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f0f0;
  }
  
  </style>
  
