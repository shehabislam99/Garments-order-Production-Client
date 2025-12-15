import React from 'react';
import useRole from '../Hooks/useRole';
import Loader from '../Components/Common/Loader/Loader';
import Forbidden from '../Components/Common/ErrorBoundary/Forbidden';
import useAuth from '../Hooks/useAuth';


const ManagerRout = ({ children }) => {
  const { loading, user } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || !user || roleLoading) {
    return <Loader></Loader>
  }

  if (role !== "manager") {
    return <Forbidden></Forbidden>
  }

  return children;
};


export default ManagerRout;