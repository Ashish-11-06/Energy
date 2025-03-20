import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dashboardApi from "../../api/consumer/dashboardApi";

// Async thunk for fetching data
export const fetchDashboardData = createAsyncThunk(
  "dashboardData/fetchDashboardData",
  async (id, { rejectWithValue }) => { // Correctly pass rejectWithValue here
    try {
      // console.log(id);
      
      const response = await dashboardApi.fetchDashboard(id);  
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

export const fetchDashboardLine = createAsyncThunk(
  "dashboardData/fetchDashboardLine",
  async (id, { rejectWithValue }) => { // Correctly pass rejectWithValue here
    try {
      const response = await dashboardApi.fetchDashboardLine(id);  
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
const dashboardData = createSlice({
  name: "dashboardData",
  initialState: {
    dashboardData: [],
    dashboardLineData:[],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(dashboardData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(dashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardData = action.payload;
      })
      .addCase(dashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchDashboardLine.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardLine.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardLineData = action.payload;
      })
      .addCase(fetchDashboardLine.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default dashboardData.reducer;
