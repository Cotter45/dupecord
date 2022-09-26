import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';

import type { User } from '@prisma/client';

/**
 * Create a new user
 * @param username - the user username
 * @param email - the user email
 * @param password - the user password
 * @param profilePicture? - the user profile picture
 * @returns the user
 * */
export const createUser = async (
  username: string,
  email: string,
  password: string,
  profilePicture?: string,
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: {
        create: {
          password: hashedPassword,
        },
      },
      profilePicture:
        profilePicture ||
        'https://www.svgrepo.com/show/353655/discord-icon.svg',
    },
    include: {
      servers: true,
      myServers: true,
      messages: true,
      calls: true,
      friends: true,
      likes: true,
      requests: true,
      myRequests: true,
      chats: true,
    },
  });

  return user;
};

/**
 * Get a user by id
 * @param id - the user id
 * @returns the user
 * */
export const getUserById = async (id: number): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      servers: true,
      myServers: true,
      friends: true,
    },
  });

  return user;
};

/**
 * Get a user by username
 * @param username - the user username
 * @returns the user
 */
export const getUserByUsername = async (
  username: string,
): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  return user;
};

/**
 * Search for users by username or email
 * @param username - the user username
 * @param email - the user email
 * @returns the list of users
 * */
export const searchUserByUsernameOrEmail = async (
  username: string,
  email: string,
): Promise<User[] | null> => {
  const user = await prisma.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: username,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: email,
            mode: 'insensitive',
          },
        },
      ],
    },
  });

  return user;
};

/**
 * Update a user
 * @param id - the user id
 * @param username? - the user username
 * @param email? - the user email
 * @param profilePicture? - the user profile picture
 * @param bio? - the user bio
 * @returns the user
 * */
export const updateUser = async (
  id: number,
  username?: string,
  email?: string,
  profilePicture?: string,
  bio?: string,
): Promise<User | null> => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      username,
      email,
      profilePicture,
      bio,
    },
    include: {
      servers: true,
      myServers: true,
      friends: true,
      requests: true,
      myRequests: true,
      chats: true,
      calls: true,
    },
  });

  return user;
};

/**
 * Delete a user
 * @param id - the user id
 * @returns the user
 * */
export const deleteUser = async (id: number): Promise<User | null> => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  return user;
};
