import { configureStore } from "@reduxjs/toolkit";
import notificationData from "./slices/consumer/notificationSlice";
import monthAheadData from "./slices/consumer/monthAheadSlice"; // Import other reducers as needed

export const store = configureStore({
  reducer: {
    notificationData: notificationData, // Add notificationData reducer
    monthAheadData: monthAheadData, // Add monthAheadData reducer
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values
    }),
});

export default store;

