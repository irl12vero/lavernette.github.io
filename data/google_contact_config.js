/**
 * Configuration : réception des messages du formulaire de contact
 * ----------------------------------------------------------------
 * Le formulaire de la page contact.html envoie les messages à une
 * "Web App" Google Apps Script, qui :
 *   1) ajoute une ligne dans l'onglet "messages" de votre Google Sheet
 *      (le même fichier que celui utilisé pour tout le reste du site),
 *   2) vous envoie un email de notification à chaque nouveau message.
 *
 * ────────────────────────────────────────────────────────────────
 * COMMENT CONFIGURER (à faire une seule fois) — voir le guide complet
 * dans GUIDE-FORMULAIRE-CONTACT.md à la racine du site.
 * ────────────────────────────────────────────────────────────────
 * 1) Ouvrez votre Google Sheet > Extensions > Apps Script.
 * 2) Collez le code fourni dans GUIDE-FORMULAIRE-CONTACT.md,
 *    remplacez l'adresse email de notification par la vôtre.
 * 3) Déployez (Déployer > Nouveau déploiement > Application Web,
 *    "Exécuter en tant que : Moi", "Qui a accès : Tout le monde").
 * 4) Copiez l'URL de déploiement obtenue et collez-la ci-dessous.
 */
window.SITE_CONFIG = window.SITE_CONFIG || {};
window.SITE_CONFIG.contact_form_endpoint = "URL_DE_VOTRE_WEB_APP_ICI";
