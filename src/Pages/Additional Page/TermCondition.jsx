import React from "react";
import {
  FaClipboardCheck,
  FaFileContract,
  FaShippingFast,
  FaUndoAlt,
} from "react-icons/fa";

const termsCards = [
  {
    icon: <FaFileContract className="h-7 w-7 text-blue-600" />,
    title: "Fair Use",
    description:
      "Users must provide accurate information and use the platform for lawful business and purchasing activity only.",
  },
  {
    icon: <FaClipboardCheck className="h-7 w-7 text-green-600" />,
    title: "Order Accuracy",
    description:
      "Production begins based on the measurements, quantity, style, and approval details submitted with each order.",
  },
  {
    icon: <FaShippingFast className="h-7 w-7 text-amber-600" />,
    title: "Delivery Process",
    description:
      "Shipping schedules may vary based on order volume, customization, production readiness, and courier timelines.",
  },
];

const termSections = [
  {
    title: "Account responsibilities",
    text: "You are responsible for maintaining the confidentiality of your account credentials and for ensuring that the information in your profile, order forms, and delivery details remains accurate and current.",
  },
  {
    title: "Orders and approvals",
    text: "All orders should be reviewed carefully before confirmation. Once production requirements, quantity, and specifications are approved, changes may affect price, timelines, or feasibility.",
  },
  {
    title: "Pricing and payments",
    text: "Prices shown on the platform may depend on customization, quantity, or order complexity. Payment may be required in full or in part before production or shipment is released.",
  },
  {
    title: "Returns and issue handling",
    text: "If an issue arises with a delivered order, customers should contact support promptly with relevant order details. Resolution depends on the nature of the issue, approval history, and product condition.",
  },
];

const TermCondition = () => {
  return (
    <div className="mx-auto min-h-screen px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto px-6">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-blue-700">
            <span className="font-semibold">Terms & Conditions</span>
          </div>
          <h1 className="mb-5 text-4xl font-bold leading-tight lg:text-5xl">
            Straightforward terms for using our ordering and production
            platform.
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
            These terms outline the rules, responsibilities, and service
            expectations that apply when customers browse products, place
            orders, request customization, or use Textile Flow Garments
            services.
          </p>
        </div>

        <div className="custom-bg rounded-[2rem] border border-gray-100 p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-red-100 p-3">
              <FaUndoAlt className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h2 className="mb-2 text-xl font-bold">Important note</h2>
              <p className="text-gray-600">
                Order modifications, cancellations, or returns may depend on
                production stage and item customization.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Key service terms</h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            We aim to keep every order process clear, from account use and
            approvals to payment, shipping, and issue resolution.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {termsCards.map((item) => (
            <div
              key={item.title}
              className="custom-bg rounded-[2rem] border border-gray-100 p-8 shadow-md transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gray-50">
                {item.icon}
              </div>
              <h3 className="mb-3 text-2xl font-bold">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto px-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          {termSections.map((section) => (
            <div
              key={section.title}
              className="custom-bg rounded-[2rem] border border-gray-100 p-8 shadow-md"
            >
              <h3 className="mb-4 text-2xl font-bold">{section.title}</h3>
              <p className="leading-7 text-gray-600">{section.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] bg-amber-50 p-8">
          <h3 className="mb-3 text-2xl font-bold text-amber-700">
            Acceptance of terms
          </h3>
          <p className="leading-7 text-gray-700">
            By using this website and placing orders through the platform, you
            agree to follow these terms and any related service requirements
            communicated during the order and delivery process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermCondition;
