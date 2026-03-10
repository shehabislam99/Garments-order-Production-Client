import React from "react";
import {
  FaEnvelopeOpenText,
  FaEye,
  FaLock,
  FaShieldAlt,
  FaUserCheck,
} from "react-icons/fa";

const policyHighlights = [
  {
    icon: <FaShieldAlt className="h-7 w-7 text-blue-600" />,
    title: "Data We Collect",
    description:
      "We collect only the information needed to manage accounts, process orders, deliver updates, and improve service quality.",
  },
  {
    icon: <FaUserCheck className="h-7 w-7 text-green-600" />,
    title: "How We Use It",
    description:
      "Your details help us confirm bookings, coordinate production, arrange delivery, and provide customer support when needed.",
  },
  {
    icon: <FaLock className="h-7 w-7 text-indigo-600" />,
    title: "How We Protect It",
    description:
      "We apply access controls and secure workflows to reduce unauthorized access, misuse, or accidental exposure of your information.",
  },
];

const privacySections = [
  {
    title: "Information we collect",
    text: "When you register, place an order, request a quote, or contact our team, we may collect your name, email address, phone number, company details, shipping address, and order-related information.",
  },
  {
    title: "Why we collect it",
    text: "We use your information to operate the platform, respond to inquiries, manage garment production, process payments, coordinate delivery, and maintain order history for support and reporting.",
  },
  {
    title: "Sharing of information",
    text: "We do not sell personal information. We may share limited data with payment providers, logistics partners, or service providers only when it is required to complete your order or maintain our services.",
  },
  {
    title: "Cookies and analytics",
    text: "Our website may use cookies or similar tools to remember preferences, understand site usage, and improve performance. You can control cookies through your browser settings.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto min-h-screen px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto px-6">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-blue-700">
            <span className="font-semibold">Privacy Policy</span>
          </div>
          <h1 className="mb-5 text-4xl font-bold leading-tight lg:text-5xl">
            Clear privacy standards for every client, inquiry, and order.
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
            Textile Flow Garments respects the confidentiality of customer and
            business information. This page explains what we collect, how we
            use it, and the steps we take to keep your information protected.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="custom-bg rounded-3xl border border-gray-100 p-5 shadow-md">
            <FaEye className="mb-3 h-7 w-7 text-indigo-600" />
            <h2 className="mb-2 text-xl font-bold">Transparency</h2>
            <p className="text-sm text-gray-600">
              We explain how information moves through our platform and support
              process.
            </p>
          </div>
          <div className="custom-bg rounded-3xl border border-gray-100 p-5 shadow-md">
            <FaEnvelopeOpenText className="mb-3 h-7 w-7 text-amber-600" />
            <h2 className="mb-2 text-xl font-bold">Responsible Contact</h2>
            <p className="text-sm text-gray-600">
              Communication is limited to order updates, support, and necessary
              service notices.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">Privacy at a glance</h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            We collect practical business information, use it for clear service
            purposes, and protect it with controlled access and internal
            safeguards.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {policyHighlights.map((item) => (
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
          {privacySections.map((section) => (
            <div
              key={section.title}
              className="custom-bg rounded-[2rem] border border-gray-100 p-8 shadow-md"
            >
              <h3 className="mb-4 text-2xl font-bold">{section.title}</h3>
              <p className="leading-7 text-gray-600">{section.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] bg-indigo-50 p-8">
          <h3 className="mb-3 text-2xl font-bold text-indigo-700">
            Your choices
          </h3>
          <p className="leading-7 text-gray-700">
            You may request updates or corrections to your submitted details at
            any time. If you have questions about data handling, you can
            contact our support team through the contact page for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
