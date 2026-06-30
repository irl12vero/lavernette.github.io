/**
 * Configuration : Google Drive (page Documents)
 * ----------------------------------------------------------
 * La page "Documents" (documents.html) affiche le contenu de DEUX
 * dossiers Google Drive distincts :
 *   1. "dossier_id"           -> Comptes-rendus (AG, bureau, etc.)
 *   2. "reglement_dossier_id" -> Règlement de copropriété et avenants
 * Vous n'avez plus besoin de modifier le site pour ajouter un
 * document : il suffit de DÉPOSER LE FICHIER DANS LE DOSSIER GOOGLE
 * DRIVE concerné et il apparaît automatiquement sur le site.
 *
 * Chaque liste affiche jusqu'à 10 documents ; la hauteur du bloc
 * s'adapte au nombre réel de fichiers. Au-delà de 10 documents, la
 * hauteur est figée et un ascenseur (scroll vertical) apparaît pour
 * accéder aux fichiers supplémentaires.
 *
 * ────────────────────────────────────────────────────────────────────
 * COMMENT CONFIGURER (à faire une seule fois) :
 * ────────────────────────────────────────────────────────────────────
 *
 * 1) Créez (ou choisissez) DEUX dossiers Google Drive : un pour les
 *    comptes-rendus, un pour le règlement de copropriété.
 *
 * 2) Partagez CHAQUE dossier en "Accessible à toute personne disposant
 *    du lien — Lecteur" (clic droit sur le dossier > Partager > Accès
 *    général > "Tous les utilisateurs disposant du lien").
 *    ⚠️ Sans ce partage public, le site ne pourra PAS afficher le
 *    contenu du dossier (et inversement : ce partage rend les
 *    documents lisibles par toute personne ayant le lien direct vers
 *    le site — n'y mettez donc pas de document strictement
 *    confidentiel).
 *
 * 3) Récupérez l'identifiant de CHAQUE dossier : ouvrez le dossier
 *    dans votre navigateur, l'identifiant est la suite de caractères
 *    à la fin de l'URL, par exemple :
 *    https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
 *                                            └──────────── dossier_id ─┘
 *
 * 4) Créez une clé API Google (nécessaire pour LISTER les fichiers
 *    d'un dossier et donc adapter automatiquement la hauteur / limiter
 *    à 10 documents) :
 *      a. Allez sur https://console.cloud.google.com/
 *      b. Créez un projet (ou choisissez-en un existant)
 *      c. Menu "API et services" > "Bibliothèque" > activez
 *         "Google Drive API"
 *      d. Menu "API et services" > "Identifiants" > "Créer des
 *         identifiants" > "Clé API"
 *      e. (Recommandé) Restreignez cette clé :
 *         - Restriction d'application : "Sites web", ajoutez l'adresse
 *           de votre site (ex : votre-site.fr/*)
 *         - Restriction d'API : limitez-la à "Google Drive API"
 *      f. Copiez la clé obtenue ci-dessous dans "api_key".
 *    Cette clé ne donne accès qu'en LECTURE aux dossiers publics que
 *    vous avez vous-même partagés ; elle ne permet ni modification,
 *    ni accès à des fichiers privés.
 *
 * 5) Collez les identifiants et la clé ci-dessous, puis enregistrez
 *    le fichier. Rechargez la page documents.html : les deux listes
 *    doivent s'afficher.
 * ────────────────────────────────────────────────────────────────────
 */
window.SITE_CONFIG = window.SITE_CONFIG || {};
window.SITE_CONFIG.google_drive = {
  "dossier_id": "VOTRE_ID_DE_DOSSIER_COMPTES_RENDUS",
  "reglement_dossier_id": "VOTRE_ID_DE_DOSSIER_REGLEMENT",
  "api_key": "VOTRE_CLE_API_GOOGLE_DRIVE"
};
