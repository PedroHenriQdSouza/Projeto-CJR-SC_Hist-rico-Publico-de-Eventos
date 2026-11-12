# 02 · Arquitetura e modelo de dados

## Visão geral

```mermaid
flowchart TB
    subgraph Navegador
        subgraph Frontend["Frontend · Vue 3 + Vite"]
            P[Portal público<br/>PublicLayout]
            A[Painel de curadoria<br/>AdminLayout]
            S[(Store Pinia<br/>catalog.ts<br/>regras + status)]
            AU[(Store Pinia<br/>auth.ts<br/>perfis + sessão)]
            ST[services/storage.ts]
            P -->|somente publicados| S
            A -->|login| AU
            A -->|put / remove| S
            S -->|verifica permissão| AU
            S --> ST
            AU --> ST
        end
        LS[(localStorage<br/>chaves cjr_*)]
        ST --> LS
    end
    subgraph Backend["Backend · NestJS (demonstrativo)"]
        H[/api/health/]
        AC[/api/acervo/*<br/>edições, temas, categorias, linha do tempo/]
        ED[/api/editorial/*<br/>publicações, editais, parceiros/]
    end
    Frontend -. integração futura .-> Backend
    GO[[Gestão operacional<br/>Desafio 01]] -. edições .-> AC
    DC[[Domínio competitivo<br/>Desafio 02]] -. resultados .-> AC
```

## Decisões técnicas

| Decisão | Motivo | Consequência |
|---|---|---|
| **SPA em Vue 3 + TypeScript** | Equipe já domina; tipagem forte no modelo de dados | `vue-tsc` checa os tipos no build |
| **Persistência em `localStorage`** | MVP demonstrável sem servidor e sem dados reais | Dados ficam por navegador; a camada `storage.ts` isola a troca por API |
| **Uma store central (`catalog.ts`)** | Regras de negócio e status num só lugar | O portal e o painel nunca divergem nas regras |
| **Perfis na store `auth.ts`** | Colaborador e Administrador master com permissões diferentes | `catalog.put()` e `remove()` recusam ações fora do perfil, mesmo que a tela seja contornada |
| **Portal lê só `status === 'published'`** | Garante que nada não validado vaze | `catalog.published(colecao)` é a única porta do público |
| **Acervo real separado dos exemplos** | `archive.ts` (fontes reais) × `seed.ts` (fictício, `demo: true`) | Exemplos aparecem com selo "Demonstração" |
| **Migração versionada do acervo** | Flags `acervo_slides_2026` e `exemplos_portal_2030` | Atualiza o acervo sem apagar o que a equipe editou |
| **Backend NestJS descritivo** | Define desde já o contrato e os módulos (`acervo`, `editorial`) | Pronto para virar a API real sem reescrever o frontend |
| **Imagens redimensionadas no cliente** | Cabem no `localStorage` (máx. 1200 px, WebP) | Uploads de até 10 MB viram cerca de 300 KB |
| **Foto ilustrativa automática** | Edições, temas e categorias sem imagem ficariam sem capa | `displayCover()` escolhe uma foto de robótica e marca o card com "Foto ilustrativa" |

## Módulos do frontend

| Pasta | Responsabilidade |
|---|---|
| `layouts/` | `PublicLayout` (header, skip-link, footer com localização e acesso ao painel) e `AdminLayout` (login com contas de teste, menu lateral por perfil e bloqueio "Acesso restrito") |
| `views/` | `Home`, `PublicCollection` (inclui os marcos históricos em Edições), `PublicDetail`, `Participate`, `Dashboard`, `AdminList`, `Editor`, `AdminUsers` |
| `components/` | `Hero`, `StudentJourney` (jornada do estudante em 4 etapas), `PartnerCarousel` (vitrine de parceiros com pausa), `Timeline` (marcos de 2017 a 2026), `EntryContent` (página de detalhe), `EntryFields` (formulário por coleção), `BlockRenderer`/`BlockSettings` (editor em blocos), `MediaEditor`, `Gallery` |
| `stores/catalog.ts` | Carga e migração, `published()`, `put()` com validações, permissões e histórico, `remove()` com checagem de vínculos, sincronização entre abas |
| `stores/auth.ts` | Contas de demonstração, `signIn()`/`signOut()`, perfil atual e `addAccount()` (só o master) |
| `services/` | `archive.ts` (acervo com fontes), `seed.ts` (exemplos), `content.ts` (fábricas, `slugify`, `safeLink`/`safeImage`, `displayCover`), `images.ts`, `storage.ts` |
| `types/content.ts` | Coleções, status, tipos de bloco e entidade `RecordEntry` |

## Rotas

| Rota | Tela |
|---|---|
| `/` | Home |
| `/edicoes`, `/temas`, `/categorias`, `/noticias`, `/editais` | Coleção pública (`/edicoes#marcos-historicos` abre os marcos) |
| `/<colecao>/:slug` | Detalhe (edição usa o ano como slug: `/edicoes/2026`) |
| `/faca-parte` | Orientações para escolas e parceiros |
| `/admin` | Login e dashboard (colaborador e master) |
| `/admin/noticias` · `/admin/noticias/:id` | Minhas matérias / publicações e editor (colaborador e master) |
| `/admin/nova-publicacao` | Assistente de nova notícia (o master também cria temas) |
| `/admin/:section` · `/admin/:section/:id` · `/admin/:section/novo` | Lista e editor das demais coleções (só master) |
| `/admin/usuarios` | Cadastro de usuários de demonstração (só master) |

## Modelo de dados

Todas as coleções usam a mesma entidade-base `RecordEntry`; o formulário mostra só os campos relevantes para cada uma.

```mermaid
erDiagram
    TEMA ||--o{ EDICAO : "tema principal (themeId)"
    EDICAO }o--o{ CATEGORIA : "categoryIds"
    TEMA }o--o{ CATEGORIA : "categoryIds"
    EDICAO ||--o{ NOTICIA : "editionId"
    EDICAO ||--o{ MARCO_HISTORICO : "editionId"
    EDICAO ||--o{ EDITAL : "editionId"
    RECORD_ENTRY ||--o{ REVISION : "revisions (até 20)"
    RECORD_ENTRY ||--o{ MEDIA : "images"
    RECORD_ENTRY ||--o{ BLOCK : "blocks"
```

### `RecordEntry` (campos principais)

| Grupo | Campos | Observação |
|---|---|---|
| Identidade | `id`, `slug`, `title`, `subtitle`, `description` | `slug` gerado do título; em edições, é o ano |
| Tempo e lugar | `year`, `date`, `period`, `place` | Ano único por edição |
| Números | `teams`, `schools`, `students` | Agregados, nunca nominais |
| Conteúdo | `objective`, `context`, `features`, `results`, `blocks[]` | `results` = projetos e resultados validados |
| Vínculos | `themeId`, `editionId`, `categoryIds[]` | Exclusão bloqueada se houver vínculo |
| Procedência | `sources`, `credits`, `demo` | Exibidos em "Fontes e créditos" e no selo "Demonstração" |
| Mídia | `images[]` (`src`, `alt`, `caption`), `coverId`, `url` | `alt` é editável; `url` passa por `safeLink` |
| Editorial | `status`, `authorId`, `createdAt`, `updatedAt`, `revisions[]` | `status ∈ {draft, pending, published}`; `authorId` guarda quem criou o registro |

### Status

| Valor | Rótulo | Visível no portal |
|---|---|---|
| `draft` | Rascunho | Não |
| `pending` | Pendente de validação | Não (contado no dashboard) |
| `published` | Publicado | Sim |

### Regras aplicadas em `catalog.put()`

- Permissão: o colaborador só salva notícias próprias, como rascunho ou pendente, e não altera matérias já publicadas; o master pode tudo
- Título obrigatório
- Edição: ano válido (1900–9999) e único; para publicar, precisa de tema
- Edital: para publicar, precisa de URL válida
- Conflito: se `updatedAt` mudou em outra aba, o salvamento é recusado
- Cada salvamento acrescenta `{ date, status }` ao histórico (mantém os 20 últimos)

`catalog.remove()` só aceita o administrador master e recusa registros com vínculos.

## API demonstrativa (backend)

Prefixo `/api`, porta `3000` (variável `PORT`), escuta em `127.0.0.1`.

| Método | Endpoint | Retorno atual |
|---|---|---|
| GET | `/api/health` | `{ "status": "ok", "demonstracao": true }` |
| GET | `/api/acervo/edicoes` · `temas` · `categorias` · `linha-do-tempo` | Descrição da entidade e dos campos |
| GET | `/api/editorial/publicacoes` · `editais` · `parceiros` | Descrição da entidade e dos campos |

Hoje os endpoints documentam o contrato. O passo seguinte do backlog é implementar CRUD com banco de dados e trocar `storage.ts` por chamadas HTTP.
