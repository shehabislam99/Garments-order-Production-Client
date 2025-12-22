import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const CustomerFeedback = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 4,
      name: "David Park",
      role: "Photographer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 5,
      comment:
        "As a photographer, I appreciate quality fabrics. These products are perfect for my photoshoots. Great value for money!",
      date: "2 weeks ago",
    },
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Blogger",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 5,
      comment:
        "The quality of products is exceptional! I ordered a custom dress and it exceeded my expectations. Perfect fit and beautiful fabric.",
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Business Owner",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 5,
      comment:
        "Outstanding customer service and premium quality products. The shipping was faster than expected. Highly recommended!",
      date: "1 week ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Interior Designer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4,
      comment:
        "Love the attention to detail in every product. The materials feel luxurious and the designs are timeless.",
      date: "3 days ago",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-600 font-medium mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold  mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from our satisfied customers
          </p>
        </motion.div>
        <div className="relative">
          <div className="relative h-[400px] lg:h-[350px] overflow-hidden rounded-3xl">
            <AnimatePresence initial={false} custom={1}>
              <motion.div
                key={currentSlide}
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0"
              >
                <div className="h-full bg-gradient-to-br from-indigo-600 to-blue-800 rounded-3xl overflow-hidden">
                  <div className="h-full flex flex-col lg:flex-row">
                    <div className="flex-1 p-8 lg:p-12 text-white">
                      <FaQuoteLeft className="w-12 h-12 text-white/30 mb-3" />

                      <p className="text-xl lg:text-2xl font-light mb-8 leading-relaxed">
                        "{testimonials[currentSlide].comment}"
                      </p>

                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-5 h-5 ${
                              i < testimonials[currentSlide].rating
                                ? "text-yellow-400 fill-current"
                                : "text-white/30"
                            }`}
                          />
                        ))}
                      </div>

                      <div>
                        <h4 className="text-2xl font-bold mb-1">
                          {testimonials[currentSlide].name}
                        </h4>
                        <p className="text-white/80">
                          {testimonials[currentSlide].role}
                        </p>
                        <p className="text-white/60 text-sm mt-2">
                          {testimonials[currentSlide].date}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 relative hidden lg:block">
                      <div className="absolute inset-0 bg-gradient-to-l from-indigo-600 to-transparent z-10"></div>
                      <img
                        src={testimonials[currentSlide].image}
                        alt={testimonials[currentSlide].name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                        <div className="text-3xl font-bold">4.8/5</div>
                        <div className="text-sm">Average Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>


          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transform hover:scale-110 transition-all duration-300 z-20"
          >
            <FaChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transform hover:scale-110 transition-all duration-300 z-20"
          >
            <FaChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-indigo-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-amber-100 rounded-4xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-600 italic">
                "{testimonial.comment.substring(0, 100)}..."
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerFeedback;
