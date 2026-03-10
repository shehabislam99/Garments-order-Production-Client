import { useState } from "react";
import {
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegComments,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { axiosInstance } from "../../Hooks/useAxios";

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email.";
    }
    if (!formData.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      nextErrors.message = "Message must be at least 10 characters.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await axiosInstance.post("/contact-messages", formData);
      toast.success("Message submitted successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to submit message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto px-6">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-blue-600 font-medium">
            Get In Touch
          </div>
          <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
            Let&apos;s plan your next garment production run.
          </h1>
          <p className="mx-auto max-w-3xl text-lg app-muted">
            Reach out for bulk orders, custom production support, sampling
            requests, or delivery planning. Our team keeps communication clear
            from first inquiry to final shipment.
          </p>
        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="custom-bg rounded-4xl border app-border p-6 shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-100">
              <FaMapMarkerAlt className="text-xl text-blue-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Factory Office</h2>
            <p className="app-muted">
              Industrial Zone, Chittagong, Bangladesh
            </p>
          </div>

          <div className="custom-bg rounded-4xl border app-border p-6 shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-green-100">
              <FaPhoneAlt className="text-xl text-green-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Direct Support</h2>
            <p className="app-muted">+880 1700 000000</p>
          </div>

          <div className="custom-bg rounded-4xl border app-border p-6 shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-100">
              <FaClock className="text-xl text-amber-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Response Window</h2>
            <p className="app-muted">Within one business day for most queries</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.25fr]">
          <div className="custom-bg rounded-4xl border app-border p-8 shadow-md">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-100">
              <FaRegComments className="text-2xl text-indigo-600" />
            </div>
            <h2 className="mb-3 text-3xl font-bold">Work with our team</h2>
            <p className="mb-6 app-muted">
              Share order quantity, product type, delivery goals, or
              customization needs. The more detail you provide, the faster we
              can guide you to the right production plan.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <FaEnvelope className="mt-1 text-blue-600" />
                <p>support@textileflow.com</p>
              </div>
              <div className="flex gap-3 items-start">
                <FaPhoneAlt className="mt-1 text-green-600" />
                <p>+880 1700 000000</p>
              </div>
              <div className="flex gap-3 items-start">
                <FaMapMarkerAlt className="mt-1 text-red-500" />
                <p>Industrial Zone, Chittagong, Bangladesh</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="custom-bg rounded-4xl border app-border p-8 shadow-md space-y-5"
          >
            <h2 className="text-3xl font-bold">Send a Message</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  className="w-full rounded-4xl border app-border app-surface px-4 py-3"
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={onChange}
                  className="w-full rounded-4xl border app-border app-surface px-4 py-3"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={onChange}
                  className="w-full rounded-4xl border app-border app-surface px-4 py-3"
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={onChange}
                  className="w-full rounded-4xl border app-border app-surface px-4 py-3"
                  aria-invalid={!!errors.subject}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={onChange}
                className="w-full rounded-[2rem] border app-border app-surface px-4 py-3"
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-indigo-600 py-3 text-white font-semibold transition-all duration-300 hover:bg-red-800 disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
