const videoService = require('./services/video');
const dotenv = require('dotenv');

dotenv.config();

async function testVideo() {
    console.log("Testing Video Generation for ANG_Tinh_NGUYEN_26.09.2005");
    try {
        await videoService.enqueueVideoJob('ANG_Tinh_NGUYEN_26.09.2005', 'HDEU');
        console.log("Job queued. Since queue processes immediately, let's wait a bit...");
    } catch(err) {
        console.error(err);
    }
}

testVideo();
