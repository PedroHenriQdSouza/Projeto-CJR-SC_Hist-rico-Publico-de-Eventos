<script setup lang="ts">
import { onMounted, ref } from 'vue'
defineProps<{ title: string; message: string; action: string }>()
const emit = defineEmits<{ cancel: []; confirm: [] }>()
const dialog = ref<HTMLDialogElement>()
onMounted(() => dialog.value?.showModal())
</script>

<template>
  <dialog ref="dialog" class="confirm-dialog" aria-labelledby="confirm-title" @cancel.prevent="emit('cancel')">
    <h2 id="confirm-title">{{ title }}</h2><p>{{ message }}</p>
    <div class="d-flex justify-content-end gap-2"><button class="btn button-light" autofocus @click="emit('cancel')">Cancelar</button><button class="btn button-dark" @click="emit('confirm')">{{ action }}</button></div>
  </dialog>
</template>
