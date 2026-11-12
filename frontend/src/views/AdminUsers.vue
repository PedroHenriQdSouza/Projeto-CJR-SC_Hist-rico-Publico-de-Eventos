<script setup lang="ts">
import { reactive, ref } from 'vue'
import { roles, type Role, useAuth } from '../stores/auth'

const auth = useAuth()
const form = reactive({ name: '', login: '', code: '', role: 'contributor' as Role })
const message = ref('')
const error = ref('')

function create() {
  message.value = ''
  error.value = ''
  try {
    auth.addAccount(form)
    message.value = 'Usuário de demonstração cadastrado.'
    Object.assign(form, { name: '', login: '', code: '', role: 'contributor' })
  } catch (issue) { error.value = (issue as Error).message }
}
</script>

<template>
  <header class="admin-heading"><div><h1>Usuários</h1><p>Cadastre perfis fictícios para testar o fluxo editorial neste navegador.</p></div></header>
  <div class="admin-user-grid">
    <form class="admin-panel" @submit.prevent="create">
      <h2>Novo usuário</h2>
      <label class="field">Nome fictício<input v-model="form.name" class="form-control" required maxlength="80"></label>
      <label class="field">Usuário<input v-model="form.login" class="form-control" required minlength="3" maxlength="30" autocomplete="off"></label>
      <label class="field">Código de demonstração<input v-model="form.code" class="form-control" required minlength="4" maxlength="24" autocomplete="off"></label>
      <label class="field">Perfil<select v-model="form.role" class="form-select"><option v-for="(label, role) in roles" :key="role" :value="role">{{ label }}</option></select></label>
      <p class="small">Use um código fictício. As contas são locais e servem à demonstração.</p>
      <button class="btn button-dark" type="submit">Cadastrar usuário</button>
      <p v-if="message" class="alert alert-success mt-3 mb-0" role="status">{{ message }}</p>
      <p v-if="error" class="alert alert-danger mt-3 mb-0" role="alert">{{ error }}</p>
    </form>
    <section class="admin-panel"><h2>Usuários cadastrados</h2>
      <ul class="admin-records"><li v-for="account in auth.accounts" :key="account.id"><div><strong>{{ account.name }}</strong><small>{{ account.login }}</small></div><span class="status">{{ roles[account.role] }}</span></li></ul>
    </section>
  </div>
</template>
