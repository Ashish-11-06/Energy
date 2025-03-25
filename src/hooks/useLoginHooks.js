/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../Redux/Slices/loginSlice";

const useLoginHooks = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isForgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const dispatch = useDispatch();

  const login = async ({ credentials }) => {
    setLoading(true);
    try {
      const result = await dispatch(loginUser({ credentials })).unwrap();
      return result.success;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleCreate = (values) => {
    // console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const handleForgotPassword = () => {
    setForgotPasswordModalVisible(true);
  };

  const handleSendOtp = (email) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmailForReset(email);
      setOtpSent(true);
      message.success(`OTP sent to ${email}`);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setOtpVerified(true);
    message.success("OTP verified successfully!");
  };

  const handleResetPassword = (values) => {
    const { newPassword } = values;
    message.success("Password reset successfully!");
    setForgotPasswordModalVisible(false);
    setOtpSent(false);
    setOtpVerified(false);
    setEmailForReset("");
  };

  return {
    isModalVisible,
    setIsModalVisible,
    isForgotPasswordModalVisible,
    setForgotPasswordModalVisible,
    loading,
    setLoading,
    otpSent,
    setOtpSent,
    otpVerified,
    setOtpVerified,
    emailForReset,
    setEmailForReset,
    login,
    showModal,
    closeModal,
    handleCreate,
    handleForgotPassword,
    handleSendOtp,
    handleVerifyOtp,
    handleResetPassword,
  };
};

export default useLoginHooks;
