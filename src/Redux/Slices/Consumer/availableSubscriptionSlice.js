
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import industryApi from "../../api/consumer/industryApi";
import availableSubscriptionApi from "../../api/consumer/availableSubscriptionApi";
availableSubscriptionApi
// Async thunk for fetching data
export const fetchSubscriptionPlan = createAsyncThunk(
  "subscriptionPlan/fetchSubscriptionPlan",
  async () => {
    // console.log('Fetching subscriptionPlan...');
    try {
      const response = await availableSubscriptionApi.availableSubscription();
    //   console.log(response.data);
      return response.data;
      
    } catch (error) {
      console.error("Error fetching subscription:", error);
      throw error;
    }
  }
);

// Slice for matching IPP
const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlan",
  initialState: {
    subscriptionPlan: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubscriptionPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscriptionPlan = action.payload;
      })
      .addCase(fetchSubscriptionPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default subscriptionPlanSlice.reducer;
