import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || 'https://65199e1e74054cec59b5ac32de01cdf0.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '7121f22f1afbeff11a3726cda0e86841',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '89efcf66c1038970e8621db2aa68c63920ad143920d075aeac87ebe22e71789e',
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'sourcepanipat-media';
const PUBLIC_R2_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://pub-sourcepanipat.r2.dev';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'categories';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${folder}/${Date.now()}-${cleanFileName}`;

    try {
      await r2Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type || 'image/png',
        })
      );

      const publicUrl = `${PUBLIC_R2_URL}/${key}`;
      return NextResponse.json({ success: true, url: publicUrl, key });
    } catch (r2Err: any) {
      console.warn('R2 bucket write notice, generating data uri fallback:', r2Err.message);
      // Fallback base64 data URI if bucket permissions are still propagating
      const base64Data = `data:${file.type || 'image/png'};base64,${buffer.toString('base64')}`;
      return NextResponse.json({ success: true, url: base64Data, key });
    }
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
