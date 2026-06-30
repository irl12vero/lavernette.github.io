# Résidences La V. — Espace copropriétaires

Architecture simple et modulaire : HTML / CSS / JS séparés, images dans un
répertoire dédié, et contenus dynamiques (listes, contacts, FAQ...) lus
directement depuis **un Google Sheet hébergé sur Google Drive** — modifiable
par le bureau sans toucher au code, et **sans avoir besoin d'un serveur
web** : il suffit d'ouvrir `index.html` dans un navigateur (une connexion
internet est nécessaire pour charger les données depuis Google Sheets).

## 1. Arborescence

```
index.html                  → squelette de page + conteneurs vides pour le contenu dynamique
assets/
  css/style.css              → toute la feuille de style
  js/
    app.js                   → navigation entre "pages", FAQ, formulaires
    data.js                  → accès aux données (lecture de window.SITE_DATA)
    render.js                → gabarits HTML générés à partir des données
  img/
    logo/logo.png             → logo (à remplacer par votre fichier)
    guide-eau/*.png            → photos du guide pratique eau du canal (placeholders à remplacer)
data/
  google_sheet_config.js      → identifiant du Google Sheet (TOUTES les listes)
  google_drive_config.js      → identifiant du dossier Drive (page Documents)
residence-data.xlsx           → classeur à importer dans Google Drive, contient
                                 un onglet par liste, déjà rempli avec les
                                 données actuelles du site
```

## 2. Gérer les images

Toutes les images vivent dans `assets/img/`. Pour changer une image,
**remplacez simplement le fichier en gardant le même nom** (ou changez le
`src` correspondant dans `index.html`). Aucune autre modification n'est
nécessaire.

- `assets/img/logo/logo.png` : logo affiché dans l'en-tête.
- `assets/img/guide-eau/*.png` : photos du guide pas-à-pas (relevé /
  remplacement du compteur, vannes, calendrier déchets). Ce sont
  actuellement des images de substitution (placeholders) — remplacez-les
  par de vraies photos (jpg/png/webp fonctionnent aussi, il suffit
  d'adapter l'extension dans le `src` de la balise `<img>` concernée dans
  `index.html`).

Le site n'utilise plus aucune image encodée en dur dans le HTML : tout
passe par des balises `<img src="assets/img/...">`, donc un changement de
fichier se voit immédiatement, sans toucher au code.

## 3. Gérer les contenus dynamiques (listes, contacts, numéros...)

Toutes les listes affichées sur le site (Flash infos, Agenda, Urgences,
Bureau, Annuaire, FAQ, Déchets, Artisans...) sont lues depuis **un seul
Google Sheet**, hébergé sur Google Drive. Pour ajouter, retirer ou
modifier une information, il suffit d'ouvrir ce Google Sheet, d'aller
sur l'onglet concerné, et de modifier une ligne — **jamais besoin de
toucher au HTML ni au code du site**.

### Mise en place (une seule fois)

1. Le fichier `residence-data.xlsx` (fourni avec le site) contient déjà
   un onglet par liste, rempli avec les données actuelles du site.
   Importez-le dans votre Google Drive (clic droit > Importer un
   fichier), puis ouvrez-le : Drive le convertit automatiquement en
   Google Sheet natif.
2. Partagez ce Google Sheet en "Accessible à toute personne disposant
   du lien — Lecteur" (bouton Partager > Accès général).
3. Copiez l'identifiant du fichier dans l'URL
   (`https://docs.google.com/spreadsheets/d/IDENTIFIANT/edit`) et
   collez-le dans `data/google_sheet_config.js` (voir les instructions
   en commentaire dans ce fichier).
4. Rechargez n'importe quelle page du site : les données doivent
   s'afficher.

### Table de correspondance onglet → affichage

| Onglet du Google Sheet           | Alimente…                                     |
|----------------------------------|------------------------------------------------|
| `flash_infos`                    | Bandeau défilant + page Flash Infos             |
| `agenda`                         | Tableau "Prochaines dates"                      |
| `arrivees_departs`               | Liste arrivées / départs                        |
| `infos_generales`                | Liste informations générales                    |
| `urgences_contacts`              | Cartes de contacts d'urgence (numéros affichés) |
| `faq`                            | Questions / réponses (groupées par catégorie)   |
| `bureau`                         | Fiches des membres du bureau                    |
| `annuaire`                       | Annuaire des résidents (filtré sur `visible`)   |
| `dechets_bacs`                   | Cartes des 3 bacs de collecte                   |
| `dechets_points_depot`           | Points de dépôt (verre, textile, compost)       |
| `prestataires_artisans`          | Liste des artisans recommandés                  |

(`data/google_drive_config.js` reste à part : il configure le **dossier**
Google Drive affiché sur la page Documents, voir section 5 — ce n'est pas
une liste de données.)

### Comment ajouter / modifier une entrée ?

Ouvrez l'onglet concerné dans le Google Sheet. La première ligne contient
les en-têtes de colonnes (NE LES MODIFIEZ PAS, le site s'en sert pour
retrouver les bonnes informations). Ajoutez ou modifiez librement les
lignes suivantes.

- Pour l'annuaire (onglet `annuaire`), seules les fiches avec la colonne
  `visible` à `TRUE` sont affichées sur le site — utile pour préparer une
  fiche sans la publier tout de suite.
- Pour les cases "oui/non" (`visible`, `referent`, `urgence`), écrivez
  `TRUE` ou `FALSE` dans la cellule (majuscules ou minuscules, peu
  importe).

Après modification, **rechargez simplement la page du site dans le
navigateur** (F5) : les nouvelles données s'affichent en quelques
secondes, sans aucune compilation ni redéploiement.

### Pourquoi un Google Sheet et pas des fichiers `.js` ?

Cela permet au bureau de modifier les informations directement dans une
interface de tableur, sans éditeur de texte ni connaissance du code, et
sans avoir à renvoyer un fichier au webmestre à chaque changement. Le
site lit les données via l'export CSV public de Google Sheets (aucune clé
technique ni compte développeur requis), exactement comme la page
Documents intègre déjà un dossier Google Drive.

## 4. Architecture modulable — pour aller plus loin

- **Ajouter une nouvelle liste dynamique** : créez `data/ma_liste.js` (en
  s'inspirant des fichiers existants), ajoutez la balise
  `<script src="data/ma_liste.js"></script>` dans `index.html` (juste
  avant `assets/js/data.js`), écrivez une fonction `render_ma_liste()`
  dans `assets/js/render.js` qui appelle
  `window.DataLoader.getData("ma_liste")`, ajoutez-la dans `RenderMap`,
  puis créez le conteneur HTML correspondant (ex.
  `<div id="ma-liste"></div>`).
- **Ajouter une nouvelle page** : dupliquez un bloc `<div id="page-xxx"
  class="page">` dans `index.html`, ajoutez le lien dans la `<nav>`, et
  reliez son rendu dynamique éventuel dans `RenderMap`.
- **Ajouter un nouvel onglet au Google Sheet** : créez l'onglet dans le
  fichier (même nom que la clé voulue), ajoutez une ligne d'en-têtes,
  écrivez une fonction `render_ma_liste()` dans `assets/js/render.js` qui
  appelle `await window.DataLoader.getData("ma_liste")`, ajoutez-la dans
  `RenderMap`, puis créez le conteneur HTML correspondant (ex.
  `<div id="ma-liste"></div>`).
- **Passer à une vraie base de données plus tard** (si une interface
  d'administration plus riche devient nécessaire) : il suffira de
  remplacer le contenu de la fonction `getData()` dans
  `assets/js/data.js` par un autre appel (API, etc.) — aucune autre
  partie du site n'a besoin de changer, car `render.js` et `app.js` ne
  connaissent jamais la source réelle des données.
- Le CSS est centralisé dans `assets/css/style.css` (variables de
  couleurs en haut de fichier via `:root`) : un changement de charte
  graphique se fait à un seul endroit.

## 5. Page Documents — dossier Google Drive intégré

Contrairement aux autres listes du site, la page `documents.html`
n'est **pas** alimentée par un fichier `/data/xxx.js` : elle affiche
directement le dossier Google Drive choisi par le bureau, intégré dans
la page. Ajouter ou retirer un document se fait donc directement dans
Google Drive, sans toucher au site.

- Le dossier Google Drive (avec ses sous-dossiers éventuels, ex.
  "Comptes-rendus AG", "Budgets & comptes") reste navigable directement
  depuis le site, dans le cadre intégré.
- Configuration (identifiant du dossier uniquement, à faire une seule
  fois — **aucune clé technique requise**) : voir les instructions en
  commentaire dans `data/google_drive_config.js`.
- Le dossier Google Drive doit être partagé en "Accessible à toute
  personne disposant du lien" pour que le site puisse l'afficher — donc
  à réserver aux documents qui peuvent être consultés par toute
  personne disposant du lien direct du site.

## 6. Limitations connues

- Le formulaire de contact et le formulaire d'inscription à l'annuaire
  simulent l'envoi (`alert()`) — il n'y a pas encore de connexion à un
  service d'envoi réel (formulaire serveur, Formspree, etc.).
- La page Documents nécessite une connexion internet (chargement du
  dossier Google Drive) ; sans configuration ou sans réseau, un message
  explicatif s'affiche à la place du dossier.
- Toutes les autres listes du site nécessitent désormais elles aussi une
  connexion internet (lecture du Google Sheet) ; sans configuration ou
  sans réseau, un message discret s'affiche à la place de chaque liste
  (voir la console du navigateur pour le détail de l'erreur).
