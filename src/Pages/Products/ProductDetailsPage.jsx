import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import {
  FaShoppingCart,
  FaTruck,
  FaDollarSign,
  FaBox,
  FaTag,
  FaInfoCircle,
  FaClock,
  FaShieldAlt,
  FaCreditCard,
  FaPaypal,
  FaStripe,
} from "react-icons/fa";
import { MdCategory, MdInventory } from "react-icons/md";
import Loader from "../../Components/Common/Loader/Loader";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role, isLoading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [imageIndex, setImageIndex] = useState(0);

  // Mock product images (replace with actual product images)
  const productImages = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w-800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop",
  ];

  const paymentOptions = [
    { id: "stripe", name: "Credit/Debit Card", icon: <FaCreditCard /> },
    { id: "paypal", name: "PayPal", icon: <FaPaypal /> },
    { id: "bank", name: "Bank Transfer", icon: <FaDollarSign /> },
  ];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id, axiosSecure]);

  const handleOrderNow = () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    if (role === "admin" || role === "manager") {
      toast.error("Admins and Managers cannot place orders");
      return;
    }

    // Redirect to booking page with product details
    navigate(`/booking/${id}`, {
      state: {
        product,
        quantity,
        selectedPayment,
      },
    });
  };

  const canOrder = () => {
    return (
      user && // User is logged in
      role && // Role is defined
      role !== "admin" && // Not admin
      role !== "manager" && // Not manager
      user.status === "active" && // Account is active
      product?.availableQuantity >= quantity && // Enough quantity
      quantity >= product?.minimumOrder // Meets minimum order requirement
    );
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
        <span className="ml-4 text-gray-600">Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/all-products")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button
                onClick={() => navigate("/all-products")}
                className="hover:text-blue-600"
              >
                Products
              </button>
            </li>
            <li>
              <span className="mx-2">›</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">
                {product.productName}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images & Video */}
          <div className="space-y-4">
            {/* Main Image/Video */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative pt-[56.25%]">
                {" "}
                {/* 16:9 Aspect Ratio */}
                {product.demoVideo ? (
                  <div className="absolute inset-0">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      poster={productImages[0]}
                    >
                      <source src={product.demoVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <img
                    src={productImages[imageIndex]}
                    alt={product.productName}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className={`relative rounded-lg overflow-hidden border-2 ${
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.productName}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <FaTag className="mr-1" />
                  {product.category || "Uncategorized"}
                </span>
                <span className="text-gray-600">
                  <FaTruck className="inline mr-1" />
                  {product.deliveryStatus || "Available"}
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.cost?.toFixed(2) || "0.00"}
                </span>
                <span className="ml-2 text-gray-500">per unit</span>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBox className="inline mr-2" />
                  Order Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.max(product.minimumOrder || 1, quantity - 1)
                        )
                      }
                      disabled={quantity <= (product.minimumOrder || 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={product.minimumOrder || 1}
                      max={product.availableQuantity}
                      value={quantity}
                      onChange={(e) => {
                        const val =
                          parseInt(e.target.value) || product.minimumOrder || 1;
                        setQuantity(
                          Math.max(
                            product.minimumOrder || 1,
                            Math.min(product.availableQuantity, val)
                          )
                        );
                      }}
                      className="w-20 text-center py-2 border-0 focus:ring-0"
                    />
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(product.availableQuantity, quantity + 1)
                        )
                      }
                      disabled={quantity >= product.availableQuantity}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    Minimum order: {product.minimumOrder || 1}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Available: {product.availableQuantity} units
                </div>
              </div>

              {/* Total Price */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Price</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${((product.cost || 0) * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaDollarSign className="mr-2" />
                Payment Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {paymentOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPayment === option.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={selectedPayment === option.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3 h-5 w-5 text-blue-600"
                    />
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{option.icon}</span>
                      <span className="font-medium">{option.name}</span>
                    </div>
                  </label>
                ))}
              </div>
              {!selectedPayment && (
                <p className="mt-3 text-sm text-yellow-600 flex items-center">
                  <FaInfoCircle className="mr-1" />
                  Please select a payment method to continue
                </p>
              )}
            </div>

            {/* Order Button */}
            <div className="sticky bottom-0 bg-white p-4 rounded-xl shadow-lg border">
              <button
                onClick={handleOrderNow}
                disabled={!canOrder() || !selectedPayment}
                className={`w-full py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center ${
                  canOrder() && selectedPayment
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FaShoppingCart className="mr-3 text-xl" />
                {canOrder() ? "Order Now" : "Cannot Place Order"}
              </button>

              {/* Order Restrictions Info */}
              {!canOrder() && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  <p className="font-medium mb-1">Order restrictions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {!user && <li>You must be logged in</li>}
                    {(role === "admin" || role === "manager") && (
                      <li>Admins/Managers cannot place orders</li>
                    )}
                    {user?.status !== "active" && (
                      <li>Your account must be active</li>
                    )}
                    {quantity < (product.minimumOrder || 1) && (
                      <li>Minimum order: {product.minimumOrder || 1}</li>
                    )}
                    {quantity > product.availableQuantity && (
                      <li>Not enough stock available</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["Description", "Specifications", "Shipping", "Reviews"].map(
                (tab) => (
                  <button
                    key={tab}
                    className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    {tab}
                  </button>
                )
              )}
            </nav>
          </div>

          <div className="py-8">
            {/* Description */}
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Product Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description ||
                  "No detailed description available for this product."}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <MdCategory className="text-2xl text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">
                    {product.category || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <MdInventory className="text-2xl text-green-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Stock Status</p>
                  <p
                    className={`font-medium ${
                      product.availableQuantity > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.availableQuantity > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <FaClock className="text-2xl text-purple-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Processing Time</p>
                  <p className="font-medium">2-3 business days</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <FaShieldAlt className="text-2xl text-orange-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Warranty</p>
                  <p className="font-medium">1 Year Manufacturer Warranty</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
