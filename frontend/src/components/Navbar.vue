<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalog } from '../stores/catalog'
const catalog = useCatalog()
const route = useRoute()
const open = ref(false)
watch(() => route.fullPath, () => { open.value = false; document.querySelectorAll<HTMLDetailsElement>('.public-nav details').forEach(item => { item.open = false }) })
const menus = [{ key: 'edicoes', label: 'Edições' }, { key: 'temas', label: 'Temas' }] as const
function entries(key: typeof menus[number]['key']) {
  return catalog.published(key).sort((a, b) => key === 'edicoes'
    ? (b.year ?? 0) - (a.year ?? 0)
    : (b.year ?? 0) - (a.year ?? 0) || b.updatedAt.localeCompare(a.updatedAt))
}
</script>

<template>
  <header class="public-header">
    <div class="utility"><div class="site-container"><span><i class="bi bi-geo-alt"></i> Joinville, Santa Catarina</span><RouterLink to="/admin"><i class="bi bi-lock"></i> Área administrativa</RouterLink></div></div>
    <div class="site-container nav-row">
      <RouterLink to="/" class="wordmark" aria-label="CJR — Home"><img class="official-wordmark" src="/images/marca-cjr.webp" alt="Campeonato Joinvilense de Robótica" width="246" height="59"></RouterLink>
      <button class="btn mobile-menu" type="button" aria-controls="public-menu" :aria-expanded="open" @click="open = !open"><i class="bi bi-list"></i> Menu</button>
      <nav id="public-menu" class="public-nav" :class="{ expanded: open }" aria-label="Menu principal">
        <RouterLink to="/">Home</RouterLink><RouterLink to="/editais">Editais</RouterLink>
        <details v-for="menu in menus" :key="menu.key"><summary>{{ menu.label }} <i class="bi bi-chevron-down"></i></summary>
          <div class="nav-dropdown"><RouterLink :to="'/' + menu.key">Ver todas</RouterLink><RouterLink v-for="item in entries(menu.key)" :key="item.id" :to="'/' + menu.key + '/' + item.slug">{{ item.title }}<small v-if="item.demo" class="d-block">Demonstração</small></RouterLink></div>
        </details>
        <RouterLink to="/categorias">Categorias</RouterLink><RouterLink class="btn button-dark" to="/faca-parte">Faça Parte <i class="bi bi-arrow-up-right"></i></RouterLink>
      </nav>
    </div>
  </header>
</template>
