import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaUserTie,
} from "react-icons/fa";
import { MdOutlineMapsHomeWork, MdElectricBolt } from "react-icons/md";



const Contact = () => {

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: "Our Location",
      details: [
        "Textile Flow Garments Pvt. Ltd.",
        "Industrial Zone, Chittagong, Bangladesh",
      ],
      color: "bg-violet-100 text-violet-600",
    },
    {
      icon: <FaPhoneAlt className="text-2xl" />,
      title: "Phone Number",
      details: ["+880 1700 000000", "+880 9876 543210"],

      color: "bg-green-100 text-green-600",
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email Address",
      details: ["support@textileflow.com", "sales@textileflow.com"],
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FaClock className="text-2xl" />,
      title: "Working Hours",
      details: ["Sunday – Friday", "9:00 AM – 6:00 PM"],
      color: "bg-red-100 text-red-600",
    },
  ];

const chooseUs = [
  {
    icon: <MdElectricBolt className="text-2xl" />,
    title: "Fast Response",
    des: " We respond within 24 hours to all inquiries",

    color: "bg-green-100 text-green-600",
  },
  {
    icon: <FaUserTie className="text-2xl" />,
    title: "Expert Consultation",
    des: "Free consultation with our production experts",

    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <MdOutlineMapsHomeWork className="text-2xl" />,
    title: "Modern Facility",
    des: "State-of-the-art garment production facility",
    color: "bg-violet-100 text-violet-600",
  },
];
  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold  mb-4">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-indigo-600">
              Touch
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Have a project in mind or want to know more about our premium
            textile flow garments production services? We're here to help you
            bring your vision to life!
          </p>
        </div>

        <div>
          <h2 className="flex justify-center text-3xl font-bold text-center mb-8 items-center">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-amber-100 p-8 rounded-4xl  flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
               
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${item?.color} mb-6`}
                  >
                    <div className="text-2xl">{item?.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-center text-xl font-semibold mb-2">{item.title}</h3>
                    {item.details.map((detail, idx) => (
                      <p
                        key={idx}
                        className="text-center text-gray-700 font-medium opacity-90"
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16  max-w-7xl mx-auto">
        <h3 className="flex justify-center text-3xl font-bold mb-8">
          Why Choose Textile Flow?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chooseUs.map((details, index) => (
            <div
              key={index}
              className="bg-amber-100 p-8 rounded-4xl  flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${details?.color} mb-6`}
              >
                <div className="text-2xl">{details?.icon}</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{details.title}</h3>
              </div>
              <div>
                <p className="text-gray-700 text-center font-medium opacity-90">
                  {details.des}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
