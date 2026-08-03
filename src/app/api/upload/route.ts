import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const DEFAULT_MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB Maximum Per File Default
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const maxKbParam = url.searchParams.get('maxKb');
    const customMaxBytes = maxKbParam ? parseInt(maxKbParam, 10) * 1024 : undefined;
    const maxSizeBytes = customMaxBytes || DEFAULT_MAX_FILE_SIZE;

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada file gambar yang diunggah' },
        { status: 400 }
      );
    }

    // Validate all files first (Size limit & allowed types)
    for (const file of files) {
      if (file.size > maxSizeBytes) {
        const maxKbDisplay = (maxSizeBytes / 1024).toFixed(0);
        const actualKbDisplay = (file.size / 1024).toFixed(1);
        return NextResponse.json(
          {
            success: false,
            message: `File "${file.name}" melebihi batas ukuran maksimum ${maxKbDisplay}KB (Ukuran file: ${actualKbDisplay}KB). Silakan kompres gambar terlebih dahulu.`,
          },
          { status: 400 }
        );
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `File "${file.name}" memiliki format yang tidak didukung. Gunakan JPEG, PNG, atau WebP.`,
          },
          { status: 400 }
        );
      }
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `img_${timestamp}_${randomStr}.${ext}`;

      let fileUploadedUrl: string | null = null;

      // Strategi 1: Upload ke Supabase Storage (Sangat Cocok & Stabil di Vercel Production)
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      ) {
        try {
          const bucketName = 'uploads';
          const filePathInBucket = `berita/${filename}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePathInBucket, buffer, {
              contentType: file.type || 'image/jpeg',
              upsert: true,
            });

          if (!uploadError && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(filePathInBucket);

            if (publicUrlData?.publicUrl) {
              fileUploadedUrl = publicUrlData.publicUrl;
            }
          }
        } catch (supabaseErr) {
          console.warn('Supabase Storage upload fallback triggered:', supabaseErr);
        }
      }

      // Strategi 2: Simpan ke Local Filesystem (Khusus saat di localhost & bukan di lingkungan read-only Vercel)
      if (!fileUploadedUrl && process.env.VERCEL !== '1') {
        try {
          const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'berita');
          await mkdir(uploadDir, { recursive: true });
          const filepath = path.join(uploadDir, filename);
          await writeFile(filepath, buffer);
          fileUploadedUrl = `/uploads/berita/${filename}`;
        } catch (localFsErr) {
          console.warn('Local FS upload error:', localFsErr);
        }
      }

      // Strategi 3: Base64 Data URI Fallback (100% Bekerja di Vercel tanpa butuh sistem file lokal)
      if (!fileUploadedUrl) {
        const mimeType = file.type || 'image/jpeg';
        fileUploadedUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      }

      uploadedUrls.push(fileUploadedUrl);
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedUrls.length} gambar berhasil diunggah`,
      data: uploadedUrls,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengunggah gambar',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
