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
      icon: icon || 'https://www.svgrepo.com/show/353655/discord-icon.svg',
      owner: {
        connect: {
          id: ownerId,
        },
      },
      channels: {
        create: [
          {
            name: 'text',
            category: {
              connect: {
                id: 1,
              },
            },
          },
          {
            name: 'voice',
            category: {
              connect: {
                id: 2,
              },
            },
          },
        ],
      },
    },
    include: {
      members: true,
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
