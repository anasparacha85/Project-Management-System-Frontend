import React, { useState } from "react";
import "./ManagerLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ApiServices from "../../../../ApiService/ApiService";
import { setToken, setUser } from "../../../../Slices/UserSlice";

const ManagerLoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [Loading, setLoading] = useState(false)
  const navigate=useNavigate()
const dispatch=useDispatch()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async(e) => {
      setLoading(true)
    e.preventDefault();
    try {
        
   
        console.log("Form submitted:", formData);
    const res=await fetch(`${import.meta.env.VITE_LOCAL_API_URL}/api/auth/loginManager`,{
        method:'POST',
        body:JSON.stringify(formData),
        headers:{
            'Content-Type':'application/json'
        },
        credentials:'include'
    })
    const data=await res.json()
    if(res.ok){
      
        alert(data.SuccessMessage)
        navigate('/dashboard')
        localStorage.setItem('token',data.token)

        dispatch(setToken(localStorage.getItem('token')))
    }
    else{
        alert(data.FailureMessage)
    }
    console.log(data);
     } catch (error) {
        alert(error.message)
        
        console.log(error);
        
    }
    finally{
      setLoading(false)
    }
    

    // Add your signup logic here
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-heading">Loginas a Manager</h1>
        <p className="login-subheading">
          Not a Manager?{" "}
          <Link to="/employee-login" className="switch-link">
            Login as Employee
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="login-form">
         

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

         
           <button disabled={Loading} type="submit" className="login-btn">
          {Loading?"Loading...":"Login"} 
          </button>
        </form>
          <p className="login-subheading">
          don't have a account?{" "}
          <Link to="/manager-signup" className="switch-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ManagerLoginPage;
