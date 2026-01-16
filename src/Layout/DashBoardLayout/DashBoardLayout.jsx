import React from "react";
import { Outlet } from "react-router";
import Asidebar from "../../Components/Shared/AsideBar/AsideBar";
import Navbar from "../../Components/Shared/Header/Navbar";
import Footer from "../../Components/Shared/Footer/Footer";

const DashBoardLayout = () => {

  return (
    <div>
      <Navbar />
      <div className="flex flex-1 ">
          <Asidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashBoardLayout;
