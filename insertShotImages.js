/**
 * Shot Image Inserter — Google Apps Script
 *
 * Reads JPG thumbnails from a Google Drive folder and inserts them as
 * floating images into the "Frame" column, matched by shot name from column "Name".
 *
 * Workflow:
 *  1. Upload your imgs/ folder to Google Drive (drag & drop in browser, or
 *     let Google Drive desktop app sync it automatically).
 *  2. Open the folder in Drive, copy its ID from the URL:
 *       https://drive.google.com/drive/folders/THIS_PART_IS_THE_ID
 *  3. Paste the ID in DRIVE_FOLDER_ID below.
 *  4. In Google Sheets: Extensions > Apps Script — paste this script, save.
 *  5. Refresh the sheet, then use the menu: VFX Tools > Insert Shot Images.
 *
 * Re-running the script is safe: existing images are cleared first.
 */

var CONFIG = {
  DRIVE_FOLDER_ID:    'YOUR_FOLDER_ID_HERE',  // ← replace with your Drive folder ID
  SHEET_NAME:         '',                      // leave empty to use the active sheet
  ROW_HEIGHT:         80,                      // px — height of rows that receive an image
  FRAME_COLUMN_WIDTH: 150,                     // px — width of the Frame column
};

// ---------------------------------------------------------------------------

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('VFX Tools')
    .addItem('Insert Shot Images', 'insertShotImages')
    .addSeparator()
    .addItem('Clear All Images', 'clearAllImages')
    .addToUi();
}

function insertShotImages() {
  var ui     = SpreadsheetApp.getUi();
  var sheet  = getSheet_();
  var folder = getDriveFolder_();
  if (!sheet || !folder) return;

  // Build filename → DriveFile map for all JPGs in the Drive folder
  var imageMap = {};
  var files = folder.getFilesByType(MimeType.JPEG);
  while (files.hasNext()) {
    var f = files.next();
    imageMap[f.getName()] = f;
  }
  Logger.log('JPGs found in Drive folder: ' + Object.keys(imageMap).length);

  // Locate header columns by name (robust to column reordering)
  var headers      = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var nameColIdx   = headers.indexOf('Name')  + 1;  // 1-based; 0 means not found
  var frameColIdx  = headers.indexOf('Frame') + 1;

  if (nameColIdx === 0) {
    ui.alert('Column "Name" not found in row 1. Make sure the tab-delimited file was imported with headers.');
    return;
  }
  if (frameColIdx === 0) {
    ui.alert('Column "Frame" not found in row 1.');
    return;
  }

  sheet.setColumnWidth(frameColIdx, CONFIG.FRAME_COLUMN_WIDTH);

  // Remove any images already in the Frame column (safe to re-run)
  clearColumnImages_(sheet, frameColIdx);

  // Read all shot names and insert matching images
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) { ui.alert('No data rows found.'); return; }

  var names    = sheet.getRange(2, nameColIdx, lastRow - 1, 1).getValues();
  var inserted = 0;
  var missing  = [];

  for (var i = 0; i < names.length; i++) {
    var name = String(names[i][0]).trim();
    if (!name) continue;

    var row  = i + 2;                             // 1-based row index (row 1 = header)
    var file = findImageByName_(imageMap, name);  // filename must contain the shot name

    if (file) {
      sheet.setRowHeight(row, CONFIG.ROW_HEIGHT);
      var blob = fetchThumbnail_(file);
      sheet.insertImage(blob, frameColIdx, row, 2, 2);
      inserted++;
    } else {
      missing.push(name);
    }
  }

  SpreadsheetApp.flush();

  var summary = 'Inserted ' + inserted + ' / ' + (inserted + missing.length) + ' images.';
  if (missing.length) summary += '\n\nNo image matched for:\n' + missing.join('\n');
  ui.alert('Done', summary, ui.ButtonSet.OK);
}

function clearAllImages() {
  var sheet = getSheet_();
  if (!sheet) return;
  var images = sheet.getImages();
  images.forEach(function(img) { img.remove(); });
  SpreadsheetApp.getUi().alert('All images removed from sheet.');
}

// ---------------------------------------------------------------------------
// Private helpers

function getSheet_() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = CONFIG.SHEET_NAME
    ? ss.getSheetByName(CONFIG.SHEET_NAME)
    : ss.getActiveSheet();
  if (!sheet) SpreadsheetApp.getUi().alert('Sheet not found: ' + CONFIG.SHEET_NAME);
  return sheet;
}

function getDriveFolder_() {
  if (CONFIG.DRIVE_FOLDER_ID === 'YOUR_FOLDER_ID_HERE') {
    SpreadsheetApp.getUi().alert('Please set DRIVE_FOLDER_ID in the script first.');
    return null;
  }
  try {
    return DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  } catch (e) {
    SpreadsheetApp.getUi().alert(
      'Drive folder not found. Check that DRIVE_FOLDER_ID is correct and you have access.\n\n' + e);
    return null;
  }
}

/**
 * Fetches a resized thumbnail from Google Drive to stay within the 2MB blob limit.
 * sz=w320 requests a max-width-320px version; adjust to taste.
 */
function fetchThumbnail_(file) {
  var url = 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w320';
  return UrlFetchApp.fetch(url).getBlob().setName(file.getName());
}

/**
 * Returns the first DriveFile whose filename contains the given shot name.
 * e.g. shot name "GDN_033_010" matches "0000 GDN_033_010.jpg"
 */
function findImageByName_(imageMap, name) {
  for (var fileName in imageMap) {
    if (fileName.indexOf(name) !== -1) return imageMap[fileName];
  }
  return null;
}

/**
 * Removes all over-grid images whose anchor cell is in the given column.
 */
function clearColumnImages_(sheet, col) {
  sheet.getImages().forEach(function(img) {
    if (img.getAnchorCell().getColumn() === col) img.remove();
  });
}
