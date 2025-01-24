
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import stateApi from "../../api/consumer/stateApi";

// Async thunk for fetching data
export const fetchState = createAsyncThunk(
  "states/fetchState",
  async ( { rejectWithValue }) => {
    try {
      const response = await stateApi.states();
      if (response.status === 200 && response.data) {
        return response.data; // Ensure response contains valid data
        console.log(response.data);
        
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
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
