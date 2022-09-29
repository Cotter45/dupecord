import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authFetch } from '../../util/authFetch';
import { AppThunk } from '../store';
import type { Category, Channel, initialApiState, Server } from './api.types';

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

export const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    resetApiState: () => initialState,
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
  },
})

export const { resetApiState } = apiSlice.actions;

export default apiSlice.reducer;