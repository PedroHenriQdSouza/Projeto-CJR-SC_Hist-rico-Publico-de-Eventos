<script setup lang="ts">
import { computed } from 'vue'
import { useCatalog } from '../stores/catalog'
import EntryContent from '../components/EntryContent.vue'
import Missing from './Missing.vue'
import type { Collection } from '../types/content'
const props = defineProps<{ section: Collection; slug: string }>()
const catalog = useCatalog()
const item = computed(() => catalog.published(props.section).find(item => item.slug === props.slug))
</script>

<template>
  <div v-if="item" class="site-container section-space">
    <RouterLink class="back-link" :to="'/' + section"><i class="bi bi-arrow-left"></i> Voltar à lista</RouterLink>
    <EntryContent :item="item" :section="section" />
  </div>
  <Missing v-else />
</template>
