import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data for Desa Suka Banjar...');

  // 1. Seed VillageProfile
  const profileCount = await prisma.villageProfile.count();
  if (profileCount === 0) {
    await prisma.villageProfile.create({
      data: {
        name: 'Suka Banjar',
        subdistrict: 'Sidomulyo',
        district: 'Lampung Selatan',
        province: 'Lampung',
        history: 'Desa Suka Banjar didirikan dengan semangat kebersamaan dan gotong royong...',
        vision: 'Terwujudnya Desa Suka Banjar yang Mandiri, Sejahtera, Berdaya Saing, dan Berkelanjutan Berbasis Potensi Lokal.',
        missions: [
          'Meningkatkan kualitas pelayanan publik dan tata kelola pemerintahan desa yang transparan.',
          'Mengembangkan potensi UMKM lokal dan sektor pertanian untuk kesejahteraan warga.',
          'Meningkatkan infrastruktur fasilitas publik dan saluran aspirasi warga berbasis digital.'
        ],
        phone: '081234567890',
        email: 'desa.Suka Banjar@gmail.com',
        address: 'Jl. Raya Desa Suka Banjar, Kec. Sidomulyo, Kab. Lampung Selatan',
      },
    });
    console.log('✔ Default VillageProfile created.');
  }

  // 2. Seed Admin User
  const adminUser = await prisma.user.findUnique({
    where: { username: 'admin' },
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('✔ Initial Admin User created (Username: admin, Password: admin123).');
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
