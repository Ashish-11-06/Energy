
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import holidayListApi from "../../api/consumer/holidayListApi";

export const fetchHolidayList = createAsyncThunk(
  "holidayList/fetchSubscriptionPlan",
  async () => {
    try {
      const response = await holidayListApi.holidayList();
   // console.log("Holiday List Response:", response);
      
   // console.log(response.data);
      return response.data;
      
    } catch (error) {
      console.error("Error fetching holiday list:", error);
      throw error;
    }
  }
);

// Slice for matching IPP
const holidayListSlice = createSlice({
  name: "holidayList",
  initialState: {
    holidayList: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidayList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHolidayList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.holidayList = action.payload;
      })
      .addCase(fetchHolidayList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default holidayListSlice.reducer;
