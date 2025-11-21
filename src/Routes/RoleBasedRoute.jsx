import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.User);
  
  if (!user || !user.role) {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default RoleBasedRoute;

