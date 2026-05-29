const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const fontBungee = path.join(__dirname, 'public/assets/Bungee/Bungee-Regular.ttf').replace(/\\/g, '/').replace(/:/g, '\\:');
const fontMontserrat = path.join(__dirname, 'public/assets/Montserrat/Montserrat-VariableFont_wght.ttf').replace(/\\/g, '/').replace(/:/g, '\\:');
const fontBaloo = path.join(__dirname, 'public/assets/Baloo_Bhai_2/BalooBhai2-VariableFont_wght.ttf').replace(/\\/g, '/').replace(/:/g, '\\:');

const name = 'NGUYỄN THỊ QUỲNH NHƯ';
const prof = 'Anerkennung Automechatroniker';
const score = '72';
const s1 = 'SCHNELLE LERNFÄHIGKEIT';
const s2 = 'SORGFÄLTIGE ARBEITSWEISE';
const s3 = 'KFZ-FACHKENNTNISSE';

const drawtext = `drawtext=fontfile='${fontBungee}':text='${name}':x=150:y=310:fontsize=75:fontcolor=white:shadowcolor=black:shadowx=2:shadowy=2,` +
                 `drawtext=fontfile='${fontMontserrat}':text='${prof}':x=150:y=480:fontsize=50:fontcolor=white,` +
                 `drawtext=fontfile='${fontBungee}':text='${score}':x=430:y=600:fontsize=80:fontcolor=white,` +
                 `drawtext=fontfile='${fontMontserrat}':text='${s1}':x=150:y=960:fontsize=28:fontcolor=white,` +
                 `drawtext=fontfile='${fontMontserrat}':text='${s2}':x=700:y=960:fontsize=28:fontcolor=white,` +
                 `drawtext=fontfile='${fontMontserrat}':text='${s3}':x=1250:y=960:fontsize=28:fontcolor=white`;

ffmpeg('public/assets/intro.mp4')
    .inputOptions(['-ss 00:00:02']) // Seek to 2 seconds
    .complexFilter([
        `[0:v]${drawtext}[t]`,
        `color=c=blue:s=600x600[box]`,
        `[t][box]overlay=x=1050:y=180[out]`
    ])
    .outputOptions([
        '-map [out]',
        '-vframes 1'
    ])
    .save('public/uploads/test-layout.jpg')
    .on('end', () => console.log('Done'))
    .on('error', (err) => console.log('Error', err));
