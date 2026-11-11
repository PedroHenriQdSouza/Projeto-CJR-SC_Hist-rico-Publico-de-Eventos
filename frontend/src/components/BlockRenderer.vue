<script setup lang="ts">
import { computed } from 'vue'
import Gallery from './Gallery.vue'
import { safeLink } from '../services/content'
import type { Block, Media } from '../types/content'
const props = defineProps<{ blocks: Block[]; images: Media[] }>()
const sorted = computed(() => [...props.blocks].sort((a, b) => a.order - b.order))
</script>

<template>
  <div class="blocks">
    <template v-for="block in sorted" :key="block.id">
      <header v-if="block.type === 'heading' && (block.title || block.subtitle)"><h2 v-if="block.title">{{ block.title }}</h2><p v-if="block.subtitle">{{ block.subtitle }}</p></header>
      <component v-else-if="block.type === 'text' && block.lines.some(line => line.text)" :is="block.style === 'bullets' ? 'ul' : block.style === 'numbered' ? 'ol' : 'div'">
        <component v-for="line in block.lines.filter(line => line.text)" :key="line.id" :is="block.style === 'paragraph' ? 'p' : 'li'">
          <component :is="safeLink(line.href) ? 'a' : 'span'" :href="safeLink(line.href) || undefined" :class="{ 'fw-bold': line.bold, 'fst-italic': line.italic }">{{ line.text }}</component>
        </component>
      </component>
      <Gallery v-else-if="block.type === 'image' || block.type === 'pair' || block.type === 'grid' || block.type === 'gallery'" :mode="block.type" :images="block.fromGallery ? images : block.images.map(image => ({ ...image, src: image.src || images.find(item => item.id === image.id)?.src || '' }))" />
      <hr v-else-if="block.type === 'divider'">
      <p v-else-if="block.type === 'button' && safeLink(block.href) && block.title"><a class="btn button-dark" :href="safeLink(block.href)">{{ block.title }} <i class="bi bi-arrow-up-right"></i></a></p>
    </template>
  </div>
</template>
