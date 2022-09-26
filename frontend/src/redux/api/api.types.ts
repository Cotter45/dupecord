import type { User } from '../session/session.types';

export interface initialApiState {
  status: 'idle' | 'loading' | 'failed';
  servers: Server[];
  myServers: Server[];
  calls: Call[];
  chats: Chat[];
  friends: User[];
  requests: Request[];
  myRequests: Request[];
  messages: {
    // server ID 
    [key: number]: {
      // channel ID
      [key: number]: Message[];
    }
  }
}

export interface Server {
  id: number;
  name: string;
  icon: string;
  ownerId: number;
  private?: boolean;

  createdAt: Date;
  updatedAt: Date;

  owner: User;
  members: User[];
  channels: Channel[];
}

export interface Channel {
  id: number;
  name: string;
  serverId: number;
  categoryId?: number;

  createdAt: Date;
  updatedAt: Date;

  server: Server;
  category: Category;
  messages: Message[];
}

export interface Category {
  id: number;
  name: string;

  createdAt: Date;
  updatedAt: Date;

  channels: Channel[];
}

export interface Chat {
  id: number;
  name: string;

  createdAt: Date;
  updatedAt: Date;

  users: User[];
  messages: Message[];
}

export interface Message {
  id: number;
  content: string;
  attachment?: string;
  authorId: number;
  channelId?: number;
  chatId?: number;

  createdAt: Date;
  updatedAt: Date;

  author: User;
  channel: Channel;
  likes:Like[];
  chat?: Chat;
}

export interface Call {
  id: number;
  status  : string;
  
  createdAt: Date;
  updatedAt: Date;

  users: User[];
}

export interface Like {
  id: number;
  messageId: number;
  userId: number;

  createdAt: Date;
  updatedAt: Date;

  message: Message;
  user: User;
}

export interface Request {
  id: number;
  senderId: number;
  receiverId: number;
  status: string;
  type: string;

  createdAt: Date;
  updatedAt: Date;

  sender: User;
  receiver: User;
}