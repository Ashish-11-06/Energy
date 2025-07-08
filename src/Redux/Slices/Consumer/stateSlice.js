
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
export const fetchDistricts = createAsyncThunk(
  "states/fetchDistricts",
  async (stateName) => {
    console.log('Fetching states name',stateName);
    try {
      const response = await stateApi.districts(stateName);
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
    district:[],
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
      })
      .addCase(fetchDistricts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.district = action.payload;
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default stateSlice.reducer;
