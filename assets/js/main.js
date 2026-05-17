/* =====================================================================
   C&G PLANEJADOS — main.js
   Utilitários compartilhados, navegação, formulário de orçamento.
   Modo estrito; sem dependências externas; sem eval/innerHTML com user input.
   ===================================================================== */
'use strict';

/* ---------- CONFIG GLOBAL ---------- */
window.WA = window.WA || {};
WA.config = {
  // Número de WhatsApp que recebe os orçamentos.
  // Formato internacional sem traços/espaços (único aceito por wa.me).
  // Para alterar, edite ESTE valor — único lugar.
  whatsappNumber: '5571981804578',
  businessName: 'C&G Planejados',
  businessEmail: 'contato@cgplanejados.com.br',
};

/* ---------- UTIL: SANITIZAÇÃO E ESCAPE ---------- */
/**
 * Escapa HTML para inserção segura no DOM.
 * Usado sempre que dado de usuário ou de produto entra em innerHTML.
 */
WA.escapeHTML = function (str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
};

/**
 * Limpa string para usar em URL de WhatsApp.
 * Remove caracteres de controle e limita tamanho.
 */
WA.sanitizeForWA = function (str) {
  if (str == null) return '';
  return String(str)
    .replace(/[\x00-\x1f\x7f]/g, '') // remove controles
    .trim()
    .slice(0, 2000);                  // limita tamanho da mensagem
};

/**
 * Monta link wa.me com mensagem pré-codificada.
 */
WA.buildWALink = function (message) {
  var msg = encodeURIComponent(WA.sanitizeForWA(message));
  return 'https://wa.me/' + WA.config.whatsappNumber + '?text=' + msg;
};

/* ---------- UTIL: FORMATADORES ---------- */
WA.formatCurrency = function (n) {
  if (typeof n !== 'number' || isNaN(n)) return 'R$ 0,00';
  return 'R$ ' + n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

WA.formatDate = function (iso) {
  if (!iso) return '';
  var d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

WA.formatPhone = function (raw) {
  var d = String(raw || '').replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
};

WA.formatCEP = function (raw) {
  var d = String(raw || '').replace(/\D/g, '').slice(0, 8);
  if (d.length <= 5) return d;
  return d.slice(0, 5) + '-' + d.slice(5);
};

/**
 * Anexa fallback de erro às imagens dentro de `root`, sem usar
 * `onerror="…"` inline (que é bloqueado por CSP `script-src 'self'`).
 *
 * Uso no HTML gerado:
 *   <img src="..." data-fallback="data:image/svg+xml;..." alt="">
 *
 * Depois de inserir o HTML, chame:
 *   WA.applyImgFallbacks(container);
 */
WA.applyImgFallbacks = function (root) {
  if (!root) root = document;
  var imgs = root.querySelectorAll('img[data-fallback]');
  imgs.forEach(function (img) {
    if (img.dataset.fbBound) return;
    img.dataset.fbBound = '1';
    img.addEventListener('error', function handle() {
      img.removeEventListener('error', handle);
      img.src = img.dataset.fallback;
    });
    // Trata o caso em que o erro já aconteceu antes do listener
    if (img.complete && img.naturalWidth === 0) {
      img.src = img.dataset.fallback;
    }
  });
};

/* ---------- UTIL: TOAST ---------- */
WA.toast = function (message, type) {
  var el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  var icon = type === 'error'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
  el.className = 'toast' + (type === 'error' ? ' error' : '');
  el.innerHTML = icon + '<span></span>';
  el.querySelector('span').textContent = message;
  // Trigger reflow so transition runs even on second toast.
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(WA._toastTimer);
  WA._toastTimer = setTimeout(function () { el.classList.remove('show'); }, 4200);
};

/* ---------- NAV: scroll + mobile menu ---------- */
function initNav() {
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (!nav) return;

  // Sombra ao rolar
  var onScroll = function () {
    if (window.scrollY > 8) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Fecha ao clicar num link
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ---------- FAB WhatsApp: href é setado em partials.js no render ---------- */

/* ---------- FORMULÁRIO DE ORÇAMENTO ----------
   Funcional de verdade: valida, sanitiza, monta a mensagem
   e abre o WhatsApp com tudo pré-preenchido.
   Funciona em GitHub Pages — não precisa de backend.
-------------------------------------------------*/
function initQuoteForm() {
  var form = document.getElementById('quoteForm');
  if (!form) return;

  // Máscaras leves de telefone e CEP (sem libs)
  var tel = form.querySelector('input[name="telefone"]');
  if (tel) tel.addEventListener('input', function () { tel.value = WA.formatPhone(tel.value); });
  var cep = form.querySelector('input[name="cep"]');
  if (cep) cep.addEventListener('input', function () { cep.value = WA.formatCEP(cep.value); });

  // Limpa estado de erro ao digitar
  form.addEventListener('input', function (e) {
    if (e.target.hasAttribute('aria-invalid')) e.target.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot — campo invisível pra humanos. Se preenchido, é bot.
    var hp = form.querySelector('input[name="website"]');
    if (hp && hp.value) {
      // Finge sucesso para não dar pista ao bot.
      WA.toast('Mensagem enviada com sucesso.');
      form.reset();
      return;
    }

    // Coleta valores
    var data = {};
    var fd = new FormData(form);
    fd.forEach(function (v, k) { data[k] = String(v).trim(); });

    // Validação
    var errors = validateQuote(data);
    if (errors.length) {
      errors.forEach(function (name) {
        var f = form.querySelector('[name="' + name + '"]');
        if (f) f.setAttribute('aria-invalid', 'true');
      });
      var first = form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      WA.toast('Verifique os campos destacados.', 'error');
      return;
    }

    // Monta mensagem
    var lines = [];
    lines.push('*Solicitação de orçamento — ' + WA.config.businessName + '*');
    lines.push('');
    lines.push('*Nome:* ' + data.nome);
    lines.push('*E-mail:* ' + data.email);
    if (data.telefone) lines.push('*Telefone:* ' + data.telefone);
    if (data.cidade)   lines.push('*Cidade:* ' + data.cidade);
    if (data.cep)      lines.push('*CEP:* ' + data.cep);
    lines.push('*Tipo de peça:* ' + getTipoLabel(data['tipo-peca']));
    if (data.prazo)    lines.push('*Prazo desejado:* ' + data.prazo);
    if (data.orcamento) lines.push('*Faixa de orçamento:* ' + data.orcamento);
    lines.push('');
    lines.push('*Detalhes:*');
    lines.push(data.observacoes);

    var url = WA.buildWALink(lines.join('\n'));

    // Feedback visual
    var btn = form.querySelector('button[type="submit"]');
    var originalText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = 'Abrindo WhatsApp…';
    }

    // Abre o WhatsApp em nova aba
    var win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) {
      // Pop-up bloqueado: redireciona a aba atual
      window.location.href = url;
    }

    setTimeout(function () {
      if (btn) { btn.disabled = false; btn.innerHTML = originalText; }
      WA.toast('Pedido pronto no WhatsApp. Só clicar em enviar lá.');
      form.reset();
    }, 600);
  });
}

function validateQuote(data) {
  var errors = [];
  if (!data.nome || data.nome.length < 3) errors.push('nome');
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('email');
  if (!data['tipo-peca']) errors.push('tipo-peca');
  if (!data.observacoes || data.observacoes.length < 10) errors.push('observacoes');
  return errors;
}

function getTipoLabel(value) {
  var map = {
    'utensilio': 'Utensílio (tábua, etc)',
    'movel': 'Móvel (mesa, cadeira, etc)',
    'organizacao': 'Organização (prateleira, nicho)',
    'jardinagem': 'Jardinagem (suporte, vaso)',
    'decoracao': 'Decoração',
    'planta': 'Planta viva',
    'outro': 'Outro'
  };
  return map[value] || value || 'Não especificado';
}

/* ---------- COMPARTILHAMENTO E ORÇAMENTO RÁPIDO POR PRODUTO ----------
   Expostos no escopo global para uso em onclick declarativo (sem eval).
-------------------------------------------------*/
WA.quoteForProduct = function (productId) {
  if (typeof window.productsDB === 'undefined') return;
  var p = window.productsDB.find(function (x) { return x.id === productId; });
  if (!p) return;
  var lines = [];
  lines.push('Olá! Vim pelo site e gostaria de um orçamento para o produto:');
  lines.push('');
  lines.push('*' + p.nome + '*');
  lines.push('Categoria: ' + (p.categoria || ''));
  if (p.preco) lines.push('Preço de referência: ' + WA.formatCurrency(p.preco));
  if (p.sku)   lines.push('SKU: ' + p.sku);
  lines.push('');
  lines.push('Poderia me passar mais informações?');
  window.open(WA.buildWALink(lines.join('\n')), '_blank', 'noopener,noreferrer');
};

WA.shareProduct = function (platform, productName, productUrl) {
  var url = encodeURIComponent(productUrl || window.location.href);
  var title = encodeURIComponent(productName || document.title);
  var map = {
    facebook:  'https://www.facebook.com/sharer/sharer.php?u=' + url,
    twitter:   'https://twitter.com/intent/tweet?text=' + title + '&url=' + url,
    pinterest: 'https://pinterest.com/pin/create/button/?url=' + url + '&description=' + title,
    whatsapp:  'https://wa.me/?text=' + title + '%20' + url
  };
  var shareUrl = map[platform];
  if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
};

WA.copyLink = function () {
  var url = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function () {
      WA.toast('Link copiado!');
    }).catch(function () {
      WA.toast('Não foi possível copiar.', 'error');
    });
  } else {
    // Fallback antigo
    var ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); WA.toast('Link copiado!'); }
    catch (e) { WA.toast('Não foi possível copiar.', 'error'); }
    document.body.removeChild(ta);
  }
};

/* ---------- ANO NO FOOTER ---------- */
function initYear() {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------- SVG: TEXTURA DE MADEIRA ---------- */
/**
 * Gera SVG de textura de madeira para swatches. Determinístico por seed:
 * mesma seed = mesma textura. Útil para diferenciar madeiras visualmente
 * sem precisar de fotos reais (placeholder até subirem fotos).
 *
 * @param {string} seed - string que determina variação (ex: slug da madeira)
 * @param {object} opts - { width, height, intensity (0-1), knots (0-3) }
 */
WA.woodSwatch = function (seed, opts) {
  opts = opts || {};
  var w = opts.width || 60;
  var h = opts.height || 60;
  var intensity = opts.intensity != null ? opts.intensity : 0.25;
  var knots = opts.knots != null ? opts.knots : 1;

  // PRNG simples (mulberry32) com seed determinística a partir da string
  var hash = 2166136261;
  for (var i = 0; i < (seed || '').length; i++) {
    hash = (hash ^ seed.charCodeAt(i)) * 16777619 >>> 0;
  }
  function rnd() {
    hash |= 0; hash = hash + 0x6D2B79F5 | 0;
    var t = Math.imul(hash ^ hash >>> 15, 1 | hash);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  var paths = '';
  // 4-6 veios horizontais com pequenas oscilações
  var nGrains = 4 + Math.floor(rnd() * 3);
  for (var g = 0; g < nGrains; g++) {
    var y = (h / (nGrains + 1)) * (g + 1) + (rnd() - 0.5) * 4;
    var amp = 2 + rnd() * 4;
    var op = (intensity * (0.7 + rnd() * 0.6)).toFixed(2);
    var sw = (0.5 + rnd() * 0.5).toFixed(2);
    paths += '<path d="M0 ' + y.toFixed(1) +
             ' Q' + (w * 0.25).toFixed(1) + ' ' + (y - amp).toFixed(1) +
             ' ' + (w * 0.5).toFixed(1) + ' ' + y.toFixed(1) +
             ' T' + w + ' ' + y.toFixed(1) +
             '" stroke="rgba(0,0,0,' + op + ')" stroke-width="' + sw + '" fill="none"/>';
  }
  // Nós (knots) — manchas ovais escuras
  for (var k = 0; k < knots; k++) {
    var cx = (rnd() * 0.6 + 0.2) * w;
    var cy = (rnd() * 0.6 + 0.2) * h;
    var rx = 2 + rnd() * 3;
    var ry = rx * (1.2 + rnd() * 0.6);
    paths += '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) +
             '" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) +
             '" fill="rgba(0,0,0,' + (intensity * 0.7).toFixed(2) + ')"/>';
  }

  return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
    paths + '</svg>';
};


/* ---------- COMPONENTE: SLIDER ANTES/DEPOIS ---------- */
/**
 * Transforma um elemento em slider de cortina (antes/depois).
 * Espera HTML interno no formato:
 *   <div class="ba"><div class="ba-before">...</div><div class="ba-after">...</div></div>
 *
 * Acessível: role="slider", arrastar com mouse/touch, ← → Home End no teclado.
 *
 * @param {HTMLElement} root - container .ba já com .ba-before e .ba-after dentro
 * @param {object} opts - { initial: 50, labels: { before, after } }
 */
WA.makeBeforeAfter = function (root, opts) {
  opts = opts || {};
  if (!root || root.dataset.baInit === '1') return;
  root.dataset.baInit = '1';

  var before = root.querySelector('.ba-before');
  var after  = root.querySelector('.ba-after');
  if (!before || !after) return;

  // Usa handle existente se já houver (ex: HTML pré-renderizado pela galeria.js).
  // Caso contrário, cria um.
  var handle = root.querySelector('.ba-handle');
  if (!handle) {
    handle = document.createElement('div');
    handle.className = 'ba-handle';
    handle.innerHTML =
      '<div class="ba-handle-line"></div>' +
      '<div class="ba-handle-knob" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<polyline points="9 18 3 12 9 6"/>' +
          '<polyline points="15 6 21 12 15 18"/>' +
        '</svg>' +
      '</div>';
    root.appendChild(handle);
  }
  // Atributos ARIA — adiciona mesmo em handles pré-existentes
  handle.setAttribute('role', 'slider');
  handle.setAttribute('tabindex', '0');
  if (!handle.getAttribute('aria-label')) {
    handle.setAttribute('aria-label', 'Arraste para revelar antes e depois');
  }
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');

  // Insere labels se não existem ainda
  if (!before.querySelector('.ba-label') && !root.querySelector('.ba-label-before')) {
    var labels = opts.labels || { before: 'Antes', after: 'Depois' };
    var labBefore = document.createElement('span');
    labBefore.className = 'ba-label ba-label-before';
    labBefore.textContent = labels.before;
    before.appendChild(labBefore);
    var labAfter = document.createElement('span');
    labAfter.className = 'ba-label ba-label-after';
    labAfter.textContent = labels.after;
    after.appendChild(labAfter);
  }

  var pct = Math.max(0, Math.min(100, opts.initial != null ? opts.initial : 50));
  apply(pct);

  function apply(p) {
    pct = Math.max(0, Math.min(100, p));
    // Mostra "antes" do lado esquerdo (clip-path do "after" começa de pct%)
    after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
    handle.style.left = pct + '%';
    handle.setAttribute('aria-valuenow', String(Math.round(pct)));
    handle.setAttribute('aria-valuetext', Math.round(pct) + '% revelado depois');
  }

  function pctFromEvent(ev) {
    var rect = root.getBoundingClientRect();
    var x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  }

  var dragging = false;

  function start(ev) {
    dragging = true;
    root.classList.add('ba-dragging');
    if (ev.cancelable) ev.preventDefault();
    apply(pctFromEvent(ev));
  }
  function move(ev) {
    if (!dragging) return;
    if (ev.cancelable) ev.preventDefault();
    apply(pctFromEvent(ev));
  }
  function end() {
    dragging = false;
    root.classList.remove('ba-dragging');
  }

  root.addEventListener('mousedown',  start);
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup',   end);

  root.addEventListener('touchstart', start, { passive: false });
  document.addEventListener('touchmove', move, { passive: false });
  document.addEventListener('touchend', end);

  handle.addEventListener('keydown', function (e) {
    var step = e.shiftKey ? 10 : 5;
    switch (e.key) {
      case 'ArrowLeft':  apply(pct - step); e.preventDefault(); break;
      case 'ArrowRight': apply(pct + step); e.preventDefault(); break;
      case 'Home':       apply(0);          e.preventDefault(); break;
      case 'End':        apply(100);        e.preventDefault(); break;
    }
  });

  return { setPct: apply, getPct: function () { return pct; } };
};

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initQuoteForm();
  initYear();
});
