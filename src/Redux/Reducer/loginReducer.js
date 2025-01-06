const initialState = {
  loginType: 'consumer', // Default value
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOGIN_TYPE':
      return {
        ...state,
        loginType: action.payload, // Update loginType in the state
      };
    default:
      return state;
  }
};

export default loginReducer;
