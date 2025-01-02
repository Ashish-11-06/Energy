// import { configureStore } from '@reduxjs/toolkit';

// // Dummy reducer
// const dummyReducer = (state = {}, action) => {
//   switch (action.type) {
//     case 'dummy/action':
//       return { ...state, dummyData: action.payload };
//     default:
//       return state;
//   }
// };

// export const store = configureStore({
//   reducer: {
//     dummy: dummyReducer, // Add the dummy reducer here
//   },
// });

// export default store;


import { createStore } from 'redux';
import { combineReducers } from 'redux';
import loginReducer from './Reducer/loginReducer'; // Adjust the import path

const rootReducer = combineReducers({
  login: loginReducer, // Add loginReducer to the rootReducer
});

const store = createStore(rootReducer);

export default store;
