import React from "react";
import { TbSquareToggle } from "react-icons/tb";
import { Outlet } from "react-router";
import Asidebar from "../../Components/Shared/AsideBar/AsideBar";
import Logo from "../../Components/Common/Logo/Logo";

const DashBoardLayout = () => {
  return (
    <div className="drawer drawer-mobile lg:drawer-open  mx-auto">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <nav className="navbar bg-base-300 px-4">
          <div className="navbar-start ">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-ghost btn-square"
            >
              <TbSquareToggle className="w-5 h-5 lg:hidden" />
            </label>
          </div>
          <div className="navbar-center">
            <Logo />
          </div>
          <div className="navbar-end"></div>
        </nav>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <Asidebar />
      </div>
    </div>
  );
};

export default DashBoardLayout;
