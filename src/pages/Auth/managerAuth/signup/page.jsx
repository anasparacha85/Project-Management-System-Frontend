import React, { useState } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";

const ManagerRegisterPage = () => {
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
    const res=await fetch(`${import.meta.env.VITE_LOCAL_API_URL}/api/auth/registerManager`,{
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
        alert(error.message)
        
        console.log(error);
        
    }
    

    // Add your signup logic here
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-heading">Signup as a Manager</h1>
        <p className="register-subheading">
          Not a Manager?{" "}
          <a href="/employee-signup" className="switch-link">
            Signup as Employee
          </a>
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
          <Link to="/" className="switch-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ManagerRegisterPage;
