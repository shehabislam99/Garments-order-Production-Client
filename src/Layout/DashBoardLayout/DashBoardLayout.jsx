import React, { useCallback, useState } from "react";
import { Outlet } from "react-router";
import Asidebar from "../../Components/Shared/AsideBar/AsideBar";
import Navbar from "../../Components/Shared/Header/Navbar";
import Footer from "../../Components/Shared/Footer/Footer";
import { TbSquareToggle } from "react-icons/tb";

const DashBoardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <div>
      <Navbar />
      <div className="relative flex flex-1">
        <button
          type="button"
          className="fixed left-4 top-24 z-40 rounded-xl bg-base-300 p-3 shadow-lg lg:hidden"
          onClick={openSidebar}
          aria-label="Open dashboard menu"
        >
          <TbSquareToggle className="text-2xl" />
        </button>
        <Asidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="min-w-0 flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashBoardLayout;
