import { Navigate, useLocation } from 'react-router-dom';
import { isMockAdminAuthenticated } from './utils/mockAdminAuth';

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isMockAdminAuthenticated()) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
