import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dashboardApi from "../../api/generator/dashboardApi";


// Async thunk for fetching data
export const fetchDashboardDataG = createAsyncThunk(
  "dashboardData/fetchDashboardData",
  async (id, { rejectWithValue }) => { // Correctly pass rejectWithValue here
    try {
      console.log(id);
      
      const response = await dashboardApi.fetchDashboardG(id);  
      if (response.status === 200 && response.data) {
        console.log('response in slice',response);
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchDashboardLineG = createAsyncThunk(
  "dashboardData/fetchDashboardLine",
  async (id, { rejectWithValue }) => { // Correctly pass rejectWithValue here
    try {
      const response = await dashboardApi.fetchDashboardLineG(id);  
      if (response.status === 200 && response.data) {
        console.log('response in slice',response);
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice for matching IPP
const dashboardDataG = createSlice({
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
      .addCase(fetchDashboardDataG.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardDataG.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardDataG.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchDashboardLineG.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardLineG.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardLineData = action.payload;
      })
      .addCase(fetchDashboardLineG.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default dashboardDataG.reducer;
