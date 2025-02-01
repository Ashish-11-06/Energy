import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Create Razorpay Order
export const createRazorpayOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ amount, currency }, { rejectWithValue }) =>{
    try {
      const response = await fetch("http://192.168.1.47:8001/api/energy/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ amount, currency }), 
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeRazorpayPayment = createAsyncThunk(
  "payment/completePayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      console.log("Sending payment data:", paymentData); // Log payment data
      const response = await fetch("http://192.168.1.47:8001/api/energy/payment-transaction-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...paymentData, user: paymentData.user }), // Ensure user field is included
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Error response:", data); // Log error response
        throw new Error(data.message || 'Failed to complete payment');
      }

      return data;
    } catch (error) {
      console.error("Error completing payment:", error); // Log error
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: { order: null, paymentStatus: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.order = action.payload;
      })
      .addCase(completeRazorpayPayment.fulfilled, (state, action) => {
        state.paymentStatus = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(completeRazorpayPayment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
