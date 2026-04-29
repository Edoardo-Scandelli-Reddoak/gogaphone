/**
 * Gogaphone — ricezione lead dalla landing page
 *
 * Da incollare in: Estensioni → Apps Script (dal foglio Google)
 * Poi: Distribuisci → Nuova distribuzione → Tipo: App Web
 *   - Esegui come: Me
 *   - Chi può accedere: Chiunque (anche anonimo)
 * Copiare l'URL dell'app web e incollarlo come APPS_SCRIPT_URL
 * nello script della landing page.
 *
 * Il foglio "campagna maggio" viene creato automaticamente al primo
 * invio se non esiste, con l'intestazione delle colonne.
 */

const SHEET_NAME = 'campagna maggio';
const HEADERS = [
  'Timestamp',
  'Nome e Cognome',
  'Telefono',
  'Email',
  'Indirizzo',
  'Tipo di interesse'
];

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Crea header se la prima cella è vuota
    if (!sheet.getRange(1, 1).getValue()) {
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setValues([HEADERS])
        .setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const p = e.parameter || {};
    sheet.appendRow([
      new Date(),
      p.nome || '',
      p.telefono || '',
      p.email || '',
      p.indirizzo || '',
      p.interesse || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Gogaphone lead endpoint OK');
}
