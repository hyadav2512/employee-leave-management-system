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

export const fetchLeaveRequests = createAsyncThunk('leave/fetchRequests', async (params, thunkAPI) => {
  try { return await leaveService.getLeaveRequests(params); }
  catch (error) { return thunkAPI.rejectWithValue(error.response?.status === 401 ? 'Your session has expired. Please sign in again.' : 'Unable to load your leave requests.'); }
});

export const fetchLeaveRequest = createAsyncThunk('leave/fetchRequest', async (id, thunkAPI) => {
  try { return await leaveService.getLeaveRequest(id); }
  catch (error) {
    const status = error.response?.status;
    return thunkAPI.rejectWithValue(status === 404 ? 'Leave request not found.' : status === 401 ? 'Your session has expired. Please sign in again.' : 'Unable to load this leave request.');
  }
});

export const cancelLeaveRequest = createAsyncThunk('leave/cancelRequest', async (id, thunkAPI) => {
  try { return await leaveService.cancelLeaveRequest(id); }
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Unable to cancel your leave request.'); }
});

const leaveSlice = createSlice({
  name: 'leave',
  initialState: { types: [], balances: [], loading: false, submitting: false, error: null, balanceError: null, requests: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }, details: null, detailsLoading: false, cancelling: false },
  reducers: { clearLeaveError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveInfo.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLeaveInfo.fulfilled, (state, action) => { state.loading = false; state.types = action.payload.types; state.balances = action.payload.balances; state.balanceError = action.payload.balanceError; })
      .addCase(fetchLeaveInfo.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(submitLeaveRequest.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(submitLeaveRequest.fulfilled, (state) => { state.submitting = false; })
      .addCase(submitLeaveRequest.rejected, (state, action) => { state.submitting = false; state.error = action.payload; });
    builder
      .addCase(fetchLeaveRequests.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => { state.loading = false; state.requests = action.payload.data; state.pagination = action.payload.pagination; })
      .addCase(fetchLeaveRequests.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchLeaveRequest.pending, (state) => { state.detailsLoading = true; state.error = null; state.details = null; })
      .addCase(fetchLeaveRequest.fulfilled, (state, action) => { state.detailsLoading = false; state.details = action.payload; })
      .addCase(fetchLeaveRequest.rejected, (state, action) => { state.detailsLoading = false; state.error = action.payload; })
      .addCase(cancelLeaveRequest.pending, (state) => { state.cancelling = true; state.error = null; })
      .addCase(cancelLeaveRequest.fulfilled, (state, action) => { state.cancelling = false; state.details = action.payload.request; })
      .addCase(cancelLeaveRequest.rejected, (state, action) => { state.cancelling = false; state.error = action.payload; });
  },
});

export const { clearLeaveError } = leaveSlice.actions;
export default leaveSlice.reducer;
