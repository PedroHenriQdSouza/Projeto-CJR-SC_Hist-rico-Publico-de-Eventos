<script setup lang="ts">
import { newLine } from '../services/content'
import { blockTypes, type Block, type Media } from '../types/content'
import MediaEditor from './MediaEditor.vue'
defineProps<{ block: Block; library: Media[] }>()
</script>

<template>
  <section class="block-settings">
    <h2>{{ blockTypes[block.type] }}</h2>
    <template v-if="block.type === 'heading' || block.type === 'button'">
      <label class="field">{{ block.type === 'button' ? 'Texto do botão' : 'Título' }}<input v-model="block.title" class="form-control"></label>
      <label v-if="block.type === 'heading'" class="field">Subtítulo<input v-model="block.subtitle" class="form-control"></label>
      <label v-else class="field">Endereço do link<input v-model="block.href" class="form-control" placeholder="https://..."></label>
    </template>
    <template v-if="block.type === 'text'">
      <label class="field">Formato<select v-model="block.style" class="form-select"><option value="paragraph">Parágrafos</option><option value="bullets">Lista com marcadores</option><option value="numbered">Lista numerada</option></select></label>
      <fieldset class="text-line" v-for="(line, index) in block.lines" :key="line.id">
        <legend>{{ block.style === 'paragraph' ? 'Parágrafo' : 'Item' }} {{ index + 1 }}</legend>
        <label class="field">Texto<textarea v-model="line.text" class="form-control" rows="3"></textarea></label>
        <div class="d-flex gap-3 flex-wrap mb-2"><label><input v-model="line.bold" type="checkbox"> Negrito</label><label><input v-model="line.italic" type="checkbox"> Itálico</label></div>
        <label class="field">Link opcional<input v-model="line.href" class="form-control" placeholder="https://..."></label>
        <button type="button" class="btn button-light" @click="block.lines.splice(index, 1)">Remover trecho</button>
      </fieldset>
      <button type="button" class="btn button-light" @click="block.lines.push(newLine())"><i class="bi bi-plus-lg"></i> Adicionar trecho</button>
    </template>
    <template v-if="block.type === 'image' || block.type === 'pair' || block.type === 'grid' || block.type === 'gallery'">
      <label v-if="block.type === 'gallery'" class="field"><input v-model="block.fromGallery" type="checkbox"> Usar todas as imagens da publicação</label>
      <MediaEditor v-if="!block.fromGallery" v-model="block.images" label="Imagens do bloco" :library="library" :limit="block.type === 'image' ? 1 : block.type === 'pair' ? 2 : block.type === 'grid' ? 3 : 12" />
      <p v-else>Adicione ou reordene imagens na aba Publicação.</p>
    </template>
    <p v-if="block.type === 'divider'">Separa visualmente as seções da publicação.</p>
  </section>
</template>
