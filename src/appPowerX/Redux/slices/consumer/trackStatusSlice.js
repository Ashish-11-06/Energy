import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import trackStatusApi from "../../api/consumer/trackStatusApi";

// Async thunk for fetching data
export const fetchTrackStatusData = createAsyncThunk(
  "fetchTrackStatusData/fetchTrackStatusData",
  async (id, { rejectWithValue }) => { // Correctly pass rejectWithValue here
    try {
      // console.log(id);
      
      const response = await trackStatusApi.fetchTrackStatus(id);  
      if (response.status === 200 && response.data) {
        // console.log('response in slice',response);
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTrackStatusGenerationData = createAsyncThunk(
  "fetchTrackStatusData/fetchTrackStatusGenerationData",
  async (id, { rejectWithValue }) => { // Correctly pass rejectWithValue here
    try {
      // console.log(id);
      
      const response = await trackStatusApi.fetchTrackStatusGenerationData(id);  
      if (response.status === 200 && response.data) {
        // console.log('response in slice',response);
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



// Slice for matching IPP
const trackStatusData = createSlice({
  name: "trackStatusData",
  initialState: {
    trackStatus: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrackStatusData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTrackStatusData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trackStatus = action.payload;
      })
      .addCase(fetchTrackStatusData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchTrackStatusGenerationData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTrackStatusGenerationData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trackStatus = action.payload;
      })
      .addCase(fetchTrackStatusGenerationData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
     
  },
});

export default trackStatusData.reducer;
