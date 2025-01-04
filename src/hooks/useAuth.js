import { useDispatch, useSelector } from 'react-redux';
import { login, logout, loadUserFromStorage } from '../Redux/Slices/loginSlice';
import { useEffect } from 'react';

const useAuth = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user, loading, error } = useSelector((state) => state.login);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const handleLogin = (credentials) => {
    return dispatch(login(credentials));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSendOtp = (email) => {
    // Simulate OTP sending logic
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`OTP sent to ${email}`);
      }, 1000);
    });
  };

  const handleVerifyOtp = (otp) => {
    // Simulate OTP verification logic
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === "123456") {
          resolve("OTP verified successfully!");
        } else {
          reject("Invalid OTP. Please try again.");
        }
      }, 1000);
    });
  };

  const handleResetPassword = (newPassword) => {
    // Simulate password reset logic
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Password reset successfully!");
      }, 1000);
    });
  };

  return {
    isLoggedIn,
    user,
    loading,
    error,
    handleLogin,
    handleLogout,
    handleSendOtp,
    handleVerifyOtp,
    handleResetPassword,
  };
};

export default useAuth;
