const XLSX = require('xlsx');
const fs = require('fs');
const { ConfidentialClientApplication } = require('@azure/msal-node');
const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
const path = require('path');

const CLIENT_ID = process.env.AZURE_CLIENT_ID || 'b4ae4dd7-68de-4abf-b14f-0d5ca3ba3f6e';
const TENANT_ID = process.env.AZURE_TENANT_ID || 'b4295bc1-8dd4-40af-935d-820db1079364';
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const USER_EMAIL = process.env.AZURE_USER_EMAIL || 'khoi.nguyen@new-solution.eu';

const msalConfig = { auth: { clientId: CLIENT_ID, authority: `https://login.microsoftonline.com/${TENANT_ID}`, clientSecret: CLIENT_SECRET } };
const cca = new ConfidentialClientApplication(msalConfig);
const authProvider = { getAccessToken: async () => { const authResponse = await cca.acquireTokenByClientCredential({ scopes: ['https://graph.microsoft.com/.default'] }); return authResponse.accessToken; } };
const client = Client.initWithMiddleware({ authProvider });

const TEMP_DIR = path.join(__dirname, 'temp_downloads');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

function getCleanProfession(filename) {
    let prof = filename.replace('NSL Assessment Centre', '').replace('NSL Assessment Center', '').replace('.xlsx', '').trim();
    if (prof.startsWith('-')) prof = prof.substring(1).trim();
    if (!prof) prof = "Khác";
    return prof;
}

async function downloadFile(item) {
    if(!item['@microsoft.graph.downloadUrl']) return null;
    const res = await fetch(item['@microsoft.graph.downloadUrl']);
    const buffer = await res.arrayBuffer();
    const dest = path.join(TEMP_DIR, item.name);
    fs.writeFileSync(dest, Buffer.from(buffer));
    return dest;
}

async function uploadFile(filePath, drivePath) {
    const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath);
    await client.api(`/users/${USER_EMAIL}/drive/root:/${drivePath}/${fileName}:/content`).put(fileContent);
    console.log(`[OK] Uploaded updated ${fileName} to ${drivePath}`);
}

async function main() {
    console.log("=== BẮT ĐẦU ĐỒNG BỘ DATA TỪ FORMS ===");
    
    // 1. Lấy file Master về
    let masterData = [];
    let masterWorkbook;
    let masterSheet;
    let masterFilePath = path.join(TEMP_DIR, 'Master_Assessment_Responses.xlsx');
    
    try {
        const masterItem = await client.api(`/users/${USER_EMAIL}/drive/root:/MANAGEMENT/Assessment/Master_Assessment_Responses.xlsx`).get();
        await downloadFile(masterItem);
        masterWorkbook = XLSX.readFile(masterFilePath);
        masterSheet = masterWorkbook.Sheets[masterWorkbook.SheetNames[0]];
        masterData = XLSX.utils.sheet_to_json(masterSheet, { defval: "" });
        console.log(`[INFO] Đã tải File Master hiện tại, có ${masterData.length} dòng dữ liệu.`);
    } catch(e) {
        console.log("[INFO] Không tìm thấy File Master hoặc file lỗi, sẽ tạo mới.");
    }

    // Tạo tập hợp (Set) chứa các bản ghi đã tồn tại để chống trùng
    // Khóa là: "Tên nghề_ID" (Ví dụ: Đầu bếp_12)
    const existingKeys = new Set();
    for (const row of masterData) {
        const prof = row["Nghề nghiệp"];
        const id = row["ID"];
        if (prof && id) {
            existingKeys.add(`${prof}_${id}`);
        }
    }

    // 2. Lấy 12 file gốc về
    const newRecords = [];
    
    async function processFolder(folderPath) {
        try {
            const children = await client.api(`/users/${USER_EMAIL}/drive/root:/${folderPath}:/children`).get();
            for (const item of children.value) {
                if (item.name.endsWith('.xlsx') && item.name.includes('Assessment Cent') && !item.name.includes('Master')) {
                    const localPath = await downloadFile(item);
                    const profession = getCleanProfession(item.name);
                    
                    const wb = XLSX.readFile(localPath);
                    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
                    
                    let added = 0;
                    for (const row of rows) {
                        const id = row["ID"];
                        const key = `${profession}_${id}`;
                        // Nếu chưa có trong Master, thì đưa vào danh sách mới
                        if (id && !existingKeys.has(key)) {
                            const newRow = { "Nghề nghiệp": profession, ...row };
                            newRecords.push(newRow);
                            added++;
                        }
                    }
                    console.log(`- Đã check [${profession}]: Thêm ${added} phản hồi mới.`);
                }
            }
        } catch (e) {
            console.log(`Không tìm thấy thư mục ${folderPath} hoặc lỗi: ${e.message}`);
        }
    }

    await processFolder('MANAGEMENT/Assessment');
    await processFolder('MANAGEMENT/Assessment/Rahul_Assessment');

    // 3. Nối data mới vào Master
    if (newRecords.length > 0) {
        console.log(`[SUCCESS] Tìm thấy tổng cộng ${newRecords.length} phản hồi mới. Tiến hành cập nhật...`);
        if (!masterWorkbook) {
            masterWorkbook = XLSX.utils.book_new();
            masterSheet = XLSX.utils.json_to_sheet(newRecords);
            XLSX.utils.book_append_sheet(masterWorkbook, masterSheet, "Master Responses");
        } else {
            XLSX.utils.sheet_add_json(masterSheet, newRecords, { skipHeader: true, origin: -1 });
        }
        
        XLSX.writeFile(masterWorkbook, masterFilePath);
        
        // 4. Upload lên lại OneDrive
        await uploadFile(masterFilePath, 'MANAGEMENT/Assessment');
        console.log("=== ĐỒNG BỘ HOÀN TẤT VÀ THÀNH CÔNG ===");
    } else {
        console.log("=== KHÔNG CÓ PHẢN HỒI NÀO MỚI, FILE MASTER ĐÃ ĐƯỢC CẬP NHẬT ĐẦY ĐỦ ===");
    }
}

main().catch(console.error);
