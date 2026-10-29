/* ==========================================================
   TecTEA – página da aula (aula.html?id=1)
   Mostra um passo por vez: aprender → ver na prática → atividade → encerrar.
   ========================================================== */
(function () {
  'use strict';
  const T = window.TecTEA, h = T.h;
  const K_FEEDBACK = 'tectea:feedback';

  const id = Number(new URLSearchParams(location.search).get('id')) || 1;
  const aula = T.AULAS.find(a => a.id === id);
  const root = document.getElementById('conteudo');

  if (!aula) {
    root.innerHTML = '<div class="container aula-page"><div class="card"><h1>Não achei essa aula</h1><p><a class="btn btn-primary" href="index.html#aulas">Voltar para as aulas</a></p></div></div>';
    return;
  }
  document.title = `Aula ${aula.id} · ${aula.titulo} · TecTEA`;

  const CHIPS = { intro: '1 · Boas-vindas', learn: '2 · Aprender', list: '2 · Aprender', demo: '3 · Ver na prática', activity: '4 · Atividade', end: '5 · Encerramento' };
  let i = 0;

  root.innerHTML = `
    <div class="container aula-page">
      <div class="crumbs">
        <a class="btn" href="index.html#aulas">← Todas as aulas</a>
        <span class="aula-name">Aula ${aula.id} · ${aula.titulo}</span>
      </div>
      <ol class="segs" id="segs" aria-label="Passos da aula"></ol>
      <p class="step-count" id="count"></p>
      <section class="card stage" id="stage"></section>
      <div class="nav-buttons" id="nav"></div>
    </div>`;
  const stage = document.getElementById('stage');
  const nav = document.getElementById('nav');

  const isActivity = s => s.kind === 'activity';
  const stepDone = s => !isActivity(s) || T.Progress.isDone(aula.id, s.id);

  function renderSegs() {
    document.getElementById('segs').innerHTML = aula.steps.map((s, k) =>
      `<li class="${k === i ? 'is-current' : (stepDone(s) && k < i ? 'is-done' : (isActivity(s) && T.Progress.isDone(aula.id, s.id) ? 'is-done' : ''))}"></li>`).join('');
    document.getElementById('count').textContent = `Passo ${i + 1} de ${aula.steps.length}`;
  }

  function renderNav() {
    const s = aula.steps[i];
    nav.innerHTML = '';
    const prev = i === 0
      ? h('a', { class: 'btn', href: 'index.html#aulas' }, '← Início')
      : h('button', { class: 'btn', type: 'button', onclick: () => go(i - 1) }, '← Voltar');
    nav.append(prev);
    if (s.kind !== 'end') {
      const done = stepDone(s);
      nav.append(h('button', { class: 'btn btn-big ' + (done ? 'btn-primary' : ''), type: 'button', onclick: () => go(i + 1) },
        done ? 'Próximo →' : 'Pular atividade →'));
    }
  }

  function go(n) {
    i = Math.max(0, Math.min(aula.steps.length - 1, n));
    render();
    window.scrollTo(0, 0);
  }

  function render() {
    const s = aula.steps[i];
    stage.innerHTML = '';
    stage.append(h('span', { class: 'chip' }, CHIPS[s.kind]));
    const title = h('h2', { tabindex: '-1' }, s.title);
    stage.append(title);

    if (s.kind === 'intro') {
      s.text.forEach(t => stage.append(h('p', { class: 'big-text' }, t)));
      if (s.hero) stage.append(h('div', { class: 'display', html: s.hero }));
      if (s.gallery) {
        const say = h('p', { class: 'feedback info', role: 'status', 'aria-live': 'polite', hidden: true });
        stage.append(h('div', { class: 'gallery' }, s.gallery.map(g =>
          h('button', { type: 'button', onclick: () => { say.hidden = false; say.textContent = g.say; } }, h('span', { html: g.img, style: 'display:block;width:100%' }), g.label))), say);
      }
      if (s.note) stage.append(h('p', { class: 'note' }, s.note));
    }

    if (s.kind === 'learn') {
      stage.append(h('div', { class: 'learn' },
        h('div', { class: 'pic', html: s.img }),
        h('div', null, h('p', { class: 'big-text' }, s.text), s.note ? h('p', { class: 'note' }, s.note) : null)));
    }

    if (s.kind === 'list') {
      stage.append(h('div', { class: 'defs' }, s.items.map(it =>
        h('div', { class: 'def' },
          h('div', { class: 'term' }, it.key ? h('span', { class: 'keycap' }, it.key) : h('span', { class: 'big-emoji', 'aria-hidden': 'true' }, it.icon), it.key ? null : it.term),
          h('div', null, it.key ? h('b', null, it.term) : null, h('p', { class: 'big-text', style: 'margin:0' }, it.text))))));
    }

    if (s.kind === 'demo' || s.kind === 'activity') {
      if (s.lead) stage.append(h('p', { class: 'lead-line' }, s.lead));
      const box = h('div', { class: 'activity' });
      stage.append(box);
      T.mount(box, s, {
        done() {
          if (!T.Progress.isDone(aula.id, s.id) && s.kind === 'activity') T.Progress.mark(aula.id, s.id);
          if (!title.querySelector('.done-badge') && s.kind === 'activity') title.append(h('span', { class: 'done-badge' }, '✔ Feito'));
          renderSegs(); renderNav();
        }
      });
      if (s.goal) stage.append(h('details', { class: 'adult' }, h('summary', null, 'Para o responsável: o que esta atividade ensina'), h('p', null, s.goal)));
      if (s.kind === 'activity' && T.Progress.isDone(aula.id, s.id)) title.append(h('span', { class: 'done-badge' }, '✔ Feito'));
    }

    if (s.kind === 'end') renderEnd(s);

    renderSegs();
    renderNav();
    title.focus({ preventScroll: true });
  }

  function renderEnd(s) {
    const total = T.activityCount(aula), done = T.Progress.count(aula.id);
    stage.append(h('div', { class: 'end-art', 'aria-hidden': 'true' }, '🎉'));
    stage.append(h('p', { class: 'big-text' }, s.text));
    if (s.small) stage.append(h('p', { class: 'note' }, s.small));
    stage.append(h('p', null, `Atividades feitas: ${done} de ${total}.`));

    const saved = T.Store.get(K_FEEDBACK, {});
    const msg = h('p', { class: 'feedback info', role: 'status', 'aria-live': 'polite' });
    if (saved[aula.id]) msg.textContent = 'Obrigado por contar como foi!';
    else msg.hidden = true;
    const faces = [['😊', 'Gostei'], ['😐', 'Mais ou menos'], ['😟', 'Foi difícil']];
    stage.append(h('h3', null, 'Como foi esta aula?'),
      h('div', { class: 'faces' }, faces.map(([e, t]) => h('button', {
        class: 'opt' + (saved[aula.id] === t ? ' is-on' : ''), type: 'button',
        onclick: ev => {
          const all = T.Store.get(K_FEEDBACK, {}); all[aula.id] = t; T.Store.set(K_FEEDBACK, all);
          stage.querySelectorAll('.faces .opt').forEach(b => b.classList.remove('is-on'));
          ev.currentTarget.classList.add('is-on');
          msg.hidden = false; msg.textContent = 'Obrigado por contar como foi! Você pode repetir qualquer atividade quando quiser.';
        }
      }, h('span', { class: 'emoji', 'aria-hidden': 'true' }, e), t))),
      msg);

    const next = T.AULAS.find(a => a.id === aula.id + 1);
    stage.append(h('div', { class: 'row-btns' },
      h('button', { class: 'btn', type: 'button', onclick: () => go(0) }, '↺ Repetir esta aula'),
      next ? h('a', { class: 'btn btn-primary btn-big', href: `aula.html?id=${next.id}` }, `Aula ${next.id} →`) : null,
      h('a', { class: 'btn', href: 'index.html#aulas' }, 'Voltar ao início')));
  }

  render();
})();
