/* ==========================================================
   TecTEA – ilustrações em SVG (sem arquivos externos)
   Cada função devolve uma string SVG pronta para usar com innerHTML.
   Para trocar por imagens suas, basta devolver '<img src="assets/..." alt="">'.
   ========================================================== */
(function () {
  'use strict';
  const T = (window.TecTEA = window.TecTEA || {});

  // Paleta calma, baseada nas cores da logo
  const B = '#2a5fb8', BD = '#1d4a94', BL = '#dbe9fb';
  const Y = '#f4b942', G = '#4caf7a', R = '#e57373', GR = '#8fa6d6';

  const svg = (w, h, inner) =>
    `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${inner}</svg>`;

  /* ---------- Partes do computador (cada uma com seu tamanho) ---------- */
  function keyboardInner() {
    let s = `<rect x="1.5" y="1.5" width="147" height="47" rx="8" fill="#eaf1fd" stroke="${B}" stroke-width="3"/>`;
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 10; c++)
        s += `<rect x="${10 + c * 13}" y="${8 + r * 9}" width="10" height="6.5" rx="1.5" fill="${GR}"/>`;
    s += `<rect x="34" y="37" width="82" height="6.5" rx="2" fill="${GR}"/>`;
    return s;
  }

  const PARTS = {
    monitor: {
      w: 180, h: 160,
      g: `<rect width="180" height="125" rx="12" fill="${B}"/>
          <rect x="9" y="9" width="162" height="107" rx="6" fill="${BL}"/>
          <rect x="22" y="22" width="62" height="38" rx="5" fill="#fff" stroke="${GR}" stroke-width="2"/>
          <circle cx="124" cy="44" r="15" fill="${Y}"/>
          <rect x="22" y="72" width="130" height="8" rx="4" fill="${GR}"/>
          <rect x="22" y="88" width="90" height="8" rx="4" fill="#bcd2f2"/>
          <rect x="78" y="125" width="24" height="22" fill="${BD}"/>
          <rect x="50" y="145" width="80" height="12" rx="6" fill="${BD}"/>`
    },
    teclado: { w: 150, h: 50, g: keyboardInner() },
    mouse: {
      w: 36, h: 54,
      g: `<rect x="1.5" y="1.5" width="33" height="51" rx="16" fill="${Y}" stroke="#c78a14" stroke-width="3"/>
          <path d="M18 2 V22 M2 22 H34" stroke="#c78a14" stroke-width="3" fill="none"/>`
    },
    gabinete: {
      w: 54, h: 120,
      g: `<rect x="1.5" y="1.5" width="51" height="117" rx="9" fill="${GR}" stroke="#5b77b3" stroke-width="3"/>
          <rect x="10" y="14" width="34" height="5" rx="2.5" fill="#5b77b3"/>
          <rect x="10" y="26" width="34" height="5" rx="2.5" fill="#5b77b3"/>
          <circle cx="27" cy="94" r="9" fill="${G}" stroke="#3a8a5e" stroke-width="2"/>`
    }
  };

  const LAYOUT = { monitor: [60, 10], gabinete: [256, 52], teclado: [65, 190], mouse: [232, 190] };

  function part(name) {
    const p = PARTS[name];
    return svg(p.w, p.h, p.g);
  }

  // computador completo; "hide" esconde partes e mostra um "?" no lugar
  function computer(hide = []) {
    let s = `<rect x="0" y="246" width="330" height="4" rx="2" fill="#c9d9ee"/>`;
    for (const k in LAYOUT) {
      const [x, y] = LAYOUT[k], p = PARTS[k];
      if (hide.includes(k)) {
        s += `<g transform="translate(${x} ${y})">
                <rect x="2" y="2" width="${p.w - 4}" height="${p.h - 4}" rx="10" fill="none" stroke="${GR}" stroke-width="4" stroke-dasharray="10 8"/>
                <text x="${p.w / 2}" y="${p.h / 2 + 12}" text-anchor="middle" font-size="${Math.min(40, p.w * 0.8)}" font-weight="700" fill="${GR}">?</text>
              </g>`;
      } else {
        s += `<g data-part="${k}" transform="translate(${x} ${y})">${p.g}</g>`;
      }
    }
    return svg(330, 250, s);
  }

  /* ---------- Outros dispositivos e objetos ---------- */
  function appDots(x0, y0, cols, rows, size, gap) {
    const cols_ = [Y, G, R, GR];
    let s = '', n = 0;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        s += `<rect x="${x0 + c * gap}" y="${y0 + r * gap}" width="${size}" height="${size}" rx="${size / 3.5}" fill="${cols_[n++ % 4]}"/>`;
    return s;
  }

  const notebook = () => svg(200, 140,
    `<rect x="38" y="8" width="124" height="86" rx="8" fill="${B}"/>
     <rect x="46" y="16" width="108" height="70" rx="4" fill="${BL}"/>
     <rect x="56" y="26" width="40" height="26" rx="4" fill="#fff" stroke="${GR}" stroke-width="2"/>
     <circle cx="124" cy="40" r="11" fill="${Y}"/>
     <rect x="56" y="62" width="84" height="7" rx="3.5" fill="${GR}"/>
     <path d="M14 100 H186 L196 126 Q196 132 190 132 H10 Q4 132 4 126 Z" fill="${GR}"/>
     <rect x="78" y="102" width="44" height="6" rx="3" fill="#6d86bd"/>`);

  const celular = () => svg(100, 170,
    `<rect x="12" y="6" width="76" height="158" rx="16" fill="${B}"/>
     <rect x="19" y="18" width="62" height="130" rx="6" fill="${BL}"/>
     ${appDots(25, 26, 3, 4, 14, 19)}
     <circle cx="50" cy="12" r="2.5" fill="${BL}"/>
     <rect x="38" y="154" width="24" height="4" rx="2" fill="${BL}"/>`);

  const tablet = () => svg(200, 150,
    `<rect x="10" y="8" width="180" height="124" rx="14" fill="${B}"/>
     <rect x="22" y="19" width="156" height="102" rx="6" fill="${BL}"/>
     ${appDots(38, 32, 4, 2, 22, 36)}
     <rect x="38" y="104" width="124" height="7" rx="3.5" fill="${GR}"/>
     <circle cx="16" cy="70" r="2.5" fill="${BL}"/>`);

  const livro = () => svg(160, 130,
    `<path d="M80 22 C60 10 30 10 10 18 V108 C30 100 60 100 80 112 Z" fill="#fff" stroke="#c98a8a" stroke-width="3"/>
     <path d="M80 22 C100 10 130 10 150 18 V108 C130 100 100 100 80 112 Z" fill="#fff" stroke="#c98a8a" stroke-width="3"/>
     <path d="M24 38 H66 M24 52 H66 M24 66 H66 M94 38 H136 M94 52 H136 M94 66 H136" stroke="#b5c4de" stroke-width="4" stroke-linecap="round"/>
     <path d="M80 22 V112" stroke="#c98a8a" stroke-width="3"/>`);

  const arvore = () => svg(120, 150,
    `<rect x="52" y="88" width="16" height="52" rx="3" fill="#a47148"/>
     <circle cx="60" cy="58" r="40" fill="${G}"/>
     <circle cx="34" cy="80" r="25" fill="#5fbf8a"/>
     <circle cx="86" cy="80" r="25" fill="#5fbf8a"/>`);

  const bola = () => svg(130, 130,
    `<circle cx="65" cy="65" r="58" fill="${Y}" stroke="#c78a14" stroke-width="3"/>
     <path d="M8 65 Q65 30 122 65 M8 65 Q65 100 122 65 M65 8 Q40 65 65 122 M65 8 Q90 65 65 122" fill="none" stroke="#fff" stroke-width="4"/>`);

  /* ---------- Ícones de programa ---------- */
  const pasta = () => svg(120, 100,
    `<path d="M8 20 Q8 12 16 12 H44 L54 24 H104 Q112 24 112 32 V82 Q112 90 104 90 H16 Q8 90 8 82 Z" fill="${Y}"/>
     <rect x="8" y="38" width="104" height="52" rx="8" fill="#f8cf6d"/>`);

  const desenho = () => svg(120, 100,
    `<path d="M60 8 C28 8 8 28 8 52 C8 76 28 92 52 92 C64 92 66 84 60 78 C54 70 62 62 74 62 H90 C104 62 112 52 112 44 C112 24 90 8 60 8Z" fill="#fff" stroke="${B}" stroke-width="4"/>
     <circle cx="36" cy="42" r="8" fill="${R}"/><circle cx="58" cy="26" r="8" fill="${Y}"/>
     <circle cx="84" cy="30" r="8" fill="${G}"/><circle cx="34" cy="66" r="8" fill="${B}"/>`);

  const calculadora = () => {
    let keys = '';
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++)
        keys += `<rect x="${14 + c * 26}" y="${46 + r * 22}" width="20" height="16" rx="4" fill="#fff"/>`;
    return svg(100, 120,
      `<rect x="2" y="2" width="96" height="116" rx="12" fill="${B}"/>
       <rect x="12" y="12" width="76" height="24" rx="4" fill="${BL}"/>${keys}`);
  };

  /* ---------- Formas geométricas ---------- */
  function star(r1, r2) {
    let pts = [];
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i - Math.PI / 2, r = i % 2 ? r2 : r1;
      pts.push((Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1));
    }
    return pts.join(' ');
  }
  const SHAPES = {
    circulo: c => `<circle cx="0" cy="0" r="22" fill="${c}"/>`,
    quadrado: c => `<rect x="-20" y="-20" width="40" height="40" rx="4" fill="${c}"/>`,
    triangulo: c => `<polygon points="0,-24 25,20 -25,20" fill="${c}"/>`,
    estrela: c => `<polygon points="${star(26, 11)}" fill="${c}"/>`
  };
  const shapeInner = (type, color) => SHAPES[type](color);
  const shape = (type, color) => svg(60, 60, `<g transform="translate(30 30)">${SHAPES[type](color)}</g>`);

  T.IMG = {
    computador: () => computer(),
    computadorSem: hide => computer(hide),
    monitor: () => part('monitor'),
    teclado: () => part('teclado'),
    mouse: () => part('mouse'),
    gabinete: () => part('gabinete'),
    notebook, celular, tablet, livro, arvore, bola,
    pasta, desenho, calculadora,
    shape, shapeInner,
    emoji: e => `<span class="emoji" aria-hidden="true">${e}</span>`
  };

  T.PARTS_INFO = {
    monitor: { nome: 'Monitor', texto: 'É a tela do computador. Nela aparecem imagens, textos, vídeos e programas.' },
    teclado: { nome: 'Teclado', texto: 'É usado para digitar letras, números e outros símbolos.' },
    mouse: { nome: 'Mouse', texto: 'Ajuda a controlar o cursor, selecionar objetos e clicar em botões.' },
    gabinete: { nome: 'Gabinete', texto: 'É a estrutura que guarda partes importantes do computador, como o processador, a memória e o armazenamento.' }
  };
})();
