import prisma from '../lib/prisma';
import { HttpError } from '../middleware/error';
import type {
  CreateCompatibilityDto,
  UpdateCompatibilityDto,
  ListCompatibilitiesQueryDto,
} from '../schemas/compatibility.schema';

export async function list(query: ListCompatibilitiesQueryDto) {
  const { partId, machineId } = query;

  return prisma.partCompatibility.findMany({
    where: { partId, machineId },
    include: { part: true, machine: true },
  });
}

export async function create(dto: CreateCompatibilityDto) {
  const part = await prisma.part.findUnique({ where: { id: dto.partId } });
  if (!part) throw new HttpError(400, 'Part not found');

  const machine = await prisma.machine.findUnique({
    where: { id: dto.machineId },
  });
  if (!machine) throw new HttpError(400, 'Machine not found');

  const duplicate = await prisma.partCompatibility.findUnique({
    where: {
      partId_machineId: { partId: dto.partId, machineId: dto.machineId },
    },
  });
  if (duplicate) {
    throw new HttpError(409, 'Compatibility already exists');
  }

  return prisma.partCompatibility.create({
    data: dto,
    include: { part: true, machine: true },
  });
}

export async function update(
  partId: number,
  machineId: number,
  dto: UpdateCompatibilityDto,
) {
  const existing = await prisma.partCompatibility.findUnique({
    where: { partId_machineId: { partId, machineId } },
  });
  if (!existing) throw new HttpError(404, 'Compatibility not found');

  return prisma.partCompatibility.update({
    where: { partId_machineId: { partId, machineId } },
    data: dto,
    include: { part: true, machine: true },
  });
}

export async function remove(partId: number, machineId: number) {
  const existing = await prisma.partCompatibility.findUnique({
    where: { partId_machineId: { partId, machineId } },
  });
  if (!existing) throw new HttpError(404, 'Compatibility not found');

  return prisma.partCompatibility.delete({
    where: { partId_machineId: { partId, machineId } },
  });
}
