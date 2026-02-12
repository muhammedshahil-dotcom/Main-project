import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextBase";

const ProtectedRoute = ({ children, role }) => {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) return null;

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
