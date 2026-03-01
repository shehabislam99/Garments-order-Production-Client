import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaTimesCircle } from "react-icons/fa";

const PaymentCancelled = () => {
  useEffect(() => {
    toast.error("Payment was cancelled. Please try again.", {
      position: "top-center",
      autoClose: 2000,
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <ToastContainer />

      <div className=" p-8 rounded-4xl custom-bg shadow-md text-center max-w-md w-full">
        <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Cancelled
        </h2>

        <p className="text-gray-600 mb-6">
          Your payment was not completed. You can try again or choose another
          payment method.
        </p>

        <Link to="/all-products">
          <button className="w-full py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-red-800 transition">
            Try Again
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelled;
