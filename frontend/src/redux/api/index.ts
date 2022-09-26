import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authFetch } from '../../util/authFetch';
import { AppThunk } from '../store';
import type { initialApiState, Server } from './api.types';

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
  },
})

export const { resetApiState } = apiSlice.actions;

export default apiSlice.reducer;