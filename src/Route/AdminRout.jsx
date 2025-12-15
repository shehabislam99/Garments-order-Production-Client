import React from "react";
import useRole from "../Hooks/useRole";
import Loader from "../Components/Common/Loader/Loader";
import Forbidden from "../Components/Common/ErrorBoundary/Forbidden";
import useAuth from "../Hooks/useAuth";

const AdminRout = ({ children }) => {
  const { loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <Loader></Loader>;
  }

  if (role !== "admin") {
    return <Forbidden></Forbidden>;
  }

  return children;
};

export default AdminRout;
