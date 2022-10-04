import { prisma } from '../../config/database';

import type { Like } from '@prisma/client';

/**
 * Get users liked messages
 * @param userId - the user id
 * @returns the messages ids
 */
export const getLikedMessages = async (userId: number): Promise<number[]> => {
  const likes = await prisma.like.findMany({
    where: {
      userId,
    },
    select: {
      messageId: true,
    },
  });

  return likes.map((like: Like) => like.messageId);
};

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
 * @param userId - the user id
 * @param messageId - the message id
 * @returns the like
 * */
export const deleteLike = async (
  userId: number,
  messageId: number,
): Promise<Like> => {
  const like = await prisma.like.findFirst({
    where: {
      userId,
      messageId,
    },
  });

  if (!like) {
    throw new Error('Like not found');
  }

  await prisma.like.delete({
    where: {
      id: like.id,
    },
  });

  return like;
};
