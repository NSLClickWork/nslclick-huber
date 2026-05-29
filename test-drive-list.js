const { google } = require('googleapis');
const { serviceAccountClient } = require('./services/googleAuth');

async function listFolders() {
    if (!serviceAccountClient) throw new Error('Service Account Client not configured.');
    const drive = google.drive({ version: 'v3', auth: serviceAccountClient });

    try {
        const response = await drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder'",
            fields: 'files(id, name, parents)',
            supportsAllDrives: true,
            includeItemsFromAllDrives: true
        });
        
        const folders = response.data.files;
        if (folders.length) {
            console.log('Folders shared with service account:');
            folders.forEach((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No folders found. Make sure you shared the folder with the service account!');
        }
    } catch (error) {
        console.error('The API returned an error: ' + error);
    }
}

listFolders();
