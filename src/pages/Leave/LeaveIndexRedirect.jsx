import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const LeaveIndexRedirect = () => {
  const { user } = useSelector((state) => state.User || {})
  const role = user?.role || 'employee'

  if (role === 'manager') {
    return <Navigate to="manager-requests" replace />
  }

  return <Navigate to="my-leaves" replace />
}

export default LeaveIndexRedirect
