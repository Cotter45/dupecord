import { prisma } from '../../config/database';

import type { Message } from '@prisma/client';

/**
 * Get message by id
 * @param messageId - the message id
 * @returns the message
 */
export const getMessageById = async (messageId: number): Promise<Message> => {
  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
    },
    include: {
      author: true,
      likes: true,
    },
  });

  return message;
};

/**
 * Get messages by channel id
 * @param channelId - the channel id
 * @returns the messages
 */
export const getMessagesByChannelId = async (
  channelId: number,
  skip: number,
  take: number,
): Promise<Message[]> => {
  const messages = await prisma.message.findMany({
    where: {
      channelId,
    },
    skip,
    take,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true,
      likes: true,
    },
  });

  return messages;
};

/**
 * Create a new message for a chat
 * @param content - the message content
 * @param authorId - the author id
 * @param chatId - the chat id
 * @param attachment? - the attachment
 * @returns the message
 * */
export const createChatMessage = async (
  content: string,
  authorId: number,
  chatId: number,
  attachment?: string,
): Promise<Message> => {
  const message = await prisma.message.create({
    data: {
      content,
      attachment: attachment || null,
      chat: {
        connect: {
          id: chatId,
        },
      },
      author: {
        connect: {
          id: authorId,
        },
      },
    },
  });

  return message;
};

/**
 * Create a message for a channel
 * @param content - the message content
 * @param authorId - the author id
 * @param channelId - the channel id
 * @param attachment? - the attachment
 * @returns the message
 * */
export const createChannelMessage = async (
  content: string,
  authorId: number,
  channelId: number,
  attachment?: string,
): Promise<Message> => {
  const message = await prisma.message.create({
    data: {
      content,
      attachment: attachment || null,
      channel: {
        connect: {
          id: channelId,
        },
      },
      author: {
        connect: {
          id: authorId,
        },
      },
    },
    include: {
      author: true,
      likes: true,
      channel: true,
    },
  });

  return message;
};

/**
 * Update a message
 * @param id - the message id
 * @param content - the message content
 * @returns the message
 * */
export const updateMessage = async (
  id: number,
  content: string,
): Promise<Message> => {
  const message = await prisma.message.update({
    where: {
      id,
    },
    data: {
      content,
    },
    include: {
      author: true,
      likes: true,
    },
  });

  return message;
};

/**
 * Delete a message
 * @param id - the message id
 * @returns the message
 * */
export const deleteMessage = async (id: number): Promise<Message> => {
  const message = await prisma.message.delete({
    where: {
      id,
    },
  });

  return message;
};
