import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './Slices/loginSlice'; // Import the loginReducer
import consumerRequirementReducer from './Slices/Consumer/consumerRequirementSlice'; // Import the consumerRequirementReducer
import portfolioReducer from './Slices/Generator/portfolioSlice'; // Import the portfolioReducer
import matchingConsumerReducer from './Slices/Generator/matchingConsumerSlice'; // Import the matchingConsumerReducer
import optimizeCapacityReducer from './Slices/Generator/optimizeCapacitySlice'; // Import the optimizeCapacityReducer
import consumptionPatternReducer from './Slices/Generator/ConsumptionPatternSlice'; // Import the consumptionPatternReducer

export const store = configureStore({
  reducer: {
    login: loginReducer, // Add loginReducer to the store
    consumerRequirement: consumerRequirementReducer, // Add consumerRequirementReducer to the store
    portfolio: portfolioReducer, // Add portfolioReducer to the store
    matchingConsumer: matchingConsumerReducer, // Add matchingConsumerReducer to the store
    optimizedCapacity: optimizeCapacityReducer, // Add optimizeCapacityReducer to the store
    consumptionPattern: consumptionPatternReducer, // Add consumptionPatternReducer to the store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values
    }),
});

export default store;
