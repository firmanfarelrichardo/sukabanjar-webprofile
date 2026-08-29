const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Migrating Apparatus table columns...');
  await prisma.$executeRawUnsafe('ALTER TABLE "Apparatus" ADD COLUMN IF NOT EXISTS "birthPlace" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "Apparatus" ADD COLUMN IF NOT EXISTS "birthDate" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "Apparatus" ADD COLUMN IF NOT EXISTS "gender" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "Apparatus" ADD COLUMN IF NOT EXISTS "address" TEXT;');
  await prisma.$executeRawUnsafe('ALTER TABLE "Apparatus" ADD COLUMN IF NOT EXISTS "description" TEXT;');
  console.log('✓ Apparatus columns added!');

  console.log('Creating Demografi tables...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "DemografiDusun" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "namaDusun" TEXT NOT NULL,
      "ketua" TEXT,
      "jumlah" INTEGER NOT NULL DEFAULT 0,
      "lakiLaki" INTEGER NOT NULL DEFAULT 0,
      "perempuan" INTEGER NOT NULL DEFAULT 0,
      "jumlahKK" INTEGER NOT NULL DEFAULT 0,
      "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "DemografiUsia" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "kategori" TEXT NOT NULL,
      "jumlah" INTEGER NOT NULL DEFAULT 0,
      "lakiLaki" INTEGER NOT NULL DEFAULT 0,
      "perempuan" INTEGER NOT NULL DEFAULT 0,
      "persentase" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "DemografiPendidikan" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "kategori" TEXT NOT NULL,
      "jumlah" INTEGER NOT NULL DEFAULT 0,
      "lakiLaki" INTEGER NOT NULL DEFAULT 0,
      "perempuan" INTEGER NOT NULL DEFAULT 0,
      "persentase" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "DemografiPekerjaan" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "kategori" TEXT NOT NULL,
      "jumlah" INTEGER NOT NULL DEFAULT 0,
      "lakiLaki" INTEGER NOT NULL DEFAULT 0,
      "perempuan" INTEGER NOT NULL DEFAULT 0,
      "persentase" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SyncLog" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "source" TEXT NOT NULL DEFAULT 'SIPDESKEL',
      "status" TEXT NOT NULL,
      "message" TEXT,
      "totalRecords" INTEGER NOT NULL DEFAULT 0,
      "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ All Demografi and SyncLog tables created successfully!');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
