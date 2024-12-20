import { configureStore } from '@reduxjs/toolkit';

// Dummy reducer
const dummyReducer = (state = {}, action) => {
  switch (action.type) {
    case 'dummy/action':
      return { ...state, dummyData: action.payload };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: {
    dummy: dummyReducer, // Add the dummy reducer here
  },
});

export default store;
