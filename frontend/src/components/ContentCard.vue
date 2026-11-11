<script setup lang="ts">
import { cover, safeImage } from '../services/content'
import type { RecordEntry } from '../types/content'
defineProps<{ item: RecordEntry; section: string }>()
</script>

<template>
  <article class="content-card">
    <img v-if="cover(item) && safeImage(cover(item)!.src)" :src="safeImage(cover(item)!.src)" :alt="cover(item)!.alt" loading="lazy">
    <div class="card-inner">
      <div class="card-meta" v-if="item.year || item.date || item.demo"><span v-if="item.year">{{ item.year }}</span><time v-if="item.date" :datetime="item.date">{{ item.date.split('-').reverse().join('/') }}</time><span v-if="item.demo">Demonstração</span></div>
      <h3>{{ item.title }}</h3><p v-if="item.subtitle || item.description">{{ item.subtitle || item.description }}</p>
      <RouterLink :to="'/' + section + '/' + item.slug" :aria-label="'Leia mais sobre ' + item.title">Leia mais <i class="bi bi-arrow-up-right"></i></RouterLink>
    </div>
  </article>
</template>
