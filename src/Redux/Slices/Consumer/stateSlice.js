
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import stateApi from "../../api/consumer/stateApi";

// Async thunk for fetching data
export const fetchState = createAsyncThunk(
  "states/fetchState",
  async () => {
    // console.log('Fetching states...');
    try {
      const response = await stateApi.states();
      // console.log(response.data);
      return response.data;
      
    } catch (error) {
      console.error("Error fetching states:", error);
      throw error;
    }
  }
);

// Slice for matching IPP
const stateSlice = createSlice({
  name: "states",
  initialState: {
    state: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchState.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchState.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.states = action.payload;
      })
      .addCase(fetchState.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default stateSlice.reducer;
