import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    
    const {token}=useSelector((state)=>state.User)
    const [isAuthorized, setIsAuthorized] = useState(null)
    
    useEffect(()=>{
        if(!token){
            setIsAuthorized(false)
        } else {
            setIsAuthorized(true)
        }
    },[token])
    
    if(isAuthorized === null) return null
    if(!isAuthorized) return <Navigate to='/' replace/>
    
  return <Outlet />
}

export default ProtectedRoute
