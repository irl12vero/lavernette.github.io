# Guide — Recevoir les messages du formulaire de contact

Ce guide explique comment configurer, **une seule fois**, la réception des
messages envoyés depuis la page `contact.html`. Une fois en place, chaque
message envoyé par un copropriétaire :

1. est ajouté comme nouvelle ligne dans un onglet **"messages"** de votre
   Google Sheet (le même fichier que celui utilisé pour tout le reste du
   site) ;
2. déclenche un **email de notification** envoyé automatiquement à
   l'adresse du bureau.

Aucune compétence technique particulière n'est nécessaire, juste suivre les
étapes ci-dessous dans l'ordre.

---

## Étape 1 — Ouvrir l'éditeur de script

1. Ouvrez votre Google Sheet (celui déjà utilisé par le site — voir
   `data/google_sheet_config.js`).
2. Menu **Extensions > Apps Script**.
3. Une nouvelle fenêtre s'ouvre avec un fichier `Code.gs` vide (ou avec du
   code d'exemple) : **supprimez tout le contenu existant**.

## Étape 2 — Coller le code

Copiez-collez le code ci-dessous dans `Code.gs`, puis **remplacez**
`bureau@votre-domaine.fr` par la vraie adresse email du bureau de
copropriété (ligne indiquée par `// <-- À MODIFIER`).

Ce code gère **les deux formulaires du site** : celui de la page Contact
et celui de la page Annuaire (inscription d'un copropriétaire). Chaque
formulaire écrit dans son propre onglet du Google Sheet et déclenche son
propre email de notification.

```javascript
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);
  var destinataire = 'bureau@votre-domaine.fr'; // <-- À MODIFIER

  if (data.type === 'annuaire') {
    traiterAnnuaire(ss, data, destinataire);
  } else {
    traiterContact(ss, data, destinataire);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function traiterContact(ss, data, destinataire) {
  var sheet = ss.getSheetByName('messages');
  if (!sheet) {
    sheet = ss.insertSheet('messages');
    sheet.appendRow(['Date', 'Catégorie', 'Lot', 'Email', 'Message', 'Autorise FAQ']);
  }

  sheet.appendRow([
    new Date(),
    data.categorie || '',
    data.lot || '',
    data.email || '',
    data.message || '',
    data.faq ? 'Oui' : 'Non'
  ]);

  MailApp.sendEmail({
    to: destinataire,
    subject: 'Nouveau message (' + (data.categorie || 'sans catégorie') + ') — Résidences La V.',
    body:
      'Un nouveau message a été envoyé depuis le site.\n\n' +
      'Catégorie : ' + (data.categorie || '-') + '\n' +
      'Lot : ' + (data.lot || '-') + '\n' +
      'Email du copropriétaire : ' + (data.email || '-') + '\n\n' +
      'Message :\n' + (data.message || '-') + '\n\n' +
      '(Le message est aussi enregistré dans l\'onglet "messages" du Google Sheet.)'
  });
}

function traiterAnnuaire(ss, data, destinataire) {
  var sheet = ss.getSheetByName('demandes_annuaire');
  if (!sheet) {
    sheet = ss.insertSheet('demandes_annuaire');
    sheet.appendRow(['Date', 'Lot', 'Nom 1', 'Nom 2', 'Année d\'emménagement', 'Autres infos']);
  }

  sheet.appendRow([
    new Date(),
    data.lot || '',
    data.nom1 || '',
    data.nom2 || '',
    data.annee || '',
    data.autres || ''
  ]);

  MailApp.sendEmail({
    to: destinataire,
    subject: 'Nouvelle demande d\'inscription à l\'annuaire — Lot ' + (data.lot || '?'),
    body:
      'Une nouvelle demande d\'inscription à l\'annuaire a été envoyée depuis le site.\n\n' +
      'Lot : ' + (data.lot || '-') + '\n' +
      'Résident 1 : ' + (data.nom1 || '-') + '\n' +
      'Résident 2 : ' + (data.nom2 || '-') + '\n' +
      'Année d\'emménagement : ' + (data.annee || '-') + '\n' +
      'Autres infos : ' + (data.autres || '-') + '\n\n' +
      '(Cette demande est aussi enregistrée dans l\'onglet "demandes_annuaire" du Google Sheet.\n' +
      'Pensez à recopier la ligne validée dans l\'onglet "annuaire" pour qu\'elle apparaisse sur le site.)'
  });
}
```

Cliquez sur l'icône **disquette** (ou Ctrl/Cmd+S) pour enregistrer.

## Étape 3 — Déployer comme "Application Web"

1. En haut à droite, cliquez sur **Déployer > Nouveau déploiement**.
2. Cliquez sur l'icône en forme d'engrenage à côté de "Sélectionner le
   type", choisissez **Application Web**.
3. Renseignez :
   - **Exécuter en tant que** : Moi (votre compte Google)
   - **Qui a accès** : Tout le monde
4. Cliquez sur **Déployer**.
5. Google va demander une **autorisation** (car le script envoie des
   emails et modifie le Sheet en votre nom) : cliquez sur "Autoriser
   l'accès", choisissez votre compte, puis "Avancé > Accéder à [nom du
   projet] (dangereux)" si un avertissement standard de Google apparaît
   (c'est normal pour tout script Apps Script non publié sur le
   Marketplace — vous êtes le seul auteur du script).
6. Une **URL** de type `https://script.google.com/macros/s/AKfycb.../exec`
   s'affiche : **copiez-la**.

## Étape 4 — Coller l'URL dans le site

1. Ouvrez le fichier `data/google_contact_config.js`.
2. Remplacez `URL_DE_VOTRE_WEB_APP_ICI` par l'URL copiée à l'étape
   précédente :

```javascript
window.SITE_CONFIG.contact_form_endpoint = "https://script.google.com/macros/s/AKfycb.../exec";
```

3. Enregistrez, republiez le site (commit + push si hébergé sur GitHub
   Pages).

C'est terminé : testez en envoyant un message depuis la page Contact du
site, vous devriez recevoir l'email quelques secondes après, et voir la
ligne apparaître dans l'onglet "messages" du Google Sheet.

---

## Si vous modifiez le code plus tard

Si un jour vous modifiez le code de `Code.gs` (par exemple pour ajouter un
champ), il faut créer un **nouveau déploiement** (Déployer > Gérer les
déploiements > icône crayon > Nouvelle version) pour que les changements
soient pris en compte. L'URL reste la même si vous éditez une version
existante ; elle change seulement si vous créez un tout nouveau
déploiement.

## Confidentialité

Les messages contiennent des données personnelles (email, éventuellement
des informations sur le lot). L'onglet "messages" n'est accessible qu'aux
personnes ayant accès en édition à votre Google Sheet — contrairement aux
autres onglets, il n'a pas besoin d'être partagé publiquement, donc rien
à changer de ce côté.
