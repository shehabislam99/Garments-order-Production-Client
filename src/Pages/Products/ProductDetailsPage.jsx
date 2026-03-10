import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowAltCircleLeft,
  FaBoxOpen,
  FaCheckCircle,
  FaCreditCard,
  FaShoppingCart,
} from "react-icons/fa";
import { MdAddShoppingCart, MdCategory, MdInventory } from "react-icons/md";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import useAuth from "../../Hooks/useAuth";
import Loading from "../../Components/Common/Loding/Loding";
import { axiosInstance } from "../../Hooks/useAxios";
import useRole from "../../Hooks/useRole";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount || 0));
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role } = useRole();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [imageIndex, setImageIndex] = useState(0);

  const paymentOptionsList = product?.payment_Options || [];
  const productImages = product?.images?.length ? product.images : [""];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch {
        toast.error("Failed to load product details", {
          position: "top-center",
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleOrderNow = () => {
    if (role === "admin" || role === "manager") {
      toast.error("Admins and Managers cannot place orders", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    if (!selectedPayment) {
      toast.error("Please select a payment method", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    navigate(`/order/${id}`, {
      state: {
        product,
        selectedPayment,
      },
    });
  };

  const canOrder = () => {
    return user && role && role !== "admin" && role !== "manager";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
        <span className="ml-4 text-gray-600">Loading product details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-500">
            Product Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            {"The product you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/all-products")}
            className="rounded-4xl bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto px-6">
        <nav className="mb-8">
          <button
            onClick={() => navigate("/all-products")}
            className="flex gap-2 text-indigo-600 hover:text-red-800"
          >
            <FaArrowAltCircleLeft className="mt-1" />
            Back to Products
          </button>
        </nav>

        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-blue-600 font-medium">
            Product Details
          </div>
          <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
            {product.product_name}
          </h1>
          <p className="mx-auto max-w-3xl text-lg app-muted">
            Review specifications, payment options, and stock availability
            before moving to order confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-4xl bg-white shadow-md">
              <div className="relative h-96 w-full">
                <img
                  src={productImages[imageIndex]}
                  alt={product.product_name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className={`relative overflow-hidden rounded-4xl border-2 ${
                    imageIndex === idx ? "border-blue-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product ${idx + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="custom-bg rounded-4xl border app-border p-8 shadow-md">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-100">
                <FaBoxOpen className="text-2xl text-indigo-600" />
              </div>
              <h2 className="mb-3 text-3xl font-bold">Product overview</h2>
              <p className="leading-7 text-gray-600">
                {product.description ||
                  "No detailed description is available for this product."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-bg rounded-4xl p-8 shadow">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                  {product.category}
                </span>
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  {Number(product.available_quantity) > 0 ?
                    "Available"
                  : "Out of stock"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex items-center rounded-4xl custom-bg p-4">
                  <MdCategory className="mr-4 text-2xl text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                </div>

                <div className="flex items-center rounded-4xl custom-bg p-4">
                  <HiOutlineCurrencyDollar className="mr-4 text-2xl text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-medium">{formatCurrency(product.price)}</p>
                  </div>
                </div>

                <div className="flex items-center rounded-4xl custom-bg p-4">
                  <FaShoppingCart className="mr-4 text-2xl text-indigo-800" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Minimum Order Quantity
                    </p>
                    <p className="font-medium">{product.moq}</p>
                  </div>
                </div>

                <div className="flex items-center rounded-4xl custom-bg p-4">
                  <MdInventory className="mr-4 text-2xl text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Available Quantity</p>
                    <p className="font-medium">{product.available_quantity}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-4xl bg-indigo-50 p-5">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 text-green-600" />
                  <p className="text-gray-700">
                    Suitable for buyers who want a clear production summary
                    before proceeding to order placement.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-bg rounded-4xl p-8 shadow space-y-5">
              <h2 className="text-3xl font-bold">Order Now</h2>
              <div className="rounded-4xl custom-bg p-5">
                <label className="mb-3 flex items-center gap-3 text-sm text-gray-600">
                  <FaCreditCard className="text-2xl text-blue-500" />
                  Payment Options
                </label>
                <select
                  name="payment_Options"
                  value={selectedPayment}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-full rounded-4xl border border-green-800 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Payment Method
                  </option>
                  {paymentOptionsList.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOrderNow}
                disabled={!canOrder()}
                className={`flex w-full items-center justify-center rounded-4xl py-4 text-lg font-semibold transition-all ${
                  canOrder() ?
                    "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                  : "cursor-not-allowed bg-gray-400 text-gray-600"
                }`}
              >
                <MdAddShoppingCart className="mr-3 text-xl" />
                {canOrder() ? "Proceed to Order" : "Cannot Place Order"}
              </button>

              {!user && (
                <p className="text-sm text-gray-500">
                  Log in with a buyer account to continue with ordering.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
