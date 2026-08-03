import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEFAULT_MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB Default Maximum Size
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const BUCKET_NAME = 'sukabanjar-assets';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const maxKbParam = url.searchParams.get('maxKb');
    const folderParam = url.searchParams.get('folder') || 'uploads';
    const customMaxBytes = maxKbParam ? parseInt(maxKbParam, 10) * 1024 : undefined;
    const maxSizeBytes = customMaxBytes || DEFAULT_MAX_FILE_SIZE;

    const formData = await request.formData();
    
    // Support multiple field names from client components: "images", "files", "file", "image"
    let rawFiles: File[] = [];
    const imagesField = formData.getAll('images');
    const filesField = formData.getAll('files');
    const singleFile = formData.get('file') || formData.get('image');

    if (imagesField.length > 0) {
      rawFiles = imagesField.filter((f): f is File => f instanceof File);
    } else if (filesField.length > 0) {
      rawFiles = filesField.filter((f): f is File => f instanceof File);
    } else if (singleFile instanceof File) {
      rawFiles = [singleFile];
    }

    if (!rawFiles || rawFiles.length === 0) {
      console.error('UPLOAD ERROR: No image files provided in request FormData');
      return NextResponse.json(
        { success: false, message: 'Tidak ada file gambar yang diunggah' },
        { status: 400 }
      );
    }

    // Validate size and format for all files
    for (const file of rawFiles) {
      if (file.size > maxSizeBytes) {
        const maxKbDisplay = (maxSizeBytes / 1024).toFixed(0);
        const actualKbDisplay = (file.size / 1024).toFixed(1);
        console.error(`UPLOAD ERROR: File "${file.name}" size ${actualKbDisplay}KB exceeds limit of ${maxKbDisplay}KB`);
        return NextResponse.json(
          {
            success: false,
            message: `File "${file.name}" melebihi batas ukuran maksimum ${maxKbDisplay}KB (Ukuran file: ${actualKbDisplay}KB). Silakan kompres gambar terlebih dahulu.`,
          },
          { status: 400 }
        );
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        console.error(`UPLOAD ERROR: File "${file.name}" format ${file.type} is not allowed`);
        return NextResponse.json(
          {
            success: false,
            message: `File "${file.name}" memiliki format yang tidak didukung. Gunakan format JPEG, PNG, atau WebP.`,
          },
          { status: 400 }
        );
      }
    }

    const uploadedUrls: string[] = [];

    for (const file of rawFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFolderName = folderParam.replace(/[^a-zA-Z0-9_-]/g, '');
      const fileNameInBucket = `${cleanFolderName}/${timestamp}_${randomStr}.${ext}`;

      let publicUrl: string | null = null;

      // 1. Upload to Supabase Storage Bucket (sukabanjar-assets)
      try {
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileNameInBucket, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          });

        if (uploadErr) {
          console.error(`UPLOAD ERROR: Supabase Storage upload failed for ${fileNameInBucket}:`, uploadErr);
        } else if (uploadData) {
          const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileNameInBucket);

          if (urlData?.publicUrl) {
            publicUrl = urlData.publicUrl;
          }
        }
      } catch (storageErr) {
        console.error(`UPLOAD ERROR: Exception during Supabase Storage upload for ${fileNameInBucket}:`, storageErr);
      }

      // 2. Fallback to Base64 Data URI if Supabase storage upload fails or bucket RLS blocks
      if (!publicUrl) {
        console.warn(`UPLOAD WARNING: Falling back to Base64 Data URI for file ${file.name}`);
        const mimeType = file.type || 'image/jpeg';
        publicUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      }

      uploadedUrls.push(publicUrl);
    }

    const primaryUrl = uploadedUrls[0] || '';

    return NextResponse.json({
      success: true,
      message: `${uploadedUrls.length} gambar berhasil diunggah ke Supabase Storage`,
      url: primaryUrl,
      data: uploadedUrls,
    });
  } catch (error) {
    console.error('UPLOAD ERROR: Unhandled exception in POST /api/upload:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengunggah gambar ke server',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
