const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    },
});

const bucketName = process.env.BUCKET_NAME;

async function putObjectInBucket(key, body) {
    return await s3Client.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: body,
        })
    );
}

async function deleteObjectFromBucket(key) {
    await s3Client
        .send(new DeleteObjectCommand({Bucket: bucketName, Key: key}))
        .then(console.log("Object deleted from s3 bucket"));
}

function createKey(folder, fileName) {
    const trimmed_filename = fileName.trim().replace(/ /g, "_");
    return (
        `${folder}/` + new Date().toISOString() + "_" + `${trimmed_filename}`
    );
}

function createURL(key) {
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
}

module.exports = {
    createKey,
    createURL,
    putObjectInBucket,
    deleteObjectFromBucket
};
