function loopThroughRows() {
  // ID del documento Google Sheets
  var spreadsheetId = 'ID_DEL_TUO_FOGLIO';
  
  // Ottieni il foglio specifico
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('NomeDelTuoFoglio');
  
  // Ottieni tutti i dati del foglio
  var data = sheet.getDataRange().getValues();
  
  // Loop attraverso ogni riga del foglio
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    Logger.log('Riga ' + (i + 1) + ': ' + row.join(', '));
    
    // Puoi fare qualcosa con i dati di ogni riga qui
    // Ad esempio, potresti voler manipolare i dati o eseguire qualche logica
  }
}

// Note:
// Assicurati di sostituire 'ID_DEL_TUO_FOGLIO' con l'effettivo ID del tuo documento Google Sheets.
// 'NomeDelTuoFoglio' dovrebbe essere sostituito con il nome esatto del foglio che vuoi manipolare.
// Questo script utilizza Logger.log per stampare ogni riga nei log di Google Apps Script. Puoi adattare il codice per fare altro con i dati, come aggiornare le celle o interagire con altri servizi Google.

// Per eseguire questa funzione:
// Apri il documento Google Sheets.
// Vai su Estensioni > Apps Script.
// Incolla il codice sopra.
// Esegui la funzione loopThroughRows dal selettore delle funzioni.

// Ricorda che per utilizzare le API di Google Sheets in questo modo, il tuo script deve avere le autorizzazioni necessarie per leggere e, se necessario, scrivere sul foglio.


function findJpgImageByName(folderId, fileName) {
  // Ottieni la cartella usando il suo ID
  var folder = DriveApp.getFolderById(folderId);
  
  // Cerca i file nella cartella che corrispondono al nome specificato
  var files = folder.getFilesByName(fileName);
  
  // Verifica se ci sono file che corrispondono al nome
  while (files.hasNext()) {
    var file = files.next();
    // Controlla se il file è di tipo JPG
    if (file.getMimeType() === MimeType.JPEG) {
      return file; // Ritorna il file se è un JPG
    }
  }
  
  // Se non si trova alcun file JPG con il nome specificato, restituisci null
  return null;
}

// Esempio di uso della funzione
function testFindJpgImage() {
  var folderId = 'ID_DELLA_CARTELLA'; // Sostituisci con l'ID della cartella Drive
  var fileName = 'nome-dell-immagine.jpg';
  var foundImage = findJpgImageByName(folderId, fileName);
  
  if (foundImage) {
    Logger.log('Immagine trovata: ' + foundImage.getName());
    Logger.log('URL dell\'immagine: ' + foundImage.getUrl());
  } else {
    Logger.log('Nessuna immagine JPG trovata con il nome specificato.');
  }
}

// Note:
// folderId deve essere l'ID della cartella Google Drive in cui stai cercando l'immagine.
// fileName dovrebbe essere il nome esatto dell'immagine JPG che cerchi, inclusa l'estensione .jpg.
// Questa funzione utilizza getFilesByName per cercare file con un nome specifico, ma poi verifica se il tipo MIME del file corrisponde a MimeType.JPEG, che include formati come .jpg e .jpeg.
// Per eseguire questo script, devi avere accesso alle API di Google Drive tramite Google Apps Script. Inoltre, dovrai concedere le autorizzazioni necessarie per accedere al tuo Google Drive quando esegui la funzione per la prima volta.
// Logger.log è usato qui per stampare informazioni nei log di Google Apps Script, utili per il debug o per verificare che la funzione funzioni come previsto.

// Ricorda che Google Apps Script è eseguito in un ambiente controllato da Google, quindi non avrai accesso diretto alle funzioni asincrone o alle librerie esterne senza configurazioni aggiuntive.


function removeInitialNumberFromFileName(fileId) {
  // Ottieni il file usando il suo ID
  var file = DriveApp.getFileById(fileId);
  
  // Ottieni il nome del file
  var originalName = file.getName();
  
  // Usa un'espressione regolare per trovare un numero all'inizio del nome
  var regex = /^(\d+)(.*\.jpg)$/i;
  var match = originalName.match(regex);
  
  if (match) {
    // Se c'è una corrispondenza, rimuove il numero e rinomina il file
    var newName = match[2]; // match[2] contiene tutto dopo il numero fino a ".jpg"
    file.setName(newName);
    Logger.log('File rinominato da ' + originalName + ' a ' + newName);
  } else {
    Logger.log('Nessun numero trovato all'inizio del nome del file ' + originalName);
  }
}

// Esempio di uso della funzione
function testRemoveNumber() {
  var fileId = 'ID_DEL_FILE'; // Sostituisci con l'ID del file JPG
  removeInitialNumberFromFileName(fileId);
}

// Note:
// fileId deve essere l'ID del file JPG che vuoi rinominare.
// L'espressione regolare ^(\d+)(.*\.jpg)$ funziona così:
// ^ indica l'inizio della stringa.
// (\d+) cattura uno o più numeri all'inizio del nome del file.
// (.*\.jpg) cattura tutto il resto fino all'estensione .jpg.
// $ indica la fine della stringa.
// Se il nome del file inizia con un numero, questo verrà rimosso. Ad esempio, "123image.jpg" diventa "image.jpg".
// Questa funzione utilizza DriveApp, che è parte di Google Apps Script, quindi assicurati di eseguire questo script in quell'ambiente.

// Prima di eseguire la funzione, assicurati di avere le autorizzazioni necessarie per modificare i file nel tuo Google Drive. La prima volta che esegui la funzione, Google potrebbe chiederti di autorizzare l'accesso.
