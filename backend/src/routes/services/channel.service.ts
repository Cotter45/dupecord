import { prisma } from '../../config/database';

import type { Channel } from '@prisma/client';

/**
 * Create a new channel
 * @param name - the channel name
 * @param serverId - the server id
 * @param categoryId? - the category id
 * @returns the channel
 * */
export const createChannel = async (
  name: string,
  serverId: number,
  categoryId?: number,
): Promise<Channel> => {
  if (!categoryId) {
    return await prisma.channel.create({
      data: {
        name,
        server: {
          connect: {
            id: +serverId,
          },
        },
      },
    });
  }

  const channel = await prisma.channel.create({
    data: {
      name,
      server: {
        connect: {
          id: +serverId,
        },
      },
      category: {
        connect: {
          id: +categoryId,
        },
      },
    },
  });

  return channel;
};

/**
 * Get a channel by id
 * @param id - the channel id
 * @returns the channel
 */
export const getChannelById = async (id: number): Promise<Channel | null> => {
  const channel = await prisma.channel.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      messages: {
        include: {
          author: true,
          likes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: 0,
        take: 50,
      },
    },
  });

  return channel;
};

/**
 * Update a channel
 * @param id - the channel id
 * @param name - the channel name
 * @param categoryId? - the category id
 * @returns the channel
 * */
export const updateChannel = async (
  id: number,
  name: string,
  categoryId?: number,
): Promise<Channel> => {
  if (!categoryId) {
    return await prisma.channel.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  const channel = await prisma.channel.update({
    where: {
      id,
    },
    data: {
      name,
      category: {
        connect: {
          id: +categoryId,
        },
      },
    },
  });

  return channel;
};

/**
 * Delete a channel
 * @param id - the channel id
 * @returns the channel
 * */
export const deleteChannel = async (id: number): Promise<Channel> => {
  const channel = await prisma.channel.delete({
    where: {
      id,
    },
  });

  return channel;
};
