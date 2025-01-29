import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import termSheetApi from "../../api/TermSheetApi";

// Async thunk for fetching data
export const getOffers = createAsyncThunk(
  "offers/fetchById",
  async (user, { rejectWithValue }) => {
    try {
      const response = await termSheetApi.getTermSheet(user);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch data");
    }
  }
);

// Slice for matching IPP
const offersSlice = createSlice({
  name: "offers",
  initialState: {
    offers: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOffers.pending, (state) => {  // Corrected reference
        state.status = "loading";
        state.error = null;
      })
      .addCase(getOffers.fulfilled, (state, action) => {  // Corrected reference
        state.status = "succeeded";
        state.offers = action.payload;
      })
      .addCase(getOffers.rejected, (state, action) => {  // Corrected reference
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default offersSlice.reducer;
