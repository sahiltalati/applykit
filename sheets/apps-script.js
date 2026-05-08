/**
 * ApplyKit — Google Apps Script
 *
 * Deploy this as a Web App to get a webhook URL for the Chrome extension.
 *
 * Setup:
 *   1. Open Google Sheets → Extensions → Apps Script
 *   2. Paste this entire file into the editor (replace any existing code)
 *   3. Click Deploy → New deployment → Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   4. Authorize and copy the deployment URL
 *   5. Paste that URL into the ApplyKit extension settings
 */

const SHEET_NAME = 'Applications';

const COLUMNS = ['Date Applied', 'Company', 'Role', 'Location', 'Status', 'Job URL', 'Notes', 'Logged At'];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);

    // Style the header row
    const header = sheet.getRange(1, 1, 1, COLUMNS.length);
    header.setBackground('#6366f1');
    header.setFontColor('#ffffff');
    header.setFontWeight('bold');
    sheet.setFrozenRows(1);

    // Set column widths
    sheet.setColumnWidth(1, 110); // Date Applied
    sheet.setColumnWidth(2, 160); // Company
    sheet.setColumnWidth(3, 220); // Role
    sheet.setColumnWidth(4, 110); // Status
    sheet.setColumnWidth(5, 280); // Job URL
    sheet.setColumnWidth(6, 200); // Notes
    sheet.setColumnWidth(7, 160); // Logged At
  }

  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const sheet = getOrCreateSheet();
    sheet.appendRow([
      data.date || new Date().toISOString().split('T')[0],
      data.company || '',
      data.role || '',
      data.location || '',
      data.status || 'Applied',
      data.url || '',
      data.notes || '',
      new Date().toLocaleString(),
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET handler — lets you verify the script is deployed correctly
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ApplyKit webhook is active' }))
    .setMimeType(ContentService.MimeType.JSON);
}
