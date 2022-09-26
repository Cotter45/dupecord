import { prisma } from '../../config/database';

import type { Request } from '@prisma/client';

/**
 * Create a new request
 * @param senderId - the sender id
 * @param receiverId - the receiver id
 * @param status - the request status
 * @param type - the request type
 * @returns the request
 * */
export const createRequest = async (
  senderId: number,
  receiverId: number,
  status: string,
  type: string,
): Promise<Request> => {
  const request = await prisma.request.create({
    data: {
      sender: {
        connect: {
          id: senderId,
        },
      },
      receiver: {
        connect: {
          id: receiverId,
        },
      },
      status: status || 'pending',
      type,
    },
  });

  return request;
};

/**
 * Get a list of users requests
 * @param userId - the user id
 * @param skip - the page number
 * @param take - the limit of requests per page
 * @returns the requests
 * */
export const getRequestsByUserId = async (
  userId: number,
  skip: number,
  take: number,
): Promise<Request[]> => {
  const requests = await prisma.request.findMany({
    where: {
      receiverId: userId,
    },
    skip,
    take,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return requests;
};

/**
 * Get a list of outgoing users requests
 * @param userId - the user id
 * @param skip - the page number
 * @param take - the limit of requests per page
 * @returns the requests
 * */
export const getOutgoingRequestsByUserId = async (
  userId: number,
  skip: number,
  take: number,
): Promise<Request[]> => {
  const requests = await prisma.request.findMany({
    where: {
      senderId: userId,
    },
    skip,
    take,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return requests;
};

/**
 * Update a request
 * @param id - the request id
 * @param status - the request status
 * @returns the request
 * */
export const updateRequest = async (
  id: number,
  status: string,
): Promise<Request> => {
  const request = await prisma.request.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  return request;
};

/**
 * Delete a request
 * @param id - the request id
 * @returns the request
 * */
export const deleteRequest = async (id: number): Promise<Request> => {
  const request = await prisma.request.delete({
    where: {
      id,
    },
  });

  return request;
};
