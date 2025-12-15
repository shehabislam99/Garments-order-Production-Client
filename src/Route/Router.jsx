import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import ProductDetailsPage from "../Pages/Products/ProductDetailsPage";
import AllProducts from "../Pages/Products/AllProducts";
import About from "../Pages/Stat/About";
import Contact from "../Pages/Stat/Contact";
import AdminDashboard from "../Pages/MainDashboard/Admin/AdminDashboard";
import ManageUsers from "../Pages/MainDashboard/Admin/ManageUsers";
import AllProductAdmin from "../Pages/MainDashboard/Admin/AllProductAdmin";
import Analytic from "../Pages/MainDashboard/Admin/Analytic";
import ManagerDashboard from "../Pages/MainDashboard/Manager/ManagerDashboard";
import AddProduct from "../Pages/MainDashboard/Manager/AddProduct";
import PendingOrders from "../Pages/MainDashboard/Manager/PendingOrders";
import ManagerProfile from "../Pages/MainDashboard/Manager/ManagerProfile";
import BuyerDashboard from "../Pages/MainDashboard/Buyer/BuyerDashboard";
import TrackOrder from "../Pages/MainDashboard/Buyer/TrackOrder";
import BookingForm from "../Pages/MainDashboard/Buyer/BookingForm";
import BuyerProfile from "../Pages/MainDashboard/Buyer/MyProfile";
import ManageProducts from "../Pages/MainDashboard/Manager/ManageProducts";
import ApproveOrders from "../Pages/MainDashboard/Manager/ApproveOrders";
import MyOrder from "../Pages/MainDashboard/Buyer/MyOrder";
import PrivetRoute from "./PrivetRout";
import ErrorPage from "../Components/Common/ErrorBoundary/ErrorPage";
import AuthLayout from "../Layout/AuthLayout/AuthLayout";
import MainLayout from "../Layout/MainLayout/MainLayout";
import DashBoardLayout from "../Layout/DashBoardLayout/DashBoardLayout";
import Forbidden from "../Components/Common/ErrorBoundary/Forbidden";
import AdminRout from "./AdminRout";
import AllOrders from "../Pages/MainDashboard/Admin/Allorders";
import ManagerRout from "./ManagerRout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/all-products",
        element: <AllProducts />,
      },
      {
        path: "/products/:id",
        element: <ProductDetailsPage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "*",
        element: <Forbidden></Forbidden>,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivetRoute>
        <DashBoardLayout></DashBoardLayout>,
      </PrivetRoute>
    ),
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "admin",
        element: (
          <AdminRout>
            <AdminDashboard />
          </AdminRout>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <AdminRout>
            <ManageUsers />
          </AdminRout>
        ),
      },
      {
        path: "admin/products",
        element: (
          <AdminRout>
            <AllProductAdmin />
          </AdminRout>
        ),
      },
      {
        path: "admin/all-orders",
        element: (
          <AdminRout>
            <AllOrders />
          </AdminRout>
        ),
      },
      {
        path: "admin/analytics",
        element: (
          <AdminRout>
            <Analytic />
          </AdminRout>
        ),
      },
      // {
      //   path: "admin/order/:id",
      //   element: (
      //     <AdminRout>
      //       <OrderDetails />
      //     </AdminRout>
      //   ),
      // },

      {
        path: "manager",
        element: (
          <ManagerRout>
            <ManagerDashboard />
          </ManagerRout>
        ),
      },
      {
        path: "manager/add-product",
        element: (
          <ManagerRout>
            <AddProduct />
          </ManagerRout>
        ),
      },
      {
        path: "manager/manage-products",
        element: (
          <ManagerRout>
            <ManageProducts />
          </ManagerRout>
        ),
      },
      {
        path: "manager/orders/pending",
        element: (
          <ManagerRout>
            <PendingOrders />
          </ManagerRout>
        ),
      },
      {
        path: "manager/orders/approved",
        element: (
          <ManagerRout>
            <ApproveOrders />
          </ManagerRout>
        ),
      },
      {
        path: "manager/profile",
        element: (
          <ManagerRout>
            <ManagerProfile />
          </ManagerRout>
        ),
      },

      // Buyer routes
      {
        path: "buyer",
        element: <BuyerDashboard />,
      },
      {
        path: "buyer/my-orders",
        element: <MyOrder />,
      },
      {
        path: "buyer/track-order",
        element: <TrackOrder />,
      },
      {
        path: "buyer/booking-order",
        element: <BookingForm />,
      },
      {
        path: "buyer/my-profile",
        element: <BuyerProfile />,
      },
      {
        path: "payment-success",
        element: <Contact />,
      },
      {
        path: "payment-cancel",
        element: <Contact />,
      },
    ],
  },
]);

export default router;
