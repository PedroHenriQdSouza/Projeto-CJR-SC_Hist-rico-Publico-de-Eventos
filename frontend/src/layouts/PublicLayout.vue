<script setup lang="ts">
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
</script>
<template>
  <a class="skip-link" href="#main">Pular para o conteúdo</a><Navbar />
  <main id="main" tabindex="-1"><RouterView /></main><Footer />
</template>
