/* ==========================================================
   TecTEA – atividades interativas
   Cada "engine" recebe (raiz, configuração, contexto) e chama
   contexto.done() quando a criança conclui a atividade.
   Regras de feedback: nunca punir. Quem erra recebe uma dica
   gentil e pode tentar de novo quantas vezes quiser.
   ========================================================== */
(function () {
  'use strict';
  const T = (window.TecTEA = window.TecTEA || {});

  /* ---------- utilitários ---------- */
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === false || v == null) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach(c => { if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c)); });
    return el;
  }
  T.h = h;

  function makeFeedback() {
    const el = h('div', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
    return { el, say(kind, msg) { el.className = 'feedback ' + (kind || ''); el.textContent = msg || ''; } };
  }

  // Arrastar com mouse ou dedo. Se o movimento for pequeno, vira um clique normal.
  function makeDraggable(el, onDrop) {
    el.addEventListener('pointerdown', e => {
      if (e.button) return;
      const sx = e.clientX, sy = e.clientY;
      let ghost = null;
      const move = ev => {
        if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 10) {
          ghost = el.cloneNode(true);
          ghost.classList.add('ghost');
          document.body.append(ghost);
          el.classList.add('dragging');
        }
        if (ghost) { ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px'; }
      };
      const up = ev => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        if (ghost) {
          ghost.remove();
          el.classList.remove('dragging');
          const t = document.elementFromPoint(ev.clientX, ev.clientY);
          onDrop(t && t.closest('[data-slot]'));
        }
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    });
  }

  const optImg = html => h('span', { class: 'opt-img', html });

  /* ==========================================================
     QUIZ – uma ou mais perguntas de escolha
     cfg.questions: [{prompt, display?, options:[{label,img?,correct?,hint?,ok?}], hint?, ok?}]
     ========================================================== */
  function quiz(root, cfg, ctx) {
    let qi = 0;
    const holder = h('div');
    const fb = makeFeedback();
    root.append(holder, fb.el);

    function show() {
      const q = cfg.questions[qi], last = qi === cfg.questions.length - 1;
      holder.innerHTML = '';
      fb.say('', '');
      if (cfg.questions.length > 1) holder.append(h('p', { class: 'counter' }, `Pergunta ${qi + 1} de ${cfg.questions.length}`));
      holder.append(h('h3', { class: 'prompt' }, q.prompt));
      if (q.display) holder.append(h('div', { class: 'display', html: q.display }));
      const grid = h('div', { class: 'opts' });
      q.options.forEach(o => {
        const b = h('button', { class: 'opt', type: 'button' }, o.img ? optImg(o.img) : null, h('span', { class: 'opt-label' }, o.label));
        b.addEventListener('click', () => {
          if (o.correct) {
            b.classList.add('is-ok');
            grid.querySelectorAll('button').forEach(x => (x.disabled = true));
            fb.say('ok', o.ok || q.ok || 'Muito bem! Resposta certa.');
            if (last) ctx.done();
            else holder.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { qi++; show(); } }, 'Próxima pergunta →'));
          } else {
            b.classList.add('is-retry');
            b.disabled = true;
            fb.say('retry', o.hint || q.hint || 'Vamos olhar de novo. Tente outra opção.');
          }
        });
        grid.append(b);
      });
      holder.append(grid);
    }
    show();
  }

  /* ==========================================================
     MULTI – escolher vários itens e conferir
     cfg: {prompt, items:[{id,label,img,yes}], explain}
     ========================================================== */
  function multi(root, cfg, ctx) {
    const chosen = new Set();
    const fb = makeFeedback();
    const grid = h('div', { class: 'opts' });
    cfg.items.forEach(it => {
      const b = h('button', { class: 'opt', type: 'button', 'aria-pressed': 'false' }, optImg(it.img), h('span', { class: 'opt-label' }, it.label));
      b.addEventListener('click', () => {
        if (chosen.has(it.id)) chosen.delete(it.id); else chosen.add(it.id);
        b.classList.toggle('is-on', chosen.has(it.id));
        b.setAttribute('aria-pressed', String(chosen.has(it.id)));
        fb.say('', '');
      });
      grid.append(b);
    });
    const check = h('button', { class: 'btn btn-primary btn-big', type: 'button' }, 'Conferir');
    check.addEventListener('click', () => {
      const yes = cfg.items.filter(i => i.yes).map(i => i.id);
      const wrong = [...chosen].filter(id => !yes.includes(id)).length;
      const missing = yes.filter(id => !chosen.has(id)).length;
      if (!chosen.size) return fb.say('info', 'Toque nas imagens que você escolher. Depois toque em Conferir.');
      if (!wrong && !missing) {
        grid.querySelectorAll('button').forEach(x => (x.disabled = true));
        check.disabled = true;
        fb.say('ok', 'Muito bem! Você encontrou todos os dispositivos digitais. ' + (cfg.explain || ''));
        ctx.done();
      } else if (wrong) {
        fb.say('retry', 'Quase! Algum objeto escolhido não é um dispositivo digital. Olhe de novo, com calma.');
      } else {
        fb.say('retry', `Quase! Ainda falta${missing > 1 ? 'm' : ''} ${missing} dispositivo${missing > 1 ? 's' : ''} digita${missing > 1 ? 'is' : 'l'}.`);
      }
    });
    root.append(h('h3', { class: 'prompt' }, cfg.prompt), grid, check, fb.el);
  }

  /* ==========================================================
     PLACE – colocar peças no lugar certo (toque+toque ou arrastar)
     cfg: {prompt, layout:'scene'|'bins', reference?, pieces:[{id,label,img,target,ok,hint}],
           targets:[{id,label,ghost?,area?}], finalMsg}
     ========================================================== */
  function place(root, cfg, ctx) {
    const fb = makeFeedback();
    let selected = null, left = cfg.pieces.length;
    const pieceEls = {}, slotEls = {};
    const tray = h('div', { class: 'tray', role: 'group', 'aria-label': 'Peças' });
    const board = h('div', { class: 'board ' + (cfg.layout || 'bins') });

    function select(id) {
      selected = selected === id ? null : id;
      Object.entries(pieceEls).forEach(([k, el]) => el.classList.toggle('is-selected', k === selected));
      fb.say(selected ? 'info' : '', selected ? 'Agora toque no lugar certo.' : '');
    }

    function attempt(pid, tid) {
      const p = cfg.pieces.find(x => x.id === pid);
      if (!p || pieceEls[pid].hidden) return;
      const slot = slotEls[tid];
      if ([].concat(p.target).includes(tid)) {
        pieceEls[pid].hidden = true;
        slot.classList.add('is-filled');
        const sil = slot.querySelector('.sil');
        if (sil && cfg.layout === 'scene') sil.remove();
        slot.querySelector('.placed').append(h('span', { class: 'mini', html: p.img }));
        selected = null;
        Object.values(pieceEls).forEach(el => el.classList.remove('is-selected'));
        left--;
        if (left === 0) { fb.say('ok', (p.ok || 'Muito bem!') + ' ' + (cfg.finalMsg || 'Você terminou!')); ctx.done(); }
        else fb.say('ok', p.ok || 'Muito bem!');
      } else {
        selected = null;
        Object.values(pieceEls).forEach(el => el.classList.remove('is-selected'));
        fb.say('retry', p.hint || 'Vamos observar de novo. Tente outro lugar.');
      }
    }

    cfg.pieces.forEach(p => {
      const el = h('button', { class: 'piece', type: 'button', 'aria-label': p.label }, optImg(p.img), h('span', { class: 'opt-label' }, p.label));
      el.addEventListener('click', () => select(p.id));
      makeDraggable(el, slot => { if (slot) attempt(p.id, slot.dataset.slot); });
      pieceEls[p.id] = el;
      tray.append(el);
    });

    cfg.targets.forEach(t => {
      const s = h('button', { class: 'slot', type: 'button', 'data-slot': t.id, style: t.area ? `grid-area:${t.area}` : null },
        t.ghost ? h('span', { class: 'sil', html: t.ghost }) : null,
        h('span', { class: 'slot-label' }, t.label),
        h('span', { class: 'placed' }));
      s.addEventListener('click', () => {
        if (s.classList.contains('is-filled') && cfg.layout === 'scene') return;
        if (selected) attempt(selected, t.id);
        else fb.say('info', 'Primeiro toque em uma peça. Depois toque no lugar dela.');
      });
      slotEls[t.id] = s;
      board.append(s);
    });

    root.append(h('h3', { class: 'prompt' }, cfg.prompt));
    root.append(h('p', { class: 'how' }, 'Toque na peça e depois no lugar dela. Você também pode arrastar a peça com o mouse ou com o dedo.'));
    if (cfg.reference) {
      root.append(h('div', { class: 'scene-wrap' }, h('figure', null, h('span', { html: cfg.reference }), h('figcaption', null, 'Olhe como fica')), h('div', null, tray, board)));
    } else {
      root.append(tray, board);
    }
    root.append(fb.el);
  }

  /* ==========================================================
     Teclado virtual (usado nas aulas 4 e 6)
     onKey(nome, shiftLigado) – nome: 'A'..'Z', '0'..'9', ' ', 'Enter', 'Backspace', 'Shift'
     ========================================================== */
  function vkeyboard(onKey) {
    const kb = h('div', { class: 'vk', role: 'group', 'aria-label': 'Teclado do computador' });
    const keys = {};
    let shift = false;
    const setShift = v => {
      shift = v;
      if (keys.Shift) { keys.Shift.classList.toggle('is-on', v); keys.Shift.setAttribute('aria-pressed', String(v)); }
    };
    function mk(name, label, cls) {
      const b = h('button', { class: 'vk-key ' + (cls || ''), type: 'button', 'data-key': name }, label);
      b.addEventListener('click', () => {
        if (name === 'Shift') { setShift(!shift); onKey('Shift', shift); return; }
        const s = shift; setShift(false); onKey(name, s);
      });
      keys[name] = b;
      return b;
    }
    const rows = ['1234567890', 'QWERTYUIOP', 'ASDFGHJKLÇ', 'ZXCVBNM'].map(r => r.split(''));
    rows.forEach((r, i) => {
      const row = h('div', { class: 'vk-row' });
      if (i === 3) row.append(mk('Shift', '⇧ Shift', 'vk-wide'));
      r.forEach(k => row.append(mk(k, k)));
      if (i === 3) row.append(mk('Backspace', '⌫ Apagar', 'vk-wide'));
      kb.append(row);
    });
    kb.append(h('div', { class: 'vk-row' }, mk(' ', 'Espaço', 'vk-space'), mk('Enter', 'Enter ↵', 'vk-wide')));
    return { el: kb, keys, setShift };
  }

  /* ---------- Encontre a letra ---------- */
  function findKey(root, cfg, ctx) {
    const fb = makeFeedback();
    const word = cfg.word.split('');
    const rounds = cfg.rounds;           // ex.: [['C'], ['A','S','A']]
    let r = 0, i = 0, idx = 0, tries = 0;
    const wordEl = h('div', { class: 'word-row', 'aria-label': 'Palavra ' + cfg.word });
    const spans = word.map(l => h('span', null, l));
    wordEl.append(...spans);
    const prompt = h('h3', { class: 'prompt' });
    const kb = vkeyboard(name => {
      const target = rounds[r][i];
      if (name === target) {
        kb.keys[name].classList.remove('is-hint');
        spans[idx].classList.add('is-found');
        idx++; i++; tries = 0;
        if (i === rounds[r].length) {
          r++; i = 0;
          if (r === rounds.length) {
            fb.say('ok', `Muito bem! Você achou todas as letras da palavra ${cfg.word}.`);
            prompt.textContent = 'Palavra completa!';
            spans.forEach(s => s.classList.remove('is-now'));
            ctx.done();
            return;
          }
          fb.say('ok', 'Muito bem! Vamos para a próxima fase.');
        } else {
          fb.say('ok', 'Isso mesmo! Agora a próxima letra.');
        }
        refresh();
      } else {
        tries++;
        const nome = name === ' ' ? 'Espaço' : name === 'Backspace' ? 'Apagar' : name;
        fb.say('retry', `Essa é a tecla ${nome}. Vamos procurar a letra ${target}.`);
        if (tries >= 2) kb.keys[target].classList.add('is-hint');
      }
    });
    function refresh() {
      spans.forEach((s, k) => s.classList.toggle('is-now', k === idx));
      const list = rounds[r];
      prompt.textContent = r === 0
        ? `Encontre a letra ${list[0]} no teclado.`
        : `Agora encontre as letras ${list.slice(0, -1).join(', ')} e ${list[list.length - 1]}, uma de cada vez. Próxima: ${list[i]}`;
    }
    refresh();
    root.append(prompt, wordEl, kb.el, fb.el);
  }

  /* ---------- Digite seu nome ---------- */
  function typeText(root, cfg, ctx) {
    const fb = makeFeedback();
    const input = h('input', { class: 'bigtext', type: 'text', maxlength: 20, placeholder: cfg.placeholder || '', 'aria-label': cfg.prompt, autocomplete: 'off' });
    const kb = vkeyboard((name, shift) => {
      const v = input.value;
      if (name === 'Shift') return;
      if (name === 'Backspace') input.value = v.slice(0, -1);
      else if (name === 'Enter') finish();
      else if (name === ' ') input.value = v + ' ';
      else {
        const auto = cfg.autoCap && (!v || v.endsWith(' '));
        input.value = v + ((shift || auto) && /[A-ZÇ]/.test(name) ? name : name.toLowerCase());
      }
    });
    function finish() {
      const v = input.value.trim();
      if (!v) return fb.say('info', 'Escolha as letras do seu nome no teclado. Depois aperte Pronto.');
      fb.say('ok', `Muito bem, ${v}! Você escreveu usando o teclado.`);
      ctx.done();
    }
    input.addEventListener('keydown', e => { if (e.key === 'Enter') finish(); });
    root.append(h('h3', { class: 'prompt' }, cfg.prompt), h('p', { class: 'how' }, cfg.how || ''), input, kb.el,
      h('button', { class: 'btn btn-primary btn-big', type: 'button', onclick: finish }, 'Pronto!'), fb.el);
  }

  /* ---------- Projeto B: meu primeiro texto ---------- */
  function docText(root, cfg, ctx) {
    const fb = makeFeedback();
    const flags = { letters: false, space: false, erase: false };
    const tasks = [['letters', 'Digite uma palavra'], ['space', 'Aperte Espaço'], ['erase', 'Aperte Apagar para corrigir uma letra']];
    const list = h('ul', { class: 'checks' }, tasks.map(([k, t]) => h('li', { 'data-k': k }, t)));
    const paper = h('input', { class: 'bigtext paper', type: 'text', maxlength: 40, 'aria-label': 'Meu documento', autocomplete: 'off', placeholder: 'Meu texto aparece aqui' });
    let finished = false;

    function update(msg) {
      flags.letters = paper.value.replace(/\s/g, '').length >= 2;
      list.querySelectorAll('li').forEach(li => li.classList.toggle('is-ok', flags[li.dataset.k]));
      const next = tasks.find(([k]) => !flags[k]);
      if (!next) {
        if (!finished) { finished = true; fb.say('ok', 'Muito bem! Você escreveu, usou o espaço e apagou uma letra.'); ctx.done(); }
      } else {
        fb.say(msg ? 'info' : '', msg || 'Agora: ' + next[1] + '.');
      }
    }
    const kb = vkeyboard((name, shift) => {
      const v = paper.value;
      if (name === 'Shift') return;
      if (name === 'Backspace') {
        if (!v) return update('Ainda não há nada para apagar. Digite uma palavra primeiro.');
        paper.value = v.slice(0, -1); flags.erase = true;
      } else if (name === ' ') {
        if (!v) return update('Digite uma palavra primeiro. Depois use o Espaço.');
        paper.value = v + ' '; flags.space = true;
      } else if (name === 'Enter') {
        return update('O Enter começa uma nova linha. Aqui vamos usar o Espaço e o Apagar.');
      } else {
        paper.value = v + (shift ? name : name.toLowerCase());
      }
      update();
    });
    paper.addEventListener('keydown', e => {
      if (e.key === ' ' && paper.value) flags.space = true;
      if (e.key === 'Backspace' && paper.value) flags.erase = true;
    });
    paper.addEventListener('input', () => update());
    root.append(h('h3', { class: 'prompt' }, cfg.prompt), list, paper, kb.el, fb.el);
    update();
  }

  /* ---------- Laboratório do mouse (apontar, clicar, duplo clique, rolar) ---------- */
  function mouseCmd(root, cfg, ctx) {
    const fb = makeFeedback();
    const lab = h('div', { class: 'lab' });
    let ok = false;
    const win = () => { if (ok) return; ok = true; lab.classList.add('is-ok'); fb.say('ok', cfg.ok); ctx.done(); };

    if (cfg.cmd === 'apontar') {
      const t = h('button', { class: 'lab-target', type: 'button', 'aria-label': 'Estrela' }, '⭐');
      const t0 = Date.now();   // evita concluir sozinho se o cursor já estiver parado nesse lugar
      ['pointerenter', 'focus', 'click'].forEach(ev => t.addEventListener(ev, () => {
        if (ev !== 'click' && Date.now() - t0 < 700) return;
        win();
      }));
      lab.append(t);
    } else if (cfg.cmd === 'clicar') {
      const t = h('button', { class: 'lab-target wide', type: 'button' }, 'Clique aqui');
      t.addEventListener('click', win);
      lab.append(t);
    } else if (cfg.cmd === 'duplo') {
      let last = 0;
      const t = h('button', { class: 'lab-target wide', type: 'button' }, 'Clique 2 vezes');
      t.addEventListener('click', () => {
        const now = Date.now();
        if (now - last < 600) win(); else if (!ok) fb.say('info', 'Isso foi 1 clique. Agora clique 2 vezes, bem rápido.');
        last = now;
      });
      lab.append(t);
    } else if (cfg.cmd === 'rolar') {
      const box = h('div', { class: 'scrollbox', tabindex: '0', role: 'region', 'aria-label': 'Caixa para rolar' },
        h('div', { class: 'inner' }, h('span', null, '⬇️ Role para baixo'), h('span', null, '⬇️'), h('span', null, '⬇️'), h('span', null, '⭐ Você chegou!')));
      box.addEventListener('scroll', () => { if (box.scrollTop + box.clientHeight >= box.scrollHeight - 8) win(); });
      lab.append(box);
    }
    root.append(h('h3', { class: 'prompt' }, cfg.prompt), lab, fb.el);
  }

  /* ---------- Janela simulada: abrir e fechar ---------- */
  function windowSim(root, cfg, ctx) {
    const fb = makeFeedback();
    const empty = h('p', { class: 'desktop-empty' }, 'A área de trabalho está vazia. Toque em Abrir.');
    const win = h('div', { class: 'win', hidden: true, role: 'dialog', 'aria-label': 'Janela Meu desenho' },
      h('div', { class: 'win-bar' }, h('span', null, '🎨 Meu desenho'), h('button', { class: 'win-x', type: 'button', 'aria-label': 'Fechar a janela', onclick: close }, '✕')),
      h('div', { class: 'win-body', html: T.IMG.desenho() }, ));
    const desktop = h('div', { class: 'desktop' }, empty, win);
    const bOpen = h('button', { class: 'btn btn-primary btn-big', type: 'button', onclick: open }, '1 · Abrir');
    const bClose = h('button', { class: 'btn btn-big', type: 'button', onclick: close, disabled: true }, '2 · Fechar');
    function open() {
      win.hidden = false; empty.hidden = true; bOpen.disabled = true; bClose.disabled = false;
      fb.say('info', 'A janela abriu! Agora toque em Fechar.');
    }
    function close() {
      if (win.hidden) return;
      win.hidden = true; empty.hidden = false; bOpen.disabled = false; bClose.disabled = true;
      empty.textContent = 'A janela fechou. Você pode abrir de novo quando quiser.';
      fb.say('ok', cfg.ok);
      ctx.done();
    }
    root.append(h('h3', { class: 'prompt' }, cfg.prompt), desktop, h('div', { class: 'row-btns' }, bOpen, bClose), fb.el);
  }

  /* ---------- O que acontece quando clicamos? ---------- */
  function buttonsDemo(root, cfg, ctx) {
    const fb = makeFeedback();
    const screen = h('div', { class: 'demo-screen', 'aria-live': 'polite' }, h('p', null, 'Aqui vai aparecer o resultado do clique.'));
    const demos = {
      desenho: () => h('div', null, h('h3', null, '🎨 Desenho'), h('div', { class: 'display', html: T.IMG.desenho() })),
      historia: () => h('div', null, h('h3', null, '🎧 História: O robô curioso'), h('p', { class: 'big-text' }, 'Era uma vez um robô pequenino que queria aprender a usar o computador. Ele apontou, clicou e descobriu muitas coisas novas.')),
      imagens: () => h('div', null, h('h3', null, '🖼️ Imagens'), h('div', null, ...['🌳', '🐶', '🚗', '🌈'].map(e => h('span', { class: 'emoji', 'aria-hidden': 'true' }, e))))
    };
    const btns = [['desenho', '🎨', 'Abrir desenho'], ['historia', '🎧', 'Ouvir história'], ['imagens', '🖼️', 'Ver imagens']];
    const seen = new Set();
    const row = h('div', { class: 'row-btns' }, btns.map(([id, emo, label]) =>
      h('button', {
        class: 'opt', type: 'button', onclick: () => {
          screen.innerHTML = ''; screen.append(demos[id]());
          seen.add(id);
          fb.say('ok', seen.size < 3 ? 'Cada botão faz uma coisa diferente. Experimente os outros também!' : 'Você experimentou os três botões!');
          ctx.done();
        }
      }, h('span', { class: 'emoji', 'aria-hidden': 'true' }, emo), h('span', { class: 'opt-label' }, label))));
    root.append(h('h3', { class: 'prompt' }, cfg.prompt), row, screen, fb.el);
  }

  /* ---------- Partes do computador para tocar ---------- */
  function hotspots(root, cfg) {
    const panel = h('div', { class: 'info-panel', 'aria-live': 'polite' }, h('p', null, 'Toque em uma parte do computador para ver o nome e para que ela serve.'));
    const box = h('div', { class: 'hot', html: T.IMG.computador() });
    function show(name) {
      const info = T.PARTS_INFO[name];
      box.querySelectorAll('[data-part]').forEach(g => g.classList.toggle('is-on', g.dataset.part === name));
      panel.innerHTML = '';
      panel.append(h('h3', null, info.nome), h('p', { class: 'big-text' }, info.texto));
    }
    box.querySelectorAll('[data-part]').forEach(g => {
      const name = g.dataset.part;
      g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', T.PARTS_INFO[name].nome);
      g.addEventListener('click', () => show(name));
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(name); } });
    });
    root.append(box, panel);
  }

  /* ---------- Projeto A: meu primeiro desenho ---------- */
  function draw(root, cfg, ctx) {
    const fb = makeFeedback();
    let color = null, shape = null, made = 0;
    const COLORS = [['Azul', '#2a5fb8'], ['Amarelo', '#f4b942'], ['Verde', '#4caf7a'], ['Vermelho', '#e57373'], ['Roxo', '#8e7cc3']];
    const SHAPES = [['circulo', 'Círculo'], ['quadrado', 'Quadrado'], ['triangulo', 'Triângulo'], ['estrela', 'Estrela']];
    const tasks = h('ul', { class: 'checks' }, h('li', { 'data-k': 'c' }, 'Escolha uma cor'), h('li', { 'data-k': 'f' }, 'Escolha uma figura'), h('li', { 'data-k': 'q' }, 'Toque no quadro para desenhar'));
    const mark = k => tasks.querySelector(`[data-k=${k}]`).classList.add('is-ok');

    const sw = COLORS.map(([n, c]) => {
      const b = h('button', { class: 'swatch', type: 'button', style: `background:${c}`, 'aria-label': n, 'aria-pressed': 'false' });
      b.addEventListener('click', () => {
        color = c; mark('c');
        sw.forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
        fb.say('info', `Cor ${n.toLowerCase()} escolhida.`);
      });
      return b;
    });
    const tools = SHAPES.map(([id, n]) => {
      const b = h('button', { class: 'tool', type: 'button', 'aria-label': n, 'aria-pressed': 'false', html: T.IMG.shape(id, '#6d86bd') });
      b.addEventListener('click', () => {
        shape = id; mark('f');
        tools.forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
        fb.say('info', `${n} escolhido.`);
      });
      return b;
    });
    const W = 400, H = 260;
    const canvas = h('div', { html: `<svg class="canvas" viewBox="0 0 ${W} ${H}" role="img" aria-label="Quadro de desenho" tabindex="0"><rect width="${W}" height="${H}" fill="#fff"/></svg>` });
    const svg = canvas.firstChild;
    function put(x, y) {
      if (!color || !shape) return fb.say('retry', 'Primeiro escolha uma cor e uma figura. Depois toque no quadro.');
      svg.insertAdjacentHTML('beforeend', `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">${T.IMG.shapeInner(shape, color)}</g>`);
      made++; mark('q');
      fb.say('ok', 'Muito bem! Você fez uma figura. Pode fazer outras se quiser.');
      ctx.done();
    }
    svg.addEventListener('click', e => {
      const r = svg.getBoundingClientRect();
      put((e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H);
    });
    svg.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); put(40 + Math.random() * (W - 80), 40 + Math.random() * (H - 80)); } });
    const clear = h('button', { class: 'btn', type: 'button', onclick: () => { svg.querySelectorAll('g').forEach(g => g.remove()); made = 0; fb.say('info', 'Quadro limpo.'); } }, 'Limpar quadro');
    root.append(h('h3', { class: 'prompt' }, cfg.prompt), tasks,
      h('div', { class: 'palette', role: 'group', 'aria-label': 'Cores' }, sw),
      h('div', { class: 'palette', role: 'group', 'aria-label': 'Figuras' }, tools),
      canvas, h('div', { class: 'row-btns' }, clear), fb.el);
  }

  /* ---------- registro ---------- */
  const engines = { quiz, multi, place, findKey, typeText, docText, mouseCmd, windowSim, buttonsDemo, hotspots, draw };
  T.mount = function (root, cfg, ctx) {
    const fn = engines[cfg.engine];
    if (!fn) { root.append(h('p', null, 'Atividade em preparação.')); return; }
    fn(root, cfg, ctx || { done() {} });
  };
})();
