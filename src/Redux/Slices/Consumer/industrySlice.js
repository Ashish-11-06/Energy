
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import industryApi from "../../api/consumer/industryApi";

// Async thunk for fetching data
export const fetchIndustry = createAsyncThunk(
  "industry/fetchIndustry",
  async () => {
    // console.log('Fetching industry...');
    try {
      const response = await industryApi.industry();
    //   console.log(response.data);
      return response.data;
      
    } catch (error) {
      console.error("Error fetching states:", error);
      throw error;
    }
  }
);

// Slice for matching IPP
const industrySlice = createSlice({
  name: "industry",
  initialState: {
    industry: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndustry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchIndustry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.industry = action.payload;
      })
      .addCase(fetchIndustry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default industrySlice.reducer;
