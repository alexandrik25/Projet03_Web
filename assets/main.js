/* ===== Scripts partagés du site ===== */

/* Les données sont chargées depuis assets/formations.json (voir chargerFormations). */
var FORMATIONS = [];

/* Styles d'affichage (icône + couleur) associés à chaque formation par id. */
var STYLES_VISUELS = {
  1:  { icone: "🧪", couleur: "#2f5d8a" },
  2:  { icone: "🤖", couleur: "#5b3a8a" },
  3:  { icone: "🌐", couleur: "#1f7a8c" },
  4:  { icone: "⚛️", couleur: "#0b6e99" },
  5:  { icone: "🅰️", couleur: "#b02a37" },
  6:  { icone: "🧩", couleur: "#0f766e" },
  7:  { icone: "📱", couleur: "#1d4ed8" },
  8:  { icone: "🔒", couleur: "#334155" },
  9:  { icone: "🐍", couleur: "#116149" },
  10: { icone: "🎨", couleur: "#9333ea" }
};

/* Retourne l'icône et la couleur d'affichage d'une formation. */
function styleDe(id) {
  return STYLES_VISUELS[id] || { icone: "📘", couleur: "#1f3a5f" };
}

/* Ouvre / ferme le menu de navigation sur mobile */
function basculerMenu() {
  var menu = document.getElementById("nav-liens");
  if (menu) menu.classList.toggle("ouvert");
}

/* ---------- Chargement des données ---------- */
/* Va chercher le fichier JSON, puis lance l'affichage. */
function chargerFormations() {
  // Rien à charger si la page n'a besoin ni de la liste ni des détails
  if (!document.getElementById("liste-formations") &&
      !document.getElementById("detail-formation")) return;

  fetch("assets/formations.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      FORMATIONS = data;
      afficherListeFormations();
      afficherDetailFormation();
    })
    .catch(function (err) {
      afficherErreurChargement(err);
    });
}

/* Message clair si le JSON ne peut pas être chargé (ex. ouverture en file://). */
function afficherErreurChargement(err) {
  var msg =
    '<div class="conteneur section">' +
      '<h1 class="section-titre">Impossible de charger les formations</h1>' +
      '<p class="section-intro">Le fichier <code>assets/formations.json</code> n\'a pas pu être lu. ' +
      'Si vous avez ouvert la page en double-cliquant (adresse <code>file://</code>), le navigateur bloque la lecture du fichier local.<br><br>' +
      'Lancez un petit serveur local, par exemple :<br>' +
      '<code>python -m http.server</code> puis ouvrez <code>http://localhost:8000</code>.</p>' +
    '</div>';
  var cible = document.getElementById("liste-formations") || document.getElementById("detail-formation");
  if (cible) cible.innerHTML = msg;
  console.error("Chargement des formations échoué :", err);
}

/* ---------- Page Liste des formations ---------- */
/* Génère les cartes à partir des données. */
function afficherListeFormations() {
  var conteneur = document.getElementById("liste-formations");
  if (!conteneur) return;

  conteneur.innerHTML = ""; // vide avant de (re)remplir
  FORMATIONS.forEach(function (f) {
    var s = styleDe(f.id); // icône + couleur d'affichage
    var carte = document.createElement("article");
    carte.className = "carte-formation";
    carte.innerHTML =
      '<div class="banniere" style="background:' + s.couleur + '">' + s.icone + '</div>' +
      '<div class="corps">' +
        '<h3>' + f.nom + '</h3>' +
        '<p>' + f.description + '</p>' +
        '<div class="meta"><span>📚 ' + f.cours.length + ' cours</span></div>' +
        '<a class="btn" href="details.html?id=' + f.id + '">Détails</a>' +
      '</div>';
    conteneur.appendChild(carte);
  });
}

/* ---------- Page Détails d'une formation ---------- */
/* Lit l'identifiant dans l'URL puis remplit la page. */
function afficherDetailFormation() {
  var zone = document.getElementById("detail-formation");
  if (!zone) return;

  // Récupère l'id passé dans l'URL (?id=...)
  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get("id"), 10);
  var f = FORMATIONS.find(function (item) { return item.id === id; });

  // Formation introuvable : message de repli
  if (!f) {
    zone.innerHTML =
      '<div class="conteneur section">' +
        '<h1 class="section-titre">Formation introuvable</h1>' +
        '<p class="section-intro">Cette formation n\'existe pas ou le lien est incorrect.</p>' +
        '<a class="btn" href="formations.html">Retour aux formations</a>' +
      '</div>';
    return;
  }

  var s = styleDe(f.id);
  document.title = f.nom + " — FormaPro";

  // Construit la liste des cours
  var coursHTML = f.cours.map(function (c, i) {
    return '<li><span class="num">' + (i + 1) + '</span><span>' + c + '</span></li>';
  }).join("");

  // Construit les étapes (chaînes de caractères)
  var etapesHTML = f.etapes.map(function (e) {
    return '<li class="etape"><p>' + e + '</p></li>';
  }).join("");

  // Construit les compétences
  var compHTML = f.competences.map(function (c) {
    return '<span class="competence">' + c + '</span>';
  }).join("");

  zone.innerHTML =
    // En-tête coloré de la formation
    '<div class="detail-entete" style="background:linear-gradient(135deg,' + s.couleur + ',#1f3a5f)">' +
      '<div class="conteneur">' +
        '<h1>' + s.icone + ' ' + f.nom + '</h1>' +
        '<p>' + f.description + '</p>' +
        '<div class="detail-meta">' +
          '<div><strong>' + f.cours.length + '</strong>Cours</div>' +
          '<div><strong>' + f.etapes.length + '</strong>Étapes</div>' +
          '<div><strong>' + f.competences.length + '</strong>Compétences</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    // Corps en deux colonnes
    '<div class="conteneur section">' +
      '<div class="detail-grille">' +
        '<div>' +
          '<div class="bloc"><h2>Cours inclus</h2><ul class="liste-cours">' + coursHTML + '</ul></div>' +
          '<div class="bloc"><h2>Étapes à compléter</h2><ul class="etapes">' + etapesHTML + '</ul></div>' +
        '</div>' +
        '<div>' +
          '<div class="bloc"><h2>Compétences développées</h2><div class="competences">' + compHTML + '</div></div>' +
          '<div class="bloc"><h2>Prêt à commencer ?</h2><p style="color:var(--gris);margin-bottom:18px">Inscrivez-vous et démarrez cette formation dès aujourd\'hui.</p><a class="btn" href="contact.html">Nous contacter</a></div>' +
        '</div>' +
      '</div>' +
      '<p style="margin-top:28px"><a href="formations.html">← Retour à toutes les formations</a></p>' +
    '</div>';
}

/* ---------- Page Contact ---------- */
/* Le bouton reste désactivé tant que les 3 champs ne sont pas remplis. */
function initFormulaireContact() {
  var form = document.getElementById("form-contact");
  if (!form) return;

  var nom = document.getElementById("nom");
  var email = document.getElementById("email");
  var message = document.getElementById("message");
  var bouton = document.getElementById("btn-envoyer");

  // Active le bouton uniquement si tous les champs sont remplis
  function verifierChamps() {
    var rempli = nom.value.trim() !== "" &&
                 email.value.trim() !== "" &&
                 message.value.trim() !== "";
    bouton.disabled = !rempli;
  }

  // Surveille la saisie de chaque champ
  [nom, email, message].forEach(function (champ) {
    champ.addEventListener("input", verifierChamps);
  });
  verifierChamps(); // état initial

  // Soumission simulée (aucun envoi serveur)
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("message-succes").style.display = "block";
    form.reset();
    bouton.disabled = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* Marque le lien de navigation de la page courante */
function marquerLienActif() {
  var page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-liens a").forEach(function (a) {
    if (a.getAttribute("href") === page) a.classList.add("actif");
  });
}

/* Lancement au chargement de la page */
document.addEventListener("DOMContentLoaded", function () {
  marquerLienActif();
  initFormulaireContact();
  chargerFormations();
});
