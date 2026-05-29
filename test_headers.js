const { google } = require('googleapis');
const path = require('path');
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function getSheetsInstance() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, 'credentials.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();
    return google.sheets({ version: 'v4', auth: client });
}

async function run() {
    try {
        require('dotenv').config();
        const sheets = await getSheetsInstance();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: `CHECKLIST!1:10`,
        });
        const rows = response.data.values;
        let headerIndex = rows.findIndex(row => row.some(cell => cell && cell.trim().toLowerCase().replace(/\s/g, '') === 'studentid'));
        if (headerIndex === -1) headerIndex = 0;
        console.log("Header Index:", headerIndex);
        console.log("Headers:", rows[headerIndex]);
    } catch (e) {
        console.error(e);
    }
}
run();
