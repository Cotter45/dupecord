import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { prisma } from '../../config/database';
import { config } from '../../config/env';

import type { User } from '@prisma/client';
import { getUserByUsername } from './user.service';

/**
 * Validate a users password
 * @param userId - the user id
 * @param password - the password
 * @returns true or false
 */
export const validatePassword = async (
  userId: number,
  password: string,
): Promise<boolean> => {
  const hashedPassword = await prisma.password.findUnique({
    where: {
      userId,
    },
  });

  if (!hashedPassword) return false;

  const isValid = await bcrypt.compare(password, hashedPassword.password);

  return isValid;
};

/**
 * Creates a JWT from safe user data
 * @param user - the user
 * @returns the JWT
 */
export const createJWT = (user: User): string => {
  const { id, username, email } = user;

  const token = jwt.sign(
    {
      id,
      username,
      email,
    },
    config.jwtConfig.jwtSecret,
    {
      expiresIn: +config.jwtConfig.jwtExpiresIn,
    },
  );

  return token;
};

/**
 * Verify JWT and return new JWT
 * @param token - the JWT
 * @returns the new JWT
 */
export const verifyJWT = async (
  token: string,
): Promise<{ user: User; token: string } | ''> => {
  const decoded = jwt.verify(token, config.jwtConfig.jwtSecret);

  if (!decoded) return '';

  const { username } = decoded as { username: string };
  const user = await getUserByUsername(username);

  if (!user) return '';
  const newToken = createJWT(decoded as User);

  return { user, token: newToken };
};

/**
 * Validate JWT
 * @param token - the JWT
 * @returns true or false
 */
export const validateJWT = async (token: string): Promise<boolean> => {
  const decoded = jwt.verify(token, config.jwtConfig.jwtSecret);

  if (!decoded) return false;

  const { username } = decoded as { username: string };
  const user = await getUserByUsername(username);

  if (!user) return false;

  return true;
};
