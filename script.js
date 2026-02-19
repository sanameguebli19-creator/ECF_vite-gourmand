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

/* ── VUE DÉTAILLÉE MENU (menu-detail.html) ── */
function initMenuDetail() {
  if (!document.getElementById('plat-entree')) return;

  window.switchPlat = function(type, btn) {
    document.querySelectorAll('.plats-list').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.plat-tab').forEach(b => b.classList.remove('active'));
    document.getElementById('plat-' + type).classList.add('active');
    btn.classList.add('active');
  };
}

/* ── COMMANDE (commande.html) ── */
function initCommande() {
  if (!document.getElementById('menu-select')) return;

  const menus = {
    noel:     { nom: 'Le Grand Festin de Noël',        theme: 'Thème Noël',      prix: 65, min: 8  },
    paques:   { nom: 'Table de Pâques Printanière',    theme: 'Thème Pâques',    prix: 48, min: 6  },
    classique:{ nom: 'Menu Classique Bordeaux',         theme: 'Classique',       prix: 38, min: 4  },
    vegan:    { nom: 'Menu Vegan Saveurs du Monde',     theme: 'Classique • Vegan', prix: 35, min: 4 },
    event:    { nom: 'Cocktail Dinatoire Prestige',     theme: 'Événement',       prix: 75, min: 20 }
  };

  window.changeQty = function(delta) {
    const input = document.getElementById('qty');
    const select = document.getElementById('menu-select');
    const menuKey = select.value;
    const minVal = menus[menuKey]?.min || 1;
    let val = parseInt(input.value) + delta;
    if (val < minVal) val = minVal;
    input.value = val;
    updateRecap();
  };

  window.updateRecap = function() {
    const select   = document.getElementById('menu-select');
    const menuKey  = select.value;
    const menu     = menus[menuKey];
    if (!menu) return;

    const qty      = parseInt(document.getElementById('qty').value) || menu.min;
    const minQty   = menu.min;

    // Forcer le minimum
    if (qty < minQty) {
      document.getElementById('qty').value = minQty;
    }

    const realQty  = Math.max(qty, minQty);
    const subtotal = menu.prix * realQty;

    // Réduction groupe : -10% si 5 personnes de plus que le minimum
    const reduction = realQty >= (minQty + 5) ? Math.round(subtotal * 0.1) : 0;
    const total     = subtotal - reduction;

    // Mise à jour récap
    document.getElementById('recap-nom').textContent       = menu.nom;
    document.getElementById('recap-theme').textContent     = menu.theme;
    document.getElementById('recap-prix-unit').textContent = menu.prix + '€ / pers.';
    document.getElementById('recap-qty').textContent       = realQty;
    document.getElementById('recap-subtotal').textContent  = subtotal + '€';
    document.getElementById('recap-total').textContent     = total + '€';
    document.getElementById('qty-note').textContent        = 'Minimum ' + minQty + ' personnes pour ce menu';

    const rowReduction = document.getElementById('row-reduction');
    const reductionMsg = document.getElementById('recap-reduction-msg');
    if (reduction > 0) {
      document.getElementById('recap-reduction').textContent = '−' + reduction + '€';
      rowReduction.style.display  = 'flex';
      reductionMsg.style.display  = 'block';
    } else {
      rowReduction.style.display  = 'none';
      reductionMsg.style.display  = 'none';
    }
  };

  window.validerCommande = function() {
    const date    = document.getElementById('date-prestation').value;
    const heure   = document.getElementById('heure-livraison').value;
    const adresse = document.getElementById('adresse').value.trim();
    if (!date || !heure || !adresse) {
      alert('Veuillez remplir tous les champs obligatoires (date, heure et adresse).');
      return;
    }
    // TODO : appel API PHP
    alert('✅ Commande validée ! Un email de confirmation vous a été envoyé.');
  };

  // Init au chargement
  updateRecap();
}

/* ── CONTACT (contact.html) ── */
function initContact() {
  if (!document.getElementById('contact-titre')) return;

  window.envoyerContact = function() {
    const titre   = document.getElementById('contact-titre').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!titre || !email || !message) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    // TODO : appel API PHP (envoi mail)
    document.getElementById('successMsg').classList.add('show');
    document.getElementById('contact-titre').value   = '';
    document.getElementById('contact-email').value   = '';
    document.getElementById('contact-message').value = '';
  };
}

/* ── DASHBOARD COMMUN (utilisateur / employé / admin) ── */
function initDashboard() {
  if (!document.querySelector('.dash-section')) return;

  window.showSection = function(id) {
    document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dash-nav li a').forEach(a => a.classList.remove('active'));
    const section = document.getElementById('section-' + id);
    if (section) section.classList.add('active');
    event.currentTarget.classList.add('active');
  };
}

/* ── ESPACE UTILISATEUR ── */
function initEspaceUtilisateur() {
  if (!document.getElementById('section-accueil') || !document.getElementById('avis-texte')) return;

  let noteActuelle = 4;

  window.setNote = function(n) {
    noteActuelle = n;
    document.querySelectorAll('.star-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i < n);
    });
  };

  window.envoyerAvis = function() {
    const texte = document.getElementById('avis-texte').value.trim();
    if (!texte) { alert('Veuillez écrire un commentaire.'); return; }
    // TODO : appel API PHP
    alert('✅ Merci pour votre avis ! Il sera publié après validation de notre équipe.');
    document.getElementById('avis-texte').value = '';
  };

  window.sauvegarderProfil = function() {
    // TODO : appel API PHP
    alert('✅ Profil mis à jour avec succès !');
  };
}

/* ── ESPACE EMPLOYÉ ── */
function initEspaceEmploye() {
  if (!document.querySelector('.commandes-table')) return;

  window.filterCommande = function(btn, statut) {
    document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.table-row').forEach(row => {
      if (statut === 'tous' || row.dataset.statut === statut) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  };

  window.avancerStatut = function(btn, nouveauStatut) {
    const row = btn.closest('.table-row');
    const badge = row.querySelector('.statut-badge');
    const classes = {
      'Acceptée'       : 'statut-accepte',
      'En préparation' : 'statut-preparation',
      'En livraison'   : 'statut-livraison',
      'Livré'          : 'statut-livraison',
      'Terminée'       : 'statut-termine'
    };
    badge.className = 'statut-badge ' + (classes[nouveauStatut] || '');
    badge.textContent = nouveauStatut;

    // Bouton suivant
    const suivants = {
      'Acceptée'       : ['→ Préparer', 'En préparation'],
      'En préparation' : ['→ Livrer',   'En livraison'],
      'En livraison'   : ['→ Livré',    'Livré'],
      'Livré'          : ['→ Terminer', 'Terminée']
    };
    if (suivants[nouveauStatut]) {
      btn.textContent = suivants[nouveauStatut][0];
      btn.onclick = () => avancerStatut(btn, suivants[nouveauStatut][1]);
    } else {
      btn.style.display = 'none';
    }
  };

  window.validerAvis = function(btn) {
    const card = btn.closest('.avis-validate-card');
    card.style.opacity = '0';
    card.style.transform = 'translateX(20px)';
    card.style.transition = 'all .3s';
    setTimeout(() => card.remove(), 300);
  };

  window.refuserAvis = function(btn) {
    const card = btn.closest('.avis-validate-card');
    card.style.opacity = '0';
    card.style.transform = 'translateX(-20px)';
    card.style.transition = 'all .3s';
    setTimeout(() => card.remove(), 300);
  };
}

/* ── ESPACE ADMIN ── */
function initEspaceAdmin() {
  if (!document.querySelector('.donut-chart')) return;

  window.creerEmploye = function() {
    const inputs = document.querySelectorAll('.create-emp-card input');
    const prenom = inputs[0].value.trim();
    const nom    = inputs[1].value.trim();
    const email  = inputs[2].value.trim();
    if (!prenom || !nom || !email) { alert('Veuillez remplir tous les champs.'); return; }
    // TODO : appel API PHP — génère mot de passe, envoie email
    alert(`✅ Compte créé pour ${prenom} ${nom}.\nUn email de notification a été envoyé à ${email}.`);
    inputs.forEach(i => i.value = '');
  };

  // Filtres CA
  document.querySelectorAll('.ca-filters .filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ca-filters .filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // TODO : recharger données depuis API selon période
    });
  });
}

/* ── INITIALISATION ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initFiltres();
  initAuth();
  initMenuDetail();
  initCommande();
  initContact();
  initDashboard();
  initEspaceUtilisateur();
  initEspaceEmploye();
  initEspaceAdmin();
});