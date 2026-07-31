import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export async function POST(request: Request) {
  try {
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
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `File "${file.name}" melebihi batas ukuran maksimum 2 MB (${(file.size / 1024 / 1024).toFixed(1)} MB)`,
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
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'umkm');
    await mkdir(uploadDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `umkm_${timestamp}_${randomStr}.${ext}`;

      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);

      uploadedUrls.push(`/uploads/umkm/${filename}`);
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
