import prisma from '../lib/prisma';
import { HttpError } from '../middleware/error';
import type {
  CreatePartDto,
  UpdatePartDto,
  ListPartsQueryDto,
} from '../schemas/part.schema';

export async function list(query: ListPartsQueryDto) {
  const { category, machineId, search, priceMin, priceMax } = query;

  return prisma.part.findMany({
    where: {
      categoryId: category,
      compatibilities: machineId ? { some: { machineId } } : undefined,
      priceRetail:
        priceMin !== undefined || priceMax !== undefined
          ? { gte: priceMin, lte: priceMax }
          : undefined,
      OR: search
        ? [
            { name: { contains: search } },
            { sku: { contains: search } },
            { description: { contains: search } },
          ]
        : undefined,
    },
    include: { category: true, oemCodes: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getById(id: number) {
  const part = await prisma.part.findUnique({
    where: { id },
    include: {
      category: true,
      oemCodes: true,
      compatibilities: { include: { machine: true } },
    },
  });

  if (!part) throw new HttpError(404, 'Part not found');

  return part;
}

export async function findByOemCode(code: string) {
  return prisma.part.findMany({
    where: { oemCodes: { some: { code } } },
    include: { category: true, oemCodes: true },
  });
}

export async function create(dto: CreatePartDto) {
  const existing = await prisma.part.findUnique({ where: { sku: dto.sku } });
  if (existing) throw new HttpError(409, 'Part with this SKU already exists');

  const category = await prisma.category.findUnique({
    where: { id: dto.categoryId },
  });
  if (!category) throw new HttpError(400, 'Category not found');

  const { oemCodes, ...partData } = dto;

  return prisma.part.create({
    data: {
      ...partData,
      oemCodes: oemCodes?.length ? { create: oemCodes } : undefined,
    },
    include: { oemCodes: true },
  });
}

export async function update(id: number, dto: UpdatePartDto) {
  const part = await prisma.part.findUnique({ where: { id } });
  if (!part) throw new HttpError(404, 'Part not found');

  if (dto.sku && dto.sku !== part.sku) {
    const duplicate = await prisma.part.findUnique({
      where: { sku: dto.sku },
    });
    if (duplicate) throw new HttpError(409, 'Part with this SKU already exists');
  }

  if (dto.categoryId && dto.categoryId !== part.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) throw new HttpError(400, 'Category not found');
  }

  const { oemCodes, ...partData } = dto;

  return prisma.$transaction(async (tx) => {
    if (oemCodes !== undefined) {
      await tx.oemCode.deleteMany({ where: { partId: id } });
    }
    return tx.part.update({
      where: { id },
      data: {
        ...partData,
        oemCodes: oemCodes?.length ? { create: oemCodes } : undefined,
      },
      include: { oemCodes: true },
    });
  });
}

export async function remove(id: number) {
  const part = await prisma.part.findUnique({ where: { id } });
  if (!part) throw new HttpError(404, 'Part not found');

  const inquiryItem = await prisma.inquiryItem.findFirst({
    where: { partId: id },
  });
  if (inquiryItem) {
    throw new HttpError(
      409,
      'Cannot delete this part because it is referenced by inquiries',
    );
  }

  return prisma.part.delete({ where: { id } });
}
