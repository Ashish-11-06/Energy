import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import modelStatisticsApi from "../../api/consumer/modelStatistics";

// Async thunk for fetching data
export const fetchModelStatistics = createAsyncThunk(
  "tradingData/fetchModelStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await modelStatisticsApi.modelStatistics();
      if (response.status === 200 && response.data) {
        console.log('response in slice', response.data);
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice for trading data
const modelStatisticsSlice = createSlice({
  name: "modelStatistics",
  initialState: {
    modelStatistics: { trade: [], plan: [] },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModelStatistics.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchModelStatistics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.modelStatistics = action.payload;
      })
      .addCase(fetchModelStatistics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default modelStatisticsSlice.reducer;
