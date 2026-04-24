import prisma from '../lib/prisma';
import { HttpError } from '../middleware/error';
import type { Category } from '../generated/prisma/client';
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../schemas/category.schema';

export async function list(): Promise<Category[]> {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function getById(id: number): Promise<Category> {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) throw new HttpError(404, 'Category not found');

  return category;
}

export async function create(dto: CreateCategoryDto): Promise<Category> {
  const duplicate = await prisma.category.findFirst({
    where: { OR: [{ name: dto.name }, { slug: dto.slug }] },
  });

  if (duplicate) {
    const field = duplicate.name === dto.name ? 'name' : 'slug';
    throw new HttpError(409, `Category with this ${field} already exists`);
  }

  return prisma.category.create({ data: dto });
}

export async function update(
  id: number,
  dto: UpdateCategoryDto,
): Promise<Category> {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) throw new HttpError(404, 'Category not found');

  if (dto.name && dto.name !== category.name) {
    const duplicate = await prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (duplicate) {
      throw new HttpError(409, 'Category with this name already exists');
    }
  }

  if (dto.slug && dto.slug !== category.slug) {
    const duplicate = await prisma.category.findUnique({
      where: { slug: dto.slug },
    });
    
    if (duplicate) {
      throw new HttpError(409, 'Category with this slug already exists');
    }
  }

  return prisma.category.update({ where: { id }, data: dto });
}

export async function remove(id: number): Promise<Category> {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new HttpError(404, 'Category not found');

  const part = await prisma.part.findFirst({ where: { categoryId: id } });
  if (part) {
    throw new HttpError(
      409,
      'Cannot delete this category because it has parts assigned to it',
    );
  }

  return prisma.category.delete({ where: { id } });
}
