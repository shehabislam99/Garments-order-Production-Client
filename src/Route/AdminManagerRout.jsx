import React from "react";
import useRole from "../Hooks/useRole";
import Forbidden from "../Components/Common/ErrorBoundary/Forbidden";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Common/Loding/Loding";

const AdminManagerRout = ({ children }) => {
  const { loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <Loading></Loading>;
  }

  if (role !== "admin" && role !== "manager") {
    return <Forbidden></Forbidden>;
  }

  return children;
};

export default AdminManagerRout;
