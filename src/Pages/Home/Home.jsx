import React from "react";
import Banner from "../../Components/Shared/HomeComponent/Banner";
import HomeProduct from "../../Components/Shared/HomeComponent/HomeProduct";
import HowWorks from "../../Components/Shared/HomeComponent/HowWorks";
import CustomerFeedback from "../../Components/Shared/HomeComponent/CustomerFeedback";
import PartnershipWith from "../../Components/Shared/HomeComponent/PartnershipWith";
import STAsection from "../../Components/Shared/HomeComponent/STAsection";


const Home = () => {
  

  return (
    <div className="bg-base-200">
      <Banner></Banner>
       <HomeProduct></HomeProduct>
      <HowWorks></HowWorks>
      <CustomerFeedback></CustomerFeedback>
      <PartnershipWith></PartnershipWith>
      <STAsection></STAsection>


    </div>
  );
};

export default Home;
