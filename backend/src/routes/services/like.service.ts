import { prisma } from '../../config/database';

import type { Like } from '@prisma/client';

/**
 * Create a new like
 * @param userId - the user id
 * @param messageId - the message id
 * @returns the like
 * */
export const createLike = async (
  userId: number,
  messageId: number,
): Promise<Like> => {
  const like = await prisma.like.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      message: {
        connect: {
          id: messageId,
        },
      },
    },
  });

  return like;
};

/**
 * Delete a like
 * @param likeId - the like id
 * @returns the like
 * */
export const deleteLike = async (likeId: number): Promise<Like> => {
  const like = await prisma.like.delete({
    where: {
      id: likeId,
    },
  });

  return like;
};
