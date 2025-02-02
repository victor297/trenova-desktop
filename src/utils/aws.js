import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "us-east-1", // Use your specific region
  endpoint: "https://nyc3.digitaloceanspaces.com",
  credentials: {
    accessKeyId: "DO00QWUMPHWUBAM9PRYE",
    secretAccessKey: "voFh7cMSqvPT1/jTbErkuHkPeTgSK3Ecp++TtJaDbDU",
  },
});

const bucketName = "trenova";

// Upload function
export const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: bucketName,
    Key: file.name,
    Body: file,
    ACL: "public-read",
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await client.send(command);
    console.log("Upload successful:", response);

    const location = `https://${bucketName}.nyc3.digitaloceanspaces.com/${file.name}`;
    return location;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Delete function
export const deleteFileFromS3 = async (fileKey) => {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await client.send(command);
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

// Get file size
export const getFileSizeFromS3 = async (fileKey) => {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    const command = new HeadObjectCommand(params);
    const data = await client.send(command);
    return data.ContentLength; // File size in bytes
  } catch (error) {
    console.error("Error getting file size:", error);
    throw error;
  }
};
