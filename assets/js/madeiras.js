/* =====================================================================
   C&G PLANEJADOS — madeiras.js
   Dados das 7 madeiras + renderização das cards e tabela comparativa.
   ===================================================================== */
'use strict';

(function () {
  // ============== DADOS ==============
  // Cada madeira: dados visuais + estrutura informacional rica para SEO.

  var MADEIRAS = [
    {
      id: 'pinus',
      nome: 'Pinus',
      cientifico: 'Pinus elliottii',
      color: '#d9b88a',
      origem: 'Reflorestamento nacional, principalmente Sul do Brasil',
      cor: 'Clara, amarelada, quase creme',
      dureza: 2, // 1-5
      preco: 1,  // 1-5
      dureza_label: 'Macia',
      preco_label: 'Econômica',
      lead: 'A madeira de entrada: leve, clara e fácil de trabalhar.',
      descricao: 'Pinus é uma das madeiras mais usadas no Brasil — quase toda vem de reflorestamento, então é amplamente disponível e tem o preço mais baixo entre as opções. A cor clara amarelada combina bem com pintura ou laca colorida. É macia, o que significa fácil de cortar e parafusar, mas também propensa a marcas e arranhões em uso pesado.',
      indicada_para: [
        'Estantes e prateleiras em peças pintadas',
        'Móveis de criança ou peças que serão repintadas com o tempo',
        'Bases e estruturas que ficam invisíveis (ex: dentro de armários)',
        'Quem busca preço acessível com bom acabamento de pintura'
      ],
      evitar: [
        'Tampos de mesa em uso pesado (risca facilmente)',
        'Áreas com muita umidade sem tratamento adequado',
        'Peças expostas a peso constante (pode deformar com o tempo)'
      ],
      nota: 'Pra quem quer começar com madeira maciça sem investir muito, é ótima escolha. Ficar bem com Pinus depende muito do acabamento — um bom verniz ou laca disfarça a maciez e protege a peça por anos.'
    },
    {
      id: 'eucalipto',
      nome: 'Eucalipto',
      cientifico: 'Eucalyptus spp.',
      color: '#b08866',
      origem: 'Reflorestamento brasileiro, larga escala',
      cor: 'Bege rosado a marrom claro',
      dureza: 3,
      preco: 2,
      dureza_label: 'Média',
      preco_label: 'Acessível',
      lead: 'Versátil, sustentável e mais resistente que parece.',
      descricao: 'O Eucalipto brasileiro é praticamente todo de reflorestamento — é uma das madeiras mais sustentáveis disponíveis. Tratado corretamente, comporta-se bem em ambientes úmidos e até externos. A cor varia de bege rosado a marrom claro dependendo da espécie, e o veio pode ser bem marcado.',
      indicada_para: [
        'Móveis externos ou em áreas úmidas (varanda, churrasqueira coberta)',
        'Decks, pergolados e estruturas que veem chuva',
        'Bancos de jardim e mobiliário rústico',
        'Peças em estilo industrial ou rústico'
      ],
      evitar: [
        'Quem busca acabamento muito polido — o veio costuma ser irregular',
        'Móveis muito delicados com encaixes finos'
      ],
      nota: 'Subestimada por muita gente. Bem tratado, o Eucalipto entrega móveis sólidos por décadas e tem credencial ambiental forte.'
    },
    {
      id: 'freijo',
      nome: 'Freijó',
      cientifico: 'Cordia goeldiana',
      color: '#a87a52',
      origem: 'Amazônia brasileira (Pará, Amazonas)',
      cor: 'Castanho amarelado a marrom dourado',
      dureza: 3,
      preco: 3,
      dureza_label: 'Média',
      preco_label: 'Intermediária',
      lead: 'A queridinha dos arquitetos — equilíbrio entre beleza e preço.',
      descricao: 'Freijó é provavelmente a madeira mais pedida no nosso ateliê. Tem cor quente, veio elegante mas discreto, trabalhabilidade excelente e custo intermediário. Aceita bem qualquer acabamento, do natural ao verniz. É uma madeira nobre brasileira com boa disponibilidade.',
      indicada_para: [
        'Mesas de jantar e escrivaninhas',
        'Estantes e bibliotecas onde a madeira fica à mostra',
        'Móveis em estilo escandinavo ou mid-century',
        'Painéis e estofados com estrutura de madeira aparente'
      ],
      evitar: [
        'Ambientes externos sem proteção (não é tão resistente quanto Eucalipto pra fora)',
        'Quem busca cor muito escura — Freijó é dourado, não marrom escuro'
      ],
      nota: 'Quando o cliente não sabe escolher e quer "uma madeira bonita que custe um valor justo", a resposta quase sempre é Freijó. Difícil errar.'
    },
    {
      id: 'cedro',
      nome: 'Cedro',
      cientifico: 'Cedrela odorata',
      color: '#8a5d39',
      origem: 'Floresta atlântica e amazônica',
      cor: 'Rosado avermelhado a marrom médio',
      dureza: 3,
      preco: 4,
      dureza_label: 'Média',
      preco_label: 'Alta',
      lead: 'Leveza incomum e aroma característico — a madeira dos charutos.',
      descricao: 'Cedro é uma madeira nobre conhecida internacionalmente pelo aroma característico (é a madeira usada em caixas de charuto). Apesar da boa durabilidade, é surpreendentemente leve — peças grandes em Cedro são mais fáceis de mover que o esperado. Tem cor avermelhada que escurece com o tempo, ganhando tons amarronzados.',
      indicada_para: [
        'Guarda-roupas e baús (o aroma repele traças naturalmente)',
        'Móveis que serão deslocados (mais leves)',
        'Peças que pedem cor avermelhada natural',
        'Trabalhos finos com entalhe'
      ],
      evitar: [
        'Ambientes muito úmidos por longos períodos',
        'Quem prefere madeiras de cor estável (Cedro escurece com o tempo)'
      ],
      nota: 'Tem uma característica única: o cheiro. Abrir um armário de Cedro pela primeira vez é experiência sensorial que outras madeiras não dão.'
    },
    {
      id: 'carvalho',
      nome: 'Carvalho',
      cientifico: 'Quercus spp.',
      color: '#6a4626',
      origem: 'Europa e América do Norte, importado',
      cor: 'Marrom médio a claro com veio bem marcado',
      dureza: 4,
      preco: 4,
      dureza_label: 'Dura',
      preco_label: 'Alta',
      lead: 'A madeira nobre dos clássicos — veio inconfundível, resistência lendária.',
      descricao: 'Carvalho (oak) é uma madeira clássica europeia, importada, com veio marcadamente visível e tons quentes. Tem dureza alta — móveis em Carvalho aguentam uso pesado por gerações. Aceita acabamentos diversos, do natural ao envelhecido artificialmente.',
      indicada_para: [
        'Tampos de mesa em uso pesado (cozinha, jantar)',
        'Pisos, balcões e bancadas',
        'Móveis que devem durar décadas com pouco desgaste',
        'Estilos rústicos, industriais e clássicos'
      ],
      evitar: [
        'Quem busca tons claros uniformes (Carvalho sempre tem variação)',
        'Orçamentos muito apertados — é uma das madeiras mais caras'
      ],
      nota: 'Quando o cliente diz "quero algo que dure pra vida toda e dos filhos", Carvalho está no topo da lista junto com Imbuia.'
    },
    {
      id: 'imbuia',
      nome: 'Imbuia',
      cientifico: 'Ocotea porosa',
      color: '#4a2e1c',
      origem: 'Mata Atlântica (Paraná, Santa Catarina)',
      cor: 'Marrom escuro com veios pretos',
      dureza: 5,
      preco: 5,
      dureza_label: 'Muito dura',
      preco_label: 'Premium',
      lead: 'Nobre, escura, densa — a madeira dos móveis que viram herança.',
      descricao: 'Imbuia é uma das madeiras nobres brasileiras mais valorizadas. Tem cor marrom escura quase preta em alguns trechos, veio com desenho dramático, dureza alta e densidade excelente. É a madeira preferida pra peças que precisam ter presença visual e durabilidade extrema. Disponibilidade limitada faz dela uma das mais caras.',
      indicada_para: [
        'Mesas e aparadores como peça de destaque',
        'Móveis em estilo clássico ou contemporâneo sóbrio',
        'Peças únicas ou de coleção',
        'Quem busca cor escura natural sem precisar tingir'
      ],
      evitar: [
        'Orçamentos modestos',
        'Ambientes claros que pedem madeiras de cor mais leve'
      ],
      nota: 'Imbuia tem um peso simbólico: é a madeira que avós tinham, que aparece em móveis dos anos 50 e 60 que ainda estão impecáveis. É um investimento.'
    },
    {
      id: 'demolicao',
      nome: 'Madeira de demolição',
      cientifico: 'Várias espécies (Peroba, Ipê, Maçaranduba, Jatobá)',
      color: '#5a3a20',
      origem: 'Construções e fazendas antigas brasileiras',
      cor: 'Variável — castanho a marrom escuro, com marcas',
      dureza: 5,
      preco: 4,
      dureza_label: 'Muito dura',
      preco_label: 'Variável',
      lead: 'Cada peça é única — madeira com história, marcas e densidade que não se fabrica mais.',
      descricao: 'Madeira de demolição vem de construções antigas — fazendas, casarões, galpões. São madeiras nobres (Peroba, Ipê, Maçaranduba, Jatobá) que cresceram décadas ou séculos. Cada peça tem marcas: furos de pregos, sinais de cupim já tratados, mudanças de cor, irregularidades no veio. Esses "defeitos" são exatamente o atrativo — você não consegue forjar essa textura.',
      indicada_para: [
        'Mesas de jantar com personalidade marcante',
        'Tampos rústicos, balcões de bar e cozinhas industriais',
        'Quem valoriza sustentabilidade e reaproveitamento',
        'Peças únicas pra ambientes que pedem caráter'
      ],
      evitar: [
        'Quem prefere acabamentos perfeitos e uniformes',
        'Móveis com encaixes muito finos (a madeira pode ter trincas tratadas)'
      ],
      nota: 'O processo de preparar madeira de demolição é trabalhoso: tirar pregos, limpar, tratar, planejar onde os "defeitos" vão aparecer na peça final. Mas o resultado tem alma de uma forma que madeira nova não consegue.'
    }
  ];

  // ============== RENDERIZAR CARDS ==============
  function renderCards() {
    var container = document.getElementById('madeiras-grid');
    if (!container) return;

    var html = MADEIRAS.map(function (m, i) {
      var alt = i % 2 === 1; // alterna lado da foto vs texto
      return '' +
        '<article class="mad-card" id="' + m.id + '">' +
          '<div class="container mad-card-grid' + (alt ? ' mad-card-grid-alt' : '') + '">' +
            renderVisual(m) +
            renderText(m) +
          '</div>' +
        '</article>';
    }).join('');
    container.innerHTML = html;
  }

  function renderVisual(m) {
    return '' +
      '<div class="mad-visual">' +
        '<div class="mad-swatch-big" style="background:' + m.color + '">' +
          WA.woodSwatch(m.id, { width: 280, height: 200, intensity: 0.32, knots: 2 }) +
          '<div class="mad-swatch-label">' +
            '<div class="mad-swatch-name">' + WA.escapeHTML(m.nome) + '</div>' +
            '<div class="mad-swatch-cientifico"><em>' + WA.escapeHTML(m.cientifico) + '</em></div>' +
          '</div>' +
        '</div>' +
        '<div class="mad-meta-grid">' +
          metaItem('Origem',   m.origem) +
          metaItem('Cor',      m.cor) +
          metaItemStars('Dureza',  m.dureza, m.dureza_label) +
          metaItemStars('Preço',   m.preco,  m.preco_label) +
        '</div>' +
      '</div>';
  }

  function renderText(m) {
    return '' +
      '<div class="mad-text">' +
        '<div class="eyebrow">' + WA.escapeHTML(m.nome) + '</div>' +
        '<h2 class="mad-card-title">' + WA.escapeHTML(m.lead) + '</h2>' +
        '<p class="mad-desc">' + WA.escapeHTML(m.descricao) + '</p>' +

        '<div class="mad-use-grid">' +
          '<div class="mad-use mad-use-good">' +
            '<h3>' + iconCheck() + ' Indicada para</h3>' +
            '<ul>' +
              m.indicada_para.map(function (it) {
                return '<li>' + WA.escapeHTML(it) + '</li>';
              }).join('') +
            '</ul>' +
          '</div>' +
          '<div class="mad-use mad-use-bad">' +
            '<h3>' + iconWarn() + ' Pense duas vezes em</h3>' +
            '<ul>' +
              m.evitar.map(function (it) {
                return '<li>' + WA.escapeHTML(it) + '</li>';
              }).join('') +
            '</ul>' +
          '</div>' +
        '</div>' +

        '<aside class="mad-note">' +
          '<div class="mad-note-label">Observação do ateliê</div>' +
          '<p>' + WA.escapeHTML(m.nota) + '</p>' +
        '</aside>' +

        '<div class="mad-cta">' +
          '<a href="configurador.html?madeira=' + m.id + '" class="btn btn-primary">Use ' + WA.escapeHTML(m.nome) + ' no orçamento ' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' +
          '</a>' +
        '</div>' +
      '</div>';
  }

  function metaItem(label, value) {
    return '<div class="mad-meta-item">' +
      '<dt>' + label + '</dt>' +
      '<dd>' + WA.escapeHTML(value) + '</dd>' +
    '</div>';
  }

  function metaItemStars(label, value, valueLabel) {
    var stars = '';
    for (var i = 1; i <= 5; i++) {
      stars += '<span class="mad-star ' + (i <= value ? 'filled' : '') + '">' + (i <= value ? '●' : '○') + '</span>';
    }
    return '<div class="mad-meta-item">' +
      '<dt>' + label + '</dt>' +
      '<dd><div class="mad-stars" aria-label="' + label + ': ' + value + ' de 5">' + stars + '</div><span class="mad-stars-label">' + WA.escapeHTML(valueLabel) + '</span></dd>' +
    '</div>';
  }

  function iconCheck() {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
  }
  function iconWarn() {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>';
  }

  // ============== TABELA COMPARATIVA ==============
  function renderComparativo() {
    var tbody = document.getElementById('mad-comparativo-tbody');
    if (!tbody) return;
    tbody.innerHTML = MADEIRAS.map(function (m) {
      var stars = function (n) {
        var out = '';
        for (var i = 1; i <= 5; i++) out += i <= n ? '●' : '○';
        return out;
      };
      var indicacao = m.indicada_para[0] || '';
      return '<tr>' +
        '<td><a href="#' + m.id + '"><span class="mad-table-swatch" style="background:' + m.color + '"></span>' + WA.escapeHTML(m.nome) + '</a></td>' +
        '<td>' + WA.escapeHTML(m.cor) + '</td>' +
        '<td><span class="mad-table-dots" title="' + m.dureza + ' de 5">' + stars(m.dureza) + '</span></td>' +
        '<td><span class="mad-table-dots" title="' + m.preco + ' de 5">' + stars(m.preco) + '</span></td>' +
        '<td>' + WA.escapeHTML(indicacao) + '</td>' +
      '</tr>';
    }).join('');
  }

  // ============== INIT ==============
  document.addEventListener('DOMContentLoaded', function () {
    renderCards();
    renderComparativo();
  });
})();
