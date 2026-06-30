/**
 * Configuration : Google Drive (page Documents)
 * ----------------------------------------------------------
 * La page "Documents" (documents.html) affiche directement le contenu
 * d'un dossier Google Drive — vous n'avez plus besoin de modifier le
 * site pour ajouter un compte-rendu, un budget ou un guide : il suffit
 * de DÉPOSER LE FICHIER DANS LE DOSSIER GOOGLE DRIVE et il apparaît
 * automatiquement sur le site. Les sous-dossiers (ex : "Comptes-rendus
 * AG", "Budgets") restent navigables directement depuis le site.
 *
 * Aucune clé technique n'est nécessaire (pas de "clé API", pas de
 * compte développeur Google Cloud) : la page intègre simplement la vue
 * Google Drive du dossier, comme un site peut intégrer une carte ou
 * une vidéo.
 *
 * ────────────────────────────────────────────────────────────────────
 * COMMENT CONFIGURER (à faire une seule fois) :
 * ────────────────────────────────────────────────────────────────────
 *
 * 1) Créez (ou choisissez) un dossier Google Drive contenant vos
 *    documents, organisé avec des sous-dossiers si vous le souhaitez.
 *
 * 2) Partagez ce dossier en "Accessible à toute personne disposant du
 *    lien — Lecteur" (clic droit sur le dossier > Partager > Accès
 *    général > "Tous les utilisateurs disposant du lien").
 *    ⚠️ Sans ce partage public, le site ne pourra PAS afficher le
 *    contenu du dossier (et inversement : ce partage rend les
 *    documents lisibles par toute personne ayant le lien direct vers
 *    le site — n'y mettez donc pas de document strictement
 *    confidentiel).
 *
 * 3) Récupérez l'identifiant du dossier : ouvrez le dossier dans votre
 *    navigateur, l'identifiant est la suite de caractères à la fin de
 *    l'URL, par exemple :
 *    https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
 *                                            └──────────── dossier_id ─┘
 *
 * 4) Collez cet identifiant ci-dessous, puis enregistrez le fichier.
 *    Rechargez la page documents.html : le dossier doit s'afficher.
 * ────────────────────────────────────────────────────────────────────
 * https://drive.google.com/drive/folders/16r4m5_LRRhEPDLj2fdy1gifO06YNf0tH?usp=sharing
 */
window.SITE_CONFIG = window.SITE_CONFIG || {};
window.SITE_CONFIG.google_drive = {
  "dossier_id": "16r4m5_LRRhEPDLj2fdy1gifO06YNf0tH"
};
