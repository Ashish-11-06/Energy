import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../Redux/Slices/loginSlice";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const login = async ({ credentials }) => {
    setLoading(true);
    try {
      // Dispatch the login action and wait for the result
      const result = await dispatch(loginUser({ credentials })).unwrap();
      if (result.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export default useLogin;
