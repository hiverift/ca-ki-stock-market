import React, { useState } from "react";
import { FaBookOpen } from "react-icons/fa";


import { FaSearch, FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState({}); // multiple boxes ke liye object

  const toggleFAQ = (category, index) => {
    setOpenIndex((prev) => ({
      ...prev,
      [category]: prev[category] === index ? null : index, // har category ke liye alag toggle
    }));
  };

  

  // Data arrays
  const faqs = [
    {
      question: "What is CA ki Stock Market?",
      answer:
      "CA ki Stock Market is a comprehensive educational and consultancy platform led by qualified CAs, providing legal, secure, and transparent stock market education. Our mission is to counter fraudulent advisory services by offering affordable, authentic financial education that helps individuals make informed investment decisions.",
    },
    {
      question: "What makes CA ki Stock Market different from others?",
      answer:
       "We are uniquely positioned as we are led by qualified CAs with 12+ years of experience, focus on complete transparency and authenticity, provide affordable education, strictly comply with all SEBI regulations, and prioritize student success over profits. Our founder's mission is specifically to counter fraudulent advisory services in the market.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach our support team via phone at +91 96675 20027, email at info@accountantskipathshala.com, through the contact form on our website, or visit our office at KG CH 16/1 Kavi Nagar, G Block Near Gurudwara, Ghaziabad-201002, India. Our support team is available during business hours to assist with any queries.",
    },
  ];

const course = [
  {
    question: "How can I join a course?",
    answer:
      "You can browse our courses without login, but to enroll you need to create an account on our platform. After selecting a course, complete the payment process through our secure gateway. Once payment is confirmed, you'll receive access credentials for our mobile app where you can access all course materials, videos, and resources.",
  },
  {
    question: "Do you provide certification for courses?",
    answer:
      "Yes, upon successful completion of our courses, you receive certificates that validate your learning and understanding of the subject matter. These certificates can be used for professional development and demonstrate your commitment to learning proper financial market practices. All certificates are digitally signed and verifiable.",
  },
  {
    question: "Can I access purchased content on mobile?",
    answer:
      "Absolutely! After purchasing any course or service, you can access all content through our dedicated mobile app. The app provides offline viewing capabilities, progress tracking, note-taking features, and seamless synchronization across devices. Simply download our app and login with your credentials to access your purchased content.",
  },
];

const Consultancy = [
  {
    question : "Are consultancy sessions live?",
    answer : "Yes, all consultancy sessions are conducted live to ensure personalized guidance and real-time interaction. You can choose from video calls, phone calls, or in-person meetings based on your preference and the consultant's availability. Each session is typically 60-90 minutes long and includes follow-up recommendations. ",
  },
    {
    question : "How do I book a consultation?",
    answer : " To book a consultation, browse our available consultants, select one based on your needs and their expertise, choose your preferred time slot from their calendar, select meeting type (video/phone/in-person), complete the payment, and you'll receive confirmation with meeting details and joining instructions.",
  }
]



  const webinars = [
    {
      question: "How are webinars conducted?",
      answer:
        "Webinars are conducted online through our professional platform with high-quality video and audio. Free webinars are open to all registered users, while paid webinars require purchase. All sessions include live Q&A opportunities, screen sharing for chart analysis, downloadable resources, and recordings for later reference...",
    },
    {
      question: "Can I access webinar recordings?",
      answer:
        "Yes, all registered participants can access webinar recordings for a specified period after the live session. Recordings include the full presentation, Q&A session, and any supplementary materials shared during the webinar. Premium subscribers get extended access to our webinar library",
    },
  ];

  const payments = [
    {
      question:
        "We support all major payment methods ",
      answer: "We support all major payment methods for your convenience: UPI payments (Google Pay, PhonePe, Paytm), Credit and Debit cards (Visa, Mastercard, RuPay), Net banking from all major banks, and Digital wallets. All transactions are secured with bank-grade encryption.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "After successful payment completion, you'll be redirected to a 'Thank You' page with instructions to download and login to our mobile app. Your purchased services (courses, consultancy sessions, webinars) will be automatically unlocked in your app account. You'll also receive email confirmation with access details.",
    },
  ];

    const Groups  = [
    {
      question:
        "Is KYC mandatory for group access? ",
      answer: "Yes, KYC (Know Your Customer) verification is mandatory for accessing paid groups to ensure compliance with financial regulations and maintain a secure trading environment. This helps us verify user identity, prevent fraudulent activities, and create a trusted community of serious learners and traders.",
    },
    {
      question: "What documents are required for KYC?",
      answer:
        "For KYC verification, you need to provide: Government-issued photo ID (Aadhaar, PAN, Passport, or Driving License), Address proof (recent utility bill, bank statement, or rental agreement), and a recent passport-size photograph. All documents should be clear, legible, and valid..",
    },
  ];

  // Reusable FAQ Box
  const FAQBox = ({ title, data, category }) => (

  
    <div className="py-6 px-6 md:px-12 lg:px-20 bg-white">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-lg rounded-lg p-5">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 p-2 rounded-full mr-3">
            <FaQuestionCircle className="text-yellow-600 text-xl" />
          </div>
          <h1 className="text-2xl md:text-3xl  text-gray-900">{title}</h1>
        </div>

        <div className="space-y-2">
          {data.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(category, index)}
                className="w-full flex justify-between items-center text-left p-4 focus:outline-none"
              >
                <span className="text-gray-900 font-normal ">{faq.question}</span>
                {openIndex[category] === index ? (
                  <FaChevronUp className="text-yellow-600" />
                ) : (
                  <FaChevronDown className="text-yellow-600" />
                )}
              </button>
              {openIndex[category] === index && (
                <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                  {faq.answer || "No additional details available."}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
   
    <div className="py-12 px-4 bg-white mt-20">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-xl md:text-3xl  text-gray-900">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-sm md:text-base mt-2 mb-6">
          Find answers to common questions about CA ki Stock Market
        </p>

        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search FAQs"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
        </div>
      </div>

      {/* Reusable Sections */}
      <FAQBox title="General Questions" data={faqs} category="general" />
      <FAQBox title="Course" data={course} category="course" />
      <FAQBox title="Consultancy" data={Consultancy} category="Consultancy" />
      <FAQBox title="Webinars" data={webinars} category="webinars" />
      <FAQBox title="Payments & Access" data={payments} category="payments" />
       <FAQBox title="Groups & KYC" data={Groups } category="Groups" />
       {/* <FAQBox title="Groups & KYC" data={Groups} category="Groups" /> */}

{/* Quick Access Section yahan paste karo */}





         {/* Quick Access Section */}
       {/* <div className="max-w-4xl mx-auto bg-yellow-100 border border-amber-400 rounded-lg p-6 shadow-md mt-10">
         <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
           Quick Access
         </h1>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { name: "Course", path: "/course" },
             { name: "Consultancy", path: "/consultancy" },
             { name: "Webinar", path: "/webinar" },
           ].map((item, idx) => (
             <div
               key={idx}
               onClick={() => navigate(item.path)}
               className="flex flex-col items-center justify-center gap-2 p-6 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg hover:bg-yellow-50 transition"
             >
               <FaBookOpen className="text-3xl text-yellow-600" />
               <span className="text-lg font-semibold text-gray-700">{item.name}</span>
             </div>
           ))}
         </div>
       </div> */}




  
    </div>
    <Footer/>
 </>
  
  );



};

export default FAQ;
