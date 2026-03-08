import { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
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
    <section className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        <div className="custom-bg p-6 rounded-4xl shadow-md border app-border">
          <h1 className="text-3xl font-bold mb-4">Contact Textile Flow</h1>
          <p className="app-muted mb-6">
            Reach out for bulk orders, custom production support, or timeline
            planning. Our operations team responds within one business day.
          </p>
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <FaMapMarkerAlt className="mt-1 text-blue-600" />
              <p>Industrial Zone, Chittagong, Bangladesh</p>
            </div>
            <div className="flex gap-3 items-start">
              <FaPhoneAlt className="mt-1 text-blue-600" />
              <p>+880 1700 000000</p>
            </div>
            <div className="flex gap-3 items-start">
              <FaEnvelope className="mt-1 text-blue-600" />
              <p>support@textileflow.com</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="custom-bg p-6 rounded-4xl shadow-md border app-border space-y-4"
        >
          <h2 className="text-2xl font-bold">Send a Message</h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-4xl border app-border app-surface"
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-4xl border app-border app-surface"
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-4xl border app-border app-surface"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-4xl border app-border app-surface"
              aria-invalid={!!errors.subject}
            />
            {errors.subject && (
              <p className="text-red-600 text-sm">{errors.subject}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-4xl border app-border app-surface"
              aria-invalid={!!errors.message}
            />
            {errors.message && (
              <p className="text-red-600 text-sm">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 rounded-4xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
