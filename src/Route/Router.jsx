import { createBrowserRouter } from "react-router-dom";
// import Layout from "../components/Layout/Layout";
import Home from "../Pages/Home/Home";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import MainLayout from "../MainLAyout/MainLayout";
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
import BuyerProfile from "../Pages/MainDashboard/Buyer/BuyerProfile";
import Allorders from "../Pages/MainDashboard/Admin/Allorders";
import ManageProducts from "../Pages/MainDashboard/Manager/ManageProducts";
import ApproveOrders from "../Pages/MainDashboard/Manager/ApproveOrders";
import MyOrder from "../Pages/MainDashboard/Buyer/MyOrder";
import PrivetRoute from "../Components/Common/PrivetRout/PrivetRout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/products",
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
        path: "/payment-success",
        element: <Contact />,
      },
      {
        path: "/payment-cancel",
        element: <Contact />,
      },

      {
        path: "/admin/dashboard",
        element: (
          <PrivetRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivetRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <PrivetRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </PrivetRoute>
        ),
      },
      {
        path: "/admin/products",
        element: (
          <PrivetRoute allowedRoles={["admin"]}>
            <AllProductAdmin />
          </PrivetRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <PrivetRoute allowedRoles={["admin"]}>
            <Allorders />
          </PrivetRoute>
        ),
      },
      {
        path: "/admin/analytics",
        element: (
          <PrivetRoute allowedRoles={["admin"]}>
            <Analytic />
          </PrivetRoute>
        ),
      },

      // Manager routes
      {
        path: "/manager/dashboard",
        element: (
          <PrivetRoute allowedRoles={["manager"]}>
            <ManagerDashboard />
          </PrivetRoute>
        ),
      },
      {
        path: "/manager/add-product",
        element: (
          <PrivetRoute allowedRoles={["manager"]}>
            <AddProduct />
          </PrivetRoute>
        ),
      },
      {
        path: "/manager/products",
        element: (
          <PrivetRoute allowedRoles={["manager"]}>
            <ManageProducts />
          </PrivetRoute>
        ),
      },
      {
        path: "/manager/orders/pending",
        element: (
          <PrivetRoute allowedRoles={["manager"]}>
            <PendingOrders />
          </PrivetRoute>
        ),
      },
      {
        path: "/manager/orders/approved",
        element: (
          <PrivetRoute allowedRoles={["manager"]}>
            <ApproveOrders />
          </PrivetRoute>
        ),
      },
      {
        path: "/manager/profile",
        element: (
          <PrivetRoute allowedRoles={["manager"]}>
            <ManagerProfile />
          </PrivetRoute>
        ),
      },

      // Buyer routes
      {
        path: "/buyer/dashboard",
        element: (
          <PrivetRoute allowedRoles={["buyer"]}>
            <BuyerDashboard />
          </PrivetRoute>
        ),
      },
      {
        path: "/buyer/orders",
        element: (
          <PrivetRoute allowedRoles={["buyer"]}>
            <MyOrder />
          </PrivetRoute>
        ),
      },
      {
        path: "/buyer/track-order",
        element: (
          <PrivetRoute allowedRoles={["buyer"]}>
            <TrackOrder />
          </PrivetRoute>
        ),
      },
      {
        path: "/buyer/booking",
        element: (
          <PrivetRoute allowedRoles={["buyer"]}>
            <BookingForm />
          </PrivetRoute>
        ),
      },
      {
        path: "/buyer/profile",
        element: (
          <PrivetRoute allowedRoles={["buyer"]}>
            <BuyerProfile />
          </PrivetRoute>
        ),
      },

      // 404 route
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;
