<script setup lang="ts">
import { useCatalog } from './stores/catalog'
const catalog = useCatalog()
</script>

<template>
  <div v-if="catalog.error" class="alert alert-warning mb-0" role="alert">{{ catalog.error }}</div>
  <RouterView />
</template>
