require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');
const sheetsService = require('./services/sheets');

async function testUpdate() {
    try {
        const studentIds = [
            'HDEU_Nhu_NGUYEN_18.11.2006',
            'HDEU_Nhu_NGUYEN_25.12.2003'
        ];
        console.log("Testing update for:", studentIds);
        
        const success = await sheetsService.batchUpdateStudentsFields(studentIds, { ProgressStatus: '3' });
        console.log("Update success:", success);
        
        // Fetch again to verify
        const students = await sheetsService.getAllStudents();
        const updated1 = students.find(s => s.StudentID === studentIds[0]);
        const updated2 = students.find(s => s.StudentID === studentIds[1]);
        
        console.log("Student 1 Progress:", updated1 ? updated1.ProgressStatus : 'NOT FOUND');
        console.log("Student 2 Progress:", updated2 ? updated2.ProgressStatus : 'NOT FOUND');
        
    } catch (e) {
        console.error(e);
    }
}

testUpdate();
