import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authFetch } from '../../util/authFetch';
import { AppThunk } from '../store';
import type { Category, Channel, initialApiState, Message, Server } from './api.types';

const initialState: initialApiState = {
  status: 'idle',
  servers: [],
  myServers: [],
  calls: [],
  chats: [],
  friends: [],
  requests: [],
  myRequests: [],
  messages: {},
  likedMessages: [],
}

export const getServers = createAsyncThunk(
  'api/getServers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authFetch('/api/servers');
      if (data) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const createServer = createAsyncThunk(
  'api/createServer',
  async (server: Partial<Server>, { rejectWithValue }) => {
    try {
      const data = await authFetch('/api/servers', {
        method: 'POST',
        body: JSON.stringify(server),
      });
      if (data) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const joinServer = createAsyncThunk(
  'api/joinServer',
  async (serverId: number, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/api/servers/${serverId}/join`, {
        method: 'POST',
      });
      if (data) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const editServer = createAsyncThunk(
  'api/editServer',
  async (server: Partial<Server>, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/api/servers/${server.id}`, {
        method: 'PATCH',
        body: JSON.stringify(server),
      });
      if (data) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const deleteServer = createAsyncThunk(
  'api/deleteServer',
  async (serverId: number, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/api/servers/${serverId}`, {
        method: 'DELETE',
      });
      if (data) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const createChannel = createAsyncThunk(
  'api/createChannel',
  async (channel: Partial<Channel>, { rejectWithValue }) => {
    try {
      const data = await authFetch('/api/channels', {
        method: 'POST',
        body: JSON.stringify(channel),
      });
      if (data && data.id) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const editChannel = createAsyncThunk(
  'api/editChannel',
  async (channel: Partial<Channel>, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/api/channels/${channel.id}`, {
        method: 'PATCH',
        body: JSON.stringify(channel),
      });
      if (data && data.id) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const deleteChannel = createAsyncThunk(
  'api/deleteChannel',
  async (channel: Partial<Channel>, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/api/channels/${channel.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ serverId: channel.serverId }),
      });
      if (data && data.id) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const createCategory = createAsyncThunk(
  'api/createCategory',
  async (category: Partial<Category>, { rejectWithValue }) => {
    try {
      const data = await authFetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify(category),
      });
      if (data && data.id) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const editCategory = createAsyncThunk(
  'api/editCategory',
  async (category: Partial<Category>, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/api/categories/${category.id}`, {
        method: 'PATCH',
        body: JSON.stringify(category),
      });
      if (data && data.id) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const deleteCategory = createAsyncThunk(
  'api/deleteCategory',
  async (category: Partial<Category>, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ serverId: category.serverId }),
      });
      if (data && data.id) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const getMessages = createAsyncThunk(
  'api/getMessages',
  async ({ channelId, skip, take }: { channelId: number, skip: number, take: number }, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/api/messages/${channelId}?skip=${skip}&take=${take}`);
      if (data) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const createChannelMessage = createAsyncThunk(
  'api/createChannelMessage',
  async (message: Partial<Message>, { rejectWithValue }) => {
    try {
      const data = await authFetch('/api/messages/channel', {
        method: 'POST',
        body: JSON.stringify(message),
      });
      if (data && data.id) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const updateMessage = createAsyncThunk(
  'api/updateMessage',
  async (message: Partial<Message>, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/api/messages/${message.id}`, {
        method: 'PATCH',
        body: JSON.stringify(message),
      });
      if (data && data.id) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const deleteMessage = createAsyncThunk(
  'api/deleteMessage',
  async (message: Partial<Message>, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/api/messages/${message.id}`, {
        method: 'DELETE',
      });
      if (data && data.id) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const getLikedMesssages = createAsyncThunk(
  'api/getLikedMesssages',
  async (userId: number, { rejectWithValue }) => {
    try {
      const data = await authFetch(`/api/likes/${userId}`);
      if (data) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const likeMessage = createAsyncThunk(
  'api/likeMessage',
  async ({ userId, messageId }: { userId: number; messageId: number }, { rejectWithValue }) => {
    try {
      const data = await authFetch('/api/likes/like', {
        method: 'POST',
        body: JSON.stringify({ userId, messageId }),
      });
      if (data && data.messageId) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const unlikeMessage = createAsyncThunk(
  'api/unlikeMessage',
  async ({ userId, messageId }: { userId: number; messageId: number }, { rejectWithValue }) => {
    try {
      const data = await authFetch('/api/likes/unlike', {
        method: 'DELETE',
        body: JSON.stringify({ userId, messageId }),
      });
      if (data && data.messageId) {
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });


export const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    resetApiState: () => initialState,
    replaceServer: (state, action: PayloadAction<Server>) => {
      state.servers = state.servers.map((server) => {
        if (server.id === action.payload.id) {
          return action.payload;
        }
        return server;
      });
    },
    addChannelMessage: (state, action: PayloadAction<Message>) => {
      if (action.payload && action.payload.channelId) {
        if (state.messages[action.payload.channelId]) {
         state.messages[action.payload.channelId].push(action.payload);
        } else {
          state.messages[action.payload.channelId] = [action.payload];
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getServers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getServers.fulfilled, (state, action: PayloadAction<Server[]>) => {
        state.status = 'idle';
        if (Array.isArray(action.payload)) {
          state.servers = action.payload;
        }
      })
      .addCase(getServers.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createServer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createServer.fulfilled, (state, action: PayloadAction<Server>) => {
        state.status = 'idle';
        if (action.payload.id) {
          state.servers.push(action.payload);
        }
      })
      .addCase(createServer.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(joinServer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(joinServer.fulfilled, (state, action: PayloadAction<Server>) => {
        state.status = 'idle';
        if (action.payload.id) {
          state.servers.push(action.payload);
        }
      })
      .addCase(joinServer.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(editServer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editServer.fulfilled, (state, action: PayloadAction<Server>) => {
        state.status = 'idle';
        if (action.payload.id) {
          const index = state.servers.findIndex((server) => server.id === action.payload.id);
          if (index !== -1) {
            state.servers[index] = action.payload;
          }
        }
      })
      .addCase(editServer.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(deleteServer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteServer.fulfilled, (state, action: PayloadAction<Server>) => {
        state.status = 'idle';
        if (action.payload.id) {
          const index = state.servers.findIndex((server) => server.id === action.payload.id);
          if (index !== -1) {
            state.servers.splice(index, 1);
          }
        }
      })
      .addCase(deleteServer.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createChannel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createChannel.fulfilled, (state, action: PayloadAction<Server>) => {
        state.status = 'idle';
        if (action.payload && action.payload.id) {
          const serverIndex = state.servers.findIndex((server) => server.id === action.payload.id);
          if (serverIndex !== -1) {
            state.servers[serverIndex] = action.payload;
          }
        }
      })
      .addCase(createChannel.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(editChannel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editChannel.fulfilled, (state, action: PayloadAction<Server>) => {
        state.status = 'idle';
        if (action.payload && action.payload.id) {
          const serverIndex = state.servers.findIndex((server) => server.id === action.payload.id);
          if (serverIndex !== -1) {
            state.servers[serverIndex] = action.payload;
          }
        }
      })
      .addCase(editChannel.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(deleteChannel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteChannel.fulfilled, (state, action: PayloadAction<Server>) => {
        state.status = 'idle';
        if (action.payload && action.payload.id) {
          const serverIndex = state.servers.findIndex((server) => server.id === action.payload.id);
          if (serverIndex !== -1) {
            state.servers[serverIndex] = action.payload;
          }
        }
      })
      .addCase(deleteChannel.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Server>) => {
        state.status = 'idle';
        if (action.payload && action.payload.id) {
          const serverIndex = state.servers.findIndex((server) => server.id === action.payload.id);
          if (serverIndex !== -1) {
            state.servers[serverIndex] = action.payload;
          }
        }
      })
      .addCase(createCategory.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(editCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editCategory.fulfilled, (state, action: PayloadAction<Server>) => {
        state.status = 'idle';
        if (action.payload && action.payload.id) {
          const serverIndex = state.servers.findIndex((server) => server.id === action.payload.id);
          if (serverIndex !== -1) {
            state.servers[serverIndex] = action.payload;
          }
        }
      })
      .addCase(editCategory.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<Server>) => {
        state.status = 'idle';
        if (action.payload && action.payload.id) {
          const serverIndex = state.servers.findIndex((server) => server.id === action.payload.id);
          if (serverIndex !== -1) {
            state.servers[serverIndex] = action.payload;
          }
        }
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(getMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getMessages.fulfilled, (state, action: PayloadAction<{ messages: Message[], channelId: number }>) => {
        state.status = 'idle';
        if (action.payload && action.payload.channelId)
          state.messages[action.payload.channelId] = action.payload.messages;
      })
      .addCase(getMessages.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createChannelMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createChannelMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.status = 'idle';
        if (action.payload && action.payload.channelId) {
          const messages = state.messages[action.payload.channelId];
          if (messages) {
            messages.push(action.payload);
          }
        }
      })
      .addCase(createChannelMessage.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.status = 'idle';
        if (action.payload && action.payload.channelId) {
          const messages = state.messages[action.payload.channelId];
          if (messages) {
            const message = messages.findIndex((message) => message.id === action.payload.id);
            if (message === -1) {
              messages.push(action.payload);
            } else {
              messages[message] = action.payload;
            }
          }
        }
      })
      .addCase(updateMessage.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(deleteMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteMessage.fulfilled, (state, action: PayloadAction<Message>) => {
        state.status = 'idle';
        if (action.payload && action.payload.channelId) {
          const messages = state.messages[action.payload.channelId];
          if (messages) {
            const message = messages.findIndex((message) => message.id === action.payload.id);
            if (message !== -1) {
              messages.splice(message, 1);
            }
          }
        }
      })
      .addCase(deleteMessage.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(getLikedMesssages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLikedMesssages.fulfilled, (state, action: PayloadAction<number[]>) => {
        state.status = 'idle';
        if (action.payload) {
          state.likedMessages = action.payload;
        }
      })
      .addCase(getLikedMesssages.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(likeMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(likeMessage.fulfilled, (state, action: PayloadAction<{ messageId: number, message: Message }>) => {
        state.status = 'idle';
        state.likedMessages.push(action.payload.messageId);

        if (action.payload && action.payload.message.channelId) {
          const messages = state.messages[action.payload.message.channelId];
          if (messages) {
            const messageIndex = messages.findIndex((message) => message.id === action.payload.message.id);
            if (messageIndex !== -1) {
              messages[messageIndex] = action.payload.message;
            }
          }
        }
      })
      .addCase(likeMessage.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(unlikeMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(unlikeMessage.fulfilled, (state, action: PayloadAction<{ messageId: number, message: Message }>) => {
        state.status = 'idle';
        const index = state.likedMessages.findIndex((messageId) => messageId === action.payload.messageId);
        if (index !== -1) {
          state.likedMessages.splice(index, 1);
        }
        if (action.payload.message.channelId) {
          const messageIndex = state.messages[action.payload.message.channelId].findIndex((message) => message.id === action.payload.messageId);

          if (messageIndex !== -1) {
            state.messages[action.payload.message.channelId][messageIndex] = action.payload.message;
          }
        }
      })
      .addCase(unlikeMessage.rejected, (state) => {
        state.status = 'failed';
      })

  },
})

export const { resetApiState, addChannelMessage, replaceServer } = apiSlice.actions;

export default apiSlice.reducer;