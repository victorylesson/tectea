/* ==========================================================
   TecTEA – tela inicial: cards das aulas com progresso e mini exercício
   ========================================================== */
(function () {
  'use strict';
  const T = window.TecTEA, h = T.h;

  function init() {
    // ilustrações marcadas com data-img
    document.querySelectorAll('[data-img]').forEach(el => { el.innerHTML = T.IMG[el.dataset.img](); });

    // cards das aulas
    const list = document.getElementById('lista-aulas');
    T.AULAS.forEach(a => {
      const total = T.activityCount(a), done = Math.min(T.Progress.count(a.id), total);
      const status = done === 0 ? 'Ainda não começou' : done >= total ? 'Aula concluída ✔' : `${done} de ${total} atividades feitas`;
      list.append(h('li', null,
        h('a', { class: 'aula-card', href: `aula.html?id=${a.id}` },
          h('span', { class: 'big-emoji', 'aria-hidden': 'true' }, a.emoji),
          h('span', { class: 'num' }, `Aula ${a.id}`),
          h('h3', null, a.titulo),
          h('p', null, a.resumo),
          h('span', { class: 'aula-status' }, status),
          h('span', { class: 'bar', 'aria-hidden': 'true' }, h('i', { style: `--p:${total ? Math.round(done / total * 100) : 0}%` })))));
    });

    // mini exercício da tela inicial
    const I = T.IMG, opt = (label, img, correct, hint) => ({ label, img, correct, hint });
    T.mount(document.getElementById('mini-exercicio'), {
      engine: 'quiz',
      questions: [{
        prompt: 'Qual destes objetos é um computador?',
        ok: 'Muito bem! Este é o computador. Vamos fazer as aulas?',
        options: [
          opt('Bola', I.bola(), false, 'Essa é a bola. Procure o computador, aquele com tela, teclado e mouse.'),
          opt('Computador', I.computador(), true),
          opt('Árvore', I.arvore(), false, 'Essa é a árvore. Procure o computador, aquele com tela, teclado e mouse.')
        ]
      }]
    }, { done() {} });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
