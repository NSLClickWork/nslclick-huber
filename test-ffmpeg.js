const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

async function testFFmpeg() {
    const introPath = path.join(__dirname, 'public', 'assets', 'intro.mp4');
    const outputPath = path.join(__dirname, 'public', 'assets', 'test_intro.mp4');

    // Windows FFmpeg requires special fontfile path escaping
    const escapePath = (p) => p.replace(/\\/g, '/').replace(/:/g, '\\:');
    
    const fontBungee = escapePath(path.join(__dirname, 'public/assets/Bungee/Bungee-Regular.ttf'));
    const fontMontserrat = escapePath(path.join(__dirname, 'public/assets/Montserrat/Montserrat-VariableFont_wght.ttf'));
    const fontBaloo = escapePath(path.join(__dirname, 'public/assets/Baloo_Bhai_2/BalooBhai2-VariableFont_wght.ttf'));

    const name = "NGUYEN VAN A";
    const profession = "Azubi Pflege";
    const score = "85";

    const drawtextFilter = `drawtext=fontfile='${fontBungee}':text='${name}':x=560:y=350:fontsize=70:fontcolor=yellow:borderw=3:bordercolor=black,` +
                           `drawtext=fontfile='${fontMontserrat}':text='${profession}':x=560:y=470:fontsize=40:fontcolor=white,` +
                           `drawtext=fontfile='${fontBaloo}':text='${score}':x=750:y=610:fontsize=80:fontcolor=white`;

    console.log("Running FFmpeg with filter:", drawtextFilter);

    return new Promise((resolve, reject) => {
        ffmpeg(introPath)
            .videoFilters(drawtextFilter)
            .outputOptions(['-c:v libx264', '-preset fast', '-crf 28', '-c:a copy'])
            .save(outputPath)
            .on('end', () => {
                console.log('Test Intro generated at', outputPath);
                resolve();
            })
            .on('error', (err) => {
                console.error('FFmpeg Error:', err.message);
                reject(err);
            });
    });
}

testFFmpeg().catch(err => console.error(err));
