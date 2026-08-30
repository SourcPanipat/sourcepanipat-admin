import { NextResponse } from 'next/server';
import { uploadMediaToB2 } from '@/lib/b2-storage';
import { supabaseAdmin } from '@/lib/supabase-admin';


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
    const timestamp = Date.now();
    const key = `${folder}/${timestamp}-${cleanFileName}`;
    const contentType = file.type || 'application/octet-stream';

    // 1. Sensitive KYC Documents -> Supabase Storage (kyc-docs private bucket)
    if (folder === 'kyc' || folder === 'kyc-docs') {
      try {
        if (supabaseAdmin) {
          const { data, error } = await supabaseAdmin.storage
            .from('kyc-docs')
            .upload(key, buffer, {
              contentType,
              upsert: true,
            });

          if (error) throw error;

          const { data: signedUrlData, error: signError } = await supabaseAdmin.storage
            .from('kyc-docs')
            .createSignedUrl(key, 604800); // 7 days

          if (signError || !signedUrlData?.signedUrl) {
            throw new Error(signError?.message || 'Failed to sign KYC document URL');
          }

          return NextResponse.json({
            success: true,
            url: signedUrlData.signedUrl,
            key,
            storage: 'supabase',
          });
        }
      } catch (sbErr: any) {
        console.warn('Falling back to Backblaze B2 for KYC storage in admin:', sbErr.message);
      }
    }


    // 2. All Public Media -> Backblaze B2
    try {
      const { presignedUrl } = await uploadMediaToB2(buffer, key, contentType);

      return NextResponse.json({
        success: true,
        url: presignedUrl,
        key,
        storage: 'b2',
      });
    } catch (b2Err: any) {
      console.error('Admin Backblaze B2 Upload Error:', b2Err.message);
      const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64Data,
        key,
        storage: 'fallback_base64',
      });
    }
  } catch (error: any) {
    console.error('Admin upload route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
