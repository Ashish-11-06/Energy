import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './Slices/loginSlice'; // Import the loginReducer
import consumerRequirementReducer from './Slices/Consumer/consumerRequirementSlice'; // Import the consumerRequirementReducer
import portfolioReducer from './Slices/Generator/portfolioSlice'; // Import the portfolioReducer
import matchingConsumerReducer from './Slices/Generator/matchingConsumerSlice'; // Import the matchingConsumerReducer

export const store = configureStore({
  reducer: {
    login: loginReducer, // Add loginReducer to the store
    consumerRequirement: consumerRequirementReducer, // Add consumerRequirementReducer to the store
    portfolio: portfolioReducer, // Add portfolioReducer to the store
    matchingConsumer: matchingConsumerReducer, // Add matchingConsumerReducer to the store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
