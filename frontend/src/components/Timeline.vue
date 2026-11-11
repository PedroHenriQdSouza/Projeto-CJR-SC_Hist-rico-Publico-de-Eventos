<script setup lang="ts">
import { computed } from 'vue'
import { useCatalog } from '../stores/catalog'
import { cover, safeImage } from '../services/content'
import type { RecordEntry } from '../types/content'

const catalog = useCatalog()
const editions = computed(() => catalog.published('edicoes'))
const themes = computed(() => catalog.published('temas'))
const icons: Record<number, string> = { 2017: 'cpu', 2018: 'trophy', 2022: 'lightning-charge', 2023: 'recycle', 2024: 'phone', 2025: 'house-gear', 2026: 'globe-americas' }
const events = computed(() => [
  ...editions.value.map(item => ({ item, edition: item })),
  ...catalog.published('marcos_historicos').map(item => ({ item, edition: editions.value.find(edition => edition.id === item.editionId) })),
].sort((a, b) => (a.item.year ?? 9999) - (b.item.year ?? 9999)).map(event => ({
  ...event, media: cover(event.item), theme: event.edition?.id === event.item.id ? themes.value.find(theme => theme.id === event.edition?.themeId) : undefined,
})))

function period(item: RecordEntry) {
  return /^\d{4}[–-]\d{4}$/.test(item.period) ? item.period : item.year ?? item.period
}
</script>

<template>
  <p v-if="!events.length">A linha do tempo ainda está em preparação.</p>
  <ol v-else class="history-route">
    <li v-for="{ item, edition, media, theme } in events" :key="item.id" class="history-stop">
      <svg class="history-connector" viewBox="0 0 440 240" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 0 0 C 0 85 440 155 440 240" vector-effect="non-scaling-stroke" />
      </svg>
      <div class="history-visual">
        <span class="history-spark" aria-hidden="true">✦</span>
        <span class="history-medallion" :class="{ 'history-poster': media?.id === 'planeta-em-alerta' }">
          <img v-if="media && safeImage(media.src)" :src="safeImage(media.src)" :alt="media.alt" loading="lazy">
          <i v-else :class="'bi bi-' + (icons[item.year ?? 0] || 'robot')" aria-hidden="true"></i>
        </span>
      </div>
      <article class="history-stop-copy">
        <p class="history-year">{{ period(item) }}</p>
        <span v-if="item.demo" class="card-meta">Demonstração</span>
        <h3>{{ item.title }}</h3>
        <p v-if="theme" class="history-theme">{{ theme.title }}</p>
        <p>{{ item.description }}</p>
        <RouterLink v-if="edition" :to="'/edicoes/' + edition.slug">{{ edition.id === item.id ? 'Ver edição' : 'Ver edição relacionada' }} <i class="bi bi-arrow-right" aria-hidden="true"></i></RouterLink>
        <details v-else-if="item.sources"><summary>Fonte do marco</summary><p>{{ item.sources }}</p></details>
      </article>
    </li>
  </ol>
</template>
