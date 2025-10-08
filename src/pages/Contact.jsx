import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, FileText, MessageSquare } from "lucide-react";
import { TiMessage } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import { RiGroupLine } from "react-icons/ri";
import { CiCalculator1 } from "react-icons/ci";
import Footer from "./Footer";
import config from "../pages/config"; // ✅ Base URL import
import Swal from "sweetalert2"; // ✅ SweetAlert2 import

const categories = [
  {
    id: 1,
    title: "Course Support",
    courses: " Help with course enrollment, access, and content",
    icon: <FaBookOpen className="text-yellow-500 text-3xl" />,
  },
  {
    id: 2,
    title: "Consultancy",
    courses: "Booking sessions and consultant availability",
    icon: <RiGroupLine className="text-yellow-500 text-3xl" />,
  },
  {
    id: 3,
    title: "Technical Support",
    courses: "App issues, login problems, and technical queries",
    icon: <CiCalculator1 className="text-yellow-500 text-3xl" />,
  },
  {
    id: 4,
    title: "General Inquiries",
    courses: "Questions about our services and platform",
    icon: <TiMessage className="text-yellow-500 text-3xl" />,
  },
];

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.email) formErrors.email = "Email is required";
    if (!formData.phone) formErrors.phone = "Phone is required";
    if (!formData.subject) formErrors.subject = "Subject is required";
    if (!formData.message) formErrors.message = "Message is required";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        setLoading(true);

        const res = await fetch(`${config.BASE_URL}contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.name,
            emailAddress: formData.email,
            phoneNumber: formData.phone,
            subject: formData.subject,
            message: formData.message,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to send message");
        }

        const data = await res.json();
        console.log("Response:", data);

        Swal.fire({
          title: "Success!",
          text: "Your message has been sent successfully.",
          icon: "success",
          confirmButtonColor: "#facc15",
        });

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } catch (err) {
        console.error("Error:", err);

        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again later.",
          icon: "error",
          confirmButtonColor: "#f87171",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  // FAQ Navigation
  const goToFAQ = () => {
    navigate("/faq");
  };

  return (
    <>
      <div className="px-4 pt-5 md:py-16 bg-gray-50 mt-10">
        {/* Heading Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Contact Us
          </h1>
          <p className="text-gray-600 mt-2">
            Get in touch with our team - We're here to help you succeed
          </p>
        </div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 mb-10"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 2-2 Grid Layout for Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  name: "name",
                  label: "Full Name",
                  placeholder: "Enter your full name",
                  icon: <User className="w-5 h-5 text-gray-400" />,
                },
                {
                  name: "email",
                  label: "Email Address",
                  placeholder: "Enter your email",
                  icon: <Mail className="w-5 h-5 text-gray-400" />,
                },
                {
                  name: "phone",
                  label: "Phone Number",
                  placeholder: "Enter your phone number",
                  icon: <Phone className="w-5 h-5 text-gray-400" />,
                },
                {
                  name: "subject",
                  label: "Subject",
                  placeholder: "What's this about?",
                  icon: <FileText className="w-5 h-5 text-gray-400" />,
                },
              ].map((field) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <label className="block text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 focus-within:ring-yellow-500">
                    {field.icon}
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full ml-2 outline-none"
                      placeholder={field.placeholder}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm">
                      {errors[field.name]}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Full Width Message Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <label className="block text-gray-700 mb-1">Message</label>
              <div className="flex items-start border rounded-lg p-2 focus-within:ring-2 focus-within:ring-yellow-500">
                <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full ml-2 outline-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-2 rounded-lg transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } text-white`}
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto bg-blue-200 border border-blue-300 p-6 rounded-lg shadow-md">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-semibold text-gray-800">
              Looking for Quick Answers?
            </h1>
            <p className="text-gray-700">
              Check our comprehensive FAQ section for instant answers to common
              questions
            </p>
            <button
              onClick={goToFAQ}
              className="flex items-center gap-2 mx-auto mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <TiMessage className="text-lg" /> Visit FAQ Section
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6 py-7">
            What can we help you with?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 flex flex-col items-center justify-center text-center border border-gray-200 gap-y-4"
              >
                <div className="bg-yellow-100 p-3 rounded-full">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {cat.title}
                </h3>
                <p className="text-sm text-gray-600">{cat.courses} Courses</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
