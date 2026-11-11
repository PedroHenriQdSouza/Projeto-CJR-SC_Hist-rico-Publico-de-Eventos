<script setup lang="ts">
import { computed } from 'vue'
import { useCatalog } from '../stores/catalog'
import { demoNoticeId } from '../services/seed'
import ContentCard from '../components/ContentCard.vue'

const catalog = useCatalog()
const example = computed(() => catalog.published('editais').find(item => item.id === demoNoticeId && item.demo))
</script>

<template>
  <header class="page-heading"><div class="site-container"><RouterLink to="/">Home</RouterLink><h1>Faça Parte</h1><p>Orientações para escolas, estudantes e organizações interessadas no CJR.</p></div></header>
  <section class="site-container section-space prose">
    <h2>Escolas e estudantes</h2><p>Acompanhe os editais de cada edição para consultar critérios, calendário e orientações de inscrição. Consulte sua escola para saber como organizar uma equipe.</p>
    <RouterLink class="btn button-dark mb-5" to="/editais">Consultar editais <i class="bi bi-arrow-right"></i></RouterLink>
    <h2>Organizações parceiras</h2><p>Para informações sobre apoio e parcerias, consulte os canais divulgados nos documentos da edição.</p>
    <section v-if="example" class="mt-5">
      <h2>Exemplo de inscrição</h2>
      <ContentCard :item="example" section="editais" />
    </section>
  </section>
</template>
