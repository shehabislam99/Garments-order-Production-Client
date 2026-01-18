import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";
import useAxiosSecure from "../../Hooks/useAxiosSecure";


const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { role } = useRole();
const axiosSecure = useAxiosSecure()
  const {
    product,
    quantity: initialQty = 0,
    selectedPayment,
  } = location.state || {};

  const [quantity, setQuantity] = useState(initialQty);
  const [totalPrice, setTotalPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    address: "",
    notes: "",
  });

useEffect(() => {
  const AccessUserProduct = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    const res = await axiosSecure.get("/users?status=suspended");
const suspended = res.data?.data || [];
const isSuspended = suspended.find(u => u.email === user.email);

if (isSuspended) {
  toast.error("Your account is suspended. You cannot place orders");
  navigate("/dashboard/profile");
  return;
}

   
    if (role === "admin" || role === "manager") {
      toast.error("Admins / Managers cannot place orders");
      navigate(-1);
      return;
    }

    if (!product) {
      toast.error("Invalid product selection");
      navigate("/all-products");
      return;
    }
  };

  AccessUserProduct();
}, [user, role, product, navigate, axiosSecure]);


  useEffect(() => {
    if (product?.moq) {
      setQuantity(product.moq);
    }
  }, [product]);

  useEffect(() => {
    if (product?.price && quantity) {
      setTotalPrice(product.price * quantity);
    }
  }, [product, quantity]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (e) => {
    const val = Number(e.target.value);

    if (val < product.moq) {
      toast.error(`Minimum order quantity is ${product.moq}`, {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    if (val > product.available_quantity) {
      toast.error("Quantity exceeds available stock", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    setQuantity(val);
  };

   const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  const orderData = {
    CustomerEmail: user.email,
    orderId: product._id,
    product_name: product.product_name,
    payment_method: selectedPayment,
    price: product.price,
    quantity,
    totalPrice,
    customer: formData,
    createdAt: new Date(),
  };

  let trackingId = null;
  try {
    const res = await axiosSecure.post("/orders", orderData);

    if (!res.data.success) {
      throw new Error("Order creation failed");
    }

    trackingId = res.data.order.trackingId;
    toast.success("Order created successfully", {
      position: "top-center",
      autoClose: 2000,
    });
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to create order", {
      position: "top-center",
      autoClose: 2000,
    });
    setSubmitting(false);
    return;
  }
  if (selectedPayment === "Stripe") {
    try {
      const paymentRes = await axiosSecure.post(
        "/payment-checkout-session",
        {
          orderamount: totalPrice,
          product_name: product.product_name,
          orderId: product._id,
          CustomerEmail: user.email,
          trackingId,
        }
      );

      if (!paymentRes.data?.url) {
        throw new Error("Stripe session creation failed");
      }

      toast.success("Redirecting to payment...", {
        position: "top-center",
        autoClose: 2000,
      });
      window.location.href = paymentRes.data.url;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Payment initiation failed",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    } finally {
      setSubmitting(false);
    }
  } else {
    toast.success("Order confirmed (Cash on Delivery)", {
      position: "top-center",
      autoClose: 2000,
    });
    navigate("/dashboard/my-orders");
    setSubmitting(false);
  }
};



  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="flex justify-center text-3xl font-bold mb-6 text-gray-800">
        Booking Form
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 rounded-4xl bg-amber-100 shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="ml-3 text-sm text-gray-700 font-medium block">
              First Name
            </label>
            <input
              name="firstName"
              onChange={handleChange}
              required
              placeholder="First Name"
              className="w-full pl-10 pr-4 py-3 text-gray-800  border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="ml-3 text-sm text-gray-700 font-medium block">
              Last Name
            </label>
            <input
              name="lastName"
              onChange={handleChange}
              required
              placeholder="Last Name"
              className="w-full pl-10 pr-4 py-3 text-gray-800  border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="block ml-3 text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              value={user?.email}
              readOnly
              className="w-full pl-10 pr-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label className="ml-3 text-sm text-gray-700 font-medium block">
              Contact Number
            </label>
            <input
              name="contactNumber"
              onChange={handleChange}
              placeholder="Contact Number"
              className="w-full pl-10 pr-4 py-3 text-gray-800  border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="ml-3 text-sm text-gray-700 font-medium block">
              Product
            </label>
            <input
              value={product?.product_name}
              readOnly
              className="w-full pl-10 pr-4 py-3 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="ml-3 text-sm text-gray-700 font-medium block">
              Price per Unit
            </label>
            <input
              value={`$${product?.price}`}
              readOnly
              className="w-full pl-10 pr-4 py-3 text-gray-800  border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          {/* QUANTITY */}
          <div>
            <label className="ml-3 text-sm text-gray-700 font-medium block">
              Order Quantity
            </label>
            <input
              type="number"
              min={product?.moq}
              max={product?.available_quantity}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-700 ml-4 font-medium block mt-1">
              Min: {product?.moq} | Available: {product?.available_quantity}
            </p>
          </div>

          {/* TOTAL */}
          <div>
            <label className="ml-3 text-sm text-gray-700 font-medium block">
              Total Price
            </label>
            <input
              value={`$${totalPrice.toFixed(2)}`}
              readOnly
              className="w-full pl-10 pr-4 py-3 text-gray-800 bg-white  border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
            />
          </div>
        </div>

        <div>
          <label className="ml-3 text-sm text-gray-700 font-medium block">
            Delivery Address
          </label>
          <textarea
            name="address"
            onChange={handleChange}
            required
            placeholder="Delivery Address"
            className="w-full pl-10 pr-4 py-3 text-gray-800 bg-white  border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
          />
        </div>
        <div>
          <label className="ml-3 text-sm text-gray-700 font-medium block">
            Additional Instructions
          </label>
          <textarea
            name="notes"
            onChange={handleChange}
            placeholder="Additional Instructions"
            className="w-full pl-10 pr-4 py-3 text-gray-800 bg-white  border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-red-800 disabled:opacity-50"
        >
          {selectedPayment === "Stripe"
            ? "Proceed to Payment"
            : "Confirm Order"}
        </button>
      </form>
    </div>
  );
};

export default Booking;
