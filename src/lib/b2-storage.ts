import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const B2_KEY_ID = process.env.B2_KEY_ID || '0036d4aac29e1590000000001';
const B2_APP_KEY = process.env.B2_APP_KEY || 'K0037wZZH0drTKeUlKwj2qf6GKXdQi4';
const B2_ENDPOINT = process.env.B2_ENDPOINT || 'https://s3.eu-central-003.backblazeb2.com';
const B2_REGION = process.env.B2_REGION || 'eu-central-003';
export const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME || 'sourcepanipat-media-bucket';

export const b2Client = new S3Client({
  region: B2_REGION,
  endpoint: B2_ENDPOINT,
  credentials: {
    accessKeyId: B2_KEY_ID,
    secretAccessKey: B2_APP_KEY,
  },
});

/**
 * Upload a media buffer directly to Backblaze B2 private bucket
 */
export async function uploadMediaToB2(
  buffer: Buffer,
  key: string,
  contentType: string = 'application/octet-stream'
): Promise<{ key: string; presignedUrl: string }> {
  await b2Client.send(
    new PutObjectCommand({
      Bucket: B2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const presignedUrl = await getPresignedMediaUrl(key, 604800); // 7 days
  return { key, presignedUrl };
}

/**
 * Generate a presigned GET URL for private B2 media
 */
export async function getPresignedMediaUrl(
  key: string,
  expiresInSeconds: number = 604800
): Promise<string> {
  const getCmd = new GetObjectCommand({
    Bucket: B2_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(b2Client, getCmd, { expiresIn: expiresInSeconds });
}

/**
 * Delete a media object from Backblaze B2
 */
export async function deleteMediaFromB2(key: string): Promise<void> {
  await b2Client.send(
    new DeleteObjectCommand({
      Bucket: B2_BUCKET_NAME,
      Key: key,
    })
  );
}
