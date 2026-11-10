# QG de Estudos PMPE

Plano de estudos para o concurso de **Soldado da PM-PE (2026)**: grade semanal por blocos, cronograma de 12 semanas, edital com revisões espaçadas, banco de questões (incluindo provas oficiais anteriores), simulados, biblioteca de PDFs com anotações e cronômetro.

Funciona no computador e no celular, com os mesmos dados nos dois.

## Como os dados são salvos

1. **No aparelho, sempre.** Tudo é gravado no navegador assim que você mexe, então funciona sem internet.
2. **Na nuvem, quando conectado.** Com a senha do QG (Ajustes → Nuvem), cada mudança sobe para o servidor e os outros aparelhos recebem em até 15 segundos, ou na hora em que você volta para a aba.
   - Se estiver sem internet, as mudanças ficam marcadas como pendentes e sobem quando a conexão voltar.
   - PDFs ficam no servidor e também numa cópia local de cada aparelho, para abrir rápido.
3. **Backup em arquivo.** Ajustes → Baixar backup gera um `.json` (com ou sem os PDFs) que pode ser restaurado em qualquer aparelho.

O código é público. Os dados não: toda leitura e gravação na API exige a senha, que fica só nas variáveis de ambiente da Vercel.

## Estrutura

```
public/                  site estático (o que a Vercel serve)
  index.html             estrutura das telas
  css/app.css            estilos (tema claro e escuro)
  js/app.js              lógica do app: telas, cronograma, questões, simulados, leitor de PDF, backup
  js/nuvem.js            sincronização com a API (estado, anotações e PDFs)
  data/questoes-oficiais.js  questões de provas anteriores com gabarito oficial
  vendor/                pdf.js 3.11
  icons/, manifest.webmanifest  ícone e instalação na tela inicial do celular
api/                     funções da Vercel (Node)
  _lib.js                senha, Redis e utilidades
  status.js              GET  /api/status
  estado.js              GET/PUT /api/estado     progresso, grade, questões, simulados…
  notas.js               GET/PUT/DELETE /api/notas  anotações dos PDFs
  pdf.js                 GET/POST/DELETE /api/pdf   PDFs em partes de 3,5 MB
analise/                 planilhas de análise das provas e prioridades
```

## Serviços usados

| O quê | Onde | Variáveis de ambiente |
|---|---|---|
| Hospedagem e API | Vercel | — |
| Progresso e anotações | Upstash Redis (Vercel Marketplace) | `KV_REST_API_URL`, `KV_REST_API_TOKEN` |
| PDFs | Vercel Blob | `BLOB_READ_WRITE_TOKEN` |
| Senha do QG | — | `QG_SENHA` |

## Rodar localmente

```bash
npm install
vercel env pull .env.local   # traz as variáveis do projeto
vercel dev
```

## Trocar a senha

Na Vercel: Settings → Environment Variables → `QG_SENHA`, depois faça um novo deploy. Cada aparelho vai pedir a senha nova em Ajustes → Nuvem.
