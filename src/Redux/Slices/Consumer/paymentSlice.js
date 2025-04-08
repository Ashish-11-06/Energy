import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentAPI from "../../api/consumer/paymentApi"; 

// Create Razorpay Order
export const createRazorpayOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ amount, currency }, { rejectWithValue }) => {
    console.log(amount, currency);
    
    try {
      const response = await paymentAPI.payment({ amount, currency });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Complete Razorpay Payment
export const completeRazorpayPayment = createAsyncThunk(
  "payment/completePayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.completePayment(paymentData);
      return response.data;
    } catch (error) {
      // console.log(error.response?.data?.error?.non_field_errors);
      
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: { 
    loading: false, 
    order: null, 
    paymentStatus: null, 
    error: null 
  },
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.order = null;
      state.paymentStatus = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(completeRazorpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeRazorpayPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = action.payload;
      })
      .addCase(completeRazorpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
