import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config()

// const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
})

export default client;
