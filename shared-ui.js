(function () {
  const THEMES = ['dark', 'light', 'retro', 'ocean', 'pastel'];

  const state = {
    handlers: {
      toggleTheme: null,
      toggleSound: null,
      toggleHaptics: null,
      openLogin: null
    }
  };

  function renderIcons(ids, icon) {
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4"></i>`;
    });
    document.querySelectorAll('[id^="theme-btn"]').forEach((el) => {
      if (ids.includes('theme-btn')) el.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4"></i>`;
    });
    if (window.lucide?.createIcons) window.lucide.createIcons();
  }

  function defaultApplyTheme(theme) {
    THEMES.forEach((t) => document.documentElement.classList.remove(t));
    if (theme && theme !== 'dark') document.documentElement.classList.add(theme);
    const icon = (theme === 'light' || theme === 'pastel') ? 'moon' : 'sun';
    renderIcons(['theme-btn', 'theme-btn-mobile'], icon);
  }

  function defaultToggleTheme() {
    const cur = localStorage.getItem('wolfle_theme') || localStorage.getItem('wolfle-theme') || 'dark';
    const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
    localStorage.setItem('wolfle_theme', next);
    localStorage.setItem('wolfle-theme', next);
    defaultApplyTheme(next);
    document.dispatchEvent(new CustomEvent('ui:themechange', { detail: { theme: next } }));
  }

  function defaultToggleSound() {
    const current = localStorage.getItem('wolfle_sound') !== 'false';
    const next = !current;
    localStorage.setItem('wolfle_sound', next);
    renderIcons(['sound-btn', 'sound-btn-mobile', 'slf-sound-btn'], next ? 'volume-2' : 'volume-x');
    document.dispatchEvent(new CustomEvent('ui:soundchange', { detail: { enabled: next } }));
  }

  function defaultToggleHaptics() {
    const current = localStorage.getItem('wolfle_haptic') === 'true';
    const next = !current;
    localStorage.setItem('wolfle_haptic', next);
    renderIcons(['haptic-btn', 'haptic-btn-mobile', 'slf-haptic-btn'], next ? 'vibrate' : 'smartphone');
    if (next && navigator.vibrate) navigator.vibrate(20);
    document.dispatchEvent(new CustomEvent('ui:hapticschange', { detail: { enabled: next } }));
  }

  function defaultOpenLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.classList.remove('hidden');
  }

  const ui = {
    setHandlers(handlers) {
      state.handlers = { ...state.handlers, ...handlers };
    },
    toggleTheme() {
      return (state.handlers.toggleTheme || defaultToggleTheme)();
    },
    toggleSound() {
      return (state.handlers.toggleSound || defaultToggleSound)();
    },
    toggleHaptics() {
      return (state.handlers.toggleHaptics || defaultToggleHaptics)();
    },
    openLogin() {
      return (state.handlers.openLogin || defaultOpenLogin)();
    },
    icons: {
      renderIcons,
      applyThemeIcon(theme) {
        const icon = (theme === 'light' || theme === 'pastel') ? 'moon' : 'sun';
        renderIcons(['theme-btn', 'theme-btn-mobile'], icon);
      },
      applySoundIcon(enabled) {
        renderIcons(['sound-btn', 'sound-btn-mobile', 'slf-sound-btn'], enabled ? 'volume-2' : 'volume-x');
      },
      applyHapticsIcon(enabled) {
        renderIcons(['haptic-btn', 'haptic-btn-mobile', 'slf-haptic-btn'], enabled ? 'vibrate' : 'smartphone');
      }
    }
  };

  window.ui = ui;
  // Backwards-compat aliases — call defaults directly to avoid circular
  // references if a game passes window.toggleTheme into ui.setHandlers.
  window.toggleTheme = defaultToggleTheme;
  window.toggleSound = defaultToggleSound;
  window.toggleHaptic = defaultToggleHaptics;
  window.openLoginModal = defaultOpenLogin;
})();

// Immediately update login header from localStorage so the header shows
// the correct state before the Firebase module finishes loading.
document.addEventListener('DOMContentLoaded', function () {
  const loggedIn = localStorage.getItem('wolfle_logged_in') === '1';
  const name = localStorage.getItem('wolfle_user_name') || '';
  const avatar = localStorage.getItem('wolfle_avatar') || '🐺';
  if (!loggedIn || !name) return;
  const btn = document.getElementById('login-header-btn');
  if (!btn) return;
  const labelEl = document.getElementById('login-header-label');
  const avatarEl = document.getElementById('login-header-avatar');
  if (labelEl) labelEl.textContent = name;
  if (avatarEl) avatarEl.textContent = avatar;
  btn.classList.remove('border-slate-600');
  btn.classList.add('border-indigo-500/50');
});
