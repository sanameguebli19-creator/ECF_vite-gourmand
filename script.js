/* ===========================
   script.js — Vite & Gourmand
   =========================== */

/* ── SCROLL REVEAL (index.html) ── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.avis-card, .team-card');
  if (elements.length === 0) return;

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/* ── FILTRES MENUS (menus.html) ── */
function initFiltres() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  let activeTheme  = 'tous';
  let activeRegime = 'tous';

  // Thème
  document.querySelectorAll('#filter-theme .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filter-theme .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTheme = btn.dataset.theme;
      applyFilters();
    });
  });

  // Régime
  document.querySelectorAll('#filter-regime .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filter-regime .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRegime = btn.dataset.regime;
      applyFilters();
    });
  });

  // Prix et personnes
  const inputPrix     = document.getElementById('filter-prix');
  const inputPersonne = document.getElementById('filter-personnes');
  if (inputPrix)     inputPrix.addEventListener('input', applyFilters);
  if (inputPersonne) inputPersonne.addEventListener('input', applyFilters);

  function applyFilters() {
    const maxPrix = parseFloat(inputPrix?.value) || Infinity;
    const minPers = parseInt(inputPersonne?.value) || 0;
    let count = 0;

    document.querySelectorAll('#menuGrid .menu-card').forEach(card => {
      const ok =
        (activeTheme  === 'tous' || card.dataset.theme  === activeTheme)  &&
        (activeRegime === 'tous' || card.dataset.regime === activeRegime) &&
        parseFloat(card.dataset.prix)      <= maxPrix &&
        parseInt(card.dataset.personnes)   >= minPers;

      card.classList.toggle('hidden', !ok);

      if (ok) {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(16px)';
        setTimeout(() => {
          card.style.transition = 'opacity .35s ease, transform .35s ease';
          card.style.opacity    = '1';
          card.style.transform  = 'translateY(0)';
        }, 50);
        count++;
      }
    });

    const countEl = document.getElementById('count');
    if (countEl) countEl.textContent = count;

    const noResults = document.getElementById('noResults');
    if (noResults) noResults.classList.toggle('show', count === 0);
  }
}

/* ── CONNEXION / INSCRIPTION (connexion.html) ── */
function initAuth() {
  if (!document.getElementById('form-connexion')) return;

  // Changer d'onglet
  window.switchTab = function(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    document.getElementById('form-' + tab).classList.add('active');
  };

  // Indicateur de force du mot de passe
  window.checkStrength = function(val) {
    const fill  = document.getElementById('strength-fill');
    const label = document.getElementById('strength-label');
    if (!fill || !label) return;

    let score = 0;
    if (val.length >= 10)       score++;
    if (/[A-Z]/.test(val))      score++;
    if (/[0-9]/.test(val))      score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];
    const labels = ['Très faible', 'Moyen', 'Bon', 'Fort ✓'];

    fill.style.width      = (score / 4 * 100) + '%';
    fill.style.background = colors[score - 1] || '#eee';
    label.textContent     = score === 0
      ? 'Minimum 10 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial'
      : labels[score - 1];
  };

  // Mot de passe oublié (modal)
  window.openModal = function() {
    document.getElementById('modalOverlay').classList.add('show');
  };
  window.closeModal = function() {
    document.getElementById('modalOverlay').classList.remove('show');
  };

  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });
  }

  // Lier l'input mot de passe à checkStrength
  const pwdInput = document.getElementById('reg-password');
  if (pwdInput) pwdInput.addEventListener('input', () => checkStrength(pwdInput.value));

  // Soumission connexion
  window.handleLogin = function() {
    const email = document.getElementById('login-email')?.value.trim();
    const pwd   = document.getElementById('login-password')?.value;
    if (!email || !pwd) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    // TODO : appel API PHP
    alert('Connexion en cours… (à connecter au back-end PHP)');
  };

  // Soumission inscription
  window.handleRegister = function() {
    const prenom = document.getElementById('reg-prenom')?.value.trim();
    const nom    = document.getElementById('reg-nom')?.value.trim();
    const email  = document.getElementById('reg-email')?.value.trim();
    const tel    = document.getElementById('reg-tel')?.value.trim();
    const adresse= document.getElementById('reg-adresse')?.value.trim();
    const pwd    = document.getElementById('reg-password')?.value;
    const pwd2   = document.getElementById('reg-password2')?.value;

    if (!prenom || !nom || !email || !pwd) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (pwd !== pwd2) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    if (pwd.length < 10) {
      alert('Le mot de passe doit faire au minimum 10 caractères.');
      return;
    }
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd) || !/[^A-Za-z0-9]/.test(pwd)) {
      alert('Le mot de passe doit contenir au moins 1 majuscule, 1 chiffre et 1 caractère spécial.');
      return;
    }
    // TODO : appel API PHP
    alert('Compte créé ! Un e-mail de bienvenue va être envoyé. (à connecter au back-end PHP)');
  };

  // Réinitialisation mot de passe
  window.handleForgot = function() {
    const email = document.getElementById('forgot-email')?.value.trim();
    if (!email) {
      alert('Veuillez entrer votre adresse e-mail.');
      return;
    }
    closeModal();
    // TODO : appel API PHP
    alert('Un lien de réinitialisation a été envoyé à ' + email + ' (à connecter au back-end PHP)');
  };
}

/* ── INITIALISATION ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initFiltres();
  initAuth();
});
