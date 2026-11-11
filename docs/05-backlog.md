# 05 · Backlog de continuidade

Prioridade: **P1** = próximo passo; **P2** = antes de uso real; **P3** = evolução.

## P1 · Fechar o ciclo do acervo

| # | Item | Valor | Critério de aceite |
|---|---|---|---|
| 1 | **Resultados estruturados por categoria** (pódio: posição, equipe, escola) | Responde "quem venceu?" | Página da edição mostra o pódio de cada categoria; nenhum nome de estudante |
| 2 | **Arquivar em vez de excluir** | Acervo histórico não perde registros | Botão "Excluir" vira "Arquivar"; arquivados ficam fora do portal e podem ser restaurados |
| 3 | **Versões completas e motivo da alteração** | Correção com procedência | Cada revisão guarda o conteúdo anterior e um motivo obrigatório ao atualizar um publicado |
| 4 | **Checklist editorial bloqueando a publicação** | Validação explícita | "Publicar" só habilita com fonte preenchida, `alt` em todas as imagens e a autorização de imagem marcada |
| 5 | **Filtro público por edição e categoria** | Consulta mais rápida | Na home e em /edicoes, filtros combináveis com URL compartilhável |

## P2 · Pronto para uso institucional

| # | Item | Critério de aceite |
|---|---|---|
| 6 | **API real + banco de dados** (NestJS + PostgreSQL) | Os endpoints de `/api/acervo` e `/api/editorial` fazem CRUD; `storage.ts` passa a usar HTTP |
| 7 | **Autenticação e perfis** (editor, validador, administrador) | Quem envia não aprova o próprio conteúdo; sessão com expiração |
| 8 | **Armazenamento de imagens** fora do banco | Upload para um serviço de arquivos; o banco guarda só a URL |
| 9 | **Importação dos Desafios 01 e 02** | Edição encerrada e resultado homologado entram como Rascunho com a fonte preenchida |
| 10 | **Testes automatizados** (Vitest para regras da store; Playwright para o fluxo editorial) | CI roda os testes a cada push |
| 11 | **Auditoria de acessibilidade** (Lighthouse/axe ≥ 90, teste com leitor de tela) | Relatório anexado ao repositório |

## P3 · Evolução

| # | Item |
|---|---|
| 12 | Busca textual em todo o acervo |
| 13 | Página por **escola**: histórico de participação e conquistas da escola (agregado) |
| 14 | Galeria de projetos por tema, com vídeo |
| 15 | Exportação de dados abertos (CSV/JSON) com as fontes |
| 16 | Termo de autorização de imagem digital integrado ao fluxo |
| 17 | Indicadores públicos: evolução de estudantes, equipes e escolas por edição (gráfico) |
