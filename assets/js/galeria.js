/* =====================================================================
   C&G PLANEJADOS — galeria.js
   Galeria antes & depois: 6 projetos com sliders de cortina.
   ===================================================================== */
'use strict';

(function () {
  // ============== DADOS ==============
  // Cada projeto tem: id, título, categoria, tempo, madeira, história, SVGs
  // antes/depois (mesma viewBox pra alinhar perfeitamente).

  var PROJETOS = [
    {
      id: 'mesinha-canto',
      titulo: 'A mesinha que ganhou o canto do sofá.',
      cliente: 'Apartamento em Vilas de Abrantes',
      categoria: 'Mesinha lateral',
      tempo: '2 semanas',
      madeira: 'Freijó',
      madeira_id: 'freijo',
      historia: 'O canto direito do sofá vivia recebendo copo no chão e revista empilhada. A cliente queria uma mesinha pequena, alta o suficiente pra um copo, baixa o suficiente pra não dominar a sala. Fizemos em Freijó com tampo redondo de 35 cm, pé central torneado, e uma gavetinha quase invisível embaixo do tampo pra esconder controle remoto e fone.',
      antes: cozinhaAntes,
      depois: cozinhaDepois
    },
    {
      id: 'mesa-imbuia',
      titulo: 'A mesa da bisavó, com mais uns 80 anos pela frente.',
      cliente: 'Cliente: Mariana C., Salvador',
      categoria: 'Restauração',
      tempo: '4 semanas',
      madeira: 'Imbuia (original)',
      madeira_id: 'imbuia',
      historia: 'Mesa redonda em Imbuia maciça herdada da bisavó da Mariana. Chegou com tampo manchado por décadas de uso, uma perna trincada por queda, e o pé central balançando. Não havia o que substituir — a madeira era boa demais. Tratamos cada peça separadamente, refizemos os encaixes do pé central e devolvemos o brilho da Imbuia com óleo e cera.',
      antes: mesaAntes,
      depois: mesaDepois
    },
    {
      id: 'trio-prateleiras',
      titulo: 'Três prateleiras que organizaram uma vida.',
      cliente: 'Sala de estar em Pituba',
      categoria: 'Prateleiras decorativas',
      tempo: '2 semanas',
      madeira: 'Carvalho',
      madeira_id: 'carvalho',
      historia: 'Cliente tinha livros, plantas pequenas e uns objetos afetivos sem lugar. Queria algo decorativo, não uma estante grande. Fizemos um trio de prateleiras suspensas em Carvalho, com profundidades diferentes (15, 20 e 25 cm) montadas em altura escalonada na parede. Pequeno detalhe: a fixação é invisível, parecem flutuar.',
      antes: dormAntes,
      depois: dormDepois
    },
    {
      id: 'cadeira-avo',
      titulo: 'A cadeira do avô — antes que perdesse a história.',
      cliente: 'Cliente: João R., Lauro de Freitas',
      categoria: 'Restauração',
      tempo: '3 semanas',
      madeira: 'Cedro (original)',
      madeira_id: 'cedro',
      historia: 'Cadeira de balanço dos anos 70 herdada do avô do João. Estrutura comprometida — cupim já tratado, mas duas hastes precisavam ser refeitas. Encordoamento do assento, que era de palha trançada, completamente desgastado. Refizemos com palhinha indiana mesma técnica, mantendo a estrutura original onde a madeira ainda tinha vida.',
      antes: cadeiraAntes,
      depois: cadeiraDepois
    },
    {
      id: 'castical-imbuia',
      titulo: 'Castiçais que viraram presença na mesa.',
      cliente: 'Sala de jantar, Itapuã',
      categoria: 'Peça decorativa autoral',
      tempo: '2 semanas',
      madeira: 'Imbuia',
      madeira_id: 'imbuia',
      historia: 'Cliente queria peças decorativas em Imbuia pra uma mesa de jantar grande, sem usar prata ou vidro. Desenhamos um trio de castiçais altos (35, 28 e 22 cm) em Imbuia maciça, torneados manualmente. A escuridão natural da madeira contrasta com qualquer toalha clara, e dá uma presença escultural na mesa mesmo sem velas acesas.',
      antes: estanteAntes,
      depois: estanteDepois
    },
    {
      id: 'bandeja-demolicao',
      titulo: 'Uma bandeja com 80 anos de história visível.',
      cliente: 'Cozinha em Buraquinho',
      categoria: 'Peça em demolição',
      tempo: '2 semanas',
      madeira: 'Peroba de demolição',
      madeira_id: 'demolicao',
      historia: 'A cliente queria uma bandeja pra servir café da manhã na cama nos fins de semana — mas algo que tivesse cara, não bandeja de loja. Fizemos em Peroba de demolição (tábua que veio de uma casa antiga em Salvador), com puxadores laterais em corda náutica e bordas levemente erguidas. As marcas do tempo na madeira ficaram visíveis de propósito.',
      antes: banheiroAntes,
      depois: banheiroDepois
    }
  ];

  // ============== RENDERIZAÇÃO ==============
  function render() {
    var container = document.getElementById('galeria-grid');
    if (!container) return;

    var html = PROJETOS.map(function (p, i) {
      var alt = i % 2 === 1;
      return '' +
        '<article class="ga-item" id="' + p.id + '">' +
          '<div class="container ga-grid' + (alt ? ' ga-grid-alt' : '') + '">' +
            '<div class="ga-slider-wrap">' +
              '<div class="ba" data-ba>' +
                '<div class="ba-after">' + p.depois() + '</div>' +
                '<div class="ba-before">' + p.antes() + '</div>' +
                '<button type="button" class="ba-handle" aria-label="Arraste para revelar antes e depois">' +
                  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                    '<polyline points="9 18 3 12 9 6"/><polyline points="15 6 21 12 15 18"/>' +
                  '</svg>' +
                '</button>' +
                '<span class="ba-label ba-label-before">Antes</span>' +
                '<span class="ba-label ba-label-after">Depois</span>' +
              '</div>' +
            '</div>' +
            '<div class="ga-text">' +
              '<div class="eyebrow">' + WA.escapeHTML(p.categoria) + '</div>' +
              '<h2 class="ga-title">' + WA.escapeHTML(p.titulo) + '</h2>' +
              '<dl class="ga-meta">' +
                '<div><dt>Cliente</dt><dd>' + WA.escapeHTML(p.cliente) + '</dd></div>' +
                '<div><dt>Madeira</dt><dd>' +
                  (p.madeira_id ?
                    '<a href="madeiras.html#' + p.madeira_id + '">' + WA.escapeHTML(p.madeira) + '</a>' :
                    WA.escapeHTML(p.madeira)) +
                '</dd></div>' +
                '<div><dt>Tempo</dt><dd>' + WA.escapeHTML(p.tempo) + '</dd></div>' +
              '</dl>' +
              '<p class="ga-historia">' + WA.escapeHTML(p.historia) + '</p>' +
              (p.madeira_id ?
                '<a href="configurador.html?madeira=' + p.madeira_id + '" class="btn btn-primary ga-cta">' +
                  'Pedir algo parecido ' +
                  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' +
                '</a>' : '') +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('');
    container.innerHTML = html;

    // Inicializa cada slider
    container.querySelectorAll('[data-ba]').forEach(function (el) {
      WA.makeBeforeAfter(el);
    });
  }

  // ============== SVGs PAREADOS ==============
  // Cada par tem mesma viewBox e mesmo enquadramento.
  // Versão "antes": paleta dessaturada, traços bagunçados, manchas
  // Versão "depois": paleta da marca, linhas limpas

  // --- 1. Cozinha ---
  function cozinhaAntes() {
    return svgWrap(800, 600,
      // chão
      '<rect width="800" height="600" fill="#9c9183"/>' +
      // parede manchada
      '<rect x="0" y="0" width="800" height="380" fill="#c2b8a3"/>' +
      // manchas de umidade
      '<ellipse cx="120" cy="80" rx="40" ry="22" fill="#a89d83" opacity="0.45"/>' +
      '<ellipse cx="680" cy="50" rx="55" ry="28" fill="#a89d83" opacity="0.35"/>' +
      // armário superior velho (branco encardido, desbotado)
      '<rect x="80" y="80" width="640" height="160" fill="#dbd3c2"/>' +
      '<rect x="80" y="80" width="640" height="160" fill="none" stroke="#8a7e68" stroke-width="2"/>' +
      // portas com puxadores tortos
      '<line x1="240" y1="80" x2="240" y2="240" stroke="#8a7e68" stroke-width="2"/>' +
      '<line x1="400" y1="80" x2="400" y2="240" stroke="#8a7e68" stroke-width="2"/>' +
      '<line x1="560" y1="80" x2="560" y2="240" stroke="#8a7e68" stroke-width="2"/>' +
      // puxadores velhos
      '<circle cx="225" cy="160" r="6" fill="#4a4036"/>' +
      '<circle cx="385" cy="160" r="6" fill="#4a4036"/>' +
      '<circle cx="545" cy="158" r="6" fill="#4a4036"/>' +
      '<circle cx="705" cy="162" r="6" fill="#4a4036"/>' +
      // bancada antiga (granito escuro, manchado)
      '<rect x="60" y="340" width="680" height="40" fill="#534b40"/>' +
      '<rect x="60" y="340" width="680" height="6" fill="#6a6155"/>' +
      // armários inferiores desbotados
      '<rect x="60" y="380" width="680" height="200" fill="#bfb29b"/>' +
      '<rect x="60" y="380" width="680" height="200" fill="none" stroke="#8a7e68" stroke-width="2"/>' +
      '<line x1="220" y1="380" x2="220" y2="580" stroke="#8a7e68" stroke-width="2"/>' +
      '<line x1="380" y1="380" x2="380" y2="580" stroke="#8a7e68" stroke-width="2"/>' +
      '<line x1="540" y1="380" x2="540" y2="580" stroke="#8a7e68" stroke-width="2"/>' +
      // descascado
      '<path d="M 100 420 Q 130 425 160 422" stroke="#8a7e68" stroke-width="1.5" fill="none"/>' +
      '<path d="M 240 480 Q 280 478 320 482" stroke="#8a7e68" stroke-width="1.5" fill="none"/>' +
      // luminária velha pendurada
      '<line x1="400" y1="0" x2="400" y2="30" stroke="#3a3328" stroke-width="2"/>' +
      '<ellipse cx="400" cy="44" rx="22" ry="14" fill="#7a705e"/>',
      'Antes: cozinha original com armário branco descascando'
    );
  }
  function cozinhaDepois() {
    return svgWrap(800, 600,
      // chão e parede com fundo creme
      '<rect width="800" height="600" fill="#e8dcc4"/>' +
      '<rect x="0" y="0" width="800" height="380" fill="#f5ecdf"/>' +
      // armário superior em Freijó
      '<defs>' +
      '<linearGradient id="freijo1" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#b8895f"/><stop offset="1" stop-color="#a87a52"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<rect x="80" y="80" width="640" height="160" fill="url(#freijo1)"/>' +
      // veios sutis
      '<path d="M 80 130 Q 240 125 400 130 T 720 130" stroke="#6a4626" stroke-width="0.6" fill="none" opacity="0.4"/>' +
      '<path d="M 80 180 Q 240 178 400 182 T 720 180" stroke="#6a4626" stroke-width="0.6" fill="none" opacity="0.3"/>' +
      // divisões finas (sem puxadores aparentes — push-to-open)
      '<line x1="240" y1="80" x2="240" y2="240" stroke="#6a4626" stroke-width="0.8"/>' +
      '<line x1="400" y1="80" x2="400" y2="240" stroke="#6a4626" stroke-width="0.8"/>' +
      '<line x1="560" y1="80" x2="560" y2="240" stroke="#6a4626" stroke-width="0.8"/>' +
      // iluminação embaixo dos armários superiores
      '<rect x="80" y="240" width="640" height="4" fill="#fff5e0" opacity="0.7"/>' +
      '<ellipse cx="400" cy="280" rx="320" ry="40" fill="#fff5d8" opacity="0.25"/>' +
      // bancada branca clara
      '<rect x="60" y="340" width="680" height="40" fill="#e8e2d4"/>' +
      '<rect x="60" y="340" width="680" height="3" fill="#c2b8a3"/>' +
      // armários inferiores em Freijó
      '<rect x="60" y="380" width="680" height="200" fill="url(#freijo1)"/>' +
      '<path d="M 60 450 Q 240 446 400 450 T 740 450" stroke="#6a4626" stroke-width="0.6" fill="none" opacity="0.4"/>' +
      '<path d="M 60 520 Q 240 518 400 522 T 740 520" stroke="#6a4626" stroke-width="0.6" fill="none" opacity="0.3"/>' +
      // divisões verticais discretas
      '<line x1="220" y1="380" x2="220" y2="580" stroke="#6a4626" stroke-width="0.8"/>' +
      '<line x1="380" y1="380" x2="380" y2="580" stroke="#6a4626" stroke-width="0.8"/>' +
      '<line x1="540" y1="380" x2="540" y2="580" stroke="#6a4626" stroke-width="0.8"/>' +
      // puxadores finos horizontais (cava)
      '<rect x="135" y="478" width="60" height="3" fill="#3a2614" opacity="0.5"/>' +
      '<rect x="295" y="478" width="60" height="3" fill="#3a2614" opacity="0.5"/>' +
      '<rect x="455" y="478" width="60" height="3" fill="#3a2614" opacity="0.5"/>' +
      '<rect x="615" y="478" width="60" height="3" fill="#3a2614" opacity="0.5"/>' +
      // pendente moderno
      '<line x1="400" y1="0" x2="400" y2="50" stroke="#2a1f17" stroke-width="1.5"/>' +
      '<rect x="380" y="50" width="40" height="6" fill="#2a1f17"/>' +
      '<rect x="385" y="56" width="30" height="14" fill="#c89456"/>',
      'Depois:  em Freijó com iluminação embutida'
    );
  }

  // --- 2. Mesa de Imbuia ---
  function mesaAntes() {
    return svgWrap(800, 600,
      // fundo cinza-quente (ambiente neutro)
      '<rect width="800" height="600" fill="#a89d8a"/>' +
      '<rect x="0" y="360" width="800" height="240" fill="#7a6e5b"/>' +
      // mesa redonda em vista 3/4 — tampo manchado
      '<ellipse cx="400" cy="350" rx="280" ry="50" fill="#4a3a28"/>' +
      // manchas no tampo (water rings, riscos)
      '<ellipse cx="290" cy="340" rx="30" ry="6" fill="#2a1f17" opacity="0.5"/>' +
      '<ellipse cx="450" cy="358" rx="38" ry="7" fill="#2a1f17" opacity="0.45"/>' +
      '<ellipse cx="560" cy="345" rx="22" ry="5" fill="#2a1f17" opacity="0.4"/>' +
      '<path d="M 200 360 Q 350 355 500 365" stroke="#2a1f17" stroke-width="1" fill="none" opacity="0.4"/>' +
      // borda lateral da mesa (espessura do tampo)
      '<path d="M 120 350 Q 120 380 130 392 L 670 392 Q 680 380 680 350" fill="#3a2818"/>' +
      // pé central trincado/quebrado
      '<rect x="370" y="392" width="60" height="14" fill="#3a2818"/>' +
      '<rect x="385" y="406" width="30" height="120" fill="#3a2818"/>' +
      // trinca vertical
      '<line x1="395" y1="406" x2="392" y2="525" stroke="#1a0e08" stroke-width="2"/>' +
      // base esculpida desgastada
      '<ellipse cx="400" cy="540" rx="100" ry="18" fill="#2a1f17"/>' +
      '<ellipse cx="400" cy="540" rx="100" ry="18" fill="none" stroke="#1a0e08" stroke-width="1"/>',
      'Antes: mesa antiga com tampo manchado e pé central trincado'
    );
  }
  function mesaDepois() {
    return svgWrap(800, 600,
      // ambiente claro (paper)
      '<rect width="800" height="600" fill="#f5ecdf"/>' +
      '<rect x="0" y="360" width="800" height="240" fill="#ede0cb"/>' +
      // tampo limpo, brilhante
      '<defs>' +
      '<radialGradient id="imbDepois" cx="0.5" cy="0.3" r="0.7">' +
      '<stop offset="0" stop-color="#6a4626"/><stop offset="1" stop-color="#3a2614"/>' +
      '</radialGradient>' +
      '</defs>' +
      '<ellipse cx="400" cy="350" rx="280" ry="50" fill="url(#imbDepois)"/>' +
      // veios elegantes no tampo
      '<path d="M 160 348 Q 300 343 450 348 T 640 350" stroke="#1a0e08" stroke-width="0.8" fill="none" opacity="0.45"/>' +
      '<path d="M 180 360 Q 320 357 500 362 T 620 365" stroke="#1a0e08" stroke-width="0.6" fill="none" opacity="0.35"/>' +
      // brilho do óleo
      '<ellipse cx="320" cy="338" rx="80" ry="8" fill="#fff5e0" opacity="0.15"/>' +
      // borda lateral
      '<path d="M 120 350 Q 120 380 130 392 L 670 392 Q 680 380 680 350" fill="#2a1f17"/>' +
      // pé central restaurado, limpo
      '<rect x="370" y="392" width="60" height="14" fill="#2a1f17"/>' +
      '<rect x="385" y="406" width="30" height="120" fill="#2a1f17"/>' +
      // base esculpida nova
      '<ellipse cx="400" cy="540" rx="100" ry="18" fill="#2a1f17"/>' +
      '<ellipse cx="400" cy="540" rx="100" ry="18" fill="none" stroke="#c89456" stroke-width="0.5" opacity="0.6"/>' +
      // pratos servidos na mesa (vida nova)
      '<circle cx="280" cy="345" r="22" fill="#f5ecdf" opacity="0.8"/>' +
      '<circle cx="280" cy="345" r="22" fill="none" stroke="#c89456" stroke-width="0.8" opacity="0.6"/>' +
      '<circle cx="500" cy="350" r="22" fill="#f5ecdf" opacity="0.8"/>' +
      '<circle cx="500" cy="350" r="22" fill="none" stroke="#c89456" stroke-width="0.8" opacity="0.6"/>',
      'Depois: mesa restaurada em Imbuia com brilho de óleo natural'
    );
  }

  // --- 3. Dormitório ---
  function dormAntes() {
    return svgWrap(800, 600,
      '<rect width="800" height="600" fill="#9a8d78"/>' +
      '<rect x="0" y="0" width="800" height="380" fill="#bdb09a"/>' +
      // cômoda dos anos 90 — bege descolada
      '<rect x="180" y="240" width="280" height="180" fill="#d8c8a6"/>' +
      '<rect x="180" y="240" width="280" height="180" fill="none" stroke="#6a5d48" stroke-width="2"/>' +
      // 3 gavetas
      '<line x1="180" y1="300" x2="460" y2="300" stroke="#6a5d48" stroke-width="2"/>' +
      '<line x1="180" y1="360" x2="460" y2="360" stroke="#6a5d48" stroke-width="2"/>' +
      // puxadores plásticos dourados velhos
      '<rect x="290" y="268" width="60" height="6" fill="#a89058" stroke="#6a5d48" stroke-width="0.6"/>' +
      '<rect x="290" y="328" width="60" height="6" fill="#a89058" stroke="#6a5d48" stroke-width="0.6"/>' +
      '<rect x="290" y="388" width="60" height="6" fill="#a89058" stroke="#6a5d48" stroke-width="0.6"/>' +
      // pés palitinho
      '<rect x="190" y="420" width="10" height="20" fill="#6a5d48"/>' +
      '<rect x="440" y="420" width="10" height="20" fill="#6a5d48"/>' +
      // caixas de papelão no chão
      '<rect x="520" y="440" width="120" height="100" fill="#a89070" stroke="#6a5d48" stroke-width="1.5"/>' +
      '<rect x="540" y="380" width="100" height="60" fill="#a89070" stroke="#6a5d48" stroke-width="1.5"/>' +
      '<rect x="540" y="380" width="100" height="60" fill="none" stroke="#6a5d48" stroke-dasharray="3 3"/>' +
      // roupas espalhadas (manchas coloridas)
      '<ellipse cx="120" cy="500" rx="50" ry="22" fill="#8a6a4a" opacity="0.6"/>' +
      '<ellipse cx="700" cy="510" rx="40" ry="18" fill="#7a5a4a" opacity="0.6"/>',
      'Antes: cômoda antiga e caixas com roupa'
    );
  }
  function dormDepois() {
    return svgWrap(800, 600,
      '<rect width="800" height="600" fill="#ede0cb"/>' +
      '<rect x="0" y="0" width="800" height="380" fill="#f5ecdf"/>' +
      '<defs>' +
      '<linearGradient id="carv1" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#7a5028"/><stop offset="1" stop-color="#6a4626"/>' +
      '</linearGradient>' +
      '</defs>' +
      // guarda-roupa amplo, do chão ao teto
      '<rect x="80" y="80" width="640" height="500" fill="url(#carv1)"/>' +
      // veios
      '<path d="M 80 200 Q 240 195 400 200 T 720 200" stroke="#3a2614" stroke-width="0.6" fill="none" opacity="0.4"/>' +
      '<path d="M 80 320 Q 240 318 400 322 T 720 320" stroke="#3a2614" stroke-width="0.6" fill="none" opacity="0.35"/>' +
      '<path d="M 80 460 Q 240 458 400 462 T 720 460" stroke="#3a2614" stroke-width="0.6" fill="none" opacity="0.4"/>' +
      // divisões verticais
      '<line x1="280" y1="80" x2="280" y2="580" stroke="#2a1f17" stroke-width="1.2"/>' +
      '<line x1="520" y1="80" x2="520" y2="580" stroke="#2a1f17" stroke-width="1.2"/>' +
      // módulos (gavetas indicadas)
      '<line x1="80" y1="320" x2="280" y2="320" stroke="#2a1f17" stroke-width="0.8"/>' +
      '<line x1="80" y1="380" x2="280" y2="380" stroke="#2a1f17" stroke-width="0.8"/>' +
      '<line x1="80" y1="440" x2="280" y2="440" stroke="#2a1f17" stroke-width="0.8"/>' +
      '<line x1="520" y1="320" x2="720" y2="320" stroke="#2a1f17" stroke-width="0.8"/>' +
      '<line x1="520" y1="380" x2="720" y2="380" stroke="#2a1f17" stroke-width="0.8"/>' +
      // puxadores pretos finos verticais
      '<rect x="265" y="120" width="2" height="160" fill="#1a0e08"/>' +
      '<rect x="535" y="120" width="2" height="160" fill="#1a0e08"/>' +
      // puxadores horizontais nas gavetas
      '<rect x="160" y="345" width="40" height="2" fill="#1a0e08"/>' +
      '<rect x="160" y="405" width="40" height="2" fill="#1a0e08"/>' +
      '<rect x="160" y="465" width="40" height="2" fill="#1a0e08"/>' +
      '<rect x="600" y="345" width="40" height="2" fill="#1a0e08"/>' +
      '<rect x="600" y="405" width="40" height="2" fill="#1a0e08"/>' +
      // espelho central (cabideiro com porta espelhada)
      '<rect x="305" y="100" width="190" height="280" fill="#d8e0e8" opacity="0.5"/>' +
      '<rect x="305" y="100" width="190" height="280" fill="none" stroke="#2a1f17" stroke-width="1"/>',
      'Depois: guarda-roupa modular em Carvalho com porta espelhada'
    );
  }

  // --- 4. Cadeira ---
  function cadeiraAntes() {
    return svgWrap(800, 600,
      '<rect width="800" height="600" fill="#a89d8a"/>' +
      // cadeira de balanço — perfil lateral
      // base curva (balanço)
      '<path d="M 200 540 Q 400 580 600 540" stroke="#5a4632" stroke-width="6" fill="none"/>' +
      // perna direita
      '<line x1="540" y1="540" x2="500" y2="350" stroke="#5a4632" stroke-width="6"/>' +
      // perna esquerda
      '<line x1="260" y1="540" x2="280" y2="350" stroke="#5a4632" stroke-width="6"/>' +
      // assento (palha desgastada)
      '<ellipse cx="390" cy="350" rx="130" ry="18" fill="#9a8b66"/>' +
      // palha rasgada (linhas irregulares)
      '<line x1="280" y1="350" x2="500" y2="350" stroke="#3a2818" stroke-width="0.4" opacity="0.5"/>' +
      '<line x1="290" y1="354" x2="490" y2="354" stroke="#3a2818" stroke-width="0.4" opacity="0.4"/>' +
      // furos na palha
      '<ellipse cx="350" cy="350" rx="12" ry="3" fill="#3a2818" opacity="0.6"/>' +
      '<ellipse cx="430" cy="352" rx="9" ry="3" fill="#3a2818" opacity="0.5"/>' +
      // encosto — duas hastes verticais (uma quebrada)
      '<line x1="280" y1="350" x2="295" y2="180" stroke="#5a4632" stroke-width="5"/>' +
      // haste quebrada (offset propositalmente)
      '<line x1="490" y1="350" x2="478" y2="265" stroke="#5a4632" stroke-width="5"/>' +
      '<line x1="478" y1="263" x2="465" y2="180" stroke="#5a4632" stroke-width="5" stroke-dasharray="2 3"/>' +
      // travessas horizontais do encosto (3, uma faltando)
      '<line x1="290" y1="210" x2="470" y2="195" stroke="#5a4632" stroke-width="4"/>' +
      '<line x1="293" y1="260" x2="475" y2="248" stroke="#5a4632" stroke-width="4"/>' +
      // pó/cupim sinalizado com pontos
      '<circle cx="295" cy="280" r="1.5" fill="#1a0e08"/>' +
      '<circle cx="300" cy="290" r="1" fill="#1a0e08"/>' +
      '<circle cx="500" cy="320" r="1.5" fill="#1a0e08"/>' +
      // braço direito quebrado
      '<line x1="490" y1="260" x2="530" y2="270" stroke="#5a4632" stroke-width="5"/>' +
      '<line x1="280" y1="260" x2="240" y2="270" stroke="#5a4632" stroke-width="5"/>',
      'Antes: cadeira de balanço com palha rasgada e haste quebrada'
    );
  }
  function cadeiraDepois() {
    return svgWrap(800, 600,
      '<rect width="800" height="600" fill="#f5ecdf"/>' +
      // sombra suave no chão
      '<ellipse cx="400" cy="560" rx="240" ry="12" fill="#2a1f17" opacity="0.1"/>' +
      // base curva (balanço) restaurada
      '<path d="M 200 540 Q 400 580 600 540" stroke="#3a2614" stroke-width="6" fill="none"/>' +
      // pernas em Cedro restaurado
      '<line x1="540" y1="540" x2="500" y2="350" stroke="#7a5028" stroke-width="6"/>' +
      '<line x1="260" y1="540" x2="280" y2="350" stroke="#7a5028" stroke-width="6"/>' +
      // assento — palhinha nova (textura)
      '<ellipse cx="390" cy="350" rx="130" ry="18" fill="#c89456"/>' +
      // linhas da palhinha indiana (trama cruzada)
      '<line x1="280" y1="350" x2="500" y2="350" stroke="#7a5028" stroke-width="0.4"/>' +
      '<line x1="290" y1="346" x2="490" y2="346" stroke="#7a5028" stroke-width="0.4"/>' +
      '<line x1="290" y1="354" x2="490" y2="354" stroke="#7a5028" stroke-width="0.4"/>' +
      // pontinhos da palhinha (entrelaçamento)
      '<g opacity="0.45">' +
      '<circle cx="300" cy="348" r="0.8" fill="#3a2614"/>' +
      '<circle cx="320" cy="348" r="0.8" fill="#3a2614"/>' +
      '<circle cx="340" cy="348" r="0.8" fill="#3a2614"/>' +
      '<circle cx="360" cy="348" r="0.8" fill="#3a2614"/>' +
      '<circle cx="380" cy="348" r="0.8" fill="#3a2614"/>' +
      '<circle cx="400" cy="348" r="0.8" fill="#3a2614"/>' +
      '<circle cx="420" cy="348" r="0.8" fill="#3a2614"/>' +
      '<circle cx="440" cy="348" r="0.8" fill="#3a2614"/>' +
      '<circle cx="460" cy="348" r="0.8" fill="#3a2614"/>' +
      '<circle cx="480" cy="348" r="0.8" fill="#3a2614"/>' +
      '</g>' +
      // encosto restaurado, hastes íntegras
      '<line x1="280" y1="350" x2="295" y2="180" stroke="#7a5028" stroke-width="5"/>' +
      '<line x1="490" y1="350" x2="475" y2="180" stroke="#7a5028" stroke-width="5"/>' +
      // travessas do encosto (3 íntegras)
      '<line x1="285" y1="210" x2="475" y2="195" stroke="#7a5028" stroke-width="4"/>' +
      '<line x1="288" y1="245" x2="478" y2="232" stroke="#7a5028" stroke-width="4"/>' +
      '<line x1="290" y1="280" x2="480" y2="268" stroke="#7a5028" stroke-width="4"/>' +
      // braços restaurados
      '<line x1="490" y1="260" x2="540" y2="280" stroke="#7a5028" stroke-width="5"/>' +
      '<line x1="280" y1="260" x2="230" y2="280" stroke="#7a5028" stroke-width="5"/>',
      'Depois: cadeira restaurada com palhinha indiana nova'
    );
  }

  // --- 5. Estante painel ---
  function estanteAntes() {
    return svgWrap(800, 600,
      '<rect width="800" height="600" fill="#a8a090"/>' +
      // parede vazia, manchada
      '<rect x="0" y="0" width="800" height="480" fill="#c2bba8"/>' +
      '<rect x="0" y="480" width="800" height="120" fill="#8a7e68"/>' +
      // sombra/marca de móvel anterior (retangular descolorida)
      '<rect x="180" y="120" width="160" height="260" fill="#b0a892" opacity="0.7"/>' +
      '<rect x="180" y="120" width="160" height="260" fill="none" stroke="#7a705e" stroke-width="0.6" stroke-dasharray="5 3"/>' +
      // furos de prego/parafuso antigos
      '<circle cx="200" cy="150" r="3" fill="#5a4f3e"/>' +
      '<circle cx="320" cy="150" r="3" fill="#5a4f3e"/>' +
      '<circle cx="200" cy="350" r="3" fill="#5a4f3e"/>' +
      '<circle cx="320" cy="350" r="3" fill="#5a4f3e"/>' +
      // mancha grande (cima da parede)
      '<ellipse cx="500" cy="80" rx="60" ry="30" fill="#9a9080" opacity="0.55"/>' +
      // tomada solitária
      '<rect x="650" y="240" width="20" height="28" fill="#e8dcc4" stroke="#7a705e" stroke-width="1"/>' +
      '<circle cx="657" cy="252" r="1.5" fill="#3a2614"/>' +
      '<circle cx="663" cy="252" r="1.5" fill="#3a2614"/>' +
      // sofá ao lado (corte parcial, dá escala)
      '<rect x="-20" y="380" width="180" height="100" fill="#7a5a4a" rx="6"/>',
      'Antes: parede vazia com marca de móvel antigo'
    );
  }
  function estanteDepois() {
    return svgWrap(800, 600,
      '<rect width="800" height="600" fill="#ede0cb"/>' +
      '<rect x="0" y="0" width="800" height="480" fill="#f5ecdf"/>' +
      '<rect x="0" y="480" width="800" height="120" fill="#c2b8a3"/>' +
      // painel-estante de canto a canto
      '<defs>' +
      '<linearGradient id="carvE" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#7a5028"/><stop offset="1" stop-color="#6a4626"/>' +
      '</linearGradient>' +
      '</defs>' +
      // base do painel
      '<rect x="40" y="60" width="720" height="420" fill="url(#carvE)"/>' +
      // veios discretos
      '<path d="M 40 180 Q 240 175 440 180 T 760 180" stroke="#3a2614" stroke-width="0.6" fill="none" opacity="0.35"/>' +
      '<path d="M 40 320 Q 240 318 440 322 T 760 320" stroke="#3a2614" stroke-width="0.6" fill="none" opacity="0.3"/>' +
      // nicho central (TV)
      '<rect x="280" y="180" width="240" height="160" fill="#1a0e08"/>' +
      // borda do nicho
      '<rect x="280" y="180" width="240" height="160" fill="none" stroke="#2a1f17" stroke-width="1"/>' +
      // brilho na "tv" (reflexo)
      '<rect x="295" y="195" width="60" height="40" fill="#3a2614" opacity="0.5"/>' +
      // prateleiras assimétricas
      '<rect x="60" y="100" width="200" height="6" fill="#3a2614"/>' +
      '<rect x="60" y="180" width="200" height="6" fill="#3a2614"/>' +
      '<rect x="60" y="270" width="200" height="6" fill="#3a2614"/>' +
      '<rect x="60" y="380" width="200" height="6" fill="#3a2614"/>' +
      '<rect x="540" y="100" width="200" height="6" fill="#3a2614"/>' +
      '<rect x="540" y="280" width="200" height="6" fill="#3a2614"/>' +
      '<rect x="540" y="380" width="200" height="6" fill="#3a2614"/>' +
      // objetos decorativos sobre prateleiras
      // livros empilhados
      '<rect x="80" y="80" width="14" height="20" fill="#7a5a4a"/>' +
      '<rect x="98" y="76" width="14" height="24" fill="#5a4032"/>' +
      '<rect x="116" y="82" width="14" height="18" fill="#8a6a5a"/>' +
      // vaso (depoia)
      '<ellipse cx="170" cy="100" rx="14" ry="6" fill="#c89456"/>' +
      '<path d="M 156 100 Q 158 80 170 75 Q 182 80 184 100 Z" fill="#a8784e"/>' +
      // outro vaso prateleira direita
      '<rect x="580" y="80" width="20" height="22" fill="#5a4032"/>' +
      // sofá visível pra escala
      '<rect x="-20" y="380" width="180" height="100" fill="#3a2818" rx="6"/>',
      'Depois: painel-estante de 3,20m em Carvalho com nicho de TV'
    );
  }

  // --- 6. Banheiro ---
  function banheiroAntes() {
    return svgWrap(800, 600,
      // azulejo bege antigo
      '<rect width="800" height="600" fill="#c2b8a3"/>' +
      // pattern azulejo (linhas finas)
      '<g opacity="0.35">' +
      '<line x1="0" y1="60" x2="800" y2="60" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="0" y1="120" x2="800" y2="120" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="0" y1="180" x2="800" y2="180" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="0" y1="240" x2="800" y2="240" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="0" y1="300" x2="800" y2="300" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="80" y1="0" x2="80" y2="320" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="160" y1="0" x2="160" y2="320" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="240" y1="0" x2="240" y2="320" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="320" y1="0" x2="320" y2="320" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="400" y1="0" x2="400" y2="320" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="480" y1="0" x2="480" y2="320" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="560" y1="0" x2="560" y2="320" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="640" y1="0" x2="640" y2="320" stroke="#8a7e68" stroke-width="0.5"/>' +
      '<line x1="720" y1="0" x2="720" y2="320" stroke="#8a7e68" stroke-width="0.5"/>' +
      '</g>' +
      // bancada granito velho cinza
      '<rect x="100" y="320" width="600" height="40" fill="#534b40"/>' +
      // cuba branca antiga
      '<ellipse cx="400" cy="340" rx="100" ry="14" fill="#dbd3c2"/>' +
      // torneira gasta
      '<rect x="395" y="280" width="10" height="40" fill="#7a705e"/>' +
      '<rect x="385" y="276" width="30" height="6" fill="#7a705e"/>' +
      // armário pré-fabricado embaixo
      '<rect x="100" y="360" width="600" height="180" fill="#a89070"/>' +
      '<rect x="100" y="360" width="600" height="180" fill="none" stroke="#5a4f3e" stroke-width="2"/>' +
      // 4 portas
      '<line x1="250" y1="360" x2="250" y2="540" stroke="#5a4f3e" stroke-width="1.5"/>' +
      '<line x1="400" y1="360" x2="400" y2="540" stroke="#5a4f3e" stroke-width="1.5"/>' +
      '<line x1="550" y1="360" x2="550" y2="540" stroke="#5a4f3e" stroke-width="1.5"/>' +
      // descascado
      '<rect x="120" y="380" width="40" height="12" fill="#8a7058" opacity="0.7"/>' +
      '<rect x="450" y="500" width="60" height="14" fill="#8a7058" opacity="0.7"/>' +
      // chão antigo
      '<rect x="0" y="540" width="800" height="60" fill="#8a7e68"/>',
      'Antes: bancada de granito antiga com armário pré-fabricado'
    );
  }
  function banheiroDepois() {
    return svgWrap(800, 600,
      // parede limpa
      '<rect width="800" height="600" fill="#f5ecdf"/>' +
      // bancada em peroba de demolição (variações de tom = caráter)
      '<defs>' +
      '<linearGradient id="peroba" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#7a5028"/>' +
      '<stop offset="0.3" stop-color="#6a4220"/>' +
      '<stop offset="0.55" stop-color="#82582c"/>' +
      '<stop offset="0.8" stop-color="#5a3a1c"/>' +
      '<stop offset="1" stop-color="#7a5028"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<rect x="100" y="320" width="600" height="44" fill="url(#peroba)"/>' +
      // marcas naturais (furos de prego antigos)
      '<circle cx="180" cy="335" r="2" fill="#2a1f17"/>' +
      '<circle cx="260" cy="345" r="2" fill="#2a1f17"/>' +
      '<circle cx="540" cy="338" r="2" fill="#2a1f17"/>' +
      '<circle cx="620" cy="350" r="2" fill="#2a1f17"/>' +
      // veios mais marcados
      '<path d="M 100 338 Q 250 333 400 338 T 700 340" stroke="#2a1f17" stroke-width="0.7" fill="none" opacity="0.5"/>' +
      '<path d="M 100 352 Q 250 350 400 354 T 700 350" stroke="#2a1f17" stroke-width="0.5" fill="none" opacity="0.4"/>' +
      // cuba branca embutida
      '<ellipse cx="400" cy="342" rx="100" ry="14" fill="#fdf8ee"/>' +
      // torneira preto fosco moderna
      '<rect x="397" y="270" width="6" height="50" fill="#1a0e08"/>' +
      '<rect x="385" y="266" width="30" height="4" fill="#1a0e08"/>' +
      '<rect x="380" y="262" width="40" height="6" fill="#1a0e08"/>' +
      // espelho redondo grande
      '<circle cx="400" cy="160" r="120" fill="#e8e4dc"/>' +
      '<circle cx="400" cy="160" r="120" fill="none" stroke="#3a2614" stroke-width="2"/>' +
      // brilho do espelho
      '<ellipse cx="350" cy="115" rx="50" ry="20" fill="#fff5e0" opacity="0.4"/>' +
      // armário suspenso (mesma madeira)
      '<rect x="100" y="364" width="600" height="180" fill="url(#peroba)"/>' +
      '<path d="M 100 450 Q 250 446 400 450 T 700 452" stroke="#2a1f17" stroke-width="0.6" fill="none" opacity="0.4"/>' +
      // 2 portas amplas com cava
      '<line x1="400" y1="364" x2="400" y2="544" stroke="#2a1f17" stroke-width="1"/>' +
      // puxadores cava horizontal
      '<rect x="160" y="448" width="60" height="3" fill="#1a0e08"/>' +
      '<rect x="580" y="448" width="60" height="3" fill="#1a0e08"/>' +
      // chão (madeira clara)
      '<rect x="0" y="544" width="800" height="56" fill="#c2b8a3"/>',
      'Depois: bancada em Peroba de demolição com cuba embutida'
    );
  }

  // ============== UTIL ==============
  function svgWrap(w, h, body, alt) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + WA.escapeHTML(alt || '') + '">' + body + '</svg>';
  }

  // ============== INIT ==============
  document.addEventListener('DOMContentLoaded', render);
})();
