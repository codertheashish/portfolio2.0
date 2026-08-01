// ================================================================
// GOOGLE APPS SCRIPT — portfolio2.0 ke liye
// Extensions → Apps Script → sab delete karo → yeh paste karo
// ================================================================

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace karo

function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);

    if (action === 'getProjects') {
      const sheet = ss.getSheetByName('Projects');
      const data  = sheet.getDataRange().getValues();
      // Headers: emoji | title | desc | stack | category | githubUrl | num | image
      const rows = data.slice(1).filter(r => r[1]).map(r => ({
        emoji:     r[0] || '📁',
        title:     r[1],
        desc:      r[2],
        stack:     r[3],
        category:  r[4] || 'util',
        githubUrl: r[5],
        num:       r[6] || '',
        image:     r[7] || '',
      }));
      result = { status: 'ok', data: rows };
    }

    else if (action === 'getCerts') {
      const sheet = ss.getSheetByName('Certificates');
      const data  = sheet.getDataRange().getValues();
      // Headers: emoji | name | org | certUrl
      const rows = data.slice(1).filter(r => r[1]).map(r => ({
        emoji:   r[0] || '📜',
        name:    r[1],
        org:     r[2],
        certUrl: r[3],
      }));
      result = { status: 'ok', data: rows };
    }

    else if (action === 'addProject') {
      const raw   = JSON.parse(decodeURIComponent(e.parameter.data));
      const sheet = ss.getSheetByName('Projects');
      sheet.appendRow([raw.emoji, raw.title, raw.desc, raw.stack, raw.category, raw.githubUrl, raw.num, raw.image || '']);
      result = { status: 'ok', message: 'Project added' };
    }

    else if (action === 'addCert') {
      const raw   = JSON.parse(decodeURIComponent(e.parameter.data));
      const sheet = ss.getSheetByName('Certificates');
      sheet.appendRow([raw.emoji, raw.name, raw.org, raw.certUrl]);
      result = { status: 'ok', message: 'Certificate added' };
    }

    else if (action === 'deleteProject') {
      const raw   = JSON.parse(decodeURIComponent(e.parameter.data));
      const sheet = ss.getSheetByName('Projects');
      const data  = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][1] === raw.title) { sheet.deleteRow(i + 1); break; }
      }
      result = { status: 'ok', message: 'Project deleted' };
    }

    else if (action === 'deleteCert') {
      const raw   = JSON.parse(decodeURIComponent(e.parameter.data));
      const sheet = ss.getSheetByName('Certificates');
      const data  = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][1] === raw.name) { sheet.deleteRow(i + 1); break; }
      }
      result = { status: 'ok', message: 'Certificate deleted' };
    }

    else {
      result = { status: 'error', message: 'Unknown action: ' + action };
    }

  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
