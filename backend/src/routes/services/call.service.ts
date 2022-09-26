import { prisma } from '../../config/database';

import type { Call } from '@prisma/client';

/**
 * Create a new call
 * @param userId - the user id
 * @param status - the status of the call
 * @returns the call
 */
export const createCall = async (
  userId: number,
  status: string,
): Promise<Call> => {
  const call = await prisma.call.create({
    data: {
      status,
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return call;
};

/**
 * Get a call by id
 * @param id - the call id
 * @returns the call
 */
export const getCallById = async (id: number): Promise<Call | null> => {
  const call = await prisma.call.findUnique({
    where: {
      id,
    },
    include: {
      users: true,
    },
  });

  return call;
};

/**
 * Get paginated users calls
 * @param userId - the user id
 * @param skip - the page number
 * @param take - the limit of calls per page
 * @returns the calls
 */
export const getCallsByUserId = async (
  userId: number,
  skip: number,
  take: number,
): Promise<Call[]> => {
  const calls = await prisma.call.findMany({
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

  return calls;
};

/**
 * Update calls status
 * @param callId - the call id
 * @param status - the status of the call
 * @returns the call
 * */
export const updateCallStatus = async (
  callId: number,
  status: string,
): Promise<Call> => {
  const call = await prisma.call.update({
    where: {
      id: +callId,
    },
    data: {
      status,
    },
  });

  return call;
};

/**
 * Delete a call
 * @param callId - the call id
 * @returns the call
 * */
export const deleteCall = async (callId: number): Promise<Call> => {
  const call = await prisma.call.delete({
    where: {
      id: +callId,
    },
  });

  return call;
};
