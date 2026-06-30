/**
 * Configuration : Google Sheet (données du site)
 * ----------------------------------------------------------
 * Toutes les listes du site (Flash infos, Agenda, Urgences,
 * Bureau, Annuaire, FAQ, Déchets, Artisans, etc.) sont désormais
 * lues directement depuis UN SEUL Google Sheet hébergé sur Google
 * Drive — vous n'avez plus besoin de modifier le code du site
 * pour changer une info : il suffit d'éditer le Google Sheet et
 * le site se met à jour automatiquement (au rechargement de la
 * page, données mises en cache quelques secondes par le
 * navigateur).
 *
 * Le classeur fourni ("residence-data.xlsx") contient UN ONGLET
 * PAR LISTE, avec exactement le même nom que dans ce fichier :
 *   flash_infos, agenda, arrivees_departs, infos_generales,
 *   urgences_contacts, faq, bureau, annuaire, dechets_bacs,
 *   dechets_points_depot, prestataires_artisans
 * La première ligne de chaque onglet contient les en-têtes de
 * colonnes : NE LES MODIFIEZ PAS / NE LES RENOMMEZ PAS, sinon le
 * site ne saura plus retrouver les bonnes informations. Vous
 * pouvez par contre ajouter, supprimer ou modifier librement les
 * LIGNES (= les entrées).
 *
 * ────────────────────────────────────────────────────────────────────
 * COMMENT CONFIGURER (à faire une seule fois) :
 * ────────────────────────────────────────────────────────────────────
 *
 * 1) Importez le fichier "residence-data.xlsx" fourni dans votre
 *    Google Drive (clic droit dans Drive > Importer un fichier),
 *    PUIS ouvrez-le avec un double-clic : Drive le convertit
 *    automatiquement en Google Sheet natif. Vous pouvez ensuite
 *    supprimer le .xlsx d'origine, seul le Google Sheet compte.
 *
 * 2) Partagez ce Google Sheet en "Accessible à toute personne
 *    disposant du lien — Lecteur" (bouton Partager > Accès général
 *    > "Tous les utilisateurs disposant du lien").
 *    ⚠️ Sans ce partage public en lecture, le site ne pourra PAS
 *    lire les données (et inversement : ce partage rend les
 *    informations du fichier lisibles par toute personne ayant
 *    le lien direct — n'y mettez donc pas de donnée confidentielle
 *    type mot de passe).
 *
 * 3) Récupérez l'identifiant du fichier : ouvrez le Google Sheet
 *    dans votre navigateur, l'identifiant est la suite de
 *    caractères au milieu de l'URL, par exemple :
 *    https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit
 *                                            └────── spreadsheet_id ──┘
 *
 * 4) Collez cet identifiant ci-dessous, puis enregistrez le fichier.
 *    Rechargez n'importe quelle page du site : les données doivent
 *    s'afficher.
 *
 * 5) Pour modifier une information plus tard : ouvrez le Google
 *    Sheet, allez sur l'onglet concerné, modifiez la ligne, c'est
 *    tout — aucune intervention sur le site n'est nécessaire.
 * ────────────────────────────────────────────────────────────────────
 */
window.SITE_CONFIG = window.SITE_CONFIG || {};
window.SITE_CONFIG.google_sheet = {
  "spreadsheet_id": "VOTRE_ID_DE_FICHIER"
};
