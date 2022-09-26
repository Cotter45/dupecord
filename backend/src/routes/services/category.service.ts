import { prisma } from '../../config/database';

import type { Category } from '@prisma/client';

/**
 * Create a new category
 * @param name - the category name
 * @returns the category
 * */
export const createCategory = async (name: string): Promise<Category> => {
  const category = await prisma.category.create({
    data: {
      name,
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

/**
 * Get a paginated list of categories
 * @param skip - the page number
 * @param take - the limit of categories per page
 * @returns the categories
 * */
export const getCategories = async (
  skip: number,
  take: number,
): Promise<Category[]> => {
  const categories = await prisma.category.findMany({
    skip,
    take,
  });

  return categories;
};
