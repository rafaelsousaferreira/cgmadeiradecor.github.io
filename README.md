# C&G Planejados

Site institucional da marcenaria **C&G Planejados** (Camaçari/BA) — catálogo, depoimentos e formulário de orçamento que envia direto pro WhatsApp.

Site 100% estático: roda em GitHub Pages, Netlify, Vercel ou qualquer servidor web simples. Sem backend, sem banco, sem dependências de build.

## Estrutura

```
cg-planejados/
├── index.html           Página inicial (hero, sobre, categorias, destaques, depoimentos, orçamento, contato)
├── produtos.html        Catálogo com busca, filtros e paginação
├── produto.html         Detalhe de um produto (?id=N)
├── depoimentos.html     Lista e formulário de depoimentos
├── 404.html             Página de erro
├── sitemap.xml          Sitemap para crawlers de busca
├── robots.txt           Diretivas para crawlers
├── .nojekyll            Evita o Jekyll processar o site no GitHub Pages
├── LICENSE
├── README.md
└── assets/
    ├── css/style.css
    ├── images/
    │   ├── og-image.jpg     Imagem de compartilhamento (1200×630)
    │   ├── og-image.svg     Fonte da OG image (editável)
    │   └── produtos/        Fotos dos produtos (subir aqui)
    └── js/
        ├── main.js          Utilitários globais + formulário
    ├── css/style.css
    ├── js/
    │   ├── main.js          Utilitários globais, nav, FAB, formulário de orçamento
    │   ├── products.js      Banco de produtos (window.productsDB)
    │   ├── testimonials.js  Banco e tela de depoimentos
    │   ├── catalog.js       Lógica da página de catálogo
    │   ├── product.js       Lógica da página de produto individual
    │   └── partials.js      Componentes HTML reutilizáveis (nav, footer, FAB)
    └── images/produtos/     Imagens dos produtos (vazia — ver abaixo)
```

## Como editar

### Mudar o número do WhatsApp

Um único lugar. Abra `assets/js/main.js` e altere:

```js
WA.config = {
  whatsappNumber: '5571981804578',   // ← edite aqui (formato internacional, só dígitos)
  ...
};
```

O formato é `55` + DDD + número, sem traços, espaços, parênteses ou o sinal `+`. Esse é o único formato aceito por `wa.me`.

### Mudar e-mail / endereço / horário

`assets/js/main.js` (e-mail) e `assets/js/partials.js` (endereço e horário, dentro de `WA.renderFooter`). No `index.html` há também o bloco da seção Contato com endereço e horário visíveis.

### Adicionar, editar ou remover um produto

Edite `assets/js/products.js`. Cada produto é um objeto:

```js
{
  id: 16,                                    // único, incremental
  nome: 'Nome do Produto',
  slug: 'nome-do-produto',                   // pra URL, opcional
  categoria: 'mobiliario',                   // ver chaves em window.CATEGORIAS
  subcategoria: 'mesas',                     // opcional, ver SUBCATEGORIAS
  descricao: 'Resumo curto (até ~110 chars).',
  descricao_completa: '<p>HTML descritivo livre.</p>',
  imagens: ['assets/images/produtos/nome-1.jpg', 'assets/images/produtos/nome-2.jpg'],
  tags: ['madeira', 'mesa'],
  preco: 890.00,
  destaque: true,                            // aparece na home e topo do catálogo
  mercado_livre_url: 'https://...',          // opcional; sem isto, o botão ML some
  estoque: 3,
  sku: 'XX-016',
  peso: '15kg',
  dimensoes: '80×70×75 cm',
  prazo_fabricacao: '12 dias',
  regional: false                            // true = entrega só em Salvador/RMS
}
```

### Adicionar imagens reais

A pasta `assets/images/produtos/` está vazia de propósito. Suba suas fotos com os nomes que estão no campo `imagens` de cada produto em `products.js`. Por exemplo:

- `assets/images/produtos/tabua-corte-1.jpg`
- `assets/images/produtos/tabua-corte-2.jpg`
- `assets/images/produtos/mesa-1.jpg`
- etc.

**Enquanto não tiver fotos**, o site mostra um SVG placeholder com a paleta da categoria. Não quebra.

**Recomendações pras fotos:**
- Proporção 4:3 (ex.: 1600×1200) — é a do card e da galeria principal
- JPEG com qualidade ~80% (entre 100kb e 250kb por imagem)
- Fundo neutro ou contextualizado, luz natural
- A primeira imagem do array é a capa do produto

### Adicionar um depoimento

Edite `assets/js/testimonials.js`. Cada depoimento é:

```js
{
  id: 6,
  nome: 'Nome do Cliente',
  cidade: 'Cidade, UF',
  produto: 'Nome exato do produto',  // texto livre
  avaliacao: 5,                       // 1 a 5
  comentario: 'O depoimento em si.',
  data: '2025-03-20',                 // formato ISO
  destaque: true                      // opcional, aparece na home
}
```

Quando alguém envia um depoimento pelo site, ele **não é salvo automaticamente** — chega no seu WhatsApp pra você decidir publicar. Pra publicar, edite este arquivo.

## Como o formulário de orçamento funciona

Cliente preenche os campos → o JS valida, sanitiza e monta uma mensagem formatada → abre uma aba do WhatsApp com a mensagem pronta. Você só recebe e responde.

Não há backend. Os dados **não são armazenados em lugar nenhum**: vão direto da página pro WhatsApp via `wa.me/`.

Há um campo invisível (honeypot) que bots costumam preencher; se vier preenchido, o envio é descartado silenciosamente.

## Deploy no GitHub Pages

1. Suba o conteúdo desta pasta para a raiz de um repositório no GitHub.
2. Vá em **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**, branch `main` (ou `master`), pasta `/ (root)`.
4. Salve. Em 1–2 minutos o site fica no ar em `https://USUARIO.github.io/REPO/`.
5. Pra usar domínio próprio, configure em **Settings → Pages → Custom domain** e ajuste o DNS.

O `.nojekyll` na raiz é importante — ele impede que o GitHub Pages tente processar o site com Jekyll (que pulariam arquivos começando com `_` etc).

## Segurança

- Todas as páginas têm **Content-Security-Policy** restritiva: scripts só do próprio site, fontes só do Google Fonts, iframes só do Google Maps.
- Sanitização de entradas antes de qualquer escrita em DOM ou abertura de URL.
- Campo honeypot anti-bot nos formulários.
- iframes com `referrerpolicy="no-referrer-when-downgrade"`.
- Sem `eval` (direto ou indireto via `onclick="${function}"`).
- Sem dependências de terceiros em runtime — só Google Fonts (e isso é opcional).

## Performance

- Sem framework, sem build step.
- Apenas **uma** stylesheet (CSS) e o necessário de JS por página.
- Ícones SVG inline (sem Font Awesome).
- Imagens com `loading="lazy"` e `decoding="async"`.
- Placeholders SVG inline (data URL) — não precisa fazer requisição.

## Licença

MIT. Ver `LICENSE`.

## SEO

O site tem SEO completo configurado:

- **Meta tags únicas por página**: title, description, canonical, hreflang
- **Open Graph**: imagem 1200×630, título, descrição (Facebook, WhatsApp, LinkedIn)
- **Twitter Cards**: summary_large_image
- **JSON-LD estruturado**:
  - Home: `LocalBusiness` + `FurnitureStore` + `WebSite` com SearchAction
  - Catálogo: `CollectionPage` + `ItemList` (todos os 15 produtos)
  - Página de produto: `Product` com preço, disponibilidade, imagem (gerado dinamicamente)
  - Depoimentos: `Organization` com `aggregateRating` real
  - Breadcrumbs em todas as páginas internas
- **Sitemap.xml** com 24 URLs (páginas + produtos + filtros de categoria)
- **Robots.txt** com sitemap declarado

### Após subir para produção

1. **Google Search Console** (https://search.google.com/search-console):
   - Adicione a propriedade `https://cgplanejados.com.br`
   - Confirme propriedade (DNS ou HTML tag)
   - Submeta o sitemap: `https://cgplanejados.com.br/sitemap.xml`

2. **Google Business Profile** (https://www.google.com/business):
   - Reivindique/crie o perfil de C&G Planejados em Camaçari
   - Use os dados do JSON-LD `LocalBusiness` para preencher

3. **Bing Webmaster Tools** (opcional): submeta o sitemap também.

### Testar antes de publicar

- **Rich Results Test** (Google): https://search.google.com/test/rich-results — cole o URL ou o HTML para validar JSON-LD
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/ — testa OG image
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Schema Markup Validator**: https://validator.schema.org/

### Editar OG image

O arquivo fonte está em `assets/images/og-image.svg`. Para regerar a `og-image.jpg`:
- Edite o SVG
- Use qualquer conversor SVG→JPG (Inkscape, browser print, ferramentas online) para 1200×630px, qualidade 85
