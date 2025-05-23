import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';
import loginReducer from './Slices/loginSlice';
import consumerRequirementReducer from './Slices/Consumer/consumerRequirementSlice';
import portfolioReducer from './Slices/Generator/portfolioSlice';
import matchingConsumerReducer from './Slices/Generator/matchingConsumerSlice';
import optimizeCapacityReducer from './Slices/Generator/optimizeCapacitySlice';
import consumptionPatternReducer from './Slices/Generator/ConsumptionPatternSlice';
import termsAndConditionsReducer from './Slices/Generator/TermsAndConditionsSlice';
import matchingIPPSlice from './Slices/Consumer/matchingIPPSlice';
import monthlyDataReducer from './Slices/Consumer/monthlyConsumptionSlice';
import paymentReducer from './Slices/Consumer/paymentSlice';
import industry from './Slices/Consumer/industrySlice';
import states from './Slices/Consumer/stateSlice';
import Notifications from './Slices/notificationSlice';
import capacitySizingReducer from './Slices/Generator/capacitySizingSlice';

// Create app slice for the resetState action
const appSlice = createSlice({
  name: 'app',
  initialState: {},
  reducers: {
    resetState: () => ({}), // just for triggering reset
  },
});
export const { resetState } = appSlice.actions;

// Combine all reducers
const combinedReducer = combineReducers({
  app: appSlice.reducer,
  login: loginReducer,
  consumerRequirement: consumerRequirementReducer,
  portfolio: portfolioReducer,
  matchingConsumer: matchingConsumerReducer,
  optimizedCapacity: optimizeCapacityReducer,
  consumptionPattern: consumptionPatternReducer,
  termsAndConditions: termsAndConditionsReducer,
  matchingIPP: matchingIPPSlice,
  monthlyData: monthlyDataReducer,
  payment: paymentReducer,
  industry: industry,
  states: states,
  notifications: Notifications,
  capacitySizing: capacitySizingReducer,
});

// Root reducer to handle reset
const rootReducer = (state, action) => {
  if (action.type === resetState.type) {
    state = undefined; // Resets entire store to initial states of each slice
  }
  return combinedReducer(state, action);
};

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
