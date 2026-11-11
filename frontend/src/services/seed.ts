import { archive } from './archive'
import { newBlock, newEntry } from './content'
import type { Collection, Media, RecordEntry } from '../types/content'

export const illustration: Media = { id: 'robotica', src: '/images/robotica.jpg', alt: 'Robô educacional sobre uma bancada', caption: 'Imagem ilustrativa gerada por IA' }
const stamp = '2026-11-10T12:00:00.000Z'
const entry = (id: string, slug: string, title: string, fields: Partial<RecordEntry> = {}): RecordEntry => ({
  ...newEntry(), id, slug, title, demo: true, status: 'published', createdAt: stamp, updatedAt: stamp, ...fields,
})
const story = newBlock('text')
story.lines[0].text = 'Neste exemplo de publicação, a turma começa com um esboço, monta o protótipo e testa o percurso. A cada rodada, registra o que funcionou e o que precisa ser ajustado.'
const example = 'Dados fictícios criados para demonstrar o portal.'
const demoEdition = 'demo-edicao-2030'
const demoTheme = 'demo-tema-2030'
const demoCategory = 'demo-categoria-2030'
export const demoNoticeId = 'demo-edital-2030'
export const demonstrations = {
  categorias: [entry(demoCategory, 'resgate-de-prototipos', 'Resgate de Protótipos', {
    description: 'Modalidade fictícia em que robôs localizam e transportam peças leves até uma zona segura.',
    features: 'No cenário de demonstração, cada equipe tem três minutos para completar o percurso.',
    sources: example,
  })],
  temas: [entry(demoTheme, 'bairros-do-futuro', 'Bairros do Futuro', {
    year: 2030, categoryIds: [demoCategory], description: 'Tema fictício sobre como a robótica poderia ajudar a melhorar a vida no bairro.',
    objective: 'Projetar soluções para acessibilidade, mobilidade ou cuidado com espaços públicos.', sources: example,
  })],
  edicoes: [entry(demoEdition, '2030', 'Edição demonstrativa de 2030', {
    year: 2030, themeId: demoTheme, categoryIds: [demoCategory], teams: 12, schools: 6, students: 48,
    period: '21 de setembro de 2030 (data fictícia)', place: 'Centro de Eventos Escola Modelo (local fictício)',
    description: 'Uma edição fictícia que mostra como o acervo reúne tema, categorias, notícias e informações de participação.',
    sources: example, images: [illustration],
  })],
  noticias: [entry('demo-noticia-2030', 'equipes-testam-prototipos-de-resgate', 'Equipes testam protótipos de resgate', {
    date: '2030-08-20', editionId: demoEdition, images: [illustration],
    subtitle: 'Nesta notícia fictícia, estudantes simulam um percurso de resgate e ajustam o código dos robôs.',
    blocks: [story], credits: illustration.caption, sources: example,
  })],
  editais: [entry(demoNoticeId, 'edital-demonstrativo-2030', 'Edital demonstrativo 01/2030 · Inscrição de equipes', {
    year: 2030, date: '2030-08-01', editionId: demoEdition,
    description: 'Exemplo fictício de edital com público-alvo, etapas e calendário de inscrição. Nenhuma inscrição está aberta por este documento.',
    url: '/documentos/edital-demonstrativo-2030.pdf', sources: example,
  })],
  parceiros: [entry('demo-parceiro-2030', 'laboratorio-oficina-modelo', 'Laboratório Oficina Modelo', {
    description: 'Organização fictícia que, neste exemplo, emprestaria kits e apoiaria as oficinas de preparação.', sources: example,
  })],
  marcos_historicos: [entry('demo-marco-2030', 'mostra-demonstrativa', 'Mostra demonstrativa de protótipos', {
    year: 2030, editionId: demoEdition,
    description: 'Neste marco fictício, equipes apresentam à comunidade os robôs construídos para a edição demonstrativa.', sources: example,
  })],
}
export const seed: Record<Collection, RecordEntry[]> = {
  edicoes: [...archive.edicoes, ...demonstrations.edicoes],
  temas: [...archive.temas, ...demonstrations.temas],
  categorias: [...archive.categorias, ...demonstrations.categorias],
  marcos_historicos: [...archive.marcos_historicos, ...demonstrations.marcos_historicos],
  noticias: [
    entry('n-demo', 'do-esboco-ao-robo', 'Do esboço ao robô', { date: '2025-11-01', subtitle: 'Veja como uma equipe pode registrar o desenvolvimento do seu protótipo.', blocks: [story], images: [illustration], credits: illustration.caption, sources: example }),
    ...demonstrations.noticias,
  ],
  editais: demonstrations.editais,
  parceiros: demonstrations.parceiros,
}
