import React from "react";
import { Outlet } from "react-router";
import Asidebar from "../../Components/Shared/AsideBar/AsideBar";

const DashBoardLayout = () => {
  return (
    <div className="flex">
      <Asidebar></Asidebar>
      <main className="flex-1 lg:ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashBoardLayout;
