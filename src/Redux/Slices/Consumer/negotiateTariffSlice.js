
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import negotiateTariffApi from "../../api/consumer/negotiateTariffApi";
// Async thunk for fetching data
export const negotiateTariff = createAsyncThunk(
  "negotiateTariff/negotiateTariff",
  async (data, { rejectWithValue }) => {
    // console.log(data);
    
    try {
      const response = await negotiateTariffApi.negotiateTariff(data);
      if (response.status === 200 && response.data) {
        return response.data; // Ensure response contains valid data

      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error);
    }
  }
);

// Slice for matching IPP
const negotiateTariffSlice = createSlice({
  name: "negotiateTariff",
  initialState: {
    negotiateTariff: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(negotiateTariff.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(negotiateTariff.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.negotiateTariff = action.payload;
      })
      .addCase(negotiateTariff.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to send data";
      });
  },
});

export default negotiateTariffSlice.reducer;
