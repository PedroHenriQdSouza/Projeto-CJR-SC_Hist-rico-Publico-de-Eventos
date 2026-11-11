<script setup lang="ts">
import type { Collection, RecordEntry } from '../types/content'
import { useCatalog } from '../stores/catalog'
import MediaEditor from './MediaEditor.vue'
defineProps<{ item: RecordEntry; section: Collection }>()
const editions = defineModel<string[]>('editions', { required: true })
const catalog = useCatalog()
</script>

<template>
  <label class="field">{{ section === 'temas' ? 'Nome do tema' : 'Título' }}<input v-model="item.title" class="form-control" required></label>
  <label v-if="section === 'noticias'" class="field">Subtítulo ou resumo<input v-model="item.subtitle" class="form-control"></label>
  <label v-else class="field">Descrição<textarea v-model="item.description" class="form-control" rows="3"></textarea></label>
  <label v-if="section === 'temas' || section === 'categorias'" class="field">Objetivos<textarea v-model="item.objective" class="form-control"></textarea></label>
  <label v-if="section === 'temas'" class="field">Contextualização<textarea v-model="item.context" class="form-control"></textarea></label>
  <label v-if="section === 'categorias'" class="field">Características da competição<textarea v-model="item.features" class="form-control"></textarea></label>
  <label v-if="section === 'edicoes' || section === 'editais' || section === 'marcos_historicos'" class="field">Ano<input v-model.number="item.year" type="number" min="1900" max="9999" class="form-control"></label>
  <label v-if="section === 'noticias' || section === 'editais'" class="field">Data<input v-model="item.date" type="date" class="form-control"></label>
  <template v-if="section === 'edicoes'">
    <label class="field">Data ou período<input v-model="item.period" class="form-control"></label>
    <label class="field">Local<input v-model="item.place" class="form-control"></label>
    <label class="field">Tema principal<select v-model="item.themeId" class="form-select"><option value="">Selecione um tema</option><option v-for="theme in catalog.data.temas" :key="theme.id" :value="theme.id">{{ theme.title }}</option></select></label>
    <label class="field">Equipes<input v-model.number="item.teams" type="number" min="0" class="form-control"></label>
    <label class="field">Escolas<input v-model.number="item.schools" type="number" min="0" class="form-control"></label>
    <label class="field">Estudantes<input v-model.number="item.students" type="number" min="0" class="form-control"></label>
    <label class="field">Projetos e resultados validados<textarea v-model="item.results" class="form-control"></textarea></label>
  </template>
  <fieldset v-if="section === 'temas' || section === 'edicoes'" class="relation-field">
    <legend>Categorias participantes</legend><p v-if="!catalog.data.categorias.length">Cadastre categorias para vinculá-las aqui.</p>
    <label v-for="category in catalog.data.categorias" :key="category.id"><input v-model="item.categoryIds" type="checkbox" :value="category.id"> {{ category.title }}</label>
  </fieldset>
  <fieldset v-if="section === 'temas'" class="relation-field"><legend>Edições relacionadas</legend><p>Selecione as edições que usarão este tema como principal.</p>
    <label v-for="edition in catalog.data.edicoes" :key="edition.id"><input v-model="editions" type="checkbox" :value="edition.id"> {{ edition.title }}</label>
  </fieldset>
  <label v-if="section === 'noticias' || section === 'marcos_historicos'" class="field">Edição relacionada<select v-model="item.editionId" class="form-select"><option value="">Sem vínculo</option><option v-for="edition in catalog.data.edicoes" :key="edition.id" :value="edition.id">{{ edition.title }}</option></select></label>
  <label v-if="section === 'marcos_historicos'" class="field">Período<input v-model="item.period" class="form-control"></label>
  <label v-if="section === 'editais' || section === 'parceiros'" class="field">{{ section === 'editais' ? 'Endereço do PDF' : 'Site do parceiro' }}<input v-model="item.url" class="form-control" placeholder="https://..."></label>
  <label class="field">Fontes e referências<textarea v-model="item.sources" class="form-control" rows="2"></textarea></label>
  <label v-if="section === 'noticias'" class="field">Créditos das imagens<input v-model="item.credits" class="form-control"></label>
  <label class="field"><input v-model="item.demo" type="checkbox"> Identificar como demonstração</label>
  <MediaEditor v-if="section !== 'editais'" v-model="item.images" :label="section === 'parceiros' ? 'Logotipo' : 'Capa e galeria'" :limit="section === 'parceiros' ? 1 : 12" :cover="item.coverId" @cover="item.coverId = $event" />
</template>
