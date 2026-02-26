# VFX Shot Image Inserter

Google Apps Script that inserts JPG thumbnails into a Google Sheet shot list, matched by shot name.

## Prerequisites

- A Google Sheet populated by importing a tab-delimited `.txt` file
- The `imgs/` folder uploaded to Google Drive

## Setup

### 1. Upload images to Google Drive

Drag and drop the `imgs/` folder into [drive.google.com](https://drive.google.com). Once uploaded, open the folder and copy its ID from the URL:

```
https://drive.google.com/drive/folders/YOUR_FOLDER_ID_HERE
                                        ^^^^^^^^^^^^^^^^^^^^
```

### 2. Import the shot list into Google Sheets

In Google Sheets: **File > Import**, select your `.txt` file, choose **Tab** as the separator type.

### 3. Install the script

1. In the sheet: **Extensions > Apps Script**
2. Delete any existing code in the editor
3. Paste the contents of `insertShotImages.js`
4. Replace `'YOUR_FOLDER_ID_HERE'` with the folder ID copied in step 1
5. Click **Save** (Ctrl+S / Cmd+S)

### 4. Authorize the script

Run `onOpen` once from the function selector and accept the permission prompt (the script needs access to Google Drive and Sheets).

### 5. Run

Refresh the Google Sheet. A new menu **VFX Tools** appears in the menu bar.

- **VFX Tools > Insert Shot Images** — inserts thumbnails into the `Frame` column, matched by shot name from the `Name` column
- **VFX Tools > Clear All Images** — removes all inserted images

Re-running *Insert Shot Images* is safe: existing images are cleared first.

## Configuration

At the top of `insertShotImages.js`:

| Variable | Default | Description |
|---|---|---|
| `DRIVE_FOLDER_ID` | — | ID of the Drive folder containing the JPGs |
| `SHEET_NAME` | `''` | Sheet tab name; empty = active sheet |
| `ROW_HEIGHT` | `80` | Row height in px for rows with an image |
| `FRAME_COLUMN_WIDTH` | `150` | Width in px of the Frame column |

## How matching works

Each image filename must contain the shot name from the `Name` column.
Example: shot name `GDN_033_010` matches file `0000 GDN_033_010.jpg`.

## Thumbnails

Google Sheets limits inserted images to 2MB and 1 million pixels. The script works around this by fetching a resized thumbnail from Google Drive instead of the full-resolution file. The default width is 320px (`sz=w320` in `fetchThumbnail_()`). Adjust the value in the script if you need more or less detail.
