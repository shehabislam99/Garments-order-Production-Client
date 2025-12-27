
import React from "react";
import Profile from "../../../Components/Shared/Profile";
import useAuth from "../../../Hooks/useAuth";

const BuyerProfile = () => {
  const { user } = useAuth();
  return (
    <div>
      <Profile key={user} value={user}></Profile>
    </div>
  );
};




export default BuyerProfile;
