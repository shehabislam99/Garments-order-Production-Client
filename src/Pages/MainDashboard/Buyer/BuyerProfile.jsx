
import React from "react";

import useAuth from "../../../Hooks/useAuth";
import Profile from "../../../Components/Shared/Profile";

const BuyerProfile = () => {
  const { user } = useAuth();
  return (
    <div>
      <Profile key={user} value={user}></Profile>
    </div>
  );
};




export default BuyerProfile;
