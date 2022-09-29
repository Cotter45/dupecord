import { prisma } from '../../config/database';

import type { Category } from '@prisma/client';

/**
 * Create a new category
 * @param name - the category name
 * @param serverId - the server id
 * @returns the category
 * */
export const createCategory = async (
  name: string,
  serverId: number,
): Promise<Category> => {
  const category = await prisma.category.create({
    data: {
      name,
      server: {
        connect: {
          id: +serverId,
        },
      },
    },
  });

  return category;
};

/**
 * Edit a category
 * @param id - the category id
 * @param name - the category name
 * @returns the category
 * */
export const updateCategory = async (
  id: number,
  name: string,
): Promise<Category> => {
  const category = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return category;
};

/**
 * Delete a category
 * @param id - the category id
 * @returns the category
 * */
export const deleteCategory = async (id: number): Promise<Category> => {
  const category = await prisma.category.delete({
    where: {
      id,
    },
  });

  return category;
};

/**
 * Check if a category exists
 * @param name - the category name
 * @returns true if the category exists
 * */
export const categoryExists = async (name: string): Promise<boolean> => {
  const category = await prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
    },
  });

  return !!category;
};
