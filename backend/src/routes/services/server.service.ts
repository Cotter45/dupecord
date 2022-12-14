import { prisma } from '../../config/database';

import type { Server } from '@prisma/client';

/**
 * Create a new server
 * @param name - the server name
 * @param ownerId - the owner id
 * @param icon - the server icon
 * @returns the server
 * */
export const newServer = async (
  name: string,
  ownerId: number,
  privateServer: boolean,
  icon: string,
): Promise<Server> => {
  const server = await prisma.server.create({
    data: {
      name,
      private: privateServer,
      icon: icon || '/dupecord.png',
      owner: {
        connect: {
          id: ownerId,
        },
      },
    },
  });

  const category1 = await prisma.category.create({
    data: {
      name: 'Text Channels',
      server: {
        connect: {
          id: server.id,
        },
      },
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Voice Channels',
      server: {
        connect: {
          id: server.id,
        },
      },
    },
  });

  await prisma.channel.create({
    data: {
      name: 'text',
      server: {
        connect: {
          id: server.id,
        },
      },
      category: {
        connect: {
          id: category1.id,
        },
      },
    },
  });

  await prisma.channel.create({
    data: {
      name: 'voice',
      server: {
        connect: {
          id: server.id,
        },
      },
      category: {
        connect: {
          id: category2.id,
        },
      },
    },
  });

  const fullServer = await prisma.server.findUnique({
    where: {
      id: server.id,
    },
    include: {
      members: true,
      categories: true,
      channels: {
        include: {
          category: true,
        },
      },
    },
  });

  return fullServer;
};

/**
 * Add a user to a server
 * @param serverId - the server id
 * @param userId - the user id
 * @returns the server
 */
export const joinServer = async (
  serverId: number,
  userId: number,
): Promise<Server> => {
  const server = await prisma.server.update({
    where: {
      id: serverId,
    },
    data: {
      members: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      members: true,
      categories: true,
      channels: {
        include: {
          category: true,
        },
      },
    },
  });

  return server;
};

/**
 * Get a server by id
 * @param id - the server id
 * @returns the server
 * */
export const getServerById = async (id: number): Promise<Server | null> => {
  const server = await prisma.server.findUnique({
    where: {
      id,
    },
    include: {
      members: true,
      categories: true,
      channels: {
        include: {
          category: true,
        },
      },
    },
  });

  return server;
};

/**
 * Search for server by name
 * @param name - the server name
 * @returns the server
 * */
export const searchServerByName = async (
  name: string,
): Promise<Server[] | null> => {
  const servers = await prisma.server.findMany({
    where: {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    },
    include: {
      _count: {
        select: {
          members: true,
        },
      },
      owner: true,
    },
  });

  return servers;
};

/**
 * Get all of a users servers
 * @param userId - the user id
 * @returns the servers
 * */
export const getServersByUserId = async (
  userId: number,
): Promise<Server[] | null> => {
  const servers = await prisma.server.findMany({
    where: {
      OR: [
        {
          owner: {
            id: userId,
          },
        },
        {
          members: {
            some: {
              id: userId,
            },
          },
        },
      ],
    },
    include: {
      categories: true,
      channels: {
        include: {
          category: true,
        },
      },
    },
  });

  return servers;
};

/**
 * Update a server
 * @param id - the server id
 * @param name - the server name
 * @param icon - the server icon
 * @returns the server
 * */
export const updateServer = async (
  id: number,
  name: string,
  privateServer: boolean,
  icon: string,
): Promise<Server | null> => {
  const server = await prisma.server.update({
    where: {
      id,
    },
    data: {
      name,
      icon,
      private: privateServer,
    },
    include: {
      categories: true,
      channels: {
        include: {
          category: true,
        },
      },
    },
  });

  return server;
};

/**
 * Delete a server
 * @param id - the server id
 * @returns the server
 * */
export const deleteServer = async (id: number): Promise<Server | null> => {
  const server = await prisma.server.delete({
    where: {
      id,
    },
  });

  return server;
};
