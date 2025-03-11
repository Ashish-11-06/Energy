import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import planningApi from "../../api/generator/planningApi";

// Async thunk for updating notification
export const fetchPlanningDataG = createAsyncThunk(
  "planningData/fetchPlanningData",
  async (id, { rejectWithValue }) => { // Accept message as parameter
    console.log('user',id);
    try {
        console.log("User ID:", id, typeof id);
        const response = await planningApi.getPlanningData(Number(id)); 

      if (response.status === 200 && response.data) {
        
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
      .addCase(fetchPlanningDataG.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPlanningDataG.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.planningData = action.payload; // Store updated notification
      })
      .addCase(fetchPlanningDataG.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update notification";
      });
  },
});

export default planningSlice.reducer;
