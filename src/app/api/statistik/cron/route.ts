import { NextResponse } from 'next/server';
import { executeSIPDeskelSync } from '@/lib/services/sipdeskelService';

// GET/POST: Automated Cron Endpoint (Scheduled 02:00 WIB)
export async function GET() {
  try {
    const result = await executeSIPDeskelSync();
    return NextResponse.json({
      success: result.success,
      cronTime: '02:00 WIB',
      result,
    });
  } catch (error) {
    console.error('Error running automated cron sync:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menjalankan cron sinkronisasi otomatis',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
