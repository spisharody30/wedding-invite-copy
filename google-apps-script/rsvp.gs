/**
 * Wedding RSVP → Google Sheet (Google Apps Script)
 *
 * SETUP
 * 1. Open your RSVP Google Sheet → Extensions → Apps Script.
 * 2. Replace the default Code.gs contents with this file (or rename to Code.gs).
 * 3. In the sheet, row 1 headers (exact order recommended):
 *    Timestamp | Name | Guests | Source | SubmittedAt
 * 4. Deploy → New deployment → Type: Web app
 *    Execute as: Me
 *    Who has access: Anyone
 * 5. Copy the Web App URL into index.html → RSVP_WEB_APP_URL
 *
 * The site sends POST body as JSON:
 * { name, guests, source, submittedAt }
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse({ ok: false, error: 'Server busy' }, 503);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Empty body' }, 400);
    }

    var data = JSON.parse(e.postData.contents);
    var name = String(data.name || '').trim();
    var guests = data.guests;
    var source = String(data.source || '').trim();
    var submittedAt = String(data.submittedAt || '').trim();

    if (!name) {
      return jsonResponse({ ok: false, error: 'Name required' }, 400);
    }
    if (guests === undefined || guests === null || guests === '' || isNaN(Number(guests))) {
      return jsonResponse({ ok: false, error: 'Guests required' }, 400);
    }
    var guestNum = Number(guests);
    if (guestNum < 1 || guestNum > 10) {
      return jsonResponse({ ok: false, error: 'Guests must be 1–10' }, 400);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date(),
      name,
      guestNum,
      source,
      submittedAt
    ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {}
  }
}

/** Allow GET for a quick “is it deployed?” check in the browser. */
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, message: 'RSVP endpoint is running. Use POST with JSON body.' })
  ).setMimeType(ContentService.MimeType.JSON);
}

function jsonResponse(obj, statusCode) {
  statusCode = statusCode || 200;
  var out = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
  // Note: Apps Script Web App cannot set HTTP status codes for clients in all cases;
  // the JSON body still carries ok: true/false.
  return out;
}
