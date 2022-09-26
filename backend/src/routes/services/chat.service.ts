import { prisma } from '../../config/database';

import type { Chat } from '@prisma/client';

/**
 * Create a new chat
 * @param name - the chat name
 * @param users - the users ids
 * @returns the chat
 * */
export const createChat = async (
  name: string,
  users: number[],
): Promise<Chat> => {
  const chat = await prisma.chat.create({
    data: {
      name,
      users: {
        connect: users.map((id) => ({ id })),
      },
    },
    include: {
      users: true,
      messages: true,
    },
  });

  return chat;
};

/**
 * Get a chat by id
 * @param id - the chat id
 * @returns the chat
 * */
export const getChatById = async (id: number): Promise<Chat | null> => {
  const chat = await prisma.chat.findUnique({
    where: {
      id,
    },
    include: {
      users: true,
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

  return chat;
};

/**
 * Get paginated chats for a user
 * @param userId - the users id
 * @param skip - the page number
 * @param take - the limit of chats per page
 * @returns the chats
 * */
export const getChatsByUserId = async (
  userId: number,
  skip: number,
  take: number,
): Promise<Chat[]> => {
  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          id: +userId,
        },
      },
    },
    include: {
      users: true,
    },
    skip,
    take,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return chats;
};

/**
 * Update a chat
 * @param id - the chat id
 * @param name - the chat name
 * @returns the chat
 * */
export const updateChat = async (id: number, name: string): Promise<Chat> => {
  const chat = await prisma.chat.update({
    where: {
      id,
    },
    data: {
      name,
    },
    include: {
      users: true,
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

  return chat;
};

/**
 * Delete a chat
 * @param id - the chat id
 * @returns the chat
 * */
export const deleteChat = async (id: number): Promise<Chat> => {
  const chat = await prisma.chat.delete({
    where: {
      id,
    },
  });

  return chat;
};
