import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  // If no token, redirect to Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child routes (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;