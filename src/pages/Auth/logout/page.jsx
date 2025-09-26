import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../../Slices/UserSlice";

const Logout = () => {
  const navigate = useNavigate();
const  dispatch=useDispatch()
  const onLogout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_LOCAL_API_URL}/api/auth/logout`,
       
      );

      const data = await res.json();
      console.log(data);
      

      if (res.ok) {

        dispatch(clearUser())
        navigate("/"); // redirect to homepage
      } else {
        alert(data.FailureMessage || "Logout failed!");
      }
    } catch (error) {
      alert(error.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    onLogout();
  }, []);

  // Always return some JSX
  return <p>Logging out...</p>;
};

export default Logout;
