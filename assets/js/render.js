/**
 * render.js — Gabarits d'affichage
 * ==================================
 * Une fonction de rendu par bloc dynamique. Chacune :
 *  - prend un id de conteneur DOM
 *  - va chercher ses données via DataLoader.getData(cle)
 *  - injecte le HTML correspondant
 *  - affiche un message d'erreur discret si la donnée est vide/indisponible
 *
 * Pour ajouter un nouveau bloc dynamique : créer le fichier
 * /data/ma_liste.js (en s'inspirant des fichiers existants), puis écrire ici
 * une fonction render_xxx() suivant le même schéma.
 */

(function () {
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function emptyMsg(label) {
    return `<p class="data-error">Aucune donnée "${esc(label)}" disponible pour le moment.</p>`;
  }

  async function render_flash_infos() {
    const data = await window.DataLoader.getData("flash_infos");
    const ticker = document.getElementById("flash-ticker");
    const list = document.getElementById("flashinfos-liste");
    if (!data.length) {
      if (ticker) { ticker.classList.remove("skeleton"); ticker.innerHTML = ""; }
      if (list) list.innerHTML = emptyMsg("Flash infos");
      return;
    }
    const itemHtml = (i) =>
      `<span class="flash-item"><span class="f-type ${esc(i.type)}">${esc(i.type)}</span> ${esc(i.texte)} <span class="f-date">— ${esc(i.source)}</span></span>`;
    if (ticker) {
      ticker.classList.remove("skeleton");
      ticker.innerHTML = data.map(itemHtml).join("") + data.map(itemHtml).join(""); // dupliqué pour le défilement continu
    }
    if (list) {
      list.innerHTML = data
        .map(
          (i) => `
        <div style="border-left:4px solid var(--${i.type === "alerte" ? "rouge" : i.type === "agenda" ? "vert-mid" : "bleu"}); background:#fafafa; border-radius:0 6px 6px 0; padding:14px 16px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="f-type ${esc(i.type)}" style="background:rgba(0,0,0,.08); padding:2px 8px; border-radius:10px;">${esc(i.type)}</span>
            <span style="font-size:.75rem; color:#888">${esc(i.date)}</span>
          </div>
          <p style="font-size:.9rem; margin:0">${esc(i.texte)}</p>
          <p style="font-size:.78rem; color:#888; margin-top:6px">Source : ${esc(i.source)}</p>
        </div>`
        )
        .join("");
    }
  }

  async function render_urgences_contacts() {
    const data = await window.DataLoader.getData("urgences_contacts");
    const el = document.getElementById("urgences-contacts");
    if (!el) return;
    if (!data.length) { el.innerHTML = emptyMsg("Contacts d'urgence"); return; }
    el.innerHTML = data
      .map(
        (c) => `
      <div class="contact-card ${c.urgence === true ? "urgence" : ""}">
        <div class="c-titre">${esc(c.icone)} ${esc(c.titre)}</div>
        <div class="c-tel">${esc(c.telephone)}</div>
        <div class="c-note">${esc(c.note)}</div>
      </div>`
      )
      .join("");
  }

  async function render_agenda() {
    const data = await window.DataLoader.getData("agenda");
    const el = document.getElementById("agenda-corps");
    if (!el) return;
    if (!data.length) { el.innerHTML = `<tr><td colspan="3">${emptyMsg("Agenda")}</td></tr>`; return; }
    el.innerHTML = data.map((d) => `<tr><td>${esc(d.date)}</td><td>${esc(d.evenement)}</td><td>${esc(d.details)}</td></tr>`).join("");
  }

  async function render_arrivees_departs() {
    const data = await window.DataLoader.getData("arrivees_departs");
    const el = document.getElementById("arrivees-departs-liste");
    if (!el) return;
    if (!data.length) { el.innerHTML = emptyMsg("Arrivées & départs"); return; }
    el.innerHTML = data.map((d) => `<li>${d.texte}</li>`).join(""); // texte autorisé avec balises <strong>
  }

  async function render_infos_generales() {
    const data = await window.DataLoader.getData("infos_generales");
    const el = document.getElementById("infos-generales-liste");
    if (!el) return;
    if (!data.length) { el.innerHTML = emptyMsg("Informations générales"); return; }
    el.innerHTML = data.map((d) => `<li>${esc(d.texte)}</li>`).join("");
  }

  async function render_faq() {
    const data = await window.DataLoader.getData("faq");
    const el = document.getElementById("faq-contenu");
    if (!el) return;
    if (!data.length) { el.innerHTML = emptyMsg("FAQ"); return; }
    const groups = {};
    data.forEach((q) => { (groups[q.categorie] = groups[q.categorie] || []).push(q); });
    el.innerHTML = Object.keys(groups)
      .map(
        (cat) => `
      <div class="content-block">
        <h3>${esc(cat)}</h3>
        ${groups[cat]
          .map(
            (q) => `
          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">${esc(q.question)}<span class="faq-chevron">▼</span></div>
            <div class="faq-reponse">${esc(q.reponse)}</div>
          </div>`
          )
          .join("")}
      </div>`
      )
      .join("");
  }

  async function render_bureau() {
    const data = await window.DataLoader.getData("bureau");
    const el = document.getElementById("bureau-grid");
    if (!el) return;
    if (!data.length) { el.innerHTML = emptyMsg("Bureau"); return; }
    el.innerHTML = data
      .map(
        (m) => `
      <div class="bureau-card ${m.referent === true ? "referent" : ""}">
        <div class="b-fonction">${esc(m.fonction)}</div>
        <div class="b-nom">${esc(m.nom)}</div>
        <div class="b-info">📍 ${esc(m.lot)}</div>
        <div class="b-info">📞 <a href="tel:${esc(m.telephone)}">${esc(m.telephone)}</a></div>
        <div class="b-info">✉️ <a href="mailto:${esc(m.email)}">${esc(m.email)}</a></div>
        <div class="b-info" style="margin-top:6px; font-size:.8rem; color:#888">${esc(m.role)}</div>
      </div>`
      )
      .join("");
  }

  async function render_annuaire() {
    const data = await window.DataLoader.getData("annuaire");
    const el = document.getElementById("annuaire-liste");
    if (!el) return;
    const visibles = data.filter((r) => r.visible === true || r.visible === "TRUE" || r.visible === "true");
    if (!visibles.length) { el.innerHTML = emptyMsg("Annuaire"); return; }
    el.innerHTML = visibles
      .map((r) => {
        const badges = String(r.badges || "")
          .split(",")
          .filter(Boolean)
          .map((b) => `<span class="a-badge ${b.includes("Artisan") ? "or" : ""}">${esc(b.trim())}</span>`)
          .join("");
        return `
        <div class="annuaire-item">
          <div class="a-lot">${esc(r.lot)}</div>
          <div class="a-nom">${esc(r.nom)}</div>
          <div class="a-ligne">📅 Depuis ${esc(r.depuis)}</div>
          <hr class="sep-resident">
          <div>${badges}</div>
          <div style="font-size:.8rem; color:#666; margin-top:6px">${esc(r.info)}</div>
        </div>`;
      })
      .join("");
  }

  // ──────────────────────────────────────────────────────────────────
  // Documents — contenu DYNAMIQUE provenant d'un dossier Google Drive
  // ──────────────────────────────────────────────────────────────────
  // Contrairement aux autres blocs de cette page (qui lisent un fichier
  // /data/xxx.js), le contenu n'est PAS stocké dans le site : la page
  // affiche directement la vue Google Drive du dossier configuré, dans
  // un cadre intégré (iframe). Pour ajouter/retirer un document, il
  // suffit d'ajouter/retirer le fichier dans le dossier Drive — aucune
  // modification du site n'est nécessaire, et aucune clé technique à
  // créer ou maintenir (contrairement à l'API Google Drive).
  //
  // Configuration requise : voir /data/google_drive_config.js
  // (uniquement l'identifiant du dossier).
  function render_all_documents() {
    const el1 = document.getElementById("documents-contenu");
    if (!el1) return;

    const cfg1 = (window.SITE_CONFIG && window.SITE_CONFIG.google_drive) || {};
    const dossierId = cfg1.dossier_id;

    render_documents(el1, dossierId1);

    const el2 = document.getElementById("documents-reglement-contenu");
    if (!el2) return;

    const cfg2 = (window.SITE_CONFIG && window.SITE_CONFIG.google_drive) || {};
    const dossierId2 = cfg2.reglement_dossier_id;

    render_documents(el2, dossierId2);
  }

  function render_documents(el, dossierId) {
    

    // Configuration absente ou laissée à la valeur d'exemple : message
    // d'aide pour le webmestre plutôt qu'un cadre vide.
    if (!dossierId || dossierId.startsWith("VOTRE_")) {
      el.innerHTML = `<div class="data-error">
        ⚠️ Le dossier Google Drive n'est pas encore configuré.<br>
        Ouvrez le fichier <code>data/google_drive_config.js</code> et suivez les instructions
        en commentaire pour renseigner l'identifiant du dossier.
      </div>`;
      return;
    }

    // "embeddedfolderview" est la vue Google Drive prévue pour être
    // intégrée dans une page tierce : elle affiche le contenu du
    // dossier (fichiers ET sous-dossiers, navigables) sans nécessiter
    // de clé API ni d'appel JavaScript à l'API Drive.
    const url = `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(dossierId)}#list`;
    el.innerHTML = `
      <div class="content-block" style="padding:0; overflow:hidden;">
        <iframe
          src="${esc(url)}"
          title="Documents — dossier Google Drive"
          style="width:100%; height:520px; border:0; display:block;"
          loading="lazy">
        </iframe>
      </div>`;
  }

  async function render_dechets_bacs() {
    const data = await window.DataLoader.getData("dechets_bacs");
    const el = document.getElementById("dechets-bacs-grid");
    if (!el) return;
    if (!data.length) { el.innerHTML = emptyMsg("Bacs de collecte"); return; }
    el.innerHTML = data
      .map(
        (b) => `
      <div class="poubelle-card ${esc(b.couleur)}">
        <div class="p-icon">${esc(b.icone)}</div>
        <div class="p-titre">${esc(b.titre)}</div>
        <div class="p-contenu">${esc(b.contenu)}</div>
        <div class="p-jour">📅 ${esc(b.jour)}</div>
      </div>`
      )
      .join("");
  }

  async function render_dechets_points_depot() {
    const data = await window.DataLoader.getData("dechets_points_depot");
    const el = document.getElementById("dechets-points-depot");
    if (!el) return;
    if (!data.length) { el.innerHTML = emptyMsg("Points de dépôt"); return; }
    el.innerHTML = data
      .map(
        (p) => `
      <div class="contact-card">
        <div class="c-titre">${esc(p.titre)}</div>
        <div class="c-tel" style="font-size:.9rem">${esc(p.lieu)}</div>
        <div class="c-note">${esc(p.note)}</div>
      </div>`
      )
      .join("");
  }

  async function render_prestataires_artisans() {
    const data = await window.DataLoader.getData("prestataires_artisans");
    const el = document.getElementById("prestataires-artisans-liste");
    if (!el) return;
    if (!data.length) { el.innerHTML = emptyMsg("Artisans recommandés"); return; }
    el.innerHTML = data.map((a) => `<li>${esc(a.icone)} ${esc(a.metier)} : ${esc(a.nom)}</li>`).join("");
  }

  // Carte de toutes les fonctions de rendu, indexées par nom de "page"
  // (= valeur de l'attribut data-page="..." posé sur <body> dans chaque
  // fichier .html). app.js lit cet attribut au chargement de la page et
  // n'exécute que les fonctions de rendu nécessaires à CETTE page —
  // c'est ce qui évite de charger inutilement toutes les données du
  // site sur chaque page.
  window.RenderMap = {
    // "toutes_pages" : fonctions à exécuter sur CHAQUE page, quel que
    // soit son contenu (ex : le bandeau Flash Infos en haut de toutes
    // les pages). Voir l'appel dans assets/js/app.js.
    toutes_pages: [render_flash_infos],
    accueil: [render_flash_infos],
    flashinfos: [render_flash_infos, render_agenda, render_arrivees_departs, render_infos_generales],
    urgences: [render_urgences_contacts],
    faq: [render_faq],
    bureau: [render_bureau],
    annuaire: [render_annuaire],
    documents: [render_all_documents],
    dechets: [render_dechets_bacs, render_dechets_points_depot],
    prestataires: [render_prestataires_artisans]
  };
})();
