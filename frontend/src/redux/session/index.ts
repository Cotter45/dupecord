import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authFetch } from '../../util/authFetch';
import {
  User,
  InitialSessionState,
} from './session.types';
import { AppThunk } from '../store';
import { resetApiState } from '../api';

let interval: any;

export const login = createAsyncThunk(
  'session/login',
  async ({ username, password }: { username: string, password: string }, { rejectWithValue }) => {
    try {
      const data = await authFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      if (data && data.id) {
        interval = setInterval(() => {
          authFetch('/api/session')
            .then((res) => {
              if (!res) {
                clearInterval(interval);
              }
            });
        }, 1000 * 60 * 25); // 25 minutes
        return data;
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const restore = createAsyncThunk(
  'session/restore',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authFetch('/api/session');
      if (data && data.id) {
        interval = setInterval(() => {
          authFetch('/api/session')
            .then((res) => {
              if (!res) {
                clearInterval(interval);
              }
            });
        }, 1000 * 60 * 25); // 25 minutes
        return data;
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

export const signup = createAsyncThunk(
  'session/signupUser',
  async (user: Partial<User>, { rejectWithValue }) => {
    try {
      const data = await authFetch('/api/session/signup', {
        method: 'POST',
        body: JSON.stringify(user),
      });

      if (data && !data.message && data.id) {
        interval = setInterval(() => {
          authFetch('/api/session')
            .then((res) => {
              if (!res) {
                clearInterval(interval);
              }
            });
        }, 1000 * 60 * 25); // 25 minutes
        return data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const logout = (): AppThunk => async (dispatch: (arg0: { payload: undefined; type: string; }) => void) => {
  const data = await authFetch('/api/session', {
    method: 'DELETE',
  });
  if (data) {
    clearInterval(interval);
    dispatch(removeUser());
    dispatch(resetApiState());
  }
  return data;
};

const initialState: InitialSessionState = {
  user: undefined,
  status: 'idle',
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'idle';
        if (action.payload.id) {
          state.user = action.payload;
        }
      })
      .addCase(login.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(restore.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(restore.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'idle';
        if (action.payload.id) {
          state.user = action.payload;
        }
      })
      .addCase(restore.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'idle';
        if (action.payload.id) {
          state.user = action.payload;
        }
      })
      .addCase(signup.rejected, (state) => {
        state.status = 'failed';
      })
  },
});

export const { setUser, removeUser } = sessionSlice.actions;

export default sessionSlice.reducer;