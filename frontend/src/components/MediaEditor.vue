<script setup lang="ts">
import { ref } from 'vue'
import { resizeImage } from '../services/images'
import { safeImage } from '../services/content'
import type { Media } from '../types/content'
const props = defineProps<{ label: string; limit?: number; cover?: string; library?: Media[] }>()
const images = defineModel<Media[]>({ required: true })
const emit = defineEmits<{ cover: [id: string] }>()
const busy = ref(false)
const error = ref('')
const picked = ref('')
async function upload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  input.value = ''
  error.value = ''
  if (images.value.length + files.length > (props.limit ?? 12)) {
    error.value = 'Limite de ' + (props.limit ?? 12) + ' imagens atingido.'
    return
  }
  busy.value = true
  try { images.value = [...images.value, ...await Promise.all(files.map(resizeImage))] }
  catch (issue) { error.value = (issue as Error).message }
  finally { busy.value = false }
}
function attach() {
  const item = props.library?.find(image => image.id === picked.value)
  if (!item || images.value.some(image => image.id === item.id) || images.value.length >= (props.limit ?? 12)) return
  images.value = [...images.value, { ...item, src: '' }]
  picked.value = ''
}
function move(index: number, step: number) {
  const next = [...images.value]
  const [image] = next.splice(index, 1)
  next.splice(index + step, 0, image)
  images.value = next
}
function remove(index: number) {
  const item = images.value[index]
  images.value = images.value.filter((_, position) => position !== index)
  if (props.cover === item.id) emit('cover', images.value[0]?.id ?? '')
}
</script>

<template>
  <fieldset class="media-editor">
    <legend>{{ label }}</legend>
    <label v-if="images.length < (limit ?? 12)" class="field">Selecionar arquivos <input class="form-control" type="file" accept="image/jpeg,image/png,image/webp" :multiple="limit !== 1" :disabled="busy" @change="upload"></label>
    <p v-if="busy" role="status">Preparando imagens…</p><p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
    <div v-if="library?.length && images.length < (limit ?? 12)" class="d-flex gap-2 align-items-end mb-3">
      <label class="field flex-grow-1 mb-0">Da galeria da publicação<select class="form-select" v-model="picked"><option value="">Selecione</option><option v-for="(image, index) in library.filter(image => !images.some(selected => selected.id === image.id))" :key="image.id" :value="image.id">{{ image.alt || image.caption || 'Imagem ' + (index + 1) }}</option></select></label>
      <button type="button" class="btn button-light" :disabled="!picked" @click="attach">Inserir</button>
    </div>
    <article v-for="(image, index) in images" :key="image.id" class="media-edit-item">
      <img v-if="safeImage(image.src || library?.find(item => item.id === image.id)?.src || '')" :src="safeImage(image.src || library?.find(item => item.id === image.id)?.src || '')" :alt="image.alt">
      <label class="field">Texto alternativo<input v-model="image.alt" class="form-control"></label>
      <label class="field">Legenda<input v-model="image.caption" class="form-control"></label>
      <div class="d-flex gap-2 flex-wrap">
        <button v-if="cover !== undefined" type="button" class="btn button-light" :aria-pressed="(cover || images[0]?.id) === image.id" @click="emit('cover', image.id)">{{ (cover || images[0]?.id) === image.id ? 'Capa selecionada' : 'Usar como capa' }}</button>
        <button type="button" class="btn button-light" :disabled="index === 0" :aria-label="'Subir imagem ' + (index + 1)" @click="move(index, -1)"><i class="bi bi-arrow-up"></i></button>
        <button type="button" class="btn button-light" :disabled="index === images.length - 1" :aria-label="'Descer imagem ' + (index + 1)" @click="move(index, 1)"><i class="bi bi-arrow-down"></i></button>
        <button type="button" class="btn button-light" :aria-label="'Remover imagem ' + (index + 1)" @click="remove(index)"><i class="bi bi-trash"></i></button>
      </div>
    </article>
  </fieldset>
</template>
