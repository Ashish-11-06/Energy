
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import offlinePaymentApi from "../../api/consumer/offlinePaymentApi";

// Async thunk for fetching data
export const addOfflinePayment = createAsyncThunk(
  "offlinePayment/addOfflinePayment",
  async (data, { rejectWithValue }) => {
    try {
        console.log('data',data);  
      const response = await offlinePaymentApi.addOfflinePayment(data);
      console.log('res slice',response)
      if (response.status === 201 && response.data) {
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error);
    }
  }
);

// Slice for matching IPP
const offlinePaymentSlice = createSlice({
  name: "offlinePayment",
  initialState: {
    offlinePayment: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addOfflinePayment.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addOfflinePayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.offlinePayment = action.payload;
      })
      .addCase(addOfflinePayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default offlinePaymentSlice.reducer;
