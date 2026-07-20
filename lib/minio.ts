import { Client } from "minio";

const requiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[MinIO] Missing required environment variable: ${key}. ` +
        "Set it in .env file. DO NOT use default credentials in production."
    );
  }
  return value;
};

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT ?? "localhost",
  port: parseInt(process.env.MINIO_PORT ?? "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: requiredEnv("MINIO_ACCESS_KEY"),
  secretKey: requiredEnv("MINIO_SECRET_KEY"),
});

const BUCKET_NAME = process.env.MINIO_BUCKET || "evidence";

/**
 * Ensure the evidence bucket exists
 */
export async function ensureBucket(): Promise<void> {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME);
  }
}

/**
 * Upload a file to MinIO
 */
export async function uploadFile(
  objectName: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  await ensureBucket();
  await minioClient.putObject(BUCKET_NAME, objectName, buffer, buffer.length, {
    "Content-Type": contentType,
  });
  return objectName;
}

/**
 * Get a presigned URL for downloading a file
 */
export async function getDownloadUrl(objectName: string, expiresInSeconds = 3600): Promise<string> {
  return minioClient.presignedGetObject(BUCKET_NAME, objectName, expiresInSeconds);
}

/**
 * Delete a file from MinIO
 */
export async function deleteFile(objectName: string): Promise<void> {
  await minioClient.removeObject(BUCKET_NAME, objectName);
}

export { minioClient, BUCKET_NAME };
