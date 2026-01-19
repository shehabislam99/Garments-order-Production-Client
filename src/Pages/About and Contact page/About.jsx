import React from "react";
import {
  FaTshirt,
  FaUsers,
  FaGlobeAmericas,
  FaAward,
  FaShippingFast,
  FaHeart,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router";
import imgwork1 from "../../assets/photo-cloth.avif";
import imgwork2 from "../../assets/pexels-photo-603022.jpeg";
import imgwork3 from "../../assets/photo-1606760227091-3dd870d97f1d.avif";
import imgwork4 from "../../assets/MP000000023898720_437Wx649H_202409292038401.avif";
import imgabout from "../../assets/photo-1523381210434-271e8be1f52b.avif";

const About = () => {
  const ChoosingUs = [
    "15+ years of industry expertise",
    "State-of-the-art manufacturing facilities",
    "Sustainable and ethical production",
    "Quick turnaround times",
    "Competitive pricing without compromising quality",
    "Personalized customer service",
  ];
  const ServiceData = [
    {
      icon: <FaTshirt />,
      title: "Custom Production",
      desc: "Tailored garment manufacturing from concept to completion",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <FaShippingFast />,
      title: "Bulk Manufacturing",
      desc: "Large-scale production with consistent quality control",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FaHeart />,
      title: "Pattern Making",
      desc: "Expert pattern development and sampling services",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: <FaAward />,
      title: "Quality Assurance",
      desc: "Rigorous inspections and finishing processes",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Global Logistics",
      desc: "Worldwide shipping and supply chain management",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: <FaUsers />,
      title: "Brand Consultation",
      desc: "Strategic guidance for apparel business success",
      color: "bg-violet-100 text-violet-600",
    },
  ];
  return (
    <div className="bg-base-200 min-h-screen ">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 mb-6">
                <span className="font-semibold">About Us</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold  mb-6 leading-tight whitespace-nowrap">
                Crafting Excellence in
                <span className="text-indigo-600 block">Every Sewing</span>
              </h1>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Welcome to{" "}
                <strong className="text-indigo-700">
                  Textile Flow Garments
                </strong>
                , where passion meets precision. We transform fabric into
                fashion, delivering premium apparel manufacturing with unmatched
                quality and ethical standards.
              </p>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src={imgabout}
                  alt="Garment Production"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-amber-100 p-6 rounded-4xl shadow-xl">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <FaCheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">10,000+</p>
                    <p className="text-gray-500">Orders Delivered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Mission & Vision</h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            We're dedicated to revolutionizing apparel manufacturing with
            innovation, sustainability, and exceptional craftsmanship.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-amber-100 p-8 rounded-4xl shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <FaAward className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Quality First
            </h3>
            <p className="text-center font-medium text-gray-700">
              Every garment undergoes rigorous quality checks to ensure
              international standards and customer satisfaction.
            </p>
          </div>

          <div className="bg-amber-100 p-8 rounded-4xl shadow-lg flex flex-col items-center hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <FaUsers className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ethical Production
            </h3>
            <p className="text-center font-medium text-gray-700">
              We maintain fair working conditions and sustainable practices
              throughout our manufacturing process.
            </p>
          </div>

          <div className="bg-amber-100 p-8 rounded-4xl shadow-lg hover:shadow-xl flex flex-col items-center transition-shadow duration-300 border border-gray-100">
            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <FaGlobeAmericas className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Global Reach
            </h3>
            <p className="text-center font-medium text-gray-700">
              Serving clients worldwide with reliable logistics and efficient
              supply chain management.
            </p>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Comprehensive garment manufacturing solutions for brands of all
              sizes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ServiceData.map((service, index) => (
              <div
                key={index}
                className="bg-amber-100 p-8 rounded-4xl  flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${service?.color} mb-6`}
                >
                  <div className="text-2xl">{service?.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-center font-medium text-gray-700">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 whitespace-nowrap">
              Why Choose Textile Flow Garments?
            </h2>
            <div className="space-y-6">
              {ChoosingUs.map((item, index) => (
                <div key={index} className="flex items-start">
                  <FaCheckCircle className="h-6 w-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                  <p className="text-lg text-gray-500">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src={imgwork1}
              alt="Manufacturing Facility"
              className="rounded-2xl shadow-lg h-64 w-full object-cover"
            />
            <img
              src={imgwork2}
              alt="Quality Control"
              className="rounded-2xl shadow-lg h-64 w-full object-cover mt-8"
            />
            <img
              src={imgwork3}
              className="rounded-2xl shadow-lg h-64 w-full object-cover"
            />
            <img
              src={imgwork4}
              className="rounded-2xl shadow-lg h-64 w-full object-cover mt-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
