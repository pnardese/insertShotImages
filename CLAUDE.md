# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Google Apps Script utilities for a VFX shot list workflow. The main script (`insertShotImages.js`) inserts JPG thumbnails from a Google Drive folder into a Google Sheet, matching images to rows by shot name.

## Workflow

1. Export a TAB-delimited `.txt` shot list from [vfx_turnover](https://github.com/pnardese/vfx_turnover) (`vfx-turnover -t`) or the [web-vfx-turnover](https://pnardese.github.io/web-vfx-turnover/) **DB Export** button
2. Import the `.txt` file into Google Sheets (File > Import, Tab separator)
3. Upload the `imgs/` folder to Google Drive (produced by the frame export step in either tool)
4. Paste `insertShotImages.js` into Extensions > Apps Script, set `DRIVE_FOLDER_ID`, save
5. Run `onOpen` once to authorize, then use **VFX Tools > Insert Shot Images**

## Sheet Structure

- Columns: `#, Name, Frame, Comments, Status, Date, Duration, Start, End, Frame Count Duration, Handles, Tape`
- `Name` column holds shot names (e.g. `GDN_033_010`)
- `Frame` column is empty — images are inserted here as floating over-grid images
- Timecodes begin at the `Duration` column

## Image Matching

Image filenames must contain the shot name from the `Name` column.
Example: `GDN_033_010` matches `0000 GDN_033_010.jpg`.

## Deployment

Paste scripts into the Apps Script editor (Extensions > Apps Script). No local build or test pipeline — all execution is in the Google Apps Script cloud environment. Use `Logger.log()` for debugging.

## Runtime Environment

- **Runtime**: Google Apps Script (V8 engine, no Node.js APIs)
- **Available services**: `SpreadsheetApp`, `DriveApp`, `MimeType`, `Logger`, `Utilities`
- Async/await and npm packages are not available
- `DRIVE_FOLDER_ID` in `insertShotImages.js` must be replaced with a real Google Drive folder ID before running
