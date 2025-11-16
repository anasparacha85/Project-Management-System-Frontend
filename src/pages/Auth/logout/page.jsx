import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser, setToken } from "../../../Slices/UserSlice";
import { resetNotifications } from "../../../Slices/NotificationSLice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setToken(null));
    localStorage.removeItem('token');
    dispatch(clearUser());
    dispatch(resetNotifications()); // Reset notification state on logout
    navigate('/');
  }, [dispatch, navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
