<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ContentCard from '../components/ContentCard.vue'
import { useCatalog } from '../stores/catalog'
import type { Collection } from '../types/content'
const props = defineProps<{ section: Collection }>()
const catalog = useCatalog()
const filter = ref('')
watch(() => props.section, () => { filter.value = '' })
const titles: Partial<Record<Collection, string>> = { edicoes: 'Edições', temas: 'Temas', categorias: 'Categorias', noticias: 'Notícias', editais: 'Editais' }
const entries = computed(() => catalog.published(props.section).sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.date || b.updatedAt).localeCompare(a.date || a.updatedAt)))
const years = computed(() => [...new Set(entries.value.map(item => item.year).filter(Boolean))])
const filtered = computed(() => entries.value.filter(item => !filter.value || String(item.year) === filter.value))
</script>

<template>
  <header class="page-heading"><div class="site-container"><RouterLink to="/">Home</RouterLink><h1>{{ titles[section] }}</h1></div></header>
  <section class="site-container section-space">
    <label v-if="section === 'editais' && years.length" class="filter">Ano<select v-model="filter" class="form-select"><option value="">Todos os anos</option><option v-for="year in years" :key="year!" :value="String(year)">{{ year }}</option></select></label>
    <div v-if="filtered.length" class="card-grid"><ContentCard v-for="item in filtered" :key="item.id" :item="item" :section="section" /></div>
    <p v-else>Ainda não há registros publicados para esta consulta.</p>
  </section>
</template>
