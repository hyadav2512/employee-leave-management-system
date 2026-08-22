import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import dashboardService from '../../services/dashboardService';

export const fetchDashboard = createAsyncThunk('dashboard/fetchEmployee', async (_, thunkAPI) => {
  try {
    return await dashboardService.getEmployeeDashboard();
  } catch (error) {
    const message = error.response?.status === 401
      ? 'Your session has expired. Please sign in again.'
      : 'Unable to load your dashboard.';
    return thunkAPI.rejectWithValue(message);
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDashboard.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchDashboard.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default dashboardSlice.reducer;