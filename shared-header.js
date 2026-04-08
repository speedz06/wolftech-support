(function () {
  function callIfExists(fnNames) {
    for (const name of fnNames) {
      const fn = window[name];
      if (typeof fn === 'function') {
        fn();
        return true;
      }
    }
    return false;
  }

  function defaultToggle(key, onMsg, offMsg) {
    const current = localStorage.getItem(key) !== 'false';
    localStorage.setItem(key, String(!current));
    return !current;
  }

  function updateDefaultButtonIcons() {
    const soundEnabled = localStorage.getItem('wolfle_sound') !== 'false';
    const hapticEnabled = localStorage.getItem('wolfle_haptic') !== 'false';
    const soundBtn = document.getElementById('sound-btn');
    const hapticBtn = document.getElementById('haptic-btn');
    if (soundBtn) soundBtn.innerHTML = `<i data-lucide="${soundEnabled ? 'volume-2' : 'volume-x'}" class="w-4 h-4"></i>`;
    if (hapticBtn) hapticBtn.innerHTML = `<i data-lucide="${hapticEnabled ? 'smartphone' : 'smartphone-nfc'}" class="w-4 h-4"></i>`;
    if (window.lucide?.createIcons) window.lucide.createIcons();
  }


  if (!document.getElementById('wolfle-header-shared-style')) {
    const style = document.createElement('style');
    style.id = 'wolfle-header-shared-style';
    style.textContent = `
      .wolfle-header { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:max(10px, env(safe-area-inset-top)) 16px 8px; border-bottom:1px solid #1e293b; flex-shrink:0; background:rgba(15,23,42,0.85); backdrop-filter:blur(12px); }
      .wolfle-header-center { display:flex; align-items:center; gap:8px; min-width:0; }
      .wolfle-brand-icon { color: #818cf8; }
      @media (min-width: 901px) { .mobile-only { display: none !important; } }
      body.game-hangman .wolfle-header-brand { background-image: linear-gradient(135deg, #fb7185, #f43f5e); }
      body.game-verbinde .wolfle-header-brand { background-image: linear-gradient(135deg, #facc15, #f59e0b); }
      body.game-stadtlandfluss .wolfle-header-brand { background-image: linear-gradient(135deg, #86efac, #22c55e); }
      body.game-tipprennen .wolfle-header-brand { background-image: linear-gradient(135deg, #67e8f9, #06b6d4); }
      body.game-wordle .wolfle-header-brand, body.game-home .wolfle-header-brand { background-image: linear-gradient(135deg, #818cf8, #38bdf8); }
    `;
    document.head.appendChild(style);
  }

  window.renderWolfleHeader = function renderWolfleHeader(options = {}) {
    const mount = document.getElementById(options.mountId || 'header-mount');
    if (!mount) return;

    mount.innerHTML = `
      <div id="page-header" class="wolfle-header">
        <div class="wolfle-header-left">
          <h1 class="wolfle-header-brand text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center gap-1.5">
            <i data-lucide="paw-print" class="w-5 h-5 wolfle-brand-icon"></i> Wolfle
          </h1>
        </div>
        <div class="wolfle-header-center">${options.centerHtml || ''}</div>
        <div class="wolfle-header-right flex items-center gap-1.5">
          <button id="theme-btn" data-header-action="theme" class="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg transition-colors" title="Design wechseln">
            <i data-lucide="sun" class="w-4 h-4"></i>
          </button>
          <button id="sound-btn" data-header-action="sound" class="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg transition-colors" title="Ton">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
          </button>
          <button id="haptic-btn" data-header-action="haptic" class="mobile-only text-slate-400 hover:text-slate-200 p-1.5 rounded-lg transition-colors" title="Vibration">
            <i data-lucide="smartphone" class="w-4 h-4"></i>
          </button>
          ${options.extraControlsHtml || ''}
          <button id="login-header-btn" data-header-action="login" title="Anmelden" class="flex items-center gap-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white px-2 py-1.5 rounded-lg border border-slate-600 transition-all">
            <span id="login-header-avatar">🐺</span>
            <span id="login-header-label">Anmelden</span>
          </button>
        </div>
      </div>
    `;

    mount.querySelector('[data-header-action="theme"]')?.addEventListener('click', () => {
      if (!callIfExists(['toggleTheme', 'slfToggleTheme'])) {
        const themes = ['', 'light', 'retro', 'ocean', 'pastel'];
        const current = localStorage.getItem('wolfle-theme') || '';
        const next = themes[(themes.indexOf(current) + 1 + themes.length) % themes.length];
        document.documentElement.className = next;
        localStorage.setItem('wolfle-theme', next);
      }
    });

    mount.querySelector('[data-header-action="sound"]')?.addEventListener('click', () => {
      if (!callIfExists(['toggleSound', 'slfToggleSound'])) {
        defaultToggle('wolfle_sound');
        updateDefaultButtonIcons();
      }
    });

    mount.querySelector('[data-header-action="haptic"]')?.addEventListener('click', () => {
      if (!callIfExists(['toggleHaptic', 'slfToggleHaptic'])) {
        defaultToggle('wolfle_haptic');
        updateDefaultButtonIcons();
      }
    });

    mount.querySelector('[data-header-action="login"]')?.addEventListener('click', () => {
      callIfExists(['openLoginModal', 'slfOpenLogin']);
    });

    updateDefaultButtonIcons();
    if (window.lucide?.createIcons) window.lucide.createIcons();
  };
})();
