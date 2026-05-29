const pdfService = require('./services/pdf');
const jobsService = require('./services/jobs');

async function test() {
    console.log("Testing PDF generation...");
    // Need a valid student ID from the sheet. We'll get one from the admin endpoint or just mock it.
    const sheetsService = require('./services/sheets');
    const students = await sheetsService.getAllStudents();
    
    if (students && students.length > 0) {
        const studentId = students[0].StudentID;
        console.log("Testing with student ID:", studentId);
        
        const { jobId } = pdfService.enqueuePdfJob(studentId);
        
        // Polling loop
        const interval = setInterval(() => {
            const job = jobsService.getJob(jobId);
            console.log("Status:", job.status);
            if (job.status === 'done' || job.status === 'failed') {
                clearInterval(interval);
                if (job.status === 'failed') {
                    console.error("Job failed with error:", job.error);
                } else {
                    console.log("Job completed successfully.");
                }
                process.exit(0);
            }
        }, 1000);
    } else {
        console.log("No students found to test.");
        process.exit(1);
    }
}

test().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
