import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { AUTH_STORAGE_KEY } from '../../constants/storage';

const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
const persistedAuth = savedAuth ? JSON.parse(savedAuth) : null;

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const authData = await authService.login(credentials);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    return authData;
  } catch (error) {
    const message = error.response?.data?.message || (error.request
      ? 'Unable to connect to the server. Please try again.'
      : 'Something went wrong. Please try again.');
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: persistedAuth?.user || null,
    token: persistedAuth?.token || null,
    isAuthenticated: Boolean(persistedAuth?.token),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(AUTH_STORAGE_KEY);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to sign in. Please try again.';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;