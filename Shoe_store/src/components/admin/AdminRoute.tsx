import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";


interface Props {
  children: React.ReactElement;
}



const AdminRoute: React.FC<Props> = ({ children }) => {
  
  const user = useAppSelector((s) => s.auth.user);
  
  const location = useLocation();

  
  if (!user) {
    
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  
  
  const role = user.role?.toLowerCase();
  
  const isStaff = role === "staff" || role === "admin";

  
  if (!isStaff) {
    return <Navigate to="/" replace />;
  }

  
  return children;
};


export default AdminRoute;
