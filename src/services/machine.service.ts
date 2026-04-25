import prisma from '../lib/prisma';
import { HttpError } from '../middleware/error';
import type { Machine } from '../generated/prisma/client';
import type {
  CreateMachineDto,
  ListMachinesQueryDto,
} from '../schemas/machine.schema';

export async function list(query: ListMachinesQueryDto): Promise<Machine[]> {
  const { brand, search } = query;

  return prisma.machine.findMany({
    where: {
      brand: brand,
      OR: search
        ? [{ brand: { contains: search } }, { model: { contains: search } }]
        : undefined,
    },
    orderBy: [{ brand: 'asc' }, { model: 'asc' }],
  });
}

export async function create(dto: CreateMachineDto): Promise<Machine> {
  const duplicate = await prisma.machine.findUnique({
    where: { brand_model: { brand: dto.brand, model: dto.model } },
  });

  if (duplicate) {
    throw new HttpError(
      409,
      'Machine with this brand and model already exists',
    );
  }

  return prisma.machine.create({ data: dto });
}

export async function listParts(machineId: number) {
  const machine = await prisma.machine.findUnique({
    where: { id: machineId },
  });

  if (!machine) throw new HttpError(404, 'Machine not found');

  return prisma.part.findMany({
    where: { compatibilities: { some: { machineId } } },
    include: { category: true, oemCodes: true, photos: true },
    orderBy: { createdAt: 'desc' },
  });
}
