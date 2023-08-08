import type { Request, Response } from "express"

const { AbortMultipartUploadCommand } = require('@aws-sdk/client-s3')
const s3Client = require('./s3');
const express = require('express')
const multer = require('multer')
const app = express()
const port = 3000

const upload = multer({ dest: 'uploads/' })

const uploadImageToS3 = async (image) => {
    const params = {
        Bucket: "STRING_VALUE", // required
        Key: "STRING_VALUE", // required
        UploadId: "STRING_VALUE", // required
        RequestPayer: "requester",
        ExpectedBucketOwner: "STRING_VALUE",
    }
    const command = new AbortMultipartUploadCommand(params);
    const data = await s3Client.send(command);
    console.log(data)
}

app.put('/image', upload.array('images', 10), (req: Request, res: Response) => {
    // send image directly to s3 bucket 
    // loop through images and upload each simultaneously (assume all images were validated client-side for {file type, size, etc})
    if (!req.files) return
    for (const file in req.files) {


    }
    // return array of imageId's
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})