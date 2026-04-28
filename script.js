document.addEventListener("DOMContentLoaded", function () {

  // 🍔 MENU HAMBURGER
  window.toggleMenu = function() {
    let nav = document.querySelector(".nav-links");
    nav.classList.toggle("show");
  };

  // 🎯 FILTRE MENUS
  let theme = "all";
  let regime = "all";

  window.setTheme = function(t) {
    theme = t;
    filtrerMenus();
  };

  window.setRegime = function(r) {
    regime = r;
    filtrerMenus();
  };

  function filtrerMenus() {
    let cards = document.querySelectorAll(".card");
    let maxPrix = document.getElementById("prix").value || Infinity;
    let minPers = document.getElementById("pers").value || 0;

    let count = 0;

    cards.forEach(card => {
      let ok = true;

      if (theme !== "all" && card.dataset.theme !== theme) ok = false;
      if (regime !== "all" && card.dataset.regime !== regime) ok = false;
      if (card.dataset.prix > maxPrix) ok = false;
      if (card.dataset.pers < minPers) ok = false;

      card.style.display = ok ? "block" : "none";
      if (ok) count++;
    });

    document.getElementById("count").innerText = count + " menus";
  }

  // 📑 ONGLET MENU DETAIL
  window.changerOnglet = function(id, btn) {
    document.querySelectorAll(".plats-list").forEach(l => l.classList.remove("active"));
    document.querySelectorAll(".plat-tab").forEach(t => t.classList.remove("active"));

    document.getElementById(id).classList.add("active");
    btn.classList.add("active");
  };

  // 🛒 COMMANDE
  window.envoyerCommande = function() {
    const nom = document.getElementById("nom").value;
    const email = document.getElementById("email").value;
    const menu = document.getElementById("menu-select").value;
    const qty = document.getElementById("qty").value;

    if (!nom || !email) {
      alert("Veuillez remplir les champs !");
      return;
    }

    fetch("backend/createCommande.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nom: nom,
        email: email,
        menu_id: menu,
        quantite: qty
      })
    })
    .then(res => res.json())
    .then(data => {
      alert("✅ Commande envoyée !");
    })
    .catch(err => console.error(err));
  };

  // 🖱️ CLICK SUR CARTE
  let cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      let titre = card.querySelector("h3").innerText;
      alert("Menu sélectionné : " + titre);
    });
  });

});