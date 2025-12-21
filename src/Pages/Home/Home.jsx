import React from "react";
import Banner from "../../Components/Shared/HomeComponent/Banner";
import HomeProduct from "../../Components/Shared/HomeComponent/HomeProduct";
import HowWorks from "../../Components/Shared/HomeComponent/HowWorks";
import CustomerFeedback from "../../Components/Shared/HomeComponent/CustomerFeedback";
import Feature from "../../Components/Shared/HomeComponent/Feature";
import CTAsection from "../../Components/Shared/HomeComponent/CTAsection";

const Home = () => {
  

  return (
    <div>
      <Banner></Banner>
       <HomeProduct></HomeProduct>
      <HowWorks></HowWorks>
      <CustomerFeedback></CustomerFeedback>
      <Feature></Feature>
      <CTAsection></CTAsection>


    </div>
  );
};

export default Home;
