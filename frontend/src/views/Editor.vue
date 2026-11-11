<script setup lang="ts">
import { computed, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useCatalog } from '../stores/catalog'
import { adminLabels } from '../services/admin'
import { newBlock, newEntry, template } from '../services/content'
import { blockTypes, collections, statuses, type BlockType, type RecordEntry, type Status } from '../types/content'
import EntryFields from '../components/EntryFields.vue'
import BlockSettings from '../components/BlockSettings.vue'
import BlockRenderer from '../components/BlockRenderer.vue'
import EntryContent from '../components/EntryContent.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const props = defineProps<{ section: string; id?: string; choose?: boolean }>()
const router = useRouter()
const catalog = useCatalog()
const section = ref(collections.find(item => item === props.section))
const saved = props.id && props.id !== 'novo' && section.value ? catalog.data[section.value].find(item => item.id === props.id) : undefined
const missing = !section.value || Boolean(props.id && props.id !== 'novo' && !saved)
const entry = ref<RecordEntry>(saved ? JSON.parse(JSON.stringify(saved)) : newEntry())
const editions = ref(catalog.data.edicoes.filter(item => item.themeId === entry.value.id).map(item => item.id))
const baseline = ref(JSON.stringify([entry.value, editions.value]))
const ready = ref(!props.choose)
const model = ref(1)
const editing = computed(() => section.value === 'noticias' || section.value === 'temas')
const preview = ref(false)
const panel = ref<'entry' | 'block'>('entry')
const active = ref('')
const blockType = ref<BlockType>('text')
const current = computed(() => entry.value.blocks.find(item => item.id === active.value))
const feedback = ref(typeof history.state?.cjrFeedback === 'string' ? history.state.cjrFeedback : '')
const error = ref('')
const confirmation = ref<Status>()
const removeBlock = ref<string>()
const dirty = computed(() => JSON.stringify([entry.value, editions.value]) !== baseline.value)
onBeforeRouteLeave(() => !dirty.value || window.confirm('Sair da edição e descartar alterações não salvas?'))

function start() {
  entry.value.blocks = template(model.value)
  ready.value = true
}
function select(id: string) {
  active.value = id
  panel.value = 'block'
}
function add() {
  const block = newBlock(blockType.value)
  block.order = entry.value.blocks.length
  entry.value.blocks.push(block)
  select(block.id)
}
function move(index: number, step: number) {
  const blocks = entry.value.blocks
  const [block] = blocks.splice(index, 1)
  blocks.splice(index + step, 0, block)
  blocks.forEach((item, order) => { item.order = order })
}
function discardBlock() {
  entry.value.blocks = entry.value.blocks.filter(block => block.id !== removeBlock.value)
  entry.value.blocks.forEach((block, index) => { block.order = index })
  if (active.value === removeBlock.value) { active.value = ''; panel.value = 'entry' }
  removeBlock.value = undefined
}
function save(status: Status) {
  if (!section.value) return
  confirmation.value = undefined
  feedback.value = ''
  error.value = ''
  try {
    const firstSave = !entry.value.createdAt
    const normalized = { ...entry.value }
    for (const field of ['year', 'teams', 'schools', 'students'] as const) {
      if (typeof normalized[field] !== 'number' || !Number.isFinite(normalized[field])) normalized[field] = null
    }
    entry.value = catalog.put(section.value, normalized, status, editions.value)
    baseline.value = JSON.stringify([entry.value, editions.value])
    feedback.value = status === 'published' ? 'Conteúdo publicado neste navegador.' : status === 'pending' ? 'Conteúdo enviado para validação simulada.' : 'Rascunho salvo.'
    if (firstSave) {
      void router.replace({
        path: '/admin/' + section.value + '/' + entry.value.id,
        state: { cjrFeedback: feedback.value },
      })
    }
  } catch (issue) {
    error.value = (issue as Error).message
  }
}
function ask(status: Status) {
  if (status === 'published' || entry.value.status === 'published') confirmation.value = status
  else save(status)
}
function viewPublic() {
  if (!section.value) return
  const to = section.value === 'parceiros' ? '/' : section.value === 'marcos_historicos' ? '/#linha-do-tempo' : '/' + section.value + '/' + entry.value.slug
  void router.push(to)
}
</script>

<template>
  <section v-if="missing" class="admin-panel"><h1>Registro indisponível</h1><RouterLink to="/admin">Voltar ao dashboard</RouterLink></section>
  <section v-else-if="!ready" class="admin-panel setup">
    <h1>Nova Publicação</h1><p>Escolha o tipo de conteúdo e a estrutura inicial dos blocos.</p>
    <form @submit.prevent="start">
      <label class="field">Tipo de publicação<select v-model="section" class="form-select"><option value="noticias">Notícia</option><option value="temas">Tema</option></select></label>
      <label class="field">Modelo<select v-model.number="model" class="form-select"><option :value="1">Notícia simples · duas imagens</option><option :value="2">Notícia ilustrada · três imagens</option><option :value="3">Reportagem com galeria</option></select></label>
      <button class="btn button-dark" type="submit">Abrir editor <i class="bi bi-arrow-right"></i></button>
    </form>
  </section>
  <template v-else-if="section">
    <RouterLink class="back-link" :to="'/admin/' + section"><i class="bi bi-arrow-left"></i> {{ adminLabels[section] }}</RouterLink>
    <header class="editor-toolbar">
      <div><span class="status" :data-status="entry.status">{{ statuses[entry.status] }}</span><h1>{{ entry.title || 'Novo registro' }}</h1></div>
      <div class="toolbar-actions">
        <button class="btn button-light" @click="preview = !preview"><i class="bi bi-eye"></i> {{ preview ? 'Voltar à edição' : 'Visualizar' }}</button>
        <button class="btn button-light" @click="ask('draft')">{{ entry.status === 'published' ? 'Retirar do ar' : 'Salvar rascunho' }}</button>
        <button class="btn button-light" @click="ask('pending')">Enviar para validação</button>
        <button class="btn button-dark" @click="ask('published')">{{ entry.status === 'pending' ? 'Aprovar e publicar' : entry.status === 'published' ? 'Atualizar publicação' : 'Publicar' }}</button>
        <button v-if="entry.status === 'published'" class="btn button-light" @click="viewPublic">Abrir no portal</button>
      </div>
    </header>
    <p v-if="feedback" class="alert alert-success" role="status">{{ feedback }}</p><p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
    <div v-if="preview" class="admin-panel"><p class="eyebrow">Pré-visualização</p><EntryContent :item="entry" :section="section" preview /></div>
    <div v-else class="editor-grid" :class="{ 'editor-form-only': !editing }">
      <section v-if="editing" class="admin-panel editor-canvas">
        <h2>Blocos da publicação</h2>
        <p v-if="!entry.blocks.length">Adicione um bloco para começar.</p>
        <article v-for="(block, index) in entry.blocks" :key="block.id" class="editor-block" :class="{ selected: block.id === active && panel === 'block' }">
          <div class="block-toolbar">
            <button class="btn button-light" :aria-pressed="block.id === active && panel === 'block'" @click="select(block.id)"><i class="bi bi-pencil"></i> {{ blockTypes[block.type] }}</button>
            <div class="d-flex gap-1">
              <button class="btn button-light" :disabled="index === 0" :aria-label="'Subir bloco ' + (index + 1)" @click="move(index, -1)"><i class="bi bi-arrow-up"></i></button>
              <button class="btn button-light" :disabled="index === entry.blocks.length - 1" :aria-label="'Descer bloco ' + (index + 1)" @click="move(index, 1)"><i class="bi bi-arrow-down"></i></button>
              <button class="btn button-light" :aria-label="'Excluir bloco ' + (index + 1)" @click="removeBlock = block.id"><i class="bi bi-trash"></i></button>
            </div>
          </div>
          <div class="block-sample"><BlockRenderer :blocks="[block]" :images="entry.images" /></div>
        </article>
        <div class="add-block"><label class="field mb-0">Tipo de bloco<select v-model="blockType" class="form-select"><option v-for="(label, type) in blockTypes" :key="type" :value="type">{{ label }}</option></select></label><button class="btn button-dark" @click="add"><i class="bi bi-plus-lg"></i> Adicionar bloco</button></div>
      </section>
      <aside class="admin-panel editor-settings" aria-label="Configurações">
        <div v-if="editing" class="settings-tabs"><button class="btn button-light" :aria-pressed="panel === 'entry'" @click="panel = 'entry'">Publicação</button><button class="btn button-light" :aria-pressed="panel === 'block'" @click="panel = 'block'">Bloco</button></div>
        <template v-if="!editing || panel === 'entry'">
          <h2>Dados do registro</h2>
          <EntryFields :item="entry" :section="section" v-model:editions="editions" />
          <details v-if="entry.revisions.length"><summary>Histórico de alterações</summary><ul><li v-for="revision in [...entry.revisions].reverse()" :key="revision.date">{{ new Date(revision.date).toLocaleString('pt-BR') }} · {{ statuses[revision.status] }}</li></ul></details>
        </template>
        <BlockSettings v-else-if="current" :key="current.id" :block="current" :library="entry.images" />
        <p v-else>Selecione um bloco na área de edição.</p>
      </aside>
    </div>
    <ConfirmDialog v-if="confirmation" :title="confirmation === 'published' ? 'Publicar conteúdo?' : 'Retirar conteúdo do ar?'" :message="confirmation === 'published' ? 'A publicação e a aprovação são simuladas. O conteúdo ficará visível no portal deste navegador.' : 'O registro ficará disponível apenas no painel administrativo.'" :action="confirmation === 'published' ? 'Publicar' : 'Confirmar'" @cancel="confirmation = undefined" @confirm="save(confirmation!)" />
    <ConfirmDialog v-if="removeBlock" title="Excluir bloco?" message="O bloco será removido da publicação em edição." action="Excluir" @cancel="removeBlock = undefined" @confirm="discardBlock" />
  </template>
</template>
