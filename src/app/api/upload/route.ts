import { NextResponse } from 'next/server';
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

    // Validate all files first
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

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'berita');
    await mkdir(uploadDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `berita_${timestamp}_${randomStr}.${ext}`;

      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);

      uploadedUrls.push(`/uploads/berita/${filename}`);
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
