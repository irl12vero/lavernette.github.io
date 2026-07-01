/**
 * app.js — Comportement de l'application
 * ========================================
 * Le site est maintenant composé de plusieurs pages HTML distinctes
 * (une page = un fichier .html, voir le dossier racine du site).
 * La navigation se fait donc avec de simples liens <a href="...">
 * (rechargement de page classique) — il n'y a plus de fonction
 * JavaScript "afficher()" à appeler pour changer de page.
 *
 * Ce fichier gère uniquement :
 *  1. Le chargement des données dynamiques de LA PAGE EN COURS
 *     (grâce à l'attribut data-page="..." posé sur <body> dans
 *     chaque fichier .html).
 *  2. L'accordéon de la FAQ.
 *  3. Les formulaires (contact + inscription annuaire).
 *
 * Le chargement des données proprement dit (lecture de window.SITE_DATA,
 * génération du HTML) est délégué à data.js / render.js.
 */

// --------------------------------------------------------------------
// 1. Chargement des données dynamiques de la page courante
// --------------------------------------------------------------------
// Chaque page <body data-page="xxx"> indique son nom. On utilise ce
// nom pour aller chercher, dans window.RenderMap (défini dans
// render.js), la liste des fonctions de rendu à exécuter pour cette
// page (ex : la page "urgences" doit charger render_urgences_contacts).
function chargerDonneesPage(page) {
  const renderers = window.RenderMap[page];
  if (renderers) renderers.forEach((fn) => fn());
}

// --------------------------------------------------------------------
// 2. FAQ — ouverture/fermeture d'une question
// --------------------------------------------------------------------
function toggleFaq(el) {
  el.nextElementSibling.classList.toggle("open");
  el.querySelector(".faq-chevron").classList.toggle("open");
}

// --------------------------------------------------------------------
// 3a. Formulaire de contact (page contact.html)
// --------------------------------------------------------------------
function envoyerFormulaire() {
  const cat = document.getElementById("f-categorie").value;
  const lot = document.getElementById("f-lot").value;
  const email = document.getElementById("f-email").value;
  const msg = document.getElementById("f-message").value;
  const faq = document.getElementById("f-faq").checked;
  const rgpd = document.getElementById("f-rgpd").checked;
  if (!cat || !lot || !email || !msg) { alert("Merci de remplir tous les champs obligatoires."); return; }
  if (!rgpd) { alert("Merci d'accepter l'utilisation de vos données pour continuer."); return; }

  const endpoint = window.SITE_CONFIG && window.SITE_CONFIG.contact_form_endpoint;
  const btn = document.getElementById("btn-envoyer");

  if (!endpoint || endpoint === "URL_DE_VOTRE_WEB_APP_ICI") {
    alert("Le formulaire n'est pas encore configuré (voir data/google_contact_config.js).");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Envoi en cours...";

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // évite une requête preflight bloquée par Apps Script
    body: JSON.stringify({ categorie: cat, lot: lot, email: email, message: msg, faq: faq }),
  })
    .then(() => {
      alert("Votre question a bien été envoyée.\nLe bureau vous répondra sous 3 à 5 jours ouvrés.");
      ["f-categorie", "f-lot", "f-email", "f-message"].forEach((id) => (document.getElementById(id).value = ""));
      document.getElementById("f-faq").checked = false;
      document.getElementById("f-rgpd").checked = false;
    })
    .catch(() => {
      alert("Une erreur est survenue lors de l'envoi. Merci de réessayer, ou de nous contacter directement par email.");
    })
    .finally(() => {
      btn.textContent = "Envoyer ma question →";
      btn.disabled = false;
    });
}

// --------------------------------------------------------------------
// 3b. Formulaire d'inscription à l'annuaire (page annuaire.html)
// --------------------------------------------------------------------
function envoyerAnnuaire() {
  const lot = document.getElementById("a-lot").value;
  const nom1 = document.getElementById("a-nom1").value;
  const annee = document.getElementById("a-annee").value;
  const rgpd = document.getElementById("a-rgpd").checked;
  const visible = document.getElementById("a-visible").checked;
  if (!lot || !nom1 || !annee) { alert("Merci de remplir les champs obligatoires : lot, année, nom du résident 1."); return; }
  if (!rgpd) { alert("Merci d'accepter l'utilisation de vos données pour continuer."); return; }
  if (!visible) { alert("Merci de cocher la case de visibilité pour apparaître dans l'annuaire."); return; }
  alert("Votre demande d'inscription a bien été envoyée au bureau.\nVotre fiche sera ajoutée sous 5 jours ouvrés.\n\n(Version brouillon : envoi simulé)");
  ["a-lot", "a-annee", "a-nom1", "a-nom2", "a-autres"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("a-rgpd").checked = false;
  document.getElementById("a-visible").checked = false;
  document.getElementById("btn-annuaire").disabled = true;
}

// --------------------------------------------------------------------
// Initialisation au chargement de CHAQUE page
// --------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  // Active le bouton "Envoyer" du formulaire de contact seulement
  // une fois la case RGPD cochée (présent uniquement sur contact.html)
  const rgpd = document.getElementById("f-rgpd");
  const btn = document.getElementById("btn-envoyer");
  if (rgpd && btn) rgpd.addEventListener("change", () => (btn.disabled = !rgpd.checked));

  // Idem pour le formulaire d'inscription annuaire (annuaire.html)
  const argpd = document.getElementById("a-rgpd");
  const abtn = document.getElementById("btn-annuaire");
  if (argpd && abtn) argpd.addEventListener("change", () => (abtn.disabled = !argpd.checked));

  // Le bandeau "Flash Infos" est présent sur TOUTES les pages : on
  // charge donc toujours ses données, en plus de celles propres à la
  // page affichée (déterminée par l'attribut data-page sur <body>).
  chargerDonneesPage("toutes_pages");

  const page = document.body.dataset.page;
  if (page) chargerDonneesPage(page);
});
