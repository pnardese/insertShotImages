# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Google Apps Script utilities for a VFX shot list workflow. The main script (`insertShotImages.js`) inserts JPG thumbnails from a Google Drive folder into a Google Sheet, matching images to rows by shot name.

## Workflow

1. Import a tab-delimited `.txt` shot list into Google Sheets (File > Import, Tab separator)
2. Upload the `imgs/` folder to Google Drive
3. Paste `insertShotImages.js` into Extensions > Apps Script, set `DRIVE_FOLDER_ID`, save
4. Run `onOpen` once to authorize, then use **VFX Tools > Insert Shot Images**

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
