import { newEntry } from './content'
import type { Media, RecordEntry } from '../types/content'

export const archiveStamp = '2026-11-10T12:00:00.000Z'
const source = (pages: string) => 'Apresentação Campeonato Joinvilense de Robótica 2026 · ' + pages
const entry = (id: string, slug: string, title: string, fields: Partial<RecordEntry>): RecordEntry => ({
  ...newEntry(), id, slug, title, status: 'published', createdAt: archiveStamp, updatedAt: archiveStamp, ...fields,
})
const media = (id: string, alt: string, page: string): Media => ({ id, src: '/images/' + id + '.webp', alt, caption: source(page) })
const poster = media('planeta-em-alerta', 'Cartaz da sexta edição com o tema Planeta em alerta', 'slide 13')
const track = media('pista-2021', 'Robôs sobre a pista da primeira edição', 'slide 3')
const editions = [
  ['t-demo', 'cidades-sustentaveis', 'Cidades sustentáveis', 'A primeira edição municipal reuniu 28 estudantes em sete equipes e foi dedicada à robótica Lego.'],
  ['t22', 'energias-renovaveis-e-sustentaveis', 'Energias renováveis e sustentáveis', 'Fontes renováveis de energia deram o tema da segunda edição.'],
  ['t23', 'ideias-sustentaveis-para-empresas', 'Ideias sustentáveis para empresas da região de Joinville', 'A terceira edição abordou ideias sustentáveis para empresas da região.'],
  ['t24', 'uso-consciente-de-telas', 'O uso consciente de telas', 'A quarta edição abordou o uso consciente de telas.'],
  ['t25', 'a-casa-do-futuro', 'A casa do futuro', 'A quinta edição teve como tema a casa do futuro.'],
  ['t26', 'planeta-em-alerta', 'Planeta em alerta: soluções em desastres naturais e ambientais', 'A sexta edição abordou soluções para desastres naturais e ambientais. A apresentação registra 312 estudantes.'],
]
const categories = [
  ['c-lego', 'robotica-lego', 'Robótica Lego', 'Missões em pista temática, engenharia do robô e inovação.', 'Equipes do 5º ao 9º ano. A avaliação inclui desafio do robô, design, projeto de inovação e trabalho em equipe.', 6],
  ['c-demo', 'atto-micro-bit', 'Atto Micro:bit', 'Programação em blocos com sensores e soluções criativas.', 'Equipes do 5º ao 9º ano participam do Desafio do Robô e do Projeto de Inovação.', 7],
  ['c-linha', 'seguidor-de-linha', 'Seguidor de Linha', 'Navegação autônoma em pista de MDF e desvio de obstáculos.', 'Estudantes do 6º ao 9º ano constroem um robô para seguir uma linha branca sobre uma pista preta.', 8],
  ['c-tec', 'tecnologia-educacional', 'Tecnologia Educacional', 'Projetos tecnológicos aplicados ao cotidiano escolar.', 'Estudantes e professores apresentam a proposta em um painel visual, com protótipo quando possível.', 9],
  ['c-jr', 'artbot-junior', 'ArtBot Júnior', 'Robôs artísticos interativos para o público.', 'Estudantes do 5º ao 9º ano constroem um robô com pelo menos uma parte móvel e ligação com o tema do campeonato.', 10],
  ['c-expert', 'artbot-expert', 'ArtBot Expert', 'Robôs artísticos interativos desenvolvidos por estudantes da EJA.', 'Os robôs devem ter pelo menos uma parte móvel e estar relacionados ao tema do campeonato.', 11],
  ['c-balao', 'estoura-balao', 'Estoura Balão', 'Duelos entre robôs em uma arena hexagonal.', 'Estudantes do 1º ao 5º ano constroem robôs com o kit Atto para estourar balões em três rodadas.', 12],
] as const

export const archive = {
  edicoes: editions.map(([themeId, , , description], index) => {
    const year = 2021 + index
    return entry('e' + String(year).slice(-2), String(year), (index + 1) + 'ª edição do CJR', {
      year, themeId, description, sources: source(year === 2021 ? 'slides 2–3' : 'slide 13'),
      ...(year === 2021 ? { students: 28, teams: 7, categoryIds: ['c-lego'], images: [track] } : {}),
      ...(year === 2026 ? {
        students: 312, teams: 69, schools: 35, images: [poster], place: 'Expocentro Edmundo Doubrawa, Joinville (SC)',
        period: '19 de setembro de 2026', sources: source('slides 4 e 13') + '. Equipes e escolas: briefing do Desafio 03.',
      } : {}),
    })
  }),
  temas: editions.map(([id, slug, title], index) => entry(id, slug, title, {
    year: 2021 + index, description: 'Tema da edição de ' + (2021 + index) + ' do Campeonato Joinvilense de Robótica.',
    categoryIds: index === 0 ? ['c-lego'] : [], sources: source(index === 0 ? 'slide 3' : 'slide 13'),
    images: index === 5 ? [poster] : [],
  })),
  categorias: categories.map(([id, slug, title, description, features, page]) => entry(id, slug, title, {
    description, features, sources: source('slide ' + page),
  })),
  marcos_historicos: [
    entry('m17', 'primeiros-clubes', 'Os primeiros clubes de robótica', {
      year: 2017, description: 'A Rede Municipal participa da FIRST LEGO League Challenge. A experiência motiva a aquisição dos primeiros kits Lego Mindstorms EV3 e a criação dos clubes de robótica.', sources: source('slide 2'),
    }),
    entry('m18', 'competicoes-regionais', 'Das escolas às competições regionais', {
      year: 2018, period: '2018–2020', description: 'Estudantes representam a rede municipal em competições regionais, conquistam premiações e fortalecem a robótica nas escolas.', sources: source('slide 2'),
    }),
  ],
}
