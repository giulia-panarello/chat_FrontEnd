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
  
  </style>
  