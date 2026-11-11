import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { collections, type Collection, type RecordEntry, type Status } from '../types/content'
import { safeLink, slugify } from '../services/content'
import { archive, archiveStamp } from '../services/archive'
import { demonstrations, seed } from '../services/seed'
import { storage } from '../services/storage'

type Catalog = Record<Collection, RecordEntry[]>
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export const useCatalog = defineStore('catalog', () => {
  const error = ref('')
  const data = reactive<Catalog>(Object.fromEntries(collections.map(key => [key, []])) as unknown as Catalog)
  const session = ref(false)

  for (const key of collections) {
    try {
      const existing = storage.read<RecordEntry[] | null>(key, null)
      if (existing !== null && !Array.isArray(existing)) throw new Error('Coleção inválida.')
      data[key] = existing ?? clone(seed[key])
      if (existing === null) storage.write(key, data[key])
    } catch {
      error.value = 'Alguns dados locais não puderam ser carregados. Verifique o armazenamento do navegador.'
    }
  }
  if (!error.value) {
    try {
      if (!storage.read<boolean>('acervo_slides_2026', false)) {
        const untouched = (item: RecordEntry) => item.updatedAt === archiveStamp && !item.revisions.length
        const legacyIds = new Set(['e25', 'e26', 't-demo', 'c-demo'])
        const references = new Map<string, string>()
        const orderedKeys = ['categorias', 'temas', 'edicoes', 'marcos_historicos'] as const
        for (const key of orderedKeys) {
          const next = [...data[key]]
          for (const item of archive[key]) {
            const index = next.findIndex(row => row.id === item.id || row.slug === item.slug || (key === 'edicoes' && row.year === item.year))
            const existing = next[index]
            const updated = {
              ...item,
              themeId: references.get(item.themeId) ?? item.themeId,
              categoryIds: item.categoryIds.map(id => references.get(id) ?? id),
            }
            references.set(item.id, existing?.id ?? item.id)
            if (!existing) next.push(updated)
            else if (legacyIds.has(existing.id) && untouched(existing)) next[index] = updated
          }
          if (next.some((item, index) => item !== data[key][index])) {
            storage.write(key, next)
            data[key] = next
          }
        }
        if (data.noticias.some(item => item.id === 'n-demo' && item.editionId === 'e25' && untouched(item))) {
          const next = data.noticias.map(item => item.id === 'n-demo' ? { ...item, editionId: '' } : item)
          storage.write('noticias', next)
          data.noticias = next
        }
        storage.write('acervo_slides_2026', true)
      }
    } catch {
      error.value = 'A atualização do acervo dos slides ficou incompleta. Verifique o espaço disponível no navegador.'
    }
  }
  if (!error.value) {
    try {
      if (!storage.read<boolean>('exemplos_portal_2030', false)) {
        for (const key of ['categorias', 'temas', 'edicoes', 'noticias', 'editais', 'parceiros', 'marcos_historicos'] as const) {
          const additions = demonstrations[key].filter(item => !data[key].some(existing =>
            existing.id === item.id || existing.slug === item.slug || (key === 'edicoes' && existing.year === item.year),
          )).map(item => ({
            ...item,
            editionId: data.edicoes.some(edition => edition.id === item.editionId) ? item.editionId : '',
            categoryIds: item.categoryIds.filter(id => data.categorias.some(category => category.id === id)),
          }))
          if (!additions.length || (key === 'edicoes' && !data.temas.some(theme => theme.id === additions[0].themeId))) continue
          const next = [...data[key], ...additions]
          storage.write(key, next)
          data[key] = next
        }
        storage.write('exemplos_portal_2030', true)
      }
    } catch {
      error.value = 'Os exemplos fictícios não puderam ser carregados por completo. Verifique o armazenamento do navegador.'
    }
  }
  try { session.value = storage.read<boolean>('admin_session', false) === true } catch { error.value = 'A sessão local não pôde ser carregada.' }

  function reload(event: StorageEvent) {
    const collection = collections.find(key => event.key === 'cjr_' + key)
    try {
      if (collection) data[collection] = storage.read(collection, clone(seed[collection]))
      if (event.key === 'cjr_admin_session') session.value = storage.read('admin_session', false)
      if (event.key === null) window.location.reload()
    } catch { error.value = 'Não foi possível sincronizar os dados locais entre abas.' }
  }
  window.addEventListener('storage', reload)

  function setSession(value: boolean) {
    storage.write('admin_session', value)
    session.value = value
  }
  function published(key: Collection) {
    return data[key].filter(item => item.status === 'published')
  }
  function put(key: Collection, entry: RecordEntry, status: Status, editionIds?: string[]) {
    const current = storage.read(key, data[key])
    const previous = current.find(item => item.id === entry.id)
    if (entry.updatedAt && previous?.updatedAt !== entry.updatedAt) throw new Error('O registro mudou em outra aba. Reabra a edição antes de salvar.')
    if (!entry.title.trim()) throw new Error('Informe o título.')
    if (key === 'edicoes' && (!entry.year || !Number.isInteger(entry.year) || entry.year < 1900 || entry.year > 9999)) throw new Error('Informe um ano válido.')
    if (key === 'edicoes' && current.some(item => item.id !== entry.id && item.year === entry.year)) throw new Error('Já existe uma edição para este ano.')
    if (key === 'edicoes' && status === 'published' && !data.temas.some(item => item.id === entry.themeId)) throw new Error('Selecione um tema principal.')
    if (key === 'editais' && status === 'published' && !safeLink(entry.url)) throw new Error('Informe um endereço válido para o documento.')
    const base = slugify(entry.title) || entry.id.slice(0, 8)
    let slug = key === 'edicoes' ? String(entry.year) : previous?.slug || base
    if (current.some(item => item.id !== entry.id && item.slug === slug)) slug = base + '-' + entry.id.slice(0, 8)
    const date = new Date().toISOString()
    const record = clone({
      ...entry, title: entry.title.trim(), slug, status, createdAt: previous?.createdAt || date, updatedAt: date,
      revisions: [...(previous?.revisions ?? []), { date, status }].slice(-20),
      blocks: entry.blocks.map((block, order) => ({ ...block, order })),
    })
    const next = previous ? current.map(item => item.id === entry.id ? record : item) : [...current, record]
    const editions = key === 'temas' && editionIds ? storage.read('edicoes', data.edicoes) : undefined
    const nextEditions = editions?.map(item => {
      const themeId = editionIds?.includes(item.id) ? entry.id : item.themeId === entry.id ? '' : item.themeId
      if (themeId === item.themeId) return item
      if (!themeId && item.status === 'published' && !item.demo) throw new Error('Uma edição publicada precisa de tema. Altere o tema no cadastro da edição.')
      return { ...item, themeId, updatedAt: date, revisions: [...item.revisions, { date, status: item.status }].slice(-20) }
    })
    storage.write(key, next)
    if (editions && nextEditions && nextEditions.some((item, index) => item !== editions[index])) {
      try { storage.write('edicoes', nextEditions) }
      catch (issue) { storage.write(key, current); throw issue }
      data.edicoes = nextEditions
    }
    data[key] = next
    return clone(record)
  }
  function remove(key: Collection, id: string) {
    const linked = (key === 'temas' && data.edicoes.some(item => item.themeId === id))
      || (key === 'edicoes' && [...data.noticias, ...data.marcos_historicos].some(item => item.editionId === id))
      || (key === 'categorias' && [...data.temas, ...data.edicoes].some(item => item.categoryIds.includes(id)))
    if (linked) throw new Error('Este registro está vinculado a outros conteúdos. Remova os vínculos antes de excluir.')
    const next = storage.read(key, data[key]).filter(item => item.id !== id)
    storage.write(key, next)
    data[key] = next
  }
  return { data, error, session, setSession, published, put, remove }
})
