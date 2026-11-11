<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { safeImage } from '../services/content'
import type { Media } from '../types/content'
const props = defineProps<{ images: Media[]; mode: 'image' | 'pair' | 'grid' | 'gallery' }>()
const slides = computed(() => props.images.filter(item => safeImage(item.src)))
const index = ref(0)
watch(() => slides.value.length, length => { if (index.value >= length) index.value = 0 })
function move(step: number) {
  index.value = (index.value + step + slides.value.length) % slides.value.length
}
</script>

<template>
  <section v-if="mode === 'gallery' && slides.length" class="media-gallery" aria-label="Carrossel de imagens">
    <figure v-if="slides[index]" :key="slides[index].id">
      <img :src="safeImage(slides[index].src)" :alt="slides[index].alt" loading="lazy"><figcaption v-if="slides[index].caption">{{ slides[index].caption }}</figcaption>
    </figure>
    <div v-if="slides.length > 1" class="gallery-controls">
      <button class="btn button-light" type="button" aria-label="Imagem anterior" @click="move(-1)"><i class="bi bi-chevron-left"></i></button>
      <span aria-live="polite">{{ index + 1 }} / {{ slides.length }}</span>
      <button class="btn button-light" type="button" aria-label="Próxima imagem" @click="move(1)"><i class="bi bi-chevron-right"></i></button>
    </div>
  </section>
  <div v-else :class="'media-' + mode">
    <figure v-for="item in slides.slice(0, mode === 'pair' ? 2 : mode === 'grid' ? 3 : 1)" :key="item.id"><img :src="safeImage(item.src)" :alt="item.alt" loading="lazy"><figcaption v-if="item.caption">{{ item.caption }}</figcaption></figure>
  </div>
</template>
