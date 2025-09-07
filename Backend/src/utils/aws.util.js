import AWS from "aws-sdk";

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadFileToS3 = async (
    fileBuffer,
    originalName,
    mimetype,
    userID,
    folder
) => {
    const fileExtension = originalName.split(".").pop();
    const timestamp = Date.now();
    let params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: "",
        Body: fileBuffer,
        ContentType: mimetype,
    };
    if (folder == "profile") {
        params.Key = `${folder}/${userID}_profile.${fileExtension}`;
    } else if (folder == "documents") {
        params.Key = `${folder}/${userID}/${userID}_${timestamp}.${fileExtension}`;
    }

    const result = await s3.upload(params).promise();
    return result.Location;
};
