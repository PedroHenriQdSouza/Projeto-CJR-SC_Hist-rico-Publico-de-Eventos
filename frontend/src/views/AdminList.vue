<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalog } from '../stores/catalog'
import { useAuth } from '../stores/auth'
import { adminLabels } from '../services/admin'
import { collections, statuses, type Collection, type RecordEntry, type Status } from '../types/content'
import ConfirmDialog from '../components/ConfirmDialog.vue'
const props = defineProps<{ section: string }>()
const catalog = useCatalog()
const auth = useAuth()
const route = useRoute()
const statusFilter = ref<Status | ''>(route.query.status === 'pending' || route.query.status === 'published' ? route.query.status : '')
const key = computed(() => collections.find(key => key === props.section))
const rows = computed(() => {
  if (!auth.isMaster) return catalog.data.noticias.filter(item => item.authorId === auth.user?.id).map(item => ({ item, key: 'noticias' as const }))
  if (key.value === 'noticias') return [...catalog.data.noticias.map(item => ({ item, key: 'noticias' as const })), ...catalog.data.temas.map(item => ({ item, key: 'temas' as const }))]
  return key.value ? catalog.data[key.value].map(item => ({ item, key: key.value! })) : []
})
const sorted = computed(() => rows.value.filter(({ item }) => !statusFilter.value || item.status === statusFilter.value)
  .sort((a, b) => b.item.updatedAt.localeCompare(a.item.updatedAt)))
const selected = ref<{ item: RecordEntry; key: Collection }>()
const feedback = ref('')
const error = ref('')
function remove() {
  if (!selected.value) return
  feedback.value = ''
  error.value = ''
  try { catalog.remove(selected.value.key, selected.value.item.id); feedback.value = 'Registro excluído.' } catch (issue) { error.value = (issue as Error).message }
  selected.value = undefined
}
</script>

<template>
  <template v-if="key">
    <header class="admin-heading"><h1>{{ auth.isMaster ? adminLabels[key] : 'Minhas matérias' }}</h1><RouterLink class="btn button-dark" :to="key === 'noticias' ? '/admin/nova-publicacao' : '/admin/' + key + '/novo'"><i class="bi bi-plus-lg"></i> {{ key === 'noticias' ? 'Nova Publicação' : 'Novo registro' }}</RouterLink></header>
    <p v-if="feedback" role="status" class="alert alert-success">{{ feedback }}</p><p v-if="error" role="alert" class="alert alert-danger">{{ error }}</p>
    <section class="admin-panel"><label v-if="key === 'noticias'" class="field filter">Situação<select v-model="statusFilter" class="form-select"><option value="">Todas</option><option v-for="(label, status) in statuses" :key="status" :value="status">{{ label }}</option></select></label>
      <p v-if="!sorted.length" class="mb-0">Nenhum registro nesta situação.</p>
      <ul v-else class="admin-records"><li v-for="row in sorted" :key="row.item.id">
        <div><RouterLink :to="!auth.isMaster && row.item.status === 'published' ? '/noticias/' + row.item.slug : '/admin/' + row.key + '/' + row.item.id">{{ row.item.title }}</RouterLink><small v-if="key === 'noticias'">{{ row.key === 'temas' ? 'Tema' : 'Notícia' }}</small></div>
        <span class="status" :data-status="row.item.status">{{ statuses[row.item.status] }}</span>
        <button v-if="auth.isMaster" class="btn button-light" :aria-label="'Excluir ' + row.item.title" @click="selected = row"><i class="bi bi-trash"></i> Excluir</button>
      </li></ul>
    </section>
    <ConfirmDialog v-if="selected" title="Excluir registro?" :message="'O registro «' + selected.item.title + '» será removido deste navegador.'" action="Excluir" @cancel="selected = undefined" @confirm="remove" />
  </template>
  <p v-else>Seção administrativa indisponível. <RouterLink to="/admin">Voltar ao dashboard</RouterLink></p>
</template>
