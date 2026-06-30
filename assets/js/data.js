/**
 * data.js — Couche d'accès aux données
 * =====================================
 * Toutes les listes du site (FAQ, contacts, bureau, annuaire, etc.) sont
 * désormais stockées dans UN SEUL Google Sheet (voir
 * data/google_sheet_config.js pour la configuration), un onglet du
 * classeur = une liste = une clé (ex : onglet "faq" -> getData("faq")).
 *
 * Pour modifier une liste : ouvrez le Google Sheet, éditez l'onglet
 * correspondant. Aucune modification du HTML ou du JavaScript n'est
 * nécessaire.
 *
 * Le reste du site (render.js) ne sait pas où sont stockées les
 * données : il appelle juste "await DataLoader.getData(cle)", qui
 * renvoie un tableau d'objets (un objet par ligne de l'onglet, les
 * clés de l'objet = les en-têtes de colonnes de la première ligne).
 *
 * Technique : chaque onglet est lu via l'export CSV public de Google
 * Sheets (endpoint "gviz/tq"), ce qui ne nécessite ni clé API, ni
 * compte développeur Google Cloud — seulement que le fichier soit
 * partagé en "Lecteur" pour "Tous les utilisateurs disposant du lien"
 * (voir data/google_sheet_config.js).
 */

(function () {
  const CACHE = {}; // clé -> tableau de résultats déjà chargés
  const PENDING = {}; // clé -> promesse de chargement en cours (anti doublon)

  // ------------------------------------------------------------------
  // Petit parseur CSV (gère les champs entre guillemets, les virgules
  // et retours à la ligne à l'intérieur d'un champ, et les guillemets
  // échappés "" -> ").
  // ------------------------------------------------------------------
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field); field = "";
      } else if (c === "\r") {
        // ignoré
      } else if (c === "\n") {
        row.push(field); rows.push(row); row = []; field = "";
      } else {
        field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // Convertit les chaînes "true"/"false"/"vrai"/"faux" en vrais booléens
  // (les autres valeurs restent des chaînes de caractères).
  function convertValue(v) {
    const t = (v || "").trim();
    if (/^(true|vrai)$/i.test(t)) return true;
    if (/^(false|faux)$/i.test(t)) return false;
    return t;
  }

  // Transforme les lignes CSV (tableau de tableaux) en tableau d'objets,
  // en utilisant la première ligne comme en-têtes de colonnes. Les
  // lignes entièrement vides sont ignorées (ex : lignes en fin d'onglet).
  function rowsToObjects(rows) {
    if (!rows.length) return [];
    const headers = rows[0].map((h) => h.trim());
    return rows
      .slice(1)
      .filter((r) => r.some((cell) => cell.trim() !== ""))
      .map((r) => {
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = convertValue(r[idx]); });
        return obj;
      });
  }

  function getSpreadsheetId() {
    const cfg = (window.SITE_CONFIG && window.SITE_CONFIG.google_sheet) || {};
    return cfg.spreadsheet_id;
  }

  // Charge un onglet ("sheet") du Google Sheet et le transforme en
  // tableau d'objets.
  async function fetchSheet(key) {
    const id = getSpreadsheetId();
    if (!id || id.startsWith("VOTRE_")) {
      throw new Error(
        "Google Sheet non configuré — renseignez data/google_sheet_config.js"
      );
    }
    const url =
      `https://docs.google.com/spreadsheets/d/${encodeURIComponent(id)}` +
      `/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(key)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `HTTP ${res.status} en lisant l'onglet "${key}" — vérifiez que le ` +
        `Google Sheet est bien partagé en "Lecteur" pour "Tous les ` +
        `utilisateurs disposant du lien", et que l'onglet "${key}" existe.`
      );
    }
    const csvText = await res.text();
    return rowsToObjects(parseCsv(csvText));
  }

  // Point d'entrée utilisé par render.js : await DataLoader.getData("xxx")
  async function getData(key) {
    if (CACHE[key]) return CACHE[key];
    if (!PENDING[key]) {
      PENDING[key] = fetchSheet(key)
        .then((data) => { CACHE[key] = data; return data; })
        .catch((err) => {
          console.warn(`[data.js] Impossible de charger "${key}" depuis le Google Sheet : ${err.message}`);
          return [];
        })
        .finally(() => { delete PENDING[key]; });
    }
    return PENDING[key];
  }

  window.DataLoader = { getData };
})();
