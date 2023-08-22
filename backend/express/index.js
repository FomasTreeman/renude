require('dotenv').config();
const bucketName = process.env.BUCKET_NAME;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;

const { S3Client } = require('@aws-sdk/client-s3');

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${cloudflareAccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');

const app = express();
const port = 3000;

const upload = multer({
  storage: multerS3({
    s3: S3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const key = `${req?.user || 'unknown'}/${file.originalname}/${Date.now().toString()}` ;
      cb(null, key);
    },
  }),
});

app.post('/upload', upload.array('photos'), (req, res) => {
  res.send('Successfully uploaded ' + req.files?.length + ' files!');
});

app.get('/users/images', (req, res) => {
  // for a given user find all images in cloudflare storage and return to client
})

app.get('/listing/images', (req, res) => {
  // for a given listing find all images in cloudflare storage and return to client
})

app.get('/listings/images', (req, res) => {
  // for all listings find all images in cloudflare storage and return to client
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
