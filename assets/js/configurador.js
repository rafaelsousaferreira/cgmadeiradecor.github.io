/* =====================================================================
   C&G PLANEJADOS — configurador.js
   Wizard de orçamento sob medida em 6 etapas.
   - Estado em memória (sem libs)
   - Estimativa de preço client-side baseada em multiplicadores
   - Envia tudo formatado para o WhatsApp
   ===================================================================== */
'use strict';

(function () {
  if (!document.getElementById('configurador')) return;

  // ============== CATÁLOGO DE OPÇÕES ==============
  // Cada item tem um multiplicador. Preço final = base × multiplicadores.
  // Os números são intencionalmente "redondos" — não é uma planilha técnica,
  // é uma estimativa honesta para qualificar lead.

  var TIPOS = [
    { id: 'mesa',       nome: 'Mesa',                  base: 1800, glyph: glyphMesa,    desc: 'Jantar, escrivaninha, café'  },
    { id: 'estante',    nome: 'Estante / Prateleira',  base: 1400, glyph: glyphEstante, desc: 'Livros, decoração, nichos'   },
    { id: 'cozinha',    nome: 'Cozinha planejada',     base: 6000, glyph: glyphCozinha, desc: 'Armários e gabinete completos' },
    { id: 'dormitorio', nome: 'Dormitório planejado',  base: 5500, glyph: glyphDorm,    desc: 'Guarda-roupa, cabeceira, cômodas' },
    { id: 'banco',      nome: 'Banco / Balcão / Bar',  base: 1600, glyph: glyphBanco,   desc: 'Bancos, balcões, bar'      },
    { id: 'outro',      nome: 'Outro tipo',            base: 1500, glyph: glyphOutro,   desc: 'Conte na sua mensagem'      }
  ];

  // Faixas de tamanho — multiplicador aplicado sobre o base
  var TAMANHOS = [
    { id: 'pequeno', nome: 'Pequeno',     mult: 0.8, hint: 'Até 1 m no maior lado'    },
    { id: 'medio',   nome: 'Médio',       mult: 1.0, hint: 'Entre 1 m e 2 m'          },
    { id: 'grande',  nome: 'Grande',      mult: 1.4, hint: 'Entre 2 m e 3 m'          },
    { id: 'extra',   nome: 'Muito grande', mult: 1.8, hint: 'Mais de 3 m, ou conjunto' }
  ];

  var MADEIRAS = [
    { id: 'pinus',     nome: 'Pinus',      mult: 0.85, color: '#d9b88a', desc: 'Clara, econômica, ideal para pintura' },
    { id: 'eucalipto', nome: 'Eucalipto',  mult: 1.00, color: '#b08866', desc: 'Tratado, bom para externo'            },
    { id: 'freijo',    nome: 'Freijó',     mult: 1.25, color: '#a87a52', desc: 'Versátil, acabamento elegante'        },
    { id: 'cedro',     nome: 'Cedro',      mult: 1.35, color: '#8a5d39', desc: 'Aromática, leve, atemporal'           },
    { id: 'carvalho',  nome: 'Carvalho',   mult: 1.55, color: '#6a4626', desc: 'Robusta, veio marcante'               },
    { id: 'imbuia',    nome: 'Imbuia',     mult: 1.70, color: '#4a2e1c', desc: 'Nobre, escura, durabilidade alta'     },
    { id: 'demolicao', nome: 'Demolição',  mult: 1.45, color: '#5a3a20', desc: 'Peça única, história visível'         }
  ];

  var ACABAMENTOS = [
    { id: 'natural',  nome: 'Natural',          mult: 0.95, desc: 'Sem tratamento, mantém cor original' },
    { id: 'oleo',     nome: 'Óleo / cera',      mult: 1.00, desc: 'Realça o veio, toque sedoso'          },
    { id: 'verniz',   nome: 'Verniz fosco',     mult: 1.10, desc: 'Proteção contra umidade e desgaste'    },
    { id: 'laca',     nome: 'Laca colorida',    mult: 1.20, desc: 'Pintada em cor à sua escolha'         }
  ];

  var PRAZOS = [
    { id: 'sem-pressa', nome: 'Tenho tempo',   hint: 'Sem urgência' },
    { id: 'normal',     nome: 'Próximo mês',   hint: '30 a 45 dias' },
    { id: 'rapido',     nome: 'Em até 30 dias', hint: 'Disponibilidade pode variar' }
  ];

  // ============== ESTADO ==============
  var state = {
    step: 1,
    total: 6,
    tipo: null,
    tamanho: null,
    madeira: null,
    acabamento: null,
    prazo: null,
    nome: '',
    telefone: '',
    cidade: '',
    obs: ''
  };

  // ============== CÁLCULO ==============
  function estimate() {
    var t = TIPOS.find(function (x) { return x.id === state.tipo; });
    var tam = TAMANHOS.find(function (x) { return x.id === state.tamanho; });
    var mad = MADEIRAS.find(function (x) { return x.id === state.madeira; });
    var aca = ACABAMENTOS.find(function (x) { return x.id === state.acabamento; });
    if (!t || !tam || !mad || !aca) return null;
    var center = t.base * tam.mult * mad.mult * aca.mult;
    // Faixa de ±15% pra dar margem honesta (peças sob medida variam mesmo)
    return {
      min: Math.round(center * 0.85 / 50) * 50,    // arredonda pra múltiplo de 50
      max: Math.round(center * 1.15 / 50) * 50,
      center: Math.round(center / 50) * 50
    };
  }

  // ============== RENDERIZAÇÃO ==============
  function render() {
    var root = document.getElementById('configurador');
    var progress = ((state.step - 1) / state.total) * 100;
    var html = '' +
      '<div class="cfg-progress" aria-label="Progresso: etapa ' + state.step + ' de ' + state.total + '">' +
        '<div class="cfg-progress-bar" style="width:' + progress + '%"></div>' +
        '<div class="cfg-steps">' +
          ['Tipo','Tamanho','Madeira','Acabamento','Prazo','Resumo'].map(function (n, i) {
            var cls = (i + 1 < state.step) ? 'done' : (i + 1 === state.step) ? 'current' : '';
            return '<span class="cfg-step ' + cls + '"><span class="cfg-step-num">' + (i+1) + '</span><span class="cfg-step-label">' + n + '</span></span>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="cfg-content">';

    if (state.step === 1) html += renderTipo();
    else if (state.step === 2) html += renderTamanho();
    else if (state.step === 3) html += renderMadeira();
    else if (state.step === 4) html += renderAcabamento();
    else if (state.step === 5) html += renderPrazo();
    else if (state.step === 6) html += renderResumo();

    html += '</div>';
    html += renderNav();
    root.innerHTML = html;
    bindEvents();
  }

  function renderTipo() {
    return '' +
      '<h2 class="cfg-title">O que você quer fazer?</h2>' +
      '<p class="cfg-help">Escolha o tipo principal. Você pode ajustar detalhes depois na conversa pelo WhatsApp.</p>' +
      '<div class="cfg-cards">' +
      TIPOS.map(function (t) {
        var sel = state.tipo === t.id ? 'selected' : '';
        return '<button type="button" class="cfg-card ' + sel + '" data-tipo="' + t.id + '">' +
          '<div class="cfg-card-icon">' + t.glyph() + '</div>' +
          '<div class="cfg-card-name">' + t.nome + '</div>' +
          '<div class="cfg-card-desc">' + t.desc + '</div>' +
        '</button>';
      }).join('') +
      '</div>';
  }

  function renderTamanho() {
    var t = TIPOS.find(function (x) { return x.id === state.tipo; });
    return '' +
      '<h2 class="cfg-title">Que tamanho?</h2>' +
      '<p class="cfg-help">Não precisa ser exato — escolha a faixa que mais se aproxima. Medidas exatas ajustamos na conversa.</p>' +
      '<div class="cfg-cards cfg-cards-2">' +
      TAMANHOS.map(function (tam) {
        var sel = state.tamanho === tam.id ? 'selected' : '';
        return '<button type="button" class="cfg-card cfg-card-small ' + sel + '" data-tamanho="' + tam.id + '">' +
          '<div class="cfg-card-name">' + tam.nome + '</div>' +
          '<div class="cfg-card-hint">' + tam.hint + '</div>' +
        '</button>';
      }).join('') +
      '</div>' +
      '<p class="cfg-aside">Tipo escolhido: <strong>' + (t ? t.nome : '—') + '</strong></p>';
  }

  function renderMadeira() {
    return '' +
      '<h2 class="cfg-title">Em qual madeira?</h2>' +
      '<p class="cfg-help">Cada madeira tem personalidade e preço. Toque para escolher.</p>' +
      '<div class="cfg-madeiras">' +
      MADEIRAS.map(function (m) {
        var sel = state.madeira === m.id ? 'selected' : '';
        return '<button type="button" class="cfg-madeira ' + sel + '" data-madeira="' + m.id + '">' +
          '<div class="cfg-madeira-swatch" style="background:' + m.color + '">' +
            woodSwatch() +
          '</div>' +
          '<div class="cfg-madeira-info">' +
            '<div class="cfg-madeira-nome">' + m.nome + '</div>' +
            '<div class="cfg-madeira-desc">' + m.desc + '</div>' +
          '</div>' +
        '</button>';
      }).join('') +
      '</div>';
  }

  function renderAcabamento() {
    return '' +
      '<h2 class="cfg-title">Que acabamento?</h2>' +
      '<p class="cfg-help">O acabamento define o toque e o brilho da peça.</p>' +
      '<div class="cfg-cards cfg-cards-2">' +
      ACABAMENTOS.map(function (a) {
        var sel = state.acabamento === a.id ? 'selected' : '';
        return '<button type="button" class="cfg-card cfg-card-small ' + sel + '" data-acabamento="' + a.id + '">' +
          '<div class="cfg-card-name">' + a.nome + '</div>' +
          '<div class="cfg-card-hint">' + a.desc + '</div>' +
        '</button>';
      }).join('') +
      '</div>';
  }

  function renderPrazo() {
    return '' +
      '<h2 class="cfg-title">Quando você precisa?</h2>' +
      '<p class="cfg-help">Peças sob medida saem em 30 a 60 dias geralmente. Algo mais rápido depende da agenda do ateliê.</p>' +
      '<div class="cfg-cards cfg-cards-3">' +
      PRAZOS.map(function (p) {
        var sel = state.prazo === p.id ? 'selected' : '';
        return '<button type="button" class="cfg-card cfg-card-small ' + sel + '" data-prazo="' + p.id + '">' +
          '<div class="cfg-card-name">' + p.nome + '</div>' +
          '<div class="cfg-card-hint">' + p.hint + '</div>' +
        '</button>';
      }).join('') +
      '</div>';
  }

  function renderResumo() {
    var t = TIPOS.find(function (x) { return x.id === state.tipo; });
    var tam = TAMANHOS.find(function (x) { return x.id === state.tamanho; });
    var mad = MADEIRAS.find(function (x) { return x.id === state.madeira; });
    var aca = ACABAMENTOS.find(function (x) { return x.id === state.acabamento; });
    var prz = PRAZOS.find(function (x) { return x.id === state.prazo; });
    var est = estimate();

    return '' +
      '<h2 class="cfg-title">Falta pouco. Conte um pouquinho de você.</h2>' +
      '<div class="cfg-resumo">' +
        '<div class="cfg-resumo-itens">' +
          summaryItem('Tipo',       t ? t.nome : '—') +
          summaryItem('Tamanho',    tam ? tam.nome : '—') +
          summaryItem('Madeira',    mad ? mad.nome : '—') +
          summaryItem('Acabamento', aca ? aca.nome : '—') +
          summaryItem('Prazo',      prz ? prz.nome : '—') +
        '</div>' +
        '<div class="cfg-price-box">' +
          '<div class="cfg-price-label">Estimativa</div>' +
          '<div class="cfg-price-range">' + WA.formatCurrency(est.min) + ' <span>a</span> ' + WA.formatCurrency(est.max) + '</div>' +
          '<div class="cfg-price-note">Valor de referência. Preço final depende de medidas exatas, complexidade dos encaixes, ferragens e logística de entrega.</div>' +
        '</div>' +
      '</div>' +
      '<div class="cfg-form">' +
        '<div class="cfg-form-row">' +
          '<div class="cfg-field">' +
            '<label for="cfg-nome">Seu nome <span class="req">*</span></label>' +
            '<input type="text" id="cfg-nome" maxlength="100" autocomplete="name" value="' + WA.escapeHTML(state.nome) + '">' +
          '</div>' +
          '<div class="cfg-field">' +
            '<label for="cfg-telefone">WhatsApp / telefone</label>' +
            '<input type="tel" id="cfg-telefone" maxlength="16" autocomplete="tel" placeholder="(71) 99999-9999" value="' + WA.escapeHTML(state.telefone) + '">' +
          '</div>' +
        '</div>' +
        '<div class="cfg-field">' +
          '<label for="cfg-cidade">Cidade</label>' +
          '<input type="text" id="cfg-cidade" maxlength="80" autocomplete="address-level2" value="' + WA.escapeHTML(state.cidade) + '">' +
        '</div>' +
        '<div class="cfg-field">' +
          '<label for="cfg-obs">Detalhes ou medidas exatas (opcional)</label>' +
          '<textarea id="cfg-obs" maxlength="800" rows="3" placeholder="Ex.: tampo de 2,20 × 1,00 m, pés torneados, referência da Pinterest…">' + WA.escapeHTML(state.obs) + '</textarea>' +
        '</div>' +
        // Honeypot
        '<div class="hp" aria-hidden="true">' +
          '<label for="cfg-website">Não preencher</label>' +
          '<input type="text" id="cfg-website" tabindex="-1" autocomplete="off">' +
        '</div>' +
      '</div>';
  }

  function summaryItem(label, value) {
    return '<div class="cfg-resumo-item"><dt>' + label + '</dt><dd>' + WA.escapeHTML(value) + '</dd></div>';
  }

  function renderNav() {
    var atras  = state.step > 1
      ? '<button type="button" class="btn btn-ghost cfg-back" id="cfg-back">← Voltar</button>'
      : '<span></span>';
    var avancar;
    if (state.step < state.total) {
      var canAdvance = canAdvanceFrom(state.step);
      avancar = '<button type="button" class="btn btn-primary cfg-next" id="cfg-next"' + (canAdvance ? '' : ' disabled') + '>Continuar →</button>';
    } else {
      avancar = '<button type="button" class="btn btn-wa cfg-send" id="cfg-send">' +
        '<svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px;"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.9 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.7-1.6-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5C9.3 9 8.8 7.6 8.6 7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 .9-1 2.3s1 2.7 1.1 2.8c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.2-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.3c1.4.7 3 1.1 4.7 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>' +
        ' Enviar para o WhatsApp' +
        '</button>';
    }
    return '<div class="cfg-nav">' + atras + avancar + '</div>';
  }

  function canAdvanceFrom(step) {
    if (step === 1) return !!state.tipo;
    if (step === 2) return !!state.tamanho;
    if (step === 3) return !!state.madeira;
    if (step === 4) return !!state.acabamento;
    if (step === 5) return !!state.prazo;
    return true;
  }

  // ============== EVENTOS ==============
  function bindEvents() {
    var root = document.getElementById('configurador');

    // Botões de seleção em cada step
    root.querySelectorAll('[data-tipo]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.tipo = b.dataset.tipo;
        autoAdvance();
        render();
      });
    });
    root.querySelectorAll('[data-tamanho]').forEach(function (b) {
      b.addEventListener('click', function () { state.tamanho = b.dataset.tamanho; autoAdvance(); render(); });
    });
    root.querySelectorAll('[data-madeira]').forEach(function (b) {
      b.addEventListener('click', function () { state.madeira = b.dataset.madeira; autoAdvance(); render(); });
    });
    root.querySelectorAll('[data-acabamento]').forEach(function (b) {
      b.addEventListener('click', function () { state.acabamento = b.dataset.acabamento; autoAdvance(); render(); });
    });
    root.querySelectorAll('[data-prazo]').forEach(function (b) {
      b.addEventListener('click', function () { state.prazo = b.dataset.prazo; autoAdvance(); render(); });
    });

    // Inputs da etapa 6 — guarda em estado on input
    bindInput('cfg-nome',     'nome');
    bindInput('cfg-telefone', 'telefone', WA.formatPhone);
    bindInput('cfg-cidade',   'cidade');
    bindInput('cfg-obs',      'obs');

    // Nav
    var back = document.getElementById('cfg-back');
    if (back) back.addEventListener('click', function () { state.step = Math.max(1, state.step - 1); render(); window.scrollTo({top: root.offsetTop - 80, behavior: 'smooth'}); });

    var next = document.getElementById('cfg-next');
    if (next) next.addEventListener('click', function () {
      if (canAdvanceFrom(state.step)) { state.step++; render(); window.scrollTo({top: root.offsetTop - 80, behavior: 'smooth'}); }
    });

    var send = document.getElementById('cfg-send');
    if (send) send.addEventListener('click', enviarParaWhatsApp);
  }

  function bindInput(id, prop, formatter) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () {
      if (formatter) el.value = formatter(el.value);
      state[prop] = el.value;
    });
  }

  function autoAdvance() {
    // Quando o usuário clica numa opção, espera 300ms e avança automaticamente.
    // Desativa nas duas últimas etapas (prazo + resumo), já que resumo precisa de input.
    if (state.step >= 5) return;
    setTimeout(function () {
      if (canAdvanceFrom(state.step)) {
        state.step++;
        render();
        var root = document.getElementById('configurador');
        if (root) window.scrollTo({ top: root.offsetTop - 80, behavior: 'smooth' });
      }
    }, 280);
  }

  // ============== ENVIO PRO WHATSAPP ==============
  function enviarParaWhatsApp() {
    // Honeypot
    var hp = document.getElementById('cfg-website');
    if (hp && hp.value) {
      WA.toast('Pedido enviado.');
      return;
    }
    // Validação mínima
    if (!state.nome || state.nome.trim().length < 3) {
      WA.toast('Informe seu nome para concluir.', 'error');
      var f = document.getElementById('cfg-nome');
      if (f) f.focus();
      return;
    }

    var t = TIPOS.find(function (x) { return x.id === state.tipo; });
    var tam = TAMANHOS.find(function (x) { return x.id === state.tamanho; });
    var mad = MADEIRAS.find(function (x) { return x.id === state.madeira; });
    var aca = ACABAMENTOS.find(function (x) { return x.id === state.acabamento; });
    var prz = PRAZOS.find(function (x) { return x.id === state.prazo; });
    var est = estimate();

    var lines = [];
    lines.push('*Orçamento sob medida — ' + WA.config.businessName + '*');
    lines.push('');
    lines.push('*Cliente:* ' + state.nome);
    if (state.telefone) lines.push('*Telefone:* ' + state.telefone);
    if (state.cidade)   lines.push('*Cidade:* ' + state.cidade);
    lines.push('');
    lines.push('*Peça:* ' + t.nome);
    lines.push('*Tamanho:* ' + tam.nome + ' (' + tam.hint.toLowerCase() + ')');
    lines.push('*Madeira:* ' + mad.nome);
    lines.push('*Acabamento:* ' + aca.nome);
    lines.push('*Prazo:* ' + prz.nome + ' (' + prz.hint.toLowerCase() + ')');
    lines.push('');
    lines.push('*Estimativa do configurador:* ' + WA.formatCurrency(est.min) + ' a ' + WA.formatCurrency(est.max));
    lines.push('');
    if (state.obs && state.obs.trim()) {
      lines.push('*Detalhes / medidas:*');
      lines.push(state.obs.trim());
    } else {
      lines.push('_Sem detalhes adicionais — combinar medidas na conversa._');
    }

    var win = window.open(WA.buildWALink(lines.join('\n')), '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = WA.buildWALink(lines.join('\n'));
    WA.toast('Pedido pronto no WhatsApp. Só clicar em enviar lá.');
  }

  // ============== SVG GLIFOS ==============
  // Pequenas ilustrações por tipo. Style consistente: stroke fino, sem fill colorido.

  function glyphMesa() {
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="10" y="22" width="44" height="6" rx="1"/>' +
      '<line x1="16" y1="28" x2="16" y2="48"/>' +
      '<line x1="48" y1="28" x2="48" y2="48"/>' +
      '</svg>';
  }
  function glyphEstante() {
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="14" y="10" width="36" height="44" rx="1"/>' +
      '<line x1="14" y1="22" x2="50" y2="22"/>' +
      '<line x1="14" y1="34" x2="50" y2="34"/>' +
      '<line x1="14" y1="46" x2="50" y2="46"/>' +
      '</svg>';
  }
  function glyphCozinha() {
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="8" y="10" width="20" height="22" rx="1"/>' +
      '<rect x="32" y="10" width="24" height="22" rx="1"/>' +
      '<rect x="8" y="36" width="48" height="18" rx="1"/>' +
      '<circle cx="18" cy="45" r="1.5" fill="currentColor"/>' +
      '<circle cx="40" cy="45" r="1.5" fill="currentColor"/>' +
      '</svg>';
  }
  function glyphDorm() {
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="6" y="22" width="52" height="22" rx="2"/>' +
      '<path d="M6 30h52"/>' +
      '<rect x="14" y="18" width="36" height="6" rx="1"/>' +
      '<line x1="10" y1="44" x2="10" y2="50"/>' +
      '<line x1="54" y1="44" x2="54" y2="50"/>' +
      '</svg>';
  }
  function glyphBanco() {
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="8" y="26" width="48" height="8" rx="1"/>' +
      '<line x1="14" y1="34" x2="14" y2="50"/>' +
      '<line x1="50" y1="34" x2="50" y2="50"/>' +
      '<line x1="14" y1="46" x2="50" y2="46"/>' +
      '</svg>';
  }
  function glyphOutro() {
    return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="32" cy="32" r="22"/>' +
      '<path d="M26 28a6 6 0 1 1 8 5.5V36"/>' +
      '<circle cx="32" cy="44" r="1.5" fill="currentColor"/>' +
      '</svg>';
  }
  function woodSwatch() {
    // veios horizontais simples no swatch
    return '<svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<path d="M0 18 Q15 12 30 18 T60 18" stroke="rgba(0,0,0,0.25)" stroke-width="0.8" fill="none"/>' +
      '<path d="M0 32 Q15 26 30 32 T60 32" stroke="rgba(0,0,0,0.18)" stroke-width="0.7" fill="none"/>' +
      '<path d="M0 46 Q15 40 30 46 T60 46" stroke="rgba(0,0,0,0.22)" stroke-width="0.6" fill="none"/>' +
      '<ellipse cx="40" cy="30" rx="3" ry="5" fill="rgba(0,0,0,0.18)"/>' +
      '</svg>';
  }

  // ============== INIT ==============
  render();
})();
