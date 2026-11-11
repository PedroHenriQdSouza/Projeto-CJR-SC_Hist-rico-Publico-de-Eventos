<script setup lang="ts">
import { computed } from 'vue'
import { useCatalog } from '../stores/catalog'
import { cover, safeImage, safeLink } from '../services/content'
import type { Collection, RecordEntry } from '../types/content'
import Gallery from './Gallery.vue'
import ContentCard from './ContentCard.vue'
import BlockRenderer from './BlockRenderer.vue'
const props = defineProps<{ item: RecordEntry; section: Collection; preview?: boolean }>()
const catalog = useCatalog()
const relations = computed(() => {
  const { item, section, preview } = props
  const entries = (key: Collection) => preview ? catalog.data[key] : catalog.published(key)
  return [
    { key: 'temas', title: 'Temas relacionados', items: entries('temas').filter(row => row.id === item.themeId || (section === 'categorias' && row.categoryIds.includes(item.id))) },
    { key: 'edicoes', title: 'Edições relacionadas', items: entries('edicoes').filter(row => row.id === item.editionId || (section === 'temas' && row.themeId === item.id) || (section === 'categorias' && row.categoryIds.includes(item.id))) },
    { key: 'categorias', title: 'Categorias participantes', items: entries('categorias').filter(row => item.categoryIds.includes(row.id)) },
    { key: 'noticias', title: 'Notícias desta edição', items: section === 'edicoes' ? entries('noticias').filter(row => row.editionId === item.id) : [] },
  ]
})
const facts = computed(() => [
  ['Período', props.item.period], ['Local', props.item.place], ['Equipes', props.item.teams],
  ['Escolas', props.item.schools], ['Estudantes', props.item.students],
].filter(([, value]) => value !== null && value !== ''))
</script>

<template>
  <article class="entry-content">
    <header class="mb-4"><div class="card-meta mb-2"><span v-if="item.year">{{ item.year }}</span><time v-if="item.date" :datetime="item.date">{{ item.date.split('-').reverse().join('/') }}</time><span v-if="item.demo">Demonstração</span></div><h1>{{ item.title || 'Sem título' }}</h1><p v-if="item.subtitle" class="lead">{{ item.subtitle }}</p></header>
    <figure v-if="cover(item) && safeImage(cover(item)!.src)" class="entry-cover"><img :src="safeImage(cover(item)!.src)" :alt="cover(item)!.alt"><figcaption v-if="cover(item)!.caption">{{ cover(item)!.caption }}</figcaption></figure>
    <p v-if="item.description" class="lead preserved">{{ item.description }}</p>
    <dl v-if="facts.length" class="facts"><div v-for="[name, value] in facts" :key="name!"><dt>{{ name }}</dt><dd>{{ value }}</dd></div></dl>
    <section v-if="item.context"><h2>Contextualização</h2><p class="preserved">{{ item.context }}</p></section>
    <section v-if="item.objective"><h2>Objetivos</h2><p class="preserved">{{ item.objective }}</p></section>
    <section v-if="item.features"><h2>Características da competição</h2><p class="preserved">{{ item.features }}</p></section>
    <section v-if="item.results"><h2>Projetos e resultados</h2><p class="preserved">{{ item.results }}</p></section>
    <BlockRenderer :blocks="item.blocks" :images="item.images" />
    <Gallery v-if="section !== 'noticias' && item.images.length > 1" :images="item.images.filter(image => image.id !== cover(item)?.id)" mode="gallery" />
    <a v-if="safeLink(item.url)" class="btn button-dark my-3" :href="safeLink(item.url)">{{ section === 'editais' ? 'Abrir documento' : 'Acessar referência' }} <i class="bi bi-arrow-up-right"></i></a>
    <section v-for="group in relations.filter(group => group.items.length)" :key="group.key" class="related"><h2>{{ group.title }}</h2>
      <ul v-if="preview"><li v-for="related in group.items" :key="related.id">{{ related.title }}</li></ul>
      <div v-else class="card-grid"><ContentCard v-for="related in group.items" :key="related.id" :item="related" :section="group.key" /></div>
    </section>
    <section v-if="item.sources || item.credits" class="entry-sources"><h2>Fontes e créditos</h2><p v-if="item.sources" class="preserved">{{ item.sources }}</p><p v-if="item.credits" class="preserved">{{ item.credits }}</p></section>
  </article>
</template>
