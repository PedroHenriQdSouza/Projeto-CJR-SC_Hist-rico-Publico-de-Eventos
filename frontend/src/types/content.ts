export const collections = ['edicoes', 'temas', 'categorias', 'noticias', 'editais', 'parceiros', 'marcos_historicos'] as const
export type Collection = typeof collections[number]
export const statuses = { draft: 'Rascunho', pending: 'Pendente de validação', published: 'Publicado' }
export type Status = keyof typeof statuses
export const blockTypes = { heading: 'Título e subtítulo', text: 'Texto formatado', image: 'Imagem individual', pair: 'Duas imagens', grid: 'Três imagens', gallery: 'Carrossel', divider: 'Separador', button: 'Botão com link' }
export type BlockType = keyof typeof blockTypes
export interface Media { id: string; src: string; alt: string; caption: string }
export interface Line { id: string; text: string; bold: boolean; italic: boolean; href: string }
export interface Block { id: string; type: BlockType; order: number; title: string; subtitle: string; style: 'paragraph' | 'bullets' | 'numbered'; lines: Line[]; images: Media[]; href: string; fromGallery: boolean }
export interface Revision { date: string; status: Status }
export interface RecordEntry {
  id: string; slug: string; title: string; subtitle: string; description: string; objective: string; context: string; features: string
  year: number | null; date: string; period: string; place: string; teams: number | null; schools: number | null; students: number | null
  results: string; sources: string; credits: string; url: string; themeId: string; editionId: string; categoryIds: string[]
  images: Media[]; coverId: string; blocks: Block[]; status: Status; createdAt: string; updatedAt: string; revisions: Revision[]; demo: boolean
}
