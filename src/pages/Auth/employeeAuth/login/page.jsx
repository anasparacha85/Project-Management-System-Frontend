import React, { useState } from "react";
import "./employeelogin.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../Slices/UserSlice";

const EmployeeLoginPage = () => {
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
    e.preventDefault();
    setLoading(true)
    try {
        
   
        console.log("Form submitted:", formData);
    const res=await fetch(`${import.meta.env.VITE_LOCAL_API_URL}/api/auth/loginEmployee`,{
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
        localStorage.setItem('token',data.token)
        navigate('/dashboard')
        dispatch(setToken(localStorage.getItem('token')))
    }
    else{
        alert(data.FailureMessage)
    }
    console.log(data);
     } catch (error) {
        alert(error.FailureMessage)
        
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
        <h1 className="login-heading">Login as a Employee</h1>
        <p className="login-subheading">
          Not a Employee?{" "}
          <Link to="/" className="switch-link">
            Login as Manager
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
          <Link to="/employee-signup" className="switch-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EmployeeLoginPage;
