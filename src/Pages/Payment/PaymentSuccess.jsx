import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  FaCheckCircle,
  FaReceipt,
  FaShippingFast,
  FaHome,
} from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState({
    transactionId: "",
    trackingId: "",
    amount: 0,
  });
  const [step, setStep] = useState(1);
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!sessionId) return;

    let interval;

    const verifyPayment = async () => {
      try {
        const res = await axiosSecure.patch(
          `/payment-success?session_id=${sessionId}`,
        );

        setPaymentInfo({
          transactionId: res.data.transactionId,
          trackingId: res.data.trackingId,
          amount: res.data.amount,
        });

        toast.success("Payment Successful", {
          position: "top-center",
          autoClose: 2000,
        });

        setTimeout(() => {
          toast.info(
            <div>
              <p className="font-bold">Transaction Details:</p>
              <p>Amount: ${res.data.amount || "N/A"}</p>
              <p>Tracking ID: {res.data.trackingId}</p>
            </div>,
            { autoClose: 8000 },
          );
        }, 1000);

        interval = setInterval(() => {
          setStep((prev) => (prev < 4 ? prev + 1 : prev));
        }, 1500);
      } catch (error) {
        console.error("Payment verification failed:", error);

        toast.error(
          error?.response?.data?.message ||
            "Payment verification failed. Please contact support.",
          {
            position: "top-center",
            autoClose: 2000,
          },
        );
      }
    };

    verifyPayment();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionId, axiosSecure]);

  return (
    <div className="min-h-screen py-12 p-10">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="text-center justify-center max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-24 h-24 bg-indigo-500 rounded-full ">
            <FaCheckCircle className="text-white text-5xl" />
          </div>
        </div>
        <div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 ">
            Thank you for your payment. Your product is now being processed and
            will be shipped shortly.
          </p>
        </div>

        {/* Progress Steps */}
        <div>
          <div className="flex justify-between items-center relative max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex flex-col items-center z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step >= num ?
                      "bg-indigo-600 text-white"
                    : "bg-white  border-2 border-gray-200"
                  }`}
                >
                  {num === 1 && <FaReceipt />}
                  {num === 2 && <FaCheckCircle />}
                  {num === 3 && <FaShippingFast />}
                  {num === 4 && <FaCheckCircle />}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">
                  {num === 1 && "Payment"}
                  {num === 2 && "Processing"}
                  {num === 3 && "Shipping"}
                  {num === 4 && "Delivery"}
                </span>
              </div>
            ))}
            <div className="absolute top-6 left-1 right-1 h-1 bg-gray-200 -z-10"></div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="space-y-4 shadow-md bg-white p-6 rounded-4xl">
            <h2 className="flex justify-center text-2xl font-bold text-gray-800">
              Payment Summary
            </h2>
            <div className="flex custom-bg px-3 rounded-lg  justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Transaction ID</span>
              <div className="flex items-center">
                <code className="bg-gray-50 px-3 py-1 rounded-lg text-sm font-mono">
                  {paymentInfo.transactionId}
                </code>
              </div>
            </div>

            <div className="flex custom-bg px-3 rounded-lg justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Amount Paid</span>
              <span className="text-2xl font-bold text-green-600">
                ${paymentInfo.amount.toFixed(2)}
              </span>
            </div>

            <div className="flex custom-bg px-3 rounded-lg justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Tracking Number</span>
              <div className="flex items-center">
                <code className="bg-gray-50 px-3 py-1 rounded-lg text-sm font-mono">
                  {paymentInfo.trackingId}
                </code>
              </div>
            </div>
          </div>
        </div>
        <Link to="/dashboard/my-orders">
          <button className="w-full font-medium px-3 py-3 rounded-full bg-indigo-600 hover:bg-red-800 text-white">
            Go to Order
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
