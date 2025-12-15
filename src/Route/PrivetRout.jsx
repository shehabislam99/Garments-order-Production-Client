import { Navigate, useLocation } from "react-router-dom";
import Loader from "../Components/Common/Loader/Loader";
import useAuth from "../Hooks/useAuth";

const PrivetRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader></Loader>

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default PrivetRoute;
