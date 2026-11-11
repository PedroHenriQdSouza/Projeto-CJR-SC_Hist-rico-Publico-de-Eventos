<script setup lang="ts">
import { ref } from 'vue'
import { useCatalog } from '../stores/catalog'
const catalog = useCatalog()
const error = ref('')
const links = [
  ['Dashboard', '/admin', 'speedometer2'], ['Publicações', '/admin/noticias', 'newspaper'], ['Edições', '/admin/edicoes', 'calendar3'],
  ['Temas', '/admin/temas', 'lightbulb'], ['Categorias', '/admin/categorias', 'grid'], ['Editais', '/admin/editais', 'file-earmark-text'],
  ['Parceiros', '/admin/parceiros', 'people'], ['Linha do Tempo', '/admin/marcos_historicos', 'clock-history'],
]
function session(value: boolean) {
  try { catalog.setSession(value); error.value = '' } catch (issue) { error.value = (issue as Error).message }
}
</script>

<template>
  <main v-if="!catalog.session" class="login">
    <section class="login-card"><RouterLink class="back-link" to="/"><i class="bi bi-arrow-left"></i> Voltar ao portal</RouterLink>
      <span class="brand-icon"><i class="bi bi-cpu"></i></span><h1>Área administrativa</h1>
      <p>Acesso demonstrativo para editar e publicar conteúdos neste navegador. A sessão é simulada e não oferece proteção de produção.</p>
      <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
      <button class="btn button-dark w-100" @click="session(true)">Entrar no painel <i class="bi bi-arrow-right"></i></button>
    </section>
  </main>
  <div v-else class="admin-shell">
    <aside class="admin-sidebar">
      <RouterLink to="/admin" class="wordmark"><span class="brand-icon"><i class="bi bi-cpu"></i></span><span><strong>CJR</strong><small>Gestão do acervo</small></span></RouterLink>
      <nav aria-label="Menu administrativo"><RouterLink v-for="[label, to, icon] in links" :key="to" :to="to"><i :class="'bi bi-' + icon"></i>{{ label }}</RouterLink></nav>
      <div class="sidebar-bottom"><RouterLink to="/"><i class="bi bi-box-arrow-up-right"></i> Abrir portal</RouterLink><button class="btn button-outline" @click="session(false)">Sair</button></div>
    </aside>
    <main class="admin-main"><p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p><RouterView :key="$route.path" /></main>
  </div>
</template>
