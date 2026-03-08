import React from "react";
import HeroSection from "../../Components/Shared/HomeComponent/HeroSection";
import FeatureSection from "../../Components/Shared/HomeComponent/FeatureSection";
import HowWorks from "../../Components/Shared/HomeComponent/HowWorks";
import CustomerFeedback from "../../Components/Shared/HomeComponent/CustomerFeedback";
import PartnershipWith from "../../Components/Shared/HomeComponent/PartnershipWith";
import WhatWeOffer from "../../Components/Shared/HomeComponent/WhatWeOffer";
import IndustryStats from "../../Components/Shared/HomeComponent/IndustryStats";
import CallItAction from "../../Components/Shared/HomeComponent/CallItAction";

const Home = () => {
  return (
    <div >
      <HeroSection></HeroSection>
      <FeatureSection></FeatureSection>
      <HowWorks></HowWorks>
      <WhatWeOffer></WhatWeOffer>
      <CustomerFeedback></CustomerFeedback>
      <PartnershipWith></PartnershipWith>
      <IndustryStats></IndustryStats>
      <CallItAction></CallItAction>
    </div>
  );
};

export default Home;
