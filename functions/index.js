const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
admin.initializeApp()
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

const app = express();

app.use(cors({ origin: true }));

app.get('/', (req, res) => {
    res.end("Received GET request!");
});

const impressorMethod = async () => {
    const filePath = "gs://nkululekodotio-projects/impressor/images/favicon-8.png";
    const fileBucket = "nkululekodotio-projects";
    // Get the file name.
    const fileName = path.basename(filePath);
    // Exit if the image is already a thumbnail.
    if (fileName.startsWith('thumb_')) {
        return functions.logger.log('Already a Thumbnail.');
    }
    const contentType = "image/jpeg"
    // [END stopConditions]
    // nkululekodotio-2b22e@appspot.gserviceaccount.com
    // [START thumbnailGeneration]
    // Download file from bucket.
    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const metadata = {
        contentType: contentType,
    };
    await bucket.file(filePath).download({ destination: tempFilePath });
    functions.logger.log('Image downloaded locally to', tempFilePath);
    // Generate a thumbnail using ImageMagick.
    await spawn('convert', [tempFilePath, '-thumbnail', '1080x1080', tempFilePath]);
    functions.logger.log('Thumbnail created at', tempFilePath);
    // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
    const thumbFileName = `impressored_${fileName}`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
    // Uploading the thumbnail.
    await bucket.upload(tempFilePath, {
        destination: thumbFilePath,
        metadata: metadata,
    });
    // HD
    const signedURLconfig = { action: 'read', expires: '01-01-2030' };
    const hd_file = bucket.file(filePath);
    const hd_signedURLArray = await hd_file.getSignedUrl(signedURLconfig);
    const hd_url = hd_signedURLArray[0];

    // Thumb
    const thumb_file = bucket.file(thumbFilePath);
    const thumb_signedURLArray = await thumb_file.getSignedUrl(signedURLconfig);
    const thumb_url = thumb_signedURLArray[0];

    return fs.unlinkSync(tempFilePath);
}

app.post('/', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    // console.log(req.body)
    const name = req.body.firstName;
    const lastName = req.body.lastName;

    const filePath = "gs://nkululekodotio-projects/impressor/images/favicon-8.png";
    const fileBucket = "nkululekodotio-projects";
    // Get the file name.
    const fileName = path.basename(filePath);
    console.log(fileName)
    // Exit if the image is already a thumbnail.
    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    // await bucket.file(filePath).download({ destination: tempFilePath });
    functions.logger.log('Image downloaded locally to', tempFilePath);
    res.end(`Received POST request! ${name} ${lastName}`);
})

//
exports.impressorBasic = functions.https.onRequest(app);
