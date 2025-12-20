import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";
import { axiosInstance } from "../../Hooks/useAxios";

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { role } = useRole();

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

  /* =======================
     GUARDS
  ======================== */
  useEffect(() => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    if (role === "admin" || role === "manager") {
      toast.error("Admins / Managers cannot place orders");
      navigate(-1);
    }

    if (!product) {
      toast.error("Invalid product selection");
      navigate("/all-products");
    }
  }, [user, role, product, navigate]);

  /* =======================
     SET DEFAULT QTY = MOQ
  ======================== */
  useEffect(() => {
    if (product?.moq) {
      setQuantity(product.moq);
    }
  }, [product]);

  /* =======================
     CALCULATE PRICE
  ======================== */
  useEffect(() => {
    if (product?.price && quantity) {
      setTotalPrice(product.price * quantity);
    }
  }, [product, quantity]);

  /* =======================
     HANDLERS
  ======================== */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (e) => {
    const val = Number(e.target.value);

    if (val < product.moq) {
      toast.error(`Minimum order quantity is ${product.moq}`);
      return;
    }
    if (val > product.available_quantity) {
      toast.error("Quantity exceeds available stock");
      return;
    }
    setQuantity(val);
  };

  /* =======================
     SUBMIT ORDER
  ======================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.contactNumber ||
      !formData.address
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const orderData = {
      userId: user.uid,
      email: user.email,
      productId: product._id,
      productName: product.product_name,
      paymentMethod: selectedPayment,
      pricePerUnit: product.price,
      quantity,
      totalPrice,
      customer: formData,
      status: selectedPayment === "Online" ? "payment_pending" : "pending",
      createdAt: new Date(),
    };

    try {
      setSubmitting(true);
      const res = await axiosInstance.post("/orders", orderData);

      if (res.data.success) {
        toast.success("Order placed successfully");

        // 🔹 Online payment
        if (selectedPayment === "Online") {
          navigate(`/payment/${res.data.orderId}`);
        }
        // 🔹 Cash on Delivery
        else {
          navigate("/dashboard/my-orders");
        }
      }
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================
     UI
  ======================== */
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Order / Booking Form
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow"
      >
        {/* EMAIL */}
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <input
            value={user?.email}
            readOnly
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
        </div>

        {/* PRODUCT */}
        <div>
          <label className="text-sm text-gray-500">Product</label>
          <input
            value={product?.product_name}
            readOnly
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="text-sm text-gray-500">Price per Unit</label>
          <input
            value={`$${product?.price}`}
            readOnly
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
        </div>

        {/* QUANTITY */}
        <div>
          <label className="text-sm text-gray-500">Order Quantity</label>
          <input
            type="number"
            min={product?.moq}
            max={product?.available_quantity}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full px-4 py-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Min: {product?.moq} | Available: {product?.available_quantity}
          </p>
        </div>

        {/* TOTAL */}
        <div>
          <label className="text-sm text-gray-500">Total Price</label>
          <input
            value={`$${totalPrice.toFixed(2)}`}
            readOnly
            className="w-full px-4 py-2 border rounded bg-gray-100 font-bold text-green-600"
          />
        </div>

        {/* CUSTOMER INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="firstName"
            onChange={handleChange}
            placeholder="First Name"
            className="border p-2 rounded"
          />
          <input
            name="lastName"
            onChange={handleChange}
            placeholder="Last Name"
            className="border p-2 rounded"
          />
        </div>

        <input
          name="contactNumber"
          onChange={handleChange}
          placeholder="Contact Number"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="address"
          onChange={handleChange}
          placeholder="Delivery Address"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="notes"
          onChange={handleChange}
          placeholder="Additional Instructions (optional)"
          className="w-full border p-2 rounded"
        />

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {selectedPayment === "Online"
            ? "Proceed to Payment"
            : "Confirm Order"}
        </button>
      </form>
    </div>
  );
};

export default Booking;
