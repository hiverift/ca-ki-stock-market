import { Link2 } from "lucide-react";
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Link } from "react-router-dom";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is CA ki Stock Market?",
      answer:
        "CA ki Stock Market is a comprehensive educational and consultancy platform led by qualified CAs, providing legal, secure, and transparent stock market education to counter fraudulent advisory services.",
    },
    {
      question: "How can I join a course?",
      answer:
        "You can browse our courses without login, but to enroll you need to create an account. After payment, you'll receive access through our mobile app where you can access all course materials.",
    },
    {
      question: "Are consultancy sessions live?",
      answer:
        "Yes, consultancy sessions are conducted live via video call, phone call, or in-person meetings based on your preference and the consultant's availability.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "We accept major payment methods including UPI, credit/debit cards, and net banking for secure transactions.",
    },
    {
      question: "Can I access purchased content on mobile?",
      answer:
        "Yes, after purchasing any course or service, you can access all content through our dedicated mobile app, which provides offline viewing and progress tracking.",
    },
    {
      question: "Is KYC mandatory for group access?",
      answer:
        "Yes, KYC verification is mandatory for accessing paid groups to ensure compliance with financial regulations and maintain a secure trading environment.",
    },
    {
      question: "Do you provide certification for courses?",
      answer:
        "Yes, upon successful completion of our courses, you receive certificates that validate your learning and can be used for professional development.",
    },
    {
      question: "What makes CA ki Stock Market different from others?",
      answer:
        "We are led by qualified CAs with 12+ years of experience, focus on transparency and authenticity, provide affordable education, and strictly comply with all SEBI regulations.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach our support team via phone at +91 96675 20027, email at info@accountantskipathshala.com, or through the contact form on our website.",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 px-4">
      {/* Section Heading */}
      <div className="text-center mb-10">
        <h2 className="text-2xl  text-gray-900 mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-md text-gray-600">
          Find answers to common questions about our services and platform
        </p>
      </div>

      {/* FAQ Dropdowns */}
      <div className="space-y-5">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="bg-white   rounded-xl p-5 border border-gray-200 transition-all duration-300"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleDropdown(index)}
            >
              <h2 className="text-lg md:text-md  text-gray-900">
                {faq.question}
              </h2>
              {openIndex === index ? (
                <FiChevronUp className="text-xl text-gray-600" />
              ) : (
                <FiChevronDown className="text-xl text-gray-600" />
              )}
            </div>

            {openIndex === index && (
              <p className="mt-3 text-gray-700 text-md leading-relaxed transition-all duration-500 ease-in-out">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="text-center p-10 ">
        <p className="text-sm md:pb-2 text-gray-600">Still have questions?</p>

        <Link to="/Contact">
          <button
            data-slot="button"
          className=" border border-gray-400 px-6 rounded text-black "
          >
            Contact Support
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FAQSection;
