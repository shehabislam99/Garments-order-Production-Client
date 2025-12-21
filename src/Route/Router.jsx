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
import BuyerProfile from "../Pages/MainDashboard/Buyer/MyProfile";
import ManageProducts from "../Pages/MainDashboard/Manager/ManageProducts";
import ApproveOrders from "../Pages/MainDashboard/Manager/ApproveOrders";
import MyOrder from "../Pages/MainDashboard/Buyer/MyOrder";
import PrivetRoute from "./PrivetRout";
import ErrorPage from "../Components/Common/ErrorBoundary/ErrorPage";
import AuthLayout from "../Layout/AuthLayout/AuthLayout";
import MainLayout from "../Layout/MainLayout/MainLayout";
import DashBoardLayout from "../Layout/DashBoardLayout/DashBoardLayout";
import AdminRout from "./AdminRout";
import AllOrders from "../Pages/MainDashboard/Admin/Allorders";
import ManagerRout from "./ManagerRout";
import Booking from "../Pages/Booking/Booking";
import PaymentSuccess from "../Pages/Payment/PaymentSuccess";
import PaymentCancelled from "../Pages/Payment/PaymentCanceled";
import UpdateProduct from "../Pages/MainDashboard/Manager/UpdateProduct";

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
        path: "/order/:id",
        element: <Booking />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-canceled",
        element: <PaymentCancelled />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
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
        path: "admin/all-products",
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
        path: "manager/pending-orders",
        element: (
          <ManagerRout>
            <PendingOrders />
          </ManagerRout>
        ),
      },
      {
        path: "manager/approved-orders",
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
      {
        path: "/dashboard/update-product/:id",
        element: (
          <ManagerRout>
            <UpdateProduct />
          </ManagerRout>
        ),
      },
      {
        path: "/dashboard/buyer",
        element: <BuyerDashboard />,
      },
      {
        path: "/dashboard/my-orders",
        element: <MyOrder />,
      },
      {
        path: "/dashboard/track-order/:orderId",
        element: <TrackOrder />,
      },
      {
        path: "/dashboard/my-profile",
        element: <BuyerProfile />,
      },
    ],
  },
]);

export default router;
