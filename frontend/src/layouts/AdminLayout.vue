<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { demoAccounts, roles, useAuth } from '../stores/auth'
const auth = useAuth()
const route = useRoute()
const error = ref('')
const login = ref('')
const code = ref('')
const menuOpen = ref(false)
watch(() => route.path, () => { menuOpen.value = false })
const links = [
  ['Dashboard', '/admin', 'speedometer2'], ['Publicações', '/admin/noticias', 'newspaper'], ['Edições', '/admin/edicoes', 'calendar3'],
  ['Temas', '/admin/temas', 'lightbulb'], ['Categorias', '/admin/categorias', 'grid'], ['Editais', '/admin/editais', 'file-earmark-text'],
  ['Parceiros', '/admin/parceiros', 'people'], ['Linha do Tempo', '/admin/marcos_historicos', 'clock-history'], ['Usuários', '/admin/usuarios', 'person-gear'],
]
const permitted = computed(() => auth.isMaster || ['/admin', '/admin/nova-publicacao', '/admin/noticias'].includes(route.path) || route.path.startsWith('/admin/noticias/'))
const visibleLinks = computed(() => auth.isMaster ? links : links.slice(0, 2))
function session(entering: boolean) {
  try {
    if (entering) auth.signIn(login.value, code.value)
    else auth.signOut()
    error.value = ''
    code.value = ''
    menuOpen.value = false
  } catch (issue) { error.value = (issue as Error).message }
}
</script>

<template>
  <main v-if="!auth.user" class="login">
    <section class="login-card"><RouterLink class="back-link" to="/"><i class="bi bi-arrow-left"></i> Voltar ao portal</RouterLink>
      <span class="brand-icon"><i class="bi bi-cpu"></i></span><h1>Área administrativa</h1>
      <p>Use um perfil de demonstração para acessar o painel deste navegador.</p>
      <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
      <form @submit.prevent="session(true)">
        <label class="field">Usuário<input v-model="login" class="form-control" autocomplete="username" required></label>
        <label class="field">Código de demonstração<input v-model="code" class="form-control" type="password" autocomplete="current-password" required></label>
        <button class="btn button-dark w-100" type="submit">Entrar no painel <i class="bi bi-arrow-right"></i></button>
      </form>
      <div class="demo-accounts"><h2>Contas de teste</h2>
        <button v-for="account in demoAccounts" :key="account.id" type="button" class="btn button-light" @click="login = account.login; code = account.code">
          <strong>{{ roles[account.role] }}</strong><small>{{ account.login }} / {{ account.code }}</small>
        </button>
      </div>
    </section>
  </main>
  <div v-else class="admin-shell">
    <aside class="admin-sidebar">
      <div class="admin-sidebar-heading">
        <RouterLink to="/admin" class="wordmark"><span class="brand-icon"><i class="bi bi-cpu"></i></span><span><strong>CJR</strong><small>{{ roles[auth.user.role] }}</small></span></RouterLink>
        <button class="btn button-outline admin-menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="admin-navigation" @click="menuOpen = !menuOpen"><i class="bi bi-list"></i> Menu</button>
      </div>
      <div id="admin-navigation" class="admin-navigation" :class="{ 'is-open': menuOpen }">
        <nav aria-label="Menu administrativo"><RouterLink v-for="[label, to, icon] in visibleLinks" :key="to" :to="to"><i :class="'bi bi-' + icon"></i>{{ label }}</RouterLink></nav>
        <div class="sidebar-bottom"><RouterLink to="/"><i class="bi bi-box-arrow-up-right"></i> Abrir portal</RouterLink><button class="btn button-outline" @click="session(false)">Sair</button></div>
      </div>
    </aside>
    <main class="admin-main"><p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p><RouterView v-if="permitted" :key="auth.user.id + $route.path" />
      <section v-else class="admin-panel"><h1>Acesso restrito</h1><p>Esta seção está disponível para o administrador master.</p><RouterLink to="/admin">Voltar ao painel</RouterLink></section>
    </main>
  </div>
</template>
