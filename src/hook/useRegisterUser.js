import { useDispatch } from 'react-redux';
import { registerUser } from '../Redux/Slices/userSlice';// Import your registerUser async action
import { message } from 'antd';

const useRegisterUser = () => {
  const dispatch = useDispatch();

  // Function to handle user registration
  const register = async (userDetails) => {
    // console.log(userDetails);
    try {
      // Dispatch the registerUser action with user details
      const action = await dispatch(registerUser(userDetails));
      
      if (action?.payload) {
        message.success('Registration successful!');
      }
    } catch (error) {
      message.error('Registration failed! Please try again.');
    }
  };

  return {
    register,
  };
};

export default useRegisterUser;
