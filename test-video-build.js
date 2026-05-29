const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

async function buildVideo() {
    const introPath = path.join(__dirname, 'public/assets/intro.mp4');
    const outroPath = path.join(__dirname, 'public/assets/outro.mp4');
    const rawLocalPath = path.join(__dirname, 'public/assets/test_intro.mp4'); // Just mock raw video with test_intro
    const outputLocalPath = path.join(__dirname, 'public/assets/final_output.mp4');

    const escapePath = (p) => p.replace(/\\/g, '/').replace(/:/g, '\\:');
    
    const fontBungee = escapePath(path.join(__dirname, 'public/assets/Bungee/Bungee-Regular.ttf'));
    const fontMontserrat = escapePath(path.join(__dirname, 'public/assets/Montserrat/Montserrat-VariableFont_wght.ttf'));
    const fontBaloo = escapePath(path.join(__dirname, 'public/assets/Baloo_Bhai_2/BalooBhai2-VariableFont_wght.ttf'));

    const name = "NGUYEN VAN B";
    const profession = "Azubi Pflege";
    const score = "88";
    const str1 = "Starke Motivation";
    const str2 = "Gute Soft-Skills";
    const str3 = "Hohe Lernbereitschaft";

    const drawtextFilter = 
        `drawtext=fontfile='${fontBungee}':text='${name}':x=150:y=350:fontsize=90:fontcolor=white:borderw=0,` +
        `drawtext=fontfile='${fontMontserrat}':text='${profession}':x=150:y=500:fontsize=45:fontcolor=white,` +
        `drawtext=fontfile='${fontBaloo}':text='${score}':x=380:y=620:fontsize=80:fontcolor=white,` +
        `drawtext=fontfile='${fontMontserrat}':text='${str1}':x=200:y=950:fontsize=25:fontcolor=white,` +
        `drawtext=fontfile='${fontMontserrat}':text='${str2}':x=700:y=950:fontsize=25:fontcolor=white,` +
        `drawtext=fontfile='${fontMontserrat}':text='${str3}':x=1200:y=950:fontsize=25:fontcolor=white`;

    console.log("Generating video...");

    return new Promise((resolve, reject) => {
        let command = ffmpeg();
        
        command.input(introPath); // 0
        command.input(rawLocalPath); // 1
        command.input(outroPath); // 2

        // Assuming 0 has no audio, 1 has audio, 2 has no audio. We need to generate silent audio for 0 and 2.
        command.input('anullsrc=channel_layout=stereo:sample_rate=44100').inputFormat('lavfi'); // 3

        let complexFilter = [
            // PIP video for intro (scale, crop to 600x600)
            `[1:v]scale=600:600:force_original_aspect_ratio=increase,crop=600:600[pip]`,
            
            // Draw text on intro (0:v) and overlay PIP
            `[0:v]${drawtextFilter}[intro_text]`,
            `[intro_text][pip]overlay=x=1200:y=200:shortest=1[intro_v_base]`,
            // Force intro to 1920x1080 and standard framerate
            `[intro_v_base]scale=1920:1080,fps=30,format=yuv420p[intro_v]`,

            // Main video (1:v): scale to 1920x1080 with padding
            `[1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p[main_v]`,

            // Outro video (2:v): scale to 1920x1080
            `[2:v]scale=1920:1080,fps=30,format=yuv420p[outro_v]`,

            // Trim audio 3 (silent) to 5 seconds for intro
            `[3:a]atrim=duration=5[intro_a]`,
            
            // Assuming outro is 5 seconds
            `[3:a]atrim=duration=5[outro_a]`,

            // Main audio
            `[1:a]aformat=sample_rates=44100:channel_layouts=stereo[main_a]`,

            // Concat
            `[intro_v][intro_a][main_v][main_a][outro_v][outro_a]concat=n=3:v=1:a=1[outv][outa]`
        ];

        command.complexFilter(complexFilter)
            .outputOptions([
                '-map [outv]',
                '-map [outa]',
                '-c:v libx264',
                '-preset fast',
                '-crf 28',
                '-c:a aac',
                '-ac 2',
                '-shortest'
            ])
            .save(outputLocalPath)
            .on('end', () => {
                console.log('Final output generated at', outputLocalPath);
                resolve();
            })
            .on('error', (err) => {
                console.error('FFmpeg Error:', err.message);
                reject(err);
            });
    });
}

buildVideo().catch(err => console.error(err));
