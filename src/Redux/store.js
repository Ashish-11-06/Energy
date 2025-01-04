import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './Slices/loginSlice'; // Import the loginReducer
import consumerRequirementReducer from './Slices/Consumer/consumerrequirementSlice'; // Import the consumerRequirementReducer

export const store = configureStore({
  reducer: {
    login: loginReducer, // Add loginReducer to the store
    consumerRequirement: consumerRequirementReducer, // Add consumerRequirementReducer to the store
    // ...other reducers
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
