import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@silsilah.local' },
    update: {},
    create: {
      email: 'admin@silsilah.local',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create sample family members
  // Generation 1 - Grandparents
  const kakek = await prisma.person.create({
    data: {
      fullName: 'Ahmad Suryadi',
      nickname: 'Kakek Ahmad',
      gender: 'MALE',
      birthDate: new Date('1940-05-15'),
      birthPlace: 'Surabaya',
      occupation: 'Pedagang',
      biography: 'Pendiri keluarga besar Suryadi. Seorang pedagang sukses yang memulai usaha dari nol.',
    },
  });

  const nenek = await prisma.person.create({
    data: {
      fullName: 'Siti Aminah',
      nickname: 'Nenek Siti',
      gender: 'FEMALE',
      birthDate: new Date('1945-08-20'),
      birthPlace: 'Malang',
      occupation: 'Ibu Rumah Tangga',
      biography: 'Istri setia Kakek Ahmad. Dikenal sebagai sosok yang lembut dan penyayang.',
    },
  });

  // Create marriage for grandparents
  await prisma.marriage.create({
    data: {
      husbandId: kakek.id,
      wifeId: nenek.id,
      marriageDate: new Date('1965-06-10'),
      marriagePlace: 'Surabaya',
      orderNumber: 1,
    },
  });

  // Generation 2 - Parents
  const ayah = await prisma.person.create({
    data: {
      fullName: 'Budi Suryadi',
      nickname: 'Pak Budi',
      gender: 'MALE',
      birthDate: new Date('1968-03-12'),
      birthPlace: 'Surabaya',
      occupation: 'Dosen',
      fatherId: kakek.id,
      motherId: nenek.id,
      biography: 'Anak pertama dari Ahmad dan Siti. Bekerja sebagai dosen di universitas negeri.',
    },
  });

  const ibu = await prisma.person.create({
    data: {
      fullName: 'Dewi Kartika',
      nickname: 'Bu Dewi',
      gender: 'FEMALE',
      birthDate: new Date('1972-11-25'),
      birthPlace: 'Jakarta',
      occupation: 'Dokter',
      biography: 'Istri Budi Suryadi. Bekerja sebagai dokter umum di rumah sakit swasta.',
    },
  });

  const paman = await prisma.person.create({
    data: {
      fullName: 'Andi Suryadi',
      nickname: 'Om Andi',
      gender: 'MALE',
      birthDate: new Date('1970-07-08'),
      birthPlace: 'Surabaya',
      occupation: 'Pengusaha',
      fatherId: kakek.id,
      motherId: nenek.id,
      biography: 'Anak kedua dari Ahmad dan Siti. Pemilik usaha konveksi.',
    },
  });

  const bibi = await prisma.person.create({
    data: {
      fullName: 'Ratna Suryadi',
      nickname: 'Tante Ratna',
      gender: 'FEMALE',
      birthDate: new Date('1975-02-14'),
      birthPlace: 'Surabaya',
      occupation: 'Guru',
      fatherId: kakek.id,
      motherId: nenek.id,
      biography: 'Anak ketiga dari Ahmad dan Siti. Bekerja sebagai guru SD.',
    },
  });

  // Create marriages
  await prisma.marriage.create({
    data: {
      husbandId: ayah.id,
      wifeId: ibu.id,
      marriageDate: new Date('1995-04-22'),
      marriagePlace: 'Jakarta',
      orderNumber: 1,
    },
  });

  // Generation 3 - Children
  const anak1 = await prisma.person.create({
    data: {
      fullName: 'Rizky Suryadi',
      nickname: 'Rizky',
      gender: 'MALE',
      birthDate: new Date('1997-09-10'),
      birthPlace: 'Jakarta',
      occupation: 'Software Engineer',
      fatherId: ayah.id,
      motherId: ibu.id,
      biography: 'Anak pertama Budi dan Dewi. Bekerja di perusahaan teknologi.',
    },
  });

  const anak2 = await prisma.person.create({
    data: {
      fullName: 'Anisa Suryadi',
      nickname: 'Nisa',
      gender: 'FEMALE',
      birthDate: new Date('2000-12-05'),
      birthPlace: 'Jakarta',
      occupation: 'Mahasiswa',
      fatherId: ayah.id,
      motherId: ibu.id,
      biography: 'Anak kedua Budi dan Dewi. Sedang menempuh S1 Kedokteran.',
    },
  });

  const anak3 = await prisma.person.create({
    data: {
      fullName: 'Fajar Suryadi',
      nickname: 'Fajar',
      gender: 'MALE',
      birthDate: new Date('2005-06-18'),
      birthPlace: 'Jakarta',
      fatherId: ayah.id,
      motherId: ibu.id,
      biography: 'Anak ketiga Budi dan Dewi. Masih bersekolah di SMA.',
    },
  });

  // Create viewer user linked to a person
  const viewerPassword = await bcrypt.hash('viewer123', 10);
  await prisma.user.upsert({
    where: { email: 'rizky@silsilah.local' },
    update: {},
    create: {
      email: 'rizky@silsilah.local',
      passwordHash: viewerPassword,
      role: 'VIEWER',
      personId: anak1.id,
    },
  });

  console.log('✅ Sample family data created');
  console.log('');
  console.log('📝 Login credentials:');
  console.log('   Admin: admin@silsilah.local / admin123');
  console.log('   Viewer: rizky@silsilah.local / viewer123');
  console.log('');
  console.log('🌱 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
