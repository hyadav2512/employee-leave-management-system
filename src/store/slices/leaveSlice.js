import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import leaveService from '../../services/leaveService';

export const fetchLeaveInfo = createAsyncThunk('leave/fetchInfo', async (_, thunkAPI) => {
  try {
    const results = await Promise.allSettled([leaveService.getLeaveTypes(), leaveService.getLeaveBalance()]);
    const typesResult = results[0];
    const balancesResult = results[1];
    if (typesResult.status === 'rejected') throw typesResult.reason;
    return {
      types: Array.isArray(typesResult.value) ? typesResult.value : [],
      balances: balancesResult.status === 'fulfilled' && Array.isArray(balancesResult.value) ? balancesResult.value : [],
      balanceError: balancesResult.status === 'rejected' ? 'Unable to load your leave balance.' : null,
    };
  } catch (error) {
    const message = error.response?.status === 401
      ? 'Your session has expired. Please sign in again.'
      : 'Unable to load leave information.';
    return thunkAPI.rejectWithValue(message);
  }
});

export const submitLeaveRequest = createAsyncThunk('leave/submit', async (request, thunkAPI) => {
  try {
    return await leaveService.createLeaveRequest(request);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to submit your leave request.');
  }
});

const leaveSlice = createSlice({
  name: 'leave',
  initialState: { types: [], balances: [], loading: false, submitting: false, error: null, balanceError: null },
  reducers: { clearLeaveError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveInfo.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLeaveInfo.fulfilled, (state, action) => { state.loading = false; state.types = action.payload.types; state.balances = action.payload.balances; state.balanceError = action.payload.balanceError; })
      .addCase(fetchLeaveInfo.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(submitLeaveRequest.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(submitLeaveRequest.fulfilled, (state) => { state.submitting = false; })
      .addCase(submitLeaveRequest.rejected, (state, action) => { state.submitting = false; state.error = action.payload; });
  },
});

export const { clearLeaveError } = leaveSlice.actions;
export default leaveSlice.reducer;
