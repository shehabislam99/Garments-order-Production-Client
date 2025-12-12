import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Components/Shared/Header/Navbar';
import Footer from '../Components/Shared/Footer/Footer';


const MainLayout = () => {
     return (
          <div>
          <Navbar></Navbar>
               <Outlet></Outlet>
               <Footer></Footer>
          </div>
     );
};

export default MainLayout;