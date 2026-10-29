/* ==========================================================
   TecTEA – partes comuns às duas páginas
   - armazenamento local (progresso, tamanho da letra, modo calmo)
   - cabeçalho, rodapé e janelas de login/cadastro
   ========================================================== */
(function () {
  'use strict';
  const T = (window.TecTEA = window.TecTEA || {});

  /* ---------- Armazenamento no navegador ---------- */
  const Store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sem armazenamento: segue sem salvar */ }
    }
  };
  T.Store = Store;

  const K_PROGRESS = 'tectea:progresso', K_FONT = 'tectea:fonte', K_CALM = 'tectea:calmo';

  T.Progress = {
    all() { return Store.get(K_PROGRESS, {}); },
    isDone(aula, atividade) { const p = this.all(); return !!(p[aula] && p[aula][atividade]); },
    mark(aula, atividade) {
      const p = this.all(); p[aula] = p[aula] || {}; p[aula][atividade] = true; Store.set(K_PROGRESS, p);
    },
    count(aula) { return Object.keys(this.all()[aula] || {}).length; },
    reset() { Store.set(K_PROGRESS, {}); }
  };

  /* ---------- Preferências de acessibilidade ---------- */
  const FONT_SIZES = [18, 20, 24, 28];   // px
  let fontIdx = Store.get(K_FONT, 1);
  let calm = Store.get(K_CALM, false);

  function applySettings() {
    document.documentElement.style.fontSize = FONT_SIZES[fontIdx] + 'px';
    document.documentElement.classList.toggle('calmo', calm);
    const btn = document.querySelector('[data-a11y="calm"]');
    if (btn) btn.setAttribute('aria-pressed', String(calm));
  }

  /* ---------- Cabeçalho, rodapé e janelas ---------- */
  const HEADER = `
    <a class="skip" href="#conteudo">Ir para o conteúdo</a>
    <header class="site-header">
      <div class="container header-row">
        <a class="brand" href="index.html"><img src="assets/logo.png" alt="" width="52" height="52"><span>TecTEA</span></a>
        <nav aria-label="Menu principal">
          <ul class="nav">
            <li><a href="index.html#inicio">Início</a></li>
            <li><a href="index.html#como-funciona">Como funciona</a></li>
            <li><a href="index.html#aulas">Aulas</a></li>
            <li><a href="index.html#experimente">Experimente</a></li>
            <li><a href="index.html#sobre">Sobre o módulo</a></li>
          </ul>
        </nav>
        <div class="auth">
          <button class="btn" type="button" data-open="login">Entrar</button>
          <button class="btn btn-primary" type="button" data-open="cadastro">Cadastrar</button>
        </div>
      </div>
      <div class="a11y-bar">
        <div class="container a11y-row">
          <span>Letras:</span>
          <button class="btn" type="button" data-a11y="smaller" aria-label="Diminuir letras">A−</button>
          <button class="btn" type="button" data-a11y="bigger" aria-label="Aumentar letras">A+</button>
          <button class="btn" type="button" data-a11y="calm" aria-pressed="false">🌿 Modo calmo</button>
        </div>
      </div>
    </header>`;

  const FOOTER = `
    <footer class="site-footer">
      <div class="container">
        <p>TecTEA · Projeto acadêmico de alfabetização digital para crianças e adolescentes com TEA.</p>
        <button class="btn btn-ghost" type="button" data-a11y="reset">Recomeçar meu progresso</button>
      </div>
    </footer>`;

  const DIALOGS = `
    <dialog id="dlg-login" aria-labelledby="dlg-login-t">
      <form method="dialog" data-auth="login" novalidate>
        <h2 id="dlg-login-t">Entrar</h2>
        <label class="field">E-mail <input type="email" name="email" autocomplete="email" placeholder="nome@email.com"></label>
        <label class="field">Senha <input type="password" name="senha" autocomplete="current-password"></label>
        <p class="note" data-auth-msg hidden></p>
        <div class="dialog-actions">
          <button class="btn btn-primary" type="submit" value="enviar">Entrar</button>
          <button class="btn btn-ghost" type="button" data-close>Fechar</button>
        </div>
      </form>
    </dialog>
    <dialog id="dlg-cadastro" aria-labelledby="dlg-cad-t">
      <form method="dialog" data-auth="cadastro" novalidate>
        <h2 id="dlg-cad-t">Criar cadastro</h2>
        <label class="field">Nome do estudante <input type="text" name="nome" autocomplete="name"></label>
        <label class="field">E-mail do responsável <input type="email" name="email" autocomplete="email"></label>
        <label class="field">Senha <input type="password" name="senha" autocomplete="new-password"></label>
        <p class="note" data-auth-msg hidden></p>
        <div class="dialog-actions">
          <button class="btn btn-primary" type="submit" value="enviar">Cadastrar</button>
          <button class="btn btn-ghost" type="button" data-close>Fechar</button>
        </div>
      </form>
    </dialog>`;

  function setup() {
    const top = document.getElementById('site-header');
    if (top) top.outerHTML = HEADER;
    const bottom = document.getElementById('site-footer');
    if (bottom) bottom.outerHTML = FOOTER;
    document.body.insertAdjacentHTML('beforeend', DIALOGS);
    applySettings();

    document.addEventListener('click', e => {
      const open = e.target.closest('[data-open]');
      if (open) {
        const dlg = document.getElementById('dlg-' + open.dataset.open);
        if (dlg && dlg.showModal) dlg.showModal();
        return;
      }
      if (e.target.closest('[data-close]')) { e.target.closest('dialog').close(); return; }

      const a = e.target.closest('[data-a11y]');
      if (!a) return;
      const act = a.dataset.a11y;
      if (act === 'bigger') fontIdx = Math.min(FONT_SIZES.length - 1, fontIdx + 1);
      if (act === 'smaller') fontIdx = Math.max(0, fontIdx - 1);
      if (act === 'calm') calm = !calm;
      if (act === 'reset' && window.confirm('Quer recomeçar do zero? O progresso salvo neste navegador será apagado.')) {
        T.Progress.reset(); location.reload(); return;
      }
      Store.set(K_FONT, fontIdx); Store.set(K_CALM, calm); applySettings();
    });

    /* ---- Login/cadastro: só o visual por enquanto ----
       TODO (backend): trocar este bloco por fetch('/api/login') e fetch('/api/cadastro'). */
    document.querySelectorAll('form[data-auth]').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const msg = form.querySelector('[data-auth-msg]');
        msg.textContent = 'Em breve! O login e o cadastro ainda estão sendo preparados. Por enquanto, você pode usar o site sem entrar.';
        msg.hidden = false;
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
