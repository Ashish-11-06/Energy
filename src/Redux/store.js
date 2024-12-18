import { configureStore } from '@reduxjs/toolkit';
// import loginReducer from './Slices/logInSlice';

export const store = configureStore({
  reducer: {
    // auth: loginReducer, // Add your reducers here
  },
});

export default store;