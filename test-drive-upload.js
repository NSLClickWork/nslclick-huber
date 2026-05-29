const fs = require('fs');
const { google } = require('googleapis');
const { serviceAccountClient } = require('./services/googleAuth');

async function testUploadOwnDrive() {
    const drive = google.drive({ version: 'v3', auth: serviceAccountClient });
    
    // Create a dummy file
    fs.writeFileSync('dummy.txt', 'Hello World');
    
    try {
        console.log("Uploading to Service Account's own drive...");
        const response = await drive.files.create({
            resource: { name: 'dummy.txt' },
            media: {
                mimeType: 'text/plain',
                body: fs.createReadStream('dummy.txt')
            },
            fields: 'id, webViewLink, webContentLink'
        });
        
        console.log("Upload successful!", response.data);
    } catch (err) {
        console.error("Upload failed:", err.message);
    } finally {
        fs.unlinkSync('dummy.txt');
    }
}

testUploadOwnDrive();
