
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import industryApi from "../../api/consumer/industryApi";
import availableSubscriptionPlanApi from "../../api/generator/availableSubscriptionPlanApi";

// Async thunk for fetching data
export const fetchSubscriptionPlan = createAsyncThunk(
  "subscriptionPlanG/fetchSubscriptionPlanG",
  async () => {
    // console.log('Fetching subscriptionPlan...');
    try {
      const response = await availableSubscriptionPlanApi.availableSubscriptionPlan();
    //   console.log(response.data);
      return response.data;
      
    } catch (error) {
      console.error("Error fetching subscription:", error);
      throw error;
    }
  }
);

// Slice for matching IPP
const subscriptionPlanGSlice = createSlice({
  name: "subscriptionPlanG",
  initialState: {
    subscriptionPlanG: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlanG.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubscriptionPlanG.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscriptionPlanG = action.payload;
      })
      .addCase(fetchSubscriptionPlanG.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default subscriptionPlanGSlice.reducer;
