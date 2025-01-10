
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AnnualSavingAPI from "../../api/consumer/annualSavingAPI";

// Async thunk for fetching data
export const FetchAnnualSaving = createAsyncThunk(
  "annualSaving/fetchByData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AnnualSavingAPI.getAnnualSaving(data);
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
const AnnualSavingSlice = createSlice({
  name: "annualSaving",
  initialState: {
    annualSaving: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchAnnualSaving.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(FetchAnnualSaving.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.annualSaving = action.payload;
      })
      .addCase(FetchAnnualSaving.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default AnnualSavingSlice.reducer;
