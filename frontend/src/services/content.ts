import type { Block, BlockType, Line, Media, RecordEntry } from '../types/content'

export const uid = () => crypto.randomUUID()
export const slugify = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const newLine = (): Line => ({ id: uid(), text: '', bold: false, italic: false, href: '' })
export const newBlock = (type: BlockType): Block => ({ id: uid(), type, order: 0, title: '', subtitle: '', style: 'paragraph', lines: type === 'text' ? [newLine()] : [], images: [], href: '', fromGallery: false })
export const newEntry = (): RecordEntry => ({
  id: uid(), slug: '', title: '', subtitle: '', description: '', objective: '', context: '', features: '',
  year: null, date: '', period: '', place: '', teams: null, schools: null, students: null,
  results: '', sources: '', credits: '', url: '', themeId: '', editionId: '', categoryIds: [],
  images: [], coverId: '', blocks: [], status: 'draft', createdAt: '', updatedAt: '', revisions: [], demo: false,
})

export function safeLink(input: string) {
  const value = input.trim()
  if (/^\/(?![\/\\])/.test(value)) return value
  if (/^https?:\/\/[^\s]+$/i.test(value)) return value
  return ''
}

export function safeImage(input: string) {
  if (/^data:image\/(jpeg|webp|png);base64,[a-z0-9+/=]+$/i.test(input)) return input
  return safeLink(input)
}

export function cover(entry: RecordEntry) {
  return entry.images.find(item => item.id === entry.coverId) ?? entry.images[0]
}

const coverIllustrations = [
  ['robo-lego.webp', 'Robô Lego sobre uma pista'],
  ['prototipo-competicao.webp', 'Protótipo de competição sobre o piso verde'],
  ['arena-cjr.webp', 'Robôs em uma arena de testes'],
  ['robo-na-arena.webp', 'Robô bípede em uma arena'],
] as const

export function displayCover(entry: RecordEntry, section: string): (Media & { illustrative?: boolean }) | undefined {
  const selected = cover(entry)
  const src = safeImage(selected?.src ?? '')
  if (selected && src) return { ...selected, src }
  if (!['edicoes', 'temas', 'categorias'].includes(section)) return undefined
  const variation = entry.year ?? Array.from(entry.slug, letter => letter.charCodeAt(0)).reduce((sum, code) => sum + code, 0)
  const [file, alt] = coverIllustrations[variation % coverIllustrations.length] ?? coverIllustrations[0]
  return { id: file, src: '/images/' + file, alt, caption: 'Foto ilustrativa de robótica.', illustrative: true }
}

export function template(number: number) {
  const gallery = newBlock('gallery')
  gallery.fromGallery = true
  const result = number === 3 ? [gallery, newBlock('heading'), newBlock('text')] : [newBlock('heading'), newBlock('text')]
  for (let index = 0; index < (number === 1 ? 2 : 3); index += 1) result.push(newBlock('image'), newBlock('text'))
  return result.map((block, order) => ({ ...block, order }))
}
