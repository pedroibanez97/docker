/* =====================================================================
   Docker desde cero — motor de la presentación (sin dependencias)
   - Navegación por teclado, botones y gestos; progreso; índice
   - Notas docentes y vista del docente sincronizada (segunda ventana)
   - Resaltado de código, botón copiar, pestañas, respuestas y cuestionario
   - Portada e índice para la versión impresa / PDF
   ===================================================================== */
(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const raiz = document.documentElement;
  const cuerpo = document.body;

  const leer = (clave) => { try { return localStorage.getItem(clave); } catch { return null; } };
  const guardar = (clave, valor) => { try { localStorage.setItem(clave, valor); } catch { /* sin almacenamiento */ } };
  const escapar = (texto) => texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const esNumerado = (m) => /^[1-9]\d*$/.test(m?.numero ?? '');

  /* ---------- 1. Diapositivas y módulos ---------- */
  const slides = [...document.querySelectorAll('.presentacion > .slide')];
  const modulos = [];
  let modulo = null;

  slides.forEach((slide, i) => {
    if (slide.dataset.moduloTitulo) {
      modulo = {
        numero: slide.dataset.modulo,
        titulo: slide.dataset.moduloTitulo,
        tiempo: slide.dataset.tiempo || '',
        slide,
        slides: [],
      };
      modulos.push(modulo);
    }
    slide.modulo = modulo;
    if (modulo) modulo.slides.push(slide);

    const encabezado = slide.querySelector('h1, h2');
    slide.titulo = slide.dataset.titulo || (encabezado ? encabezado.textContent.replace(/\s+/g, ' ').trim() : `Diapositiva ${i + 1}`);
    if (!slide.id) slide.id = modulo ? `m${modulo.numero}-${modulo.slides.length}`.toLowerCase() : `s${i + 1}`;
    slide.setAttribute('aria-label', slide.titulo);

    // Etiquetas de tipo y módulo (no en portadas)
    if (!slide.classList.contains('portada') && !slide.classList.contains('slide--modulo') && modulo) {
      const meta = document.createElement('div');
      meta.className = 'slide__meta';
      const tipo = slide.dataset.tipo || 'explicacion';
      const nombres = { explicacion: 'Explicación', demo: 'Demo del docente', actividad: 'Actividad', solucion: 'Solución', repaso: 'Repaso' };
      const etiquetaModulo = esNumerado(modulo) ? `Módulo ${modulo.numero} · ${modulo.titulo}` : modulo.titulo;
      meta.innerHTML = `<span class="tipo tipo--${tipo}">${nombres[tipo] || tipo}</span><span class="slide__modulo">${escapar(etiquetaModulo)}</span>`;
      slide.prepend(meta);
    }
  });

  /* ---------- 2. Código: resaltado + copiar ---------- */
  const BASH_CMDS = 'docker|sudo|npm|npx|ng|curl|curl\\.exe|cd|cp|ls|cat|echo|git|mysql|mysqldump|wsl|softwareupdate|systemctl|apt|usermod|groupadd|newgrp|openssl|nano|ssh|scp|chmod|mkdir|exit|lsof|netstat|findstr|Copy-Item|Invoke-RestMethod|ufw|node|sh|whoami|uname|Get-Content|dpkg|tee|install|rm|nslookup|ping';
  const LENGUAJES = {
    bash: [
      ['com', /(?<=^|\s)#.*/m],
      ['str', /"(?:[^"\\]|\\.)*"|'[^']*'/],
      ['var', /\$\{[^}]*\}|\$[A-Za-z_][A-Za-z0-9_]*/],
      ['flag', /(?<=\s)--?[A-Za-z][\w-]*(?:=[^\s'"]*)?/],
      ['cmd', new RegExp(`(?<=^\\s*|\\|\\s*|&&\\s*|;\\s*|\\(\\s*)(?:${BASH_CMDS})(?![\\w-])`, 'm')],
    ],
    dockerfile: [
      ['com', /^\s*#.*/m],
      ['dir', /^\s*(?:FROM|WORKDIR|COPY|RUN|ENV|EXPOSE|CMD|ENTRYPOINT|USER|ARG|LABEL|ADD|VOLUME|HEALTHCHECK|SHELL)\b/m],
      ['kw', /\bAS\b/],
      ['str', /"(?:[^"\\]|\\.)*"/],
      ['flag', /--[\w-]+(?:=\S*)?/],
      ['var', /\$\{?\w+\}?/],
    ],
    yaml: [
      ['com', /(?<=^|\s)#.*/m],
      ['str', /"(?:[^"\\]|\\.)*"|'[^']*'/],
      ['var', /\$\{[^}]*\}|\$\$?[A-Za-z_]\w*/],
      ['key', /[A-Za-z_][\w.-]*(?=:(?:\s|$))/m],
      ['kw', /\b(?:true|false|null)\b/],
    ],
    js: [
      ['com', /\/\/.*|\/\*[\s\S]*?\*\//],
      ['str', /`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/],
      ['kw', /\b(?:import|from|export|default|const|let|var|async|await|return|if|else|new|function|class|try|catch|throw|of|for|interface|implements|private|protected|readonly|public|this|null|undefined|true|false|typeof)\b/],
      ['dir', /@[A-Za-z]\w*/],
      ['num', /\b\d+(?:\.\d+)?\b/],
    ],
    json: [
      ['key', /"(?:[^"\\]|\\.)*"(?=\s*:)/],
      ['str', /"(?:[^"\\]|\\.)*"/],
      ['num', /-?\b\d+(?:\.\d+)?\b/],
      ['kw', /\b(?:true|false|null)\b/],
    ],
    sql: [
      ['com', /--.*/],
      ['str', /'(?:[^'\\]|\\.)*'/],
      ['kw', /\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|CREATE|TABLE|DATABASE|IF|NOT|EXISTS|PRIMARY|KEY|AUTO_INCREMENT|DEFAULT|NULL|INT|VARCHAR|BOOLEAN|TIMESTAMP|SMALLINT|CURRENT_TIMESTAMP|SET|NAMES|USE|ORDER|BY|DELETE|UPDATE|TRUE|FALSE|CHARACTER|COLLATE|COUNT|AS|SHOW|TABLES|DATABASES|GRANT|ON|TO|ALL|PRIVILEGES)\b/i],
      ['num', /\b\d+\b/],
    ],
    nginx: [
      ['com', /#.*/],
      ['var', /\$\w+/],
      ['dir', /^\s*[a-z_]+(?=\s)/m],
      ['str', /"[^"]*"/],
    ],
    env: [
      ['com', /^\s*#.*/m],
      ['key', /^[A-Za-z_][A-Za-z0-9_]*(?==)/m],
    ],
    texto: [],
  };
  LENGUAJES.ts = LENGUAJES.js;
  LENGUAJES.powershell = LENGUAJES.bash;
  LENGUAJES.caddy = LENGUAJES.nginx;

  const compiladas = {};
  const reglasDe = (lenguaje) => {
    if (!compiladas[lenguaje]) {
      compiladas[lenguaje] = (LENGUAJES[lenguaje] || []).map(([clase, re]) => [clase, new RegExp(re.source, re.flags.replace(/[gy]/g, '') + 'y')]);
    }
    return compiladas[lenguaje];
  };

  function resaltar(texto, lenguaje) {
    const reglas = reglasDe(lenguaje);
    let html = '';
    let plano = '';
    let i = 0;
    while (i < texto.length) {
      let avance = 0;
      for (const [clase, re] of reglas) {
        re.lastIndex = i;
        const m = re.exec(texto);
        if (m && m[0].length) {
          if (plano) { html += escapar(plano); plano = ''; }
          html += `<span class="tk-${clase}">${escapar(m[0])}</span>`;
          avance = m[0].length;
          break;
        }
      }
      if (avance) i += avance;
      else { plano += texto[i]; i += 1; }
    }
    return html + escapar(plano);
  }

  async function copiarTexto(texto) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch {
      const area = document.createElement('textarea');
      area.value = texto;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.append(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      area.remove();
      return ok;
    }
  }

  document.querySelectorAll('.presentacion pre[data-lang]').forEach((pre) => {
    const code = pre.querySelector('code') || pre;
    const lenguaje = pre.dataset.lang;
    const texto = code.textContent.replace(/\n$/, '');
    code.innerHTML = resaltar(texto, lenguaje);

    const envoltura = document.createElement('div');
    envoltura.className = 'codigo';
    if (pre.classList.contains('chico')) envoltura.classList.add('codigo--chico');
    if (pre.classList.contains('alto')) envoltura.classList.add('codigo--alto');
    const cabecera = document.createElement('div');
    cabecera.className = 'codigo__cabecera';
    const nombre = pre.dataset.archivo || pre.dataset.fuente || ({ bash: 'Terminal', powershell: 'PowerShell' }[lenguaje] ?? lenguaje);
    cabecera.innerHTML = `<span class="codigo__archivo">${escapar(nombre)}</span>`;
    if (!pre.hasAttribute('data-sin-copiar')) {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'copiar';
      boton.textContent = 'Copiar';
      boton.setAttribute('aria-label', `Copiar ${nombre}`);
      boton.addEventListener('click', async () => {
        const ok = await copiarTexto(texto);
        boton.textContent = ok ? '¡Copiado!' : 'No se pudo copiar';
        boton.classList.toggle('copiado', ok);
        setTimeout(() => { boton.textContent = 'Copiar'; boton.classList.remove('copiado'); }, 1600);
      });
      cabecera.append(boton);
    }
    pre.replaceWith(envoltura);
    envoltura.append(cabecera, pre);
  });

  /* ---------- 3. Pestañas (con grupos sincronizados, p. ej. sistema operativo) ---------- */
  const sistemaDetectado = (() => {
    const ua = navigator.userAgent;
    if (/Windows/i.test(ua)) return 'Windows';
    if (/Mac/i.test(ua)) return 'macOS';
    if (/Linux/i.test(ua)) return 'Linux';
    return null;
  })();
  const gruposPestanas = new Map();

  function seleccionarPestana(contenedor, titulo) {
    const paneles = [...contenedor.querySelectorAll(':scope > .pestana')];
    const botones = [...contenedor.querySelectorAll(':scope > .pestanas__lista > button')];
    const indice = Math.max(0, paneles.findIndex((p) => p.dataset.titulo.startsWith(titulo)));
    paneles.forEach((p, i) => { p.hidden = i !== indice; });
    botones.forEach((b, i) => { b.setAttribute('aria-selected', String(i === indice)); b.tabIndex = i === indice ? 0 : -1; });
  }

  document.querySelectorAll('.pestanas').forEach((contenedor, n) => {
    const paneles = [...contenedor.querySelectorAll(':scope > .pestana')];
    const lista = document.createElement('div');
    lista.className = 'pestanas__lista';
    lista.setAttribute('role', 'tablist');
    paneles.forEach((panel, i) => {
      const id = `pestana-${n}-${i}`;
      panel.id = id;
      panel.setAttribute('role', 'tabpanel');
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.setAttribute('role', 'tab');
      boton.setAttribute('aria-controls', id);
      boton.textContent = panel.dataset.titulo;
      boton.addEventListener('click', () => {
        const grupo = contenedor.dataset.grupo;
        if (grupo) {
          guardar(`dd-pestana-${grupo}`, panel.dataset.titulo);
          (gruposPestanas.get(grupo) || []).forEach((c) => seleccionarPestana(c, panel.dataset.titulo));
        } else {
          seleccionarPestana(contenedor, panel.dataset.titulo);
        }
      });
      lista.append(boton);
    });
    contenedor.prepend(lista);
    const grupo = contenedor.dataset.grupo;
    if (grupo) {
      if (!gruposPestanas.has(grupo)) gruposPestanas.set(grupo, []);
      gruposPestanas.get(grupo).push(contenedor);
    }
    const preferida = (grupo && leer(`dd-pestana-${grupo}`)) || (grupo === 'so' && sistemaDetectado) || paneles[0].dataset.titulo;
    seleccionarPestana(contenedor, preferida);
  });

  /* ---------- 4. Respuestas para revelar y cuestionario ---------- */
  document.querySelectorAll('.respuesta').forEach((respuesta) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'boton-revelar';
    boton.textContent = 'Ver respuesta';
    boton.setAttribute('aria-expanded', 'false');
    boton.addEventListener('click', () => {
      const contenedor = respuesta.parentElement;
      const abierta = contenedor.classList.toggle('revelada');
      boton.textContent = abierta ? 'Ocultar respuesta' : 'Ver respuesta';
      boton.setAttribute('aria-expanded', String(abierta));
    });
    respuesta.before(boton);
  });

  document.querySelectorAll('.quiz__pregunta').forEach((pregunta) => {
    const items = [...pregunta.querySelectorAll('.opciones > li')];
    items.forEach((li) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.innerHTML = li.innerHTML;
      li.replaceChildren(boton);
      boton.addEventListener('click', () => {
        items.forEach((otro) => {
          const b = otro.querySelector('button');
          b.classList.remove('correcta', 'incorrecta');
          if (otro.hasAttribute('data-correcta')) b.classList.add('correcta');
        });
        if (!li.hasAttribute('data-correcta')) boton.classList.add('incorrecta');
        pregunta.classList.add('respondida');
      });
    });
  });

  /* ---------- 5. Barra, índice y navegación ---------- */
  const $ = (id) => document.getElementById(id);
  const progreso = $('progreso');
  const contador = $('contador');
  const ubicacion = $('ubicacion');
  const panelIndice = $('panel-indice');
  const panelAyuda = $('panel-ayuda');
  const listaIndice = $('lista-indice');

  if (listaIndice) {
    listaIndice.innerHTML = modulos.map((m) => {
      const titulo = esNumerado(m) ? `${m.numero}. ${m.titulo}` : m.titulo;
      const items = m.slides.slice(1).map((s) => `<li data-id="${s.id}"><a href="#${s.id}">${escapar(s.titulo)}</a></li>`).join('');
      return `<section class="indice-modulo" data-id="${m.slide.id}">
        <h3><a href="#${m.slide.id}">${escapar(titulo)}</a></h3>
        ${m.tiempo ? `<div class="tiempo">⏱ ${escapar(m.tiempo)}</div>` : ''}
        ${items ? `<ol>${items}</ol>` : ''}
      </section>`;
    }).join('');
  }

  let actual = -1;
  const canal = 'BroadcastChannel' in window ? new BroadcastChannel('docker-desde-cero') : null;
  const esVistaDocente = params.get('vista') === 'docente';

  function ir(indice, { emitir = true, actualizarHash = true } = {}) {
    const n = Math.max(0, Math.min(slides.length - 1, indice));
    if (n === actual) return;
    if (actual >= 0) slides[actual].classList.remove('activa');
    actual = n;
    const slide = slides[n];
    slide.classList.add('activa');
    slide.scrollTop = 0;

    if (progreso) progreso.style.width = `${(n / Math.max(1, slides.length - 1)) * 100}%`;
    if (contador) contador.textContent = `${n + 1} / ${slides.length}`;
    if (ubicacion) {
      const m = slide.modulo;
      const etiqueta = esNumerado(m) ? `Módulo ${m.numero}` : (m ? m.titulo : '');
      ubicacion.innerHTML = `<strong>${escapar(etiqueta)}</strong>${etiqueta ? ' · ' : ''}${escapar(slide.titulo)}`;
    }
    if (listaIndice) {
      listaIndice.querySelectorAll('.actual').forEach((el) => el.classList.remove('actual'));
      listaIndice.querySelector(`[data-id="${slide.id}"]`)?.classList.add('actual');
    }
    if (actualizarHash && location.hash !== `#${slide.id}`) history.replaceState(null, '', `#${slide.id}`);
    if (emitir && canal) canal.postMessage({ indice: n });
    if (esVistaDocente) pintarVistaDocente();
  }

  const siguiente = () => ir(actual + 1);
  const anterior = () => ir(actual - 1);

  function indiceDesdeHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const n = slides.findIndex((s) => s.id === id);
    return n >= 0 ? n : 0;
  }

  function alternarPanel(panel, abrir) {
    if (!panel) return;
    const mostrar = abrir ?? panel.hidden;
    [panelIndice, panelAyuda].forEach((p) => { if (p && p !== panel) p.hidden = true; });
    panel.hidden = !mostrar;
    if (mostrar) {
      panel.querySelector('.actual a, a, button')?.focus({ preventScroll: false });
    }
  }

  function alternarNotas() {
    const activas = cuerpo.classList.toggle('mostrar-notas');
    $('btn-notas')?.setAttribute('aria-pressed', String(activas));
  }

  function alternarTema() {
    const oscuro = raiz.dataset.theme
      ? raiz.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    raiz.dataset.theme = oscuro ? 'light' : 'dark';
    guardar('dd-tema', raiz.dataset.theme);
  }

  function pantallaCompleta() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else raiz.requestFullscreen?.().catch(() => {});
  }

  function abrirVistaDocente() {
    const url = `${location.pathname}?vista=docente${location.hash}`;
    window.open(url, 'docker-desde-cero-docente', 'width=1200,height=800');
  }

  $('btn-siguiente')?.addEventListener('click', siguiente);
  $('btn-anterior')?.addEventListener('click', anterior);
  $('btn-indice')?.addEventListener('click', () => alternarPanel(panelIndice));
  $('btn-ayuda')?.addEventListener('click', () => alternarPanel(panelAyuda));
  $('btn-notas')?.addEventListener('click', alternarNotas);
  $('btn-tema')?.addEventListener('click', alternarTema);
  $('btn-pantalla')?.addEventListener('click', pantallaCompleta);
  $('btn-docente')?.addEventListener('click', abrirVistaDocente);
  document.querySelectorAll('[data-cerrar-panel]').forEach((b) => b.addEventListener('click', () => alternarPanel(b.closest('.panel'), false)));
  document.querySelectorAll('[data-ir]').forEach((b) => b.addEventListener('click', () => ir(slides.findIndex((s) => s.id === b.dataset.ir))));
  document.querySelectorAll('[data-abrir="indice"]').forEach((b) => b.addEventListener('click', () => alternarPanel(panelIndice, true)));

  // Los enlaces internos del índice cierran el panel
  panelIndice?.addEventListener('click', (e) => {
    if (e.target.closest('a[href^="#"]')) panelIndice.hidden = true;
  });

  window.addEventListener('hashchange', () => ir(indiceDesdeHash(), { actualizarHash: false }));

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    const enBoton = e.target.closest('button, a');
    switch (e.key) {
      case 'ArrowRight': case 'PageDown':
        e.preventDefault(); siguiente(); break;
      case ' ':
        if (enBoton) return;
        e.preventDefault(); if (e.shiftKey) anterior(); else siguiente(); break;
      case 'ArrowLeft': case 'PageUp':
        e.preventDefault(); anterior(); break;
      case 'Home': e.preventDefault(); ir(0); break;
      case 'End': e.preventDefault(); ir(slides.length - 1); break;
      case 'i': case 'I': alternarPanel(panelIndice); break;
      case 'n': case 'N': alternarNotas(); break;
      case 't': case 'T': alternarTema(); break;
      case 'f': case 'F': pantallaCompleta(); break;
      case 'd': case 'D': if (!esVistaDocente) abrirVistaDocente(); break;
      case '?': case 'h': case 'H': alternarPanel(panelAyuda); break;
      case 'Escape': alternarPanel(panelIndice, false); alternarPanel(panelAyuda, false); break;
      default: break;
    }
  });

  // Gestos en pantallas táctiles
  let toque = null;
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) toque = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (!toque || e.target.closest('.codigo, .tabla-envoltura, .panel')) { toque = null; return; }
    const dx = e.changedTouches[0].clientX - toque.x;
    const dy = e.changedTouches[0].clientY - toque.y;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 50) { if (dx < 0) siguiente(); else anterior(); }
    toque = null;
  }, { passive: true });

  if (canal) canal.onmessage = (e) => { if (typeof e.data?.indice === 'number') ir(e.data.indice, { emitir: false }); };

  /* ---------- 6. Vista del docente ---------- */
  const inicioClase = Date.now();
  let inicioCronometro = Date.now();

  function pintarVistaDocente() {
    const vista = $('vista-docente');
    if (!vista) return;
    const slide = slides[actual];
    const proxima = slides[actual + 1];
    const notas = slide.querySelector('.notas');
    vista.querySelector('[data-docente="titulo"]').textContent = slide.titulo;
    vista.querySelector('[data-docente="posicion"]').textContent = `${actual + 1} / ${slides.length}`;
    vista.querySelector('[data-docente="modulo"]').textContent = slide.modulo
      ? `${esNumerado(slide.modulo) ? `Módulo ${slide.modulo.numero} · ` : ''}${slide.modulo.titulo}${slide.modulo.tiempo ? ` (⏱ ${slide.modulo.tiempo})` : ''}`
      : '';
    vista.querySelector('[data-docente="notas"]').innerHTML = notas
      ? notas.outerHTML
      : '<p class="suave">Esta diapositiva no tiene notas. Seguí el contenido en pantalla.</p>';
    vista.querySelector('[data-docente="siguiente"]').textContent = proxima ? proxima.titulo : '— Fin de la presentación —';
    const tipo = slide.dataset.tipo || (slide.classList.contains('slide--modulo') ? 'inicio de módulo' : 'explicacion');
    vista.querySelector('[data-docente="tipo"]').textContent = { explicacion: 'Explicación', demo: 'Demo del docente', actividad: 'Actividad de los alumnos', solucion: 'Solución', repaso: 'Repaso' }[tipo] || tipo;
  }

  function relojes() {
    const formato = (ms) => {
      const s = Math.floor(ms / 1000);
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      return `${h ? `${h}:` : ''}${String(m).padStart(h ? 2 : 1, '0')}:${String(s % 60).padStart(2, '0')}`;
    };
    $('reloj-clase').textContent = formato(Date.now() - inicioClase);
    $('reloj-tramo').textContent = formato(Date.now() - inicioCronometro);
    $('reloj-hora').textContent = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }

  if (esVistaDocente) {
    cuerpo.classList.add('vista-docente');
    document.title = `Vista del docente · ${document.title}`;
    $('docente-anterior')?.addEventListener('click', anterior);
    $('docente-siguiente')?.addEventListener('click', siguiente);
    $('docente-reiniciar')?.addEventListener('click', () => { inicioCronometro = Date.now(); relojes(); });
    relojes();
    setInterval(relojes, 1000);
  }

  /* ---------- 7. Versión impresa: portada, índice y notas ---------- */
  if (params.has('notas')) cuerpo.classList.add('imprimir-notas', 'mostrar-notas');
  const presentacion = document.querySelector('.presentacion');
  if (presentacion) {
    const edicion = params.has('notas') ? 'Guía del docente (incluye notas de exposición)' : 'Guía de estudio';
    const dibujo = document.querySelector('.portada__dibujo')?.outerHTML ?? '';
    const portadaImpresa = document.createElement('section');
    portadaImpresa.className = 'solo-impresion portada-impresion';
    portadaImpresa.innerHTML = `
      <div class="sello">Técnico Universitario en Programación</div>
      <h1>Docker desde cero</h1>
      <div class="subtitulo">Guía práctica para programadores</div>
      ${dibujo}
      <p><strong>${edicion}</strong></p>
      <p>Del problema de “en mi computadora funciona” al deploy: imágenes, contenedores, Dockerfile, Compose, MySQL, Angular + Express y diagnóstico de errores.</p>
      <div class="datos sin-url">
        <p>${escapar(cuerpo.dataset.version || '')}</p>
        <p>Presentación interactiva: ${escapar(cuerpo.dataset.urlPublica || '')}<br>
        Repositorio con ejemplos y práctica: ${escapar(cuerpo.dataset.urlRepo || '')}</p>
      </div>`;
    const indiceImpreso = document.createElement('nav');
    indiceImpreso.className = 'solo-impresion indice-impresion';
    indiceImpreso.setAttribute('aria-label', 'Índice de la guía');
    indiceImpreso.innerHTML = `<h2>Índice</h2><ol>${modulos.map((m) => {
      const visibles = m.slides.filter((s) => !s.classList.contains('portada'));
      if (!visibles.length) return '';
      const titulo = esNumerado(m) ? `Módulo ${m.numero}. ${m.titulo}` : m.titulo;
      const items = visibles.filter((s) => !s.classList.contains('slide--modulo'))
        .map((s) => `<li><a href="#${s.id}">${escapar(s.titulo)}</a></li>`).join('');
      return `<li><a href="#${visibles[0].id}">${escapar(titulo)}</a>${items ? `<ol>${items}</ol>` : ''}</li>`;
    }).join('')}</ol>`;
    presentacion.prepend(portadaImpresa, indiceImpreso);
  }

  /* ---------- 8. Arranque ---------- */
  ir(indiceDesdeHash(), { emitir: false, actualizarHash: Boolean(location.hash) });
  cuerpo.classList.add('listo');
})();
