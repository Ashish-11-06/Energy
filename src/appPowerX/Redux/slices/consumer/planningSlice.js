import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import planningApi from "../../api/consumer/planningApi";

// Async thunk for updating notification
export const fetchPlanningData = createAsyncThunk(
  "planningData/fetchPlanningData",
  async (id, { rejectWithValue }) => { // Accept message as parameter
    // console.log('user',id);
    try {
        // console.log("User ID:", id, typeof id);
        const response = await planningApi.getPlanningData(Number(id)); 
// console.log(response);

      if (response.status === 200 && response.data) {
        // console.log(response.data);
        return response.data;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
     
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Notification slice
const planningSlice = createSlice({
  name: "planningData",
  initialState: {
    planningData: null, // Notification is a single object, not an array
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanningData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPlanningData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.planningData = action.payload; // Store updated notification
      })
      .addCase(fetchPlanningData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update notification";
      });
  },
});

export default planningSlice.reducer;
