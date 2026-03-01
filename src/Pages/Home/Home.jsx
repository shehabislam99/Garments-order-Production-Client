import React from "react";
import Banner from "../../Components/Shared/HomeComponent/Banner";
import HomeProduct from "../../Components/Shared/HomeComponent/HomeProduct";
import HowWorks from "../../Components/Shared/HomeComponent/HowWorks";
import CustomerFeedback from "../../Components/Shared/HomeComponent/CustomerFeedback";
import PartnershipWith from "../../Components/Shared/HomeComponent/PartnershipWith";
import STAsection from "../../Components/Shared/HomeComponent/STAsection";
import WhatWeOffer from "../../Components/Shared/HomeComponent/WhatWeOffer";

const Home = () => {
  return (
    <div >
      <Banner></Banner>
      <HomeProduct></HomeProduct>
      <HowWorks></HowWorks>
      <WhatWeOffer></WhatWeOffer>
      <CustomerFeedback></CustomerFeedback>
      <PartnershipWith></PartnershipWith>
      <STAsection></STAsection>
    </div>
  );
};

export default Home;
