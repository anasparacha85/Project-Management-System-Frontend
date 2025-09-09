import React, { useState } from "react";
import "./employeesignup.css";
import { Link, useNavigate } from "react-router-dom";

const EmployeeRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate=useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        
   
        console.log("Form submitted:", formData);
    const res=await fetch(`${import.meta.env.VITE_LOCAL_API_URL}/api/auth/registerEmployee`,{
        method:'POST',
        body:JSON.stringify(formData),
        headers:{
            'Content-Type':'application/json'
        }
    })
    const data=await res.json()
    if(res.ok){
        alert(data.SuccessMessage)
        navigate('/')
    }
    else{
        alert(data.FailureMessage)
    }
    console.log(data);
     } catch (error) {
        alert(error.FailureMessage)
        
        console.log(error);
        
    }
    

    // Add your signup logic here
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-heading">Signup as a EMployee</h1>
        <p className="register-subheading">
          Not a Employee?{" "}
          <Link to="/manager-signup" className="switch-link">
            Signup as Manager
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange}
            required
          />

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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="register-btn">
            Signup
          </button>
        </form>
          <p className="register-subheading">
          Already have a account?{" "}
          <Link to="/employee-login" className="switch-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EmployeeRegisterPage;
