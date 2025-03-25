import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../Redux/Slices/loginSlice'; // Import the login action from your slice
import { useState } from 'react';

const useLogin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth); // Get loading and error from Redux state

  const [loginError, setLoginError] = useState(null); // Local error state for form-specific errors

  const login = async (credentials) => {
    setLoginError(null); // Reset any previous error

    try {
      // console.log("dispatch");
      const resultAction = await dispatch(loginUser(credentials)); // Dispatch login action
//  console.log(resultAction);
    //   if (loginUser.fulfilled.match(resultAction)) {
    //     return resultAction.payload; // Successful login, return user data
    //   } else {
    //     setLoginError(resultAction.payload); // Set error from rejected action
    //     return null;
    //   }
    return resultAction;
    } catch (err) {
      setLoginError(err.message || 'An unexpected error occurred');
      return null;
    }
  };

  return { login, loading, error: loginError };
};

export default useLogin;
