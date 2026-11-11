<script setup lang="ts">
import { computed } from 'vue'
import { useCatalog } from '../stores/catalog'
import { statuses } from '../types/content'
const catalog = useCatalog()
const publications = computed(() => [
  ...catalog.data.noticias.map(item => ({ item, key: 'noticias' })),
  ...catalog.data.temas.map(item => ({ item, key: 'temas' })),
].sort((a, b) => b.item.updatedAt.localeCompare(a.item.updatedAt)))
const stats = computed(() => [
  ['Edições', catalog.data.edicoes.length], ['Temas', catalog.data.temas.length], ['Notícias', catalog.data.noticias.length],
  ['Categorias', catalog.data.categorias.length], ['Publicações pendentes', publications.value.filter(({ item }) => item.status === 'pending').length],
])
</script>

<template>
  <header class="admin-heading"><div><h1>Dashboard</h1><p>Visão geral do conteúdo deste navegador.</p></div><RouterLink class="btn button-dark" to="/admin/nova-publicacao"><i class="bi bi-plus-lg"></i> Nova Publicação</RouterLink></header>
  <div class="stat-grid"><article v-for="[label, count] in stats" :key="label"><strong>{{ count }}</strong><span>{{ label }}</span></article></div>
  <section class="admin-panel mt-4"><h2>Últimas publicações</h2><p v-if="!publications.length">Nenhuma publicação cadastrada.</p>
    <ul v-else class="admin-records"><li v-for="{ item, key } in publications.slice(0, 6)" :key="item.id"><RouterLink :to="'/admin/' + key + '/' + item.id">{{ item.title }}</RouterLink><span class="status" :data-status="item.status">{{ statuses[item.status] }}</span></li></ul>
  </section>
</template>
