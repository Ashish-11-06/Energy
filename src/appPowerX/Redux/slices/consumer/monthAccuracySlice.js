import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import monthAccuracyApi from "../../api/consumer/monthAccuracyApi";
// Async thunk for fetching data
export const fetchAccuracyData = createAsyncThunk(
  "accuracyData/fetchAccuracyData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await monthAccuracyApi.fetchAccuracy();
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
const accuracyDataSlice = createSlice({
  name: "accuracyData",
  initialState: {
    accuracyData: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccuracyData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAccuracyData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accuracyData = action.payload;
      })
      .addCase(fetchAccuracyData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default accuracyDataSlice.reducer;
