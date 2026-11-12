<script setup lang="ts">
import { computed } from 'vue'
import { displayCover } from '../services/content'
import type { RecordEntry } from '../types/content'
const props = defineProps<{ item: RecordEntry; section: string }>()
const photo = computed(() => displayCover(props.item, props.section))
</script>

<template>
  <article class="content-card">
    <img v-if="photo" :src="photo.src" :alt="photo.alt" loading="lazy">
    <div class="card-inner">
      <div class="card-meta" v-if="item.year || item.date || item.demo || photo?.illustrative"><span v-if="item.year">{{ item.year }}</span><time v-if="item.date" :datetime="item.date">{{ item.date.split('-').reverse().join('/') }}</time><span v-if="item.demo">Demonstração</span><span v-if="photo?.illustrative">Foto ilustrativa</span></div>
      <h3>{{ item.title }}</h3><p v-if="item.subtitle || item.description">{{ item.subtitle || item.description }}</p>
      <RouterLink :to="'/' + section + '/' + item.slug" :aria-label="'Leia mais sobre ' + item.title">Leia mais <i class="bi bi-arrow-up-right"></i></RouterLink>
    </div>
  </article>
</template>
