/**
 * Mekhi Studio -> Google Sheets submissions.
 * Paste into Extensions > Apps Script while viewing the parent dashboard.
 * Run setupMekhiSync() once, then deploy as a Web app.
 * DO NOT put the generated token in GitHub or any published HTML.
 */
const TAB_NAME = 'Submission Log';
const KEY_PROP = 'MEKHI_STUDIO_TOKEN';
const SHEET_PROP = 'MEKHI_STUDIO_SHEET_ID';
const HEADERS = [
  'Date','Lesson ID','Area','Assignment','Status','Correct','Total','Score',
  'Start independently?','Support level','Evidence / notes','Reviewed by',
  'Submission ID','Practical review'
];

function setupMekhiSync() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error('Open the parent Google Sheet first, then Extensions > Apps Script.');
  const sheet = book.getSheetByName(TAB_NAME);
  if (!sheet) throw new Error('Could not find the Submission Log tab.');
  const props = PropertiesService.getScriptProperties();
  props.setProperty(SHEET_PROP, book.getId());
  let token = props.getProperty(KEY_PROP);
  if (!token) {
    token = Utilities.getUuid().replace(/-/g,'') + Utilities.getUuid().replace(/-/g,'');
    props.setProperty(KEY_PROP, token);
  }
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange('H2:H').setNumberFormat('0%');
  console.log('SYNC TOKEN — copy only to Mekhi Studio Settings (keep private): ' + token);
  console.log('Dashboard connected: ' + book.getName());
}

function text_(v, length) {
  let s = String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,length);
  // Escape spreadsheet-formula prefixes in untrusted text.
  if (/^[=+@-]/.test(s)) s = "'" + s;
  return s;
}

function result_(nonce, ok, message) {
  const obj = {
    type: 'MEKHI_STUDIO_SYNC',
    nonce: String(nonce || '').slice(0,100).replace(/[^A-Za-z0-9_-]/g,''),
    ok: !!ok,
    error: String(message || '').slice(0,130)
  };
  const safe = JSON.stringify(obj).replace(/</g,'\\u003c');
  const html = '<!doctype html><meta charset="utf-8"><script>window.parent.postMessage(' +
    safe + ', "*");<\\/script>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  let nonce = '';
  try {
    if (!e || !e.parameter || typeof e.parameter.payload !== 'string' ||
        e.parameter.payload.length > 3500) throw new Error('Bad request');
    const p = JSON.parse(e.parameter.payload);
    nonce = String(p.nonce || '').slice(0,100).replace(/[^A-Za-z0-9_-]/g,'');
    const props = PropertiesService.getScriptProperties();
    const expected = props.getProperty(KEY_PROP);
    const sheetId = props.getProperty(SHEET_PROP);
    if (!expected || !sheetId || p.key !== expected) throw new Error('Not authorized');
    if (p.type === 'test') return result_(nonce,true,'Test successful');
    if (p.type !== 'lesson' && p.type !== 'road') throw new Error('Unknown submission type');
    const uid = text_(p.uid,90), lessonId = text_(p.id,35);
    if (!/^m[a-z0-9-]+$/i.test(uid)) throw new Error('Invalid submission ID');
    if (!/^(W\d{2}D[1-5]|G1SPRINT-\d{4}-\d{2}-\d{2})$/.test(lessonId)) throw new Error('Invalid lesson code');
    const correct = Number(p.correct), total = Number(p.total);
    if (!Number.isInteger(correct) || !Number.isInteger(total) ||
        total < 0 || total > 20 || correct < 0 || correct > total) throw new Error('Invalid score');
    const date = new Date(p.date);
    if (Number.isNaN(date.valueOf())) throw new Error('Invalid date');
    const started = ['I started myself','My phone reminder helped me'].includes(p.startType) ? 'Yes' : 'No';
    const review = ['Not reviewed','Demonstrated independently','Demonstrated with support','Repeat practice'].includes(p.review) ? p.review : 'Not reviewed';
    const row = [
      date,lessonId,text_(p.area,40),text_(p.title,150),
      total ? (correct/total >= 0.8 ? 'Completed' : 'Needs review') : 'Practice',
      correct,total,total ? correct/total : '',started,
      text_(p.support,90),'','',uid,review
    ];
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(TAB_NAME);
      if (!sheet) throw new Error('Submission Log tab is missing');
      const last = sheet.getLastRow();
      const match = last > 1 ? sheet.getRange(2, 13, last-1, 1)
        .createTextFinder(uid).matchEntireCell(true).findNext() : null;
      const target = match ? match.getRow() : last + 1;
      sheet.getRange(target,1,1,row.length).setValues([row]);
      sheet.getRange(target,1).setNumberFormat('mmm d, yyyy h:mm AM/PM');
      sheet.getRange(target,8).setNumberFormat('0%');
    } finally {
      lock.releaseLock();
    }
    return result_(nonce,true,'Saved');
  } catch (err) {
    console.error('Mekhi sync error: ' + String(err).slice(0,140));
    return result_(nonce,false,'Submission not saved. Check configuration.');
  }
}
