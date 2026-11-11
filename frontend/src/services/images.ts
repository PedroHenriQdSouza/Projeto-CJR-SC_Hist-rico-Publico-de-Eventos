import { uid } from './content'
import type { Media } from '../types/content'

export async function resizeImage(file: File): Promise<Media> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
    throw new Error('Selecione imagens JPG, PNG ou WebP de até 10 MB.')
  }
  const bitmap = await createImageBitmap(file).catch(() => { throw new Error('Não foi possível abrir a imagem selecionada.') })
  try {
    const canvas = document.createElement('canvas')
    const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height))
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('O navegador não conseguiu redimensionar a imagem.')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const src = canvas.toDataURL('image/webp', 0.72)
    if (src.length > 330_000) throw new Error('A imagem continua grande após a compressão. Escolha uma imagem menor.')
    return { id: uid(), src, alt: '', caption: '' }
  } finally {
    bitmap.close()
  }
}
