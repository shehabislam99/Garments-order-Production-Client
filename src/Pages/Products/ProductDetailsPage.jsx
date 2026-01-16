import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaShoppingCart,
  FaCreditCard,
  FaArrowAltCircleLeft,
} from "react-icons/fa";
import { MdAddShoppingCart, MdCategory, MdInventory } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import Loading from "../../Components/Common/Loding/Loding";
import { axiosInstance } from "../../Hooks/useAxios";
import useRole from "../../Hooks/useRole";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user} = useAuth();
  const { role } = useRole()
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [imageIndex, setImageIndex] = useState(0);

  const paymentOptionsList = product?.payment_Options||[];

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
    // Redirect to booking page with product details
    navigate(`/order/${id}`, {
      state: {
        product,
        selectedPayment,
      },
    });
  };

  const canOrder = () => {
    return (
      user && // User is logged in
      role && // Role is defined
      role !== "admin" &&
      role !== "manager" 
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading></Loading>
        <span className="ml-4 text-gray-600">Loading product details...</span>
      </div>
    );
  }

  if ( !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            { "The product you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/all-products")}
            className="px-6 py-3 bg-blue-600 text-white rounded-4xl hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <button
            onClick={() => navigate("/all-products")}
            className="text-indigo-600 hover:text-red-800 flex gap-2"
          >
            <FaArrowAltCircleLeft className="mt-1" />
            Back to Products
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-white rounded-4xl shadow-lg overflow-hidden">
              <div className="relative w-full h-96 ">
                <img
                  src={product.images[imageIndex]}
                  alt={product.productName}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className={`relative rounded-4xl overflow-hidden border-2 ${
                    imageIndex === idx
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="bg-white p-6 rounded-4xl shadow">
              <h1 className="text-3xl font-bold text-gray-700">
                {product.product_name}
              </h1>
              {/* Specifications Grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-amber-100 rounded-4xl">
                  <MdCategory className="text-2xl text-blue-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-amber-100 rounded-4xl">
                  <HiOutlineCurrencyDollar className="text-2xl text-purple-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">{product.price}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-amber-100 rounded-4xl">
                  <FaShoppingCart className="text-2xl text-indigo-800 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Minimum Order Quantity
                    </p>
                    <p className="font-medium">{product.moq}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-amber-100 rounded-4xl">
                  <MdInventory className="text-2xl text-green-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Avilable Quantity</p>
                    <p className="font-medium">{product.available_quantity}</p>
                  </div>
                </div>
              </div>
              <div className="my-4">
                <div className=" p-4 bg-amber-100 rounded-4xl max-w-none">
                  <h3 className="text-sm text-gray-500">Description </h3>
                  <p className="font-medium">
                    {product.description ||
                      "No detailed available for this product."}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-4xl shadow space-y-4">
              <h2 className="text-3xl font-bold text-gray-700">Order Now</h2>
              <div className="flex p-4  bg-amber-100 rounded-4xl gap-4">
                <p className="text-sm flex mt-3 text-gray-500">
                  <span>
                    <FaCreditCard className="text-2xl text-blue-500 mr-4" />
                  </span>
                  Payment Options:
                </p>
                <select
                  name="payment_Options"
                  value={selectedPayment}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="px-4 py-3 border border-green-800 rounded-4xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className={`w-full py-4 rounded-4xl text-lg font-semibold transition-all flex items-center justify-center ${
                  canOrder()
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <MdAddShoppingCart className="mr-3 text-xl" />
                {canOrder() ? "Proceed to Order" : "Cannot Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
