# Tela de Apoiadores — Esquadrão Nerdola

Aplicativo desktop local para transformar uma exportação CSV da plataforma de apoio em uma tela animada, pronta para ser usada como **Fonte de Navegador** no OBS.

## Objetivo

Eliminar a edição manual da lista de apoiadores. O operador importa o CSV, confirma as categorias, escolhe uma identidade visual e exporta uma pasta autocontida. O OBS abre o `index.html` exportado e reproduz a animação em loop, os nomes por categoria e, opcionalmente, a música.

## Decisões de produto

- **Electron, sem servidor:** é um app Windows; o OBS lê um arquivo local. Não há login, banco de dados, API ou servidor para configurar.
- **Exportação autocontida:** HTML, CSS, JavaScript, dados e cópia da música ficam na mesma pasta. A transmissão não depende de CDN, internet ou do app permanecer aberto.
- **Ciclo por categoria:** cada tipo de apoio vira uma tela exclusiva. O título recebe automaticamente o tipo (por exemplo, `... APOIADORES CAPITÃO`) e a tela alterna na duração configurada, inicialmente 5 segundos.
- **Paginação automática:** se os nomes ultrapassarem a área visível, a categoria é repartida em telas consecutivas, com o mesmo título, sem cortar apoiadores.
- **Ordem e cores:** o operador reordena manualmente as telas de categoria e escolhe as três cores que compõem o fundo animado.
- **Filtro obrigatório:** entram somente registros cujo status é equivalente a `Apoios Ativos` / `Apoio Ativo`. O valor pode ser revisado pelo operador antes da exportação.
- **Colunas flexíveis:** o app detecta `Apoiador`, `Recompensa` e `Status da Promessa`, e aceita os nomes alternativos `Faixa de Recompensa` e `Status atual do apoio`.
- **Privacidade:** e-mail, endereço e valores não são exportados; somente nome e categoria.
- **Fidelidade da lista:** cada apoio ativo é mantido na tela, inclusive nomes iguais inseridos por pessoas diferentes.
- **Visual offline:** quatro fundos Canvas nativos, incluindo `Prismas cósmicos`, inspirado na referência. Essa escolha é mais confiável que Vanta.js para um arquivo local no OBS e evita dependências externas.

## Fluxo operacional

1. Abra o app e carregue o CSV exportado pela plataforma.
2. Confira os campos detectados e o texto que identifica apoios ativos.
3. Veja totais, categorias e amostra dos nomes; desmarque categorias que não devem entrar.
4. Escolha fundo, fonte, título, duração por tela e uma música opcional.
5. Exporte a pasta.
6. No OBS, crie uma **Fonte de navegador** local apontando para `index.html` dentro da pasta exportada. Use 1920×1080 e habilite a reprodução de áudio da fonte, se aplicável.

## Versão 1.0.1

Aplicativo Windows com importação local de CSV, limpeza/ordenação, painel de categorias, prévia, fundos em loop, música local e exportação para OBS.

## Evoluções recomendadas

- Salvar e reabrir um perfil de programa (título, categorias e fundo).
- Controle de duração/rolagem automática para listas muito grandes.
- Marca d’água/logo e presets de tipografia por quadro.
- Histórico de exportações e comparação de entradas/saídas entre CSVs.
- Validação de duplicados e alias de nomes.

## Desenvolvimento

Requer Node.js 20+.

```powershell
npm install
npm start
```

Para gerar o instalador Windows:

```powershell
npm run dist
```
