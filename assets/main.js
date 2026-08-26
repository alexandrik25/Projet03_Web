/* ===== FormaPro — script unique ===== */

var FORMATIONS = [];  // rempli depuis formations.json

/* Icône + couleur d'affichage par id de formation */
var STYLES = {
  1: { icone: "🧪", couleur: "#2f5d8a" },
  2: { icone: "🤖", couleur: "#5b3a8a" },
  3: { icone: "🌐", couleur: "#1f7a8c" },
  4: { icone: "⚛️", couleur: "#0b6e99" },
  5: { icone: "🅰️", couleur: "#b02a37" },
  6: { icone: "🧩", couleur: "#0f766e" },
  7: { icone: "📱", couleur: "#1d4ed8" },
  8: { icone: "🔒", couleur: "#334155" },
  9: { icone: "🐍", couleur: "#116149" },
  10: { icone: "🎨", couleur: "#9333ea" }
};
function styleDe(id) { return STYLES[id] || { icone: "📘", couleur: "#1f3a5f" }; }

/* Ouvre / ferme le menu mobile */
function basculerMenu() { document.getElementById("nav").classList.toggle("ouvert"); }

/* Petite fonction réutilisée pour les cours ET les étapes */
function numListe(arr) {
  return arr.map(function (t, i) {
    return '<li><span class="n">' + (i + 1) + '</span><span>' + t + '</span></li>';
  }).join("");
}

/* Liste des formations (cartes) */
function afficherListe() {
  var c = document.getElementById("liste");
  if (!c) return;
  c.innerHTML = FORMATIONS.map(function (f) {
    var s = styleDe(f.id);
    return '<article class="carte">' +
      '<div class="badge" style="background:' + s.couleur + '">' + s.icone + '</div>' +
      '<h3>' + f.nom + '</h3><p>' + f.description + '</p>' +
      '<a class="btn" href="details.html?id=' + f.id + '">Détails</a></article>';
  }).join("");
}

/* Détails d'une formation (selon l'id dans l'URL) */
function afficherDetail() {
  var z = document.getElementById("detail");
  if (!z) return;
  var id = parseInt(new URLSearchParams(location.search).get("id"), 10);
  var f = FORMATIONS.find(function (x) { return x.id === id; });

  if (!f) {
    z.innerHTML = '<div class="conteneur section"><h1>Formation introuvable</h1>' +
      '<p><a class="btn" href="formations.html">Retour aux formations</a></p></div>';
    return;
  }

  var s = styleDe(f.id);
  document.title = f.nom + " — FormaPro";
  z.innerHTML =
    '<div class="bandeau" style="background:linear-gradient(135deg,' + s.couleur + ',#1f3a5f)">' +
      '<div class="conteneur"><h1>' + s.icone + ' ' + f.nom + '</h1><p>' + f.description + '</p></div></div>' +
    '<div class="conteneur section"><div class="deux-cols large">' +
      '<div>' +
        '<h2>Cours inclus</h2><ul class="liste-num">' + numListe(f.cours) + '</ul>' +
        '<h2 style="margin-top:28px">Étapes à compléter</h2><ul class="liste-num">' + numListe(f.etapes) + '</ul>' +
      '</div>' +
      '<div>' +
        '<h2>Compétences</h2><div class="tags">' +
          f.competences.map(function (x) { return '<span class="tag">' + x + '</span>'; }).join("") +
        '</div><p style="margin-top:24px"><a class="btn" href="contact.html">Nous contacter</a></p>' +
      '</div>' +
    '</div><p style="margin-top:24px"><a href="formations.html">← Toutes les formations</a></p></div>';
}

/* Formulaire de contact : bouton désactivé tant que les champs sont vides */
function initContact() {
  var form = document.getElementById("form");
  if (!form) return;
  var champs = ["nom", "email", "message"].map(function (id) { return document.getElementById(id); });
  var btn = document.getElementById("envoyer");

  function verifier() {
    btn.disabled = champs.some(function (c) { return c.value.trim() === ""; });
  }
  champs.forEach(function (c) { c.addEventListener("input", verifier); });
  verifier();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("succes").style.display = "block";
    form.reset();
    btn.disabled = true;
    scrollTo(0, 0);
  });
}

/* Charge le JSON puis affiche (uniquement si la page en a besoin) */
function chargerFormations() {
  var cible = document.getElementById("liste") || document.getElementById("detail");
  if (!cible) return;
  fetch("assets/formations.json")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) { FORMATIONS = d; afficherListe(); afficherDetail(); })
    .catch(function () {
      cible.innerHTML = '<div class="conteneur section"><h2>Impossible de charger les formations</h2>' +
        '<p>Ouvre le site via un serveur local (ex. <code>python -m http.server</code>), pas en double-clic.</p></div>';
    });
}

document.addEventListener("DOMContentLoaded", function () {
  initContact();
  chargerFormations();
});
