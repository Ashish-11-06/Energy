import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tradingApi from "../../api/consumer/tradingApii";

// Async thunk for fetching data
export const fetchTradingData = createAsyncThunk(
  "tradingData/fetchTradingData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await tradingApi.fetchTrading();
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
const tradingDataSlice = createSlice({
  name: "tradingData",
  initialState: {
    tradingData: { trade: [], plan: [] },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradingData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTradingData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tradingData = action.payload;
      })
      .addCase(fetchTradingData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default tradingDataSlice.reducer;
