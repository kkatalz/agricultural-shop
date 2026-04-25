import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcrypt';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? '' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'myadminpassword';

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      name: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log(`Seeded admin user: ${adminEmail}`);

  const categories = [
    { name: 'Bearings', slug: 'bearings' },
    { name: 'Filters', slug: 'filters' },
    { name: 'Belts', slug: 'belts' },
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }
  console.log(`Seeded ${categories.length} categories`);

  const bearings = await prisma.category.findUniqueOrThrow({
    where: { slug: 'bearings' },
  });
  const filters = await prisma.category.findUniqueOrThrow({
    where: { slug: 'filters' },
  });
  const belts = await prisma.category.findUniqueOrThrow({
    where: { slug: 'belts' },
  });

  const parts = [
    {
      sku: 'BRG-6206',
      name: 'Deep Groove Ball Bearing 6206',
      description: 'Sealed deep groove ball bearing, 30x62x16mm',
      priceRetail: 320,
      stock: 25,
      categoryId: bearings.id,
    },
    {
      sku: 'FLT-OIL-JD',
      name: 'Oil Filter (John Deere)',
      description: 'Spin-on oil filter for John Deere 6000-series tractors',
      priceRetail: 480,
      stock: 40,
      categoryId: filters.id,
    },
    {
      sku: 'BLT-V-A55',
      name: 'V-Belt A55',
      description: 'Classical V-belt, A-section, 55 inches',
      priceRetail: 210,
      stock: 60,
      categoryId: belts.id,
    },
  ];
  for (const p of parts) {
    await prisma.part.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
  }
  console.log(`Seeded ${parts.length} parts`);

  const machines = [
    { brand: 'John Deere', model: '6830', yearFrom: 2007, yearTo: 2012 },
    { brand: 'John Deere', model: '7830', yearFrom: 2007, yearTo: 2011 },
    { brand: 'Massey Ferguson', model: '5455', yearFrom: 2003, yearTo: 2008 },
    { brand: 'New Holland', model: 'T6.140', yearFrom: 2012, yearTo: 2018 },
  ];
  for (const m of machines) {
    await prisma.machine.upsert({
      where: { brand_model: { brand: m.brand, model: m.model } },
      update: {},
      create: m,
    });
  }
  console.log(`Seeded ${machines.length} machines`);

  const bearing = await prisma.part.findUniqueOrThrow({
    where: { sku: 'BRG-6206' },
  });
  const oilFilter = await prisma.part.findUniqueOrThrow({
    where: { sku: 'FLT-OIL-JD' },
  });
  const vbelt = await prisma.part.findUniqueOrThrow({
    where: { sku: 'BLT-V-A55' },
  });
  const jd6830 = await prisma.machine.findUniqueOrThrow({
    where: { brand_model: { brand: 'John Deere', model: '6830' } },
  });
  const jd7830 = await prisma.machine.findUniqueOrThrow({
    where: { brand_model: { brand: 'John Deere', model: '7830' } },
  });
  const mf5455 = await prisma.machine.findUniqueOrThrow({
    where: { brand_model: { brand: 'Massey Ferguson', model: '5455' } },
  });
  const nh = await prisma.machine.findUniqueOrThrow({
    where: { brand_model: { brand: 'New Holland', model: 'T6.140' } },
  });

  const compatibilities = [
    { partId: bearing.id, machineId: jd6830.id, note: 'Front axle' },
    { partId: bearing.id, machineId: jd7830.id, note: 'Front axle' },
    { partId: bearing.id, machineId: mf5455.id, note: null },
    { partId: oilFilter.id, machineId: jd6830.id, note: 'Engine oil filter' },
    { partId: oilFilter.id, machineId: jd7830.id, note: 'Engine oil filter' },
    { partId: vbelt.id, machineId: nh.id, note: 'Alternator belt' },
  ];
  for (const c of compatibilities) {
    await prisma.partCompatibility.upsert({
      where: {
        partId_machineId: { partId: c.partId, machineId: c.machineId },
      },
      update: {},
      create: c,
    });
  }
  console.log(`Seeded ${compatibilities.length} compatibilities`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
