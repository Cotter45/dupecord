import { prisma } from '../../config/database';

import type { Message } from '@prisma/client';

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
