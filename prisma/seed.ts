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

  await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      email: 'user@gmail.com',
      phone: '0956587909',
      passwordHash:
        '$2b$10$eLQhdyMD9VS.phD2tZ7uauNaJbf1nBTUpczZgWETjIf5.1XQiTwwm',
      name: 'user1',
      role: 'CUSTOMER',
    },
  });
  console.log('Seeded users');

  const categories = [
    { name: 'Bearings', slug: 'bearings' },
    { name: 'Filters', slug: 'filters' },
    { name: 'Belts', slug: 'belts' },
    { name: 'Hydraulic Hoses', slug: 'hydraulic-hoses' },
    { name: 'Seals', slug: 'seals' },
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }
  console.log(`Seeded ${categories.length} categories`);

  const parts = [
    {
      sku: 'BRG-6205',
      name: 'Deep Groove Ball Bearing 6205',
      description: 'Sealed deep groove ball bearing, 25x52x15mm',
      priceRetail: 280,
      stock: 40,
      categorySlug: 'bearings',
      oemCodes: [
        { code: '6205-2RS', brand: 'SKF' },
        { code: '6205-2RS1', brand: 'FAG' },
      ],
    },
    {
      sku: 'BRG-30205',
      name: 'Tapered Roller Bearing 30205',
      description: 'Single row tapered roller bearing for heavy axial loads',
      priceRetail: 540,
      stock: 18,
      categorySlug: 'bearings',
      oemCodes: [
        { code: '30205', brand: 'SKF' },
        { code: 'JR-30205', brand: 'Koyo' },
      ],
    },
    {
      sku: 'FLT-OIL-JD',
      name: 'Engine Oil Filter (John Deere compat.)',
      description: 'Spin-on oil filter, 3/4-16 UNF thread',
      priceRetail: 320,
      stock: 60,
      categorySlug: 'filters',
      oemCodes: [
        { code: 'RE504836', brand: 'John Deere' },
        { code: 'W940/25', brand: null },
      ],
    },
    {
      sku: 'FLT-AIR-C15',
      name: 'Air Filter C15',
      description: 'Radial-seal air filter for mid-size tractors',
      priceRetail: 450,
      stock: 35,
      categorySlug: 'filters',
      oemCodes: [
        { code: 'AF25557', brand: 'Fleetguard' },
        { code: 'P527682', brand: 'Donaldson' },
      ],
    },
    {
      sku: 'FLT-HYD-10',
      name: 'Hydraulic Oil Filter HF-10',
      description: 'In-line hydraulic filter, 10 micron',
      priceRetail: 610,
      stock: 22,
      categorySlug: 'filters',
      oemCodes: [
        { code: 'HF6177', brand: 'Fleetguard' },
        { code: 'BT8903', brand: 'Baldwin' },
      ],
    },
    {
      sku: 'BLT-VA42',
      name: 'V-Belt A-42',
      description: 'Classical V-belt, 13x1067 mm outer length',
      priceRetail: 180,
      stock: 80,
      categorySlug: 'belts',
      oemCodes: [{ code: 'A-42', brand: 'Gates' }],
    },
    {
      sku: 'BLT-TIM123',
      name: 'Timing Belt 123T',
      description: '123-tooth timing belt for combine harvester',
      priceRetail: 920,
      stock: 12,
      categorySlug: 'belts',
      oemCodes: [
        { code: '123ZA22', brand: 'Gates' },
        { code: 'TB123', brand: null },
      ],
    },
    {
      sku: 'HYD-HOSE-12-2M',
      name: 'Hydraulic Hose 1/2" x 2m',
      description: '2-wire braided hydraulic hose, 350 bar',
      priceRetail: 780,
      stock: 25,
      categorySlug: 'hydraulic-hoses',
      oemCodes: [{ code: '2SN-08-2M', brand: 'Parker' }],
    },
    {
      sku: 'SEAL-35-52-7',
      name: 'Shaft Seal 35x52x7',
      description: 'Rotary shaft oil seal, double-lip',
      priceRetail: 95,
      stock: 120,
      categorySlug: 'seals',
      oemCodes: [{ code: '35X52X7-TC', brand: 'Corteco' }],
    },
    {
      sku: 'SEAL-ORK-MM',
      name: 'Metric O-Ring Kit (382 pcs)',
      description: 'Assorted NBR O-rings, 1.5-50mm',
      priceRetail: 1450,
      stock: 8,
      categorySlug: 'seals',
      oemCodes: [{ code: 'ORK-382', brand: null }],
    },
    {
      sku: 'BRG-6206',
      name: 'Deep Groove Ball Bearing 6206',
      description: 'Sealed deep groove ball bearing, 30x62x16mm',
      priceRetail: 320,
      stock: 25,
      categorySlug: 'bearings',
      oemCodes: [
        { code: '6206-2RS', brand: 'SKF' },
        { code: '6206-2RS1', brand: 'FAG' },
      ],
    },
    {
      sku: 'BLT-V-A55',
      name: 'V-Belt A55',
      description: 'Classical V-belt, A-section, 55 inches',
      priceRetail: 210,
      stock: 60,
      categorySlug: 'belts',
      oemCodes: [],
    },
  ];

  for (const p of parts) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: p.categorySlug },
    });
    const part = await prisma.part.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        sku: p.sku,
        name: p.name,
        description: p.description,
        priceRetail: p.priceRetail,
        stock: p.stock,
        categoryId: category.id,
      },
    });
    for (const oem of p.oemCodes) {
      const exists = await prisma.oemCode.findFirst({
        where: { partId: part.id, code: oem.code, brand: oem.brand },
      });
      if (!exists) {
        await prisma.oemCode.create({
          data: { partId: part.id, code: oem.code, brand: oem.brand },
        });
      }
    }
  }
  console.log(`Seeded ${parts.length} parts (with OEM codes)`);

  const photos = [
    { sku: 'BRG-6205', url: '/uploads/1777040557493-569142880.jpeg', isPrimary: false },
    { sku: 'BRG-30205', url: '/uploads/1777040750879-877821533.jpeg', isPrimary: false },
    { sku: 'BRG-30205', url: '/uploads/1777040995321-26819477.jpeg', isPrimary: true },
  ];
  for (const ph of photos) {
    const part = await prisma.part.findUniqueOrThrow({ where: { sku: ph.sku } });
    const exists = await prisma.photo.findFirst({
      where: { partId: part.id, url: ph.url },
    });
    if (!exists) {
      await prisma.photo.create({
        data: { partId: part.id, url: ph.url, isPrimary: ph.isPrimary },
      });
    }
  }
  console.log(`Seeded ${photos.length} photo rows (files themselves only exist locally)`);

  const machines = [
    { brand: 'John Deere', model: '6830', yearFrom: 2007, yearTo: 2012 },
    { brand: 'John Deere 989', model: '6831', yearFrom: 2007, yearTo: 2012 },
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

  const compatibilities = [
    { partSku: 'BRG-6206', machine: { brand: 'John Deere', model: '6830' }, note: 'Front axle' },
    { partSku: 'BRG-6206', machine: { brand: 'John Deere', model: '7830' }, note: 'Front axle' },
    { partSku: 'BRG-6206', machine: { brand: 'Massey Ferguson', model: '5455' }, note: null },
    { partSku: 'FLT-OIL-JD', machine: { brand: 'John Deere', model: '6830' }, note: 'Engine oil filter' },
    { partSku: 'FLT-OIL-JD', machine: { brand: 'John Deere', model: '7830' }, note: 'Engine oil filter' },
    { partSku: 'BLT-V-A55', machine: { brand: 'New Holland', model: 'T6.140' }, note: 'Alternator belt' },
  ];
  for (const c of compatibilities) {
    const part = await prisma.part.findUniqueOrThrow({ where: { sku: c.partSku } });
    const machine = await prisma.machine.findUniqueOrThrow({
      where: { brand_model: c.machine },
    });
    await prisma.partCompatibility.upsert({
      where: {
        partId_machineId: { partId: part.id, machineId: machine.id },
      },
      update: {},
      create: { partId: part.id, machineId: machine.id, note: c.note },
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
