import type { Call, Chat, Like, Message, Server } from "../api/api.types";

export interface InitialSessionState {
  user: User | undefined;
  status: 'idle' | 'loading' | 'failed';
}

export interface User {
  id: number;
  email: string;
  username: string;
  profilePicture: string;
  bio?: string;

  createdAt: Date;
  updatedAt: Date;

  password: string;
  servers: Server[];
  myServers: Server[];
  messages: Message[];
  calls: Call[];
  friends: User[]; 
  friendOf: User[];
  likes: Like[];
  requests: Request[];
  myRequests: Request[];
  chats: Chat[];
}

export interface Password {
  id: number;
  password: string;
  userId: number;

  createdAt: Date;
  updatedAt: Date;

  user: User;
}
