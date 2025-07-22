
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import pwattApi from "../../api/consumer/pwattApi";

// Async thunk for fetching data
export const addPWatt = createAsyncThunk(
  "pwatt/addPWatt",
  async (data, { rejectWithValue }) => {
    try {
      // console.log('calling pwattApi with data:', data);
      const response = await pwattApi.addPWatt(data);
      // console.log('response pwatt slice', response); // Not printed if above line throws
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
  console.error('❌ Error in addPWatt thunk:', error);
  return rejectWithValue(
    error.response?.data?.error ||  // ← handles backend error message
    error.response?.data?.message ||  // fallback
    error.message                   // generic fallback
  );
}

  }
);


// Slice for matching IPP
const pwattSlice = createSlice({
  name: "pwatt",
  initialState: {
    pwatt: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPWatt.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPWatt.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pwatt = action.payload;
      })
      .addCase(addPWatt.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default pwattSlice.reducer;
