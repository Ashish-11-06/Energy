
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import performaInvoiceApi from "../../api/consumer/performaInvoiceApi";

// Async thunk for fetching data
export const fetchPerformaById = createAsyncThunk(
  "performa/fetchById",
  async (requirementId, { rejectWithValue }) => {
    try {
      const response = await performaInvoiceApi.performa(requirementId);
      if (response.status === 200 && response.data) {
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice for matching IPP
const performaSlice = createSlice({
  name: "performa",
  initialState: {
    performa: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformaById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPerformaById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.performa = action.payload;
      })
      .addCase(fetchPerformaById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default performaSlice.reducer;
