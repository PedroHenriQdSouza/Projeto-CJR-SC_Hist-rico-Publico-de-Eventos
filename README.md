# CJR · Histórico Público do Campeonato Joinvilense de Robótica

> Portal público e painel de curadoria para **preservar, organizar e divulgar** a história do Campeonato Joinvilense de Robótica (CJR).
> Proposta da equipe para o **Desafio 03 — Histórico Público do Evento** do Hackathon UniSENAI · ADS · Novembro/2026.

![Status](https://img.shields.io/badge/status-MVP%20demonstrável-0b6b75) ![Vue](https://img.shields.io/badge/Vue-3.5-42b883) ![NestJS](https://img.shields.io/badge/NestJS-11-e0234e) ![Dados](https://img.shields.io/badge/dados-fictícios%20ou%20públicos-orange)

---

## O problema

O CJR é uma iniciativa da Rede Municipal de Ensino de Joinville. Começou em 2021 com **28 estudantes em 7 equipes**. Em 2026, na 6ª edição, chegou a **69 equipes de 35 escolas, com mais de 250 estudantes** (312, segundo a apresentação oficial).

Essa trajetória está **espalhada** entre matérias publicadas, apresentações e o acervo interno da Secretaria de Educação. Não existe um espaço público e estruturado que reúna edições, temas, categorias, vencedores e projetos. Isso dificulta a consulta e coloca em risco a memória do campeonato.

## A solução

Um portal com duas faces:

| Portal público | Painel de curadoria (`/admin`) |
|---|---|
| Linha do tempo de 2017 até a edição atual | Cadastro de edições, temas, categorias, notícias, editais, parceiros e marcos |
| Páginas de **edição**, **tema** e **categoria** ligadas entre si | **Fluxo editorial**: Rascunho → Pendente de validação → Publicado |
| **Fonte e créditos** em cada conteúdo | **Histórico de alterações** por registro e opção "Retirar do ar" |
| Exibe **somente conteúdo publicado** | Editor de publicações em blocos (texto, imagens, galeria, botão) |

O diferencial está na **procedência**. Todo registro guarda de onde veio a informação ("Apresentação CJR 2026 · slide 13", por exemplo), e nada aparece no portal sem passar pela etapa de publicação.

## Como executar

**Pré-requisitos:** Node.js 20 ou superior e npm 10 ou superior.

```bash
# 1. Instalar dependências (npm workspaces: frontend + backend)
npm install

# 2. Subir o portal (Vite)
npm run dev
# → http://127.0.0.1:5173

# 3. (Opcional) Subir a API demonstrativa em outro terminal
npm run dev:api
# → http://127.0.0.1:3000/api/health
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Portal público + painel admin em modo desenvolvimento |
| `npm run dev:api` | API NestJS demonstrativa com recarga automática |
| `npm run build` | Checagem de tipos (`vue-tsc`) e build de produção do frontend e do backend |

**Painel administrativo:** acesse `http://127.0.0.1:5173/admin` e clique em **Entrar no painel**. O acesso é simulado e não pede senha (veja [Limitações](#limitações-conhecidas)).

**Recomeçar do zero:** os dados ficam no `localStorage` do navegador. Para restaurar o acervo inicial, apague as chaves `cjr_*` em DevTools → Application → Local Storage, ou abra o portal numa janela anônima.

## Roteiro de demonstração (2 minutos)

1. **Home**: apresentação do campeonato → atalhos → "Nossa história" com a fonte → **linha do tempo** de 2017 a 2026.
2. Clique em **6ª edição** e veja o cartaz, os números (69 equipes, 35 escolas, 312 estudantes), o local, o tema e as fontes.
3. Abra **Temas** e **Categorias** e repare que tudo se liga (tema → edições; categoria → edições).
4. Entre em **Área administrativa** → **Edições** → abra uma edição e preencha "Projetos e resultados validados".
5. Clique em **Enviar para validação**. O status muda para *Pendente de validação* e o conteúdo **não aparece** no portal.
6. Clique em **Aprovar e publicar** e confirme. O conteúdo aparece no portal com a fonte, e o **histórico de alterações** registra cada etapa.

## Funcionalidades

**Portal público**
- Home com hero, atalhos, história, linha do tempo, notícias e parceiros
- Coleções: Edições, Temas, Categorias, Notícias e Editais (com filtro por ano)
- Página de detalhe com fatos (período, local, equipes, escolas, estudantes), resultados, galeria, conteúdos relacionados e **Fontes e créditos**
- Página "Faça parte" para escolas e parceiros
- Conteúdo de exemplo marcado como **"Demonstração"**

**Curadoria**
- Dashboard com contadores e **publicações pendentes**
- CRUD das 7 coleções, com vínculos entre edição, tema e categoria
- Fluxo de status com confirmação antes de publicar ou retirar do ar
- Histórico das últimas 20 alterações por registro
- Editor em blocos com pré-visualização
- Upload de imagens com redimensionamento automático, **texto alternativo** e legenda

**Qualidade e segurança**
- Validações de negócio: ano único por edição, tema obrigatório para publicar, URL válida em editais
- Exclusão bloqueada quando o registro tem vínculos
- Detecção de edição simultânea em outra aba
- Sanitização de links e imagens (só `http(s)`, caminhos relativos e `data:image` válido) e nenhum `v-html`
- Acessibilidade: link "pular para o conteúdo", foco visível, `aria-*` nos controles, `prefers-reduced-motion` e `lang="pt-BR"`

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | Vue 3.5 + TypeScript, Vite 6, Pinia 3, Vue Router 4, Bootstrap 5.3, Bootstrap Icons |
| Backend (demonstrativo) | NestJS 11 + TypeScript (endpoints que descrevem o contrato das entidades) |
| Persistência do MVP | `localStorage` do navegador, com camada isolada em `services/storage.ts` |
| Organização | npm workspaces (`frontend/` e `backend/`) |

## Estrutura do repositório

```
CJR/
├── backend/                 API NestJS demonstrativa (contratos /api/acervo e /api/editorial)
│   └── src/main.ts
├── frontend/
│   ├── public/              imagens do acervo e PDF de edital demonstrativo
│   └── src/
│       ├── components/      Hero, Timeline, Navbar, EntryContent, editor de blocos e mídia…
│       ├── layouts/         PublicLayout (portal) e AdminLayout (curadoria)
│       ├── views/           Home, coleções, detalhe, Dashboard, listas e Editor
│       ├── stores/          catalog.ts: estado, regras de negócio e fluxo de status
│       ├── services/        archive.ts (acervo real), seed.ts (exemplos), storage, imagens
│       ├── types/           content.ts: modelo de dados e status
│       └── router/
├── docs/                    documentação do projeto (ver abaixo)
└── package.json             scripts e workspaces
```

## Documentação

| Documento | Conteúdo |
|---|---|
| [01 · Problema e escopo](docs/01-problema-e-escopo.md) | Problema priorizado, atores, justificativa, escopo do MVP e fluxo principal |
| [02 · Arquitetura e modelo de dados](docs/02-arquitetura.md) | Componentes, decisões técnicas e entidades |
| [03 · Interoperabilidade](docs/03-interoperabilidade.md) | Fronteiras com os outros dois desafios, dados compartilhados e responsabilidades |
| [04 · Fluxo editorial, privacidade e acessibilidade](docs/04-editorial-privacidade.md) | Critérios de publicação, LGPD, segurança e correções |
| [05 · Backlog de continuidade](docs/05-backlog.md) | Próximos passos priorizados |
| [06 · Uso de ferramentas de IA](docs/06-uso-de-ia.md) | Declaração de ferramentas de IA e finalidades |

## Fontes dos dados

- **Apresentação do Campeonato Joinvilense de Robótica 2026** (Secretaria de Educação de Joinville): marcos de 2017 a 2021, temas das 6 edições, 7 categorias e número de estudantes por edição. Cada registro cita o slide de origem.
- **Briefing oficial do Desafio 03** (10/11/2026): 69 equipes e 35 escolas em 2026.
- **Conteúdo fictício**: a "Edição demonstrativa de 2030" e seus vínculos, além de notícias, edital e parceiro de exemplo. Todos aparecem marcados como *Demonstração*.

Não há nomes, imagens ou dados pessoais de estudantes, professores ou servidores.

## Limitações conhecidas

- **Persistência local:** os dados vivem no navegador de quem acessa (limite de cerca de 5 MB) e não são compartilhados entre computadores.
- **Autenticação simulada:** não há login real nem separação entre os papéis de editor e validador. A mesma sessão envia para validação e aprova.
- **Histórico parcial:** o histórico registra data e status de cada alteração, mas não guarda o conteúdo anterior nem o motivo da correção.
- **Resultados em texto livre:** "Projetos e resultados" ainda não tem estrutura de pódio por categoria.
- **API apenas descritiva:** o backend expõe o contrato das entidades, mas o frontend ainda não consome a API.
- **Exclusão definitiva:** a exclusão ainda existe (bloqueada quando há vínculos). Num acervo histórico, o ideal é arquivar.
- **Sem testes automatizados** e sem busca textual.

Os itens acima estão priorizados no [backlog](docs/05-backlog.md).

## Equipe

| Integrante | Papel |
|---|---|
| _Nome_ | _Ex.: desenvolvimento frontend_ |
| _Nome_ | _Ex.: curadoria de dados e documentação_ |
| _Nome_ | _Ex.: UX e pitch_ |

## Licença e autoria

Material acadêmico produzido no Hackathon UniSENAI, em parceria com a Secretaria de Educação de Joinville. Conforme o regulamento, qualquer cessão, licenciamento ou implantação depende de instrumento jurídico e validação institucional próprios.
