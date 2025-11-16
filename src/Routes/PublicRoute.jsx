import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = () => {
    const {token}=useSelector((state)=>state.User)
    const [isPublic, setIsPublic] = useState(null)
    
    useEffect(()=>{
        if(token){
            setIsPublic(false)
        } else {
            setIsPublic(true)
        }
    },[token])
    
    if(isPublic === null) return null
    if(!isPublic) return <Navigate to='/dashboard' replace/>
    
  return <Outlet />
}

export default PublicRoute
