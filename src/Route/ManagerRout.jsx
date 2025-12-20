import React from 'react';
import useRole from '../Hooks/useRole';
import Forbidden from '../Components/Common/ErrorBoundary/Forbidden';
import useAuth from '../Hooks/useAuth';
import Loading from '../Components/Common/Loding/Loding';


const ManagerRout = ({ children }) => {
  const { loading, user } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || !user || roleLoading) {
    return <Loading></Loading>
  }

  if (role !== "manager") {
    return <Forbidden></Forbidden>
  }

  return children;
};


export default ManagerRout;