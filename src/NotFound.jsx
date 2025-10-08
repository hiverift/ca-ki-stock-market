import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
  // Airplane animation variants
  const airplaneVariants = {
    initial: {
      x: '-100vw',
      y: '30vh',
      rotate: 0,
    },
    animate: {
      x: '100vw',
      y: ['30vh', '20vh', '40vh', '30vh'], // Wave-like motion
      rotate: [0, 10, -10, 0],
      transition: {
        x: { duration: 5, ease: 'linear' },
        y: { duration: 5, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' },
        rotate: { duration: 5, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' },
        repeat: Infinity,
        repeatDelay: 1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col justify-center items-center relative overflow-hidden pt-16">
      {/* Airplane Animation */}
      <motion.div
        className="absolute text-6xl"
        variants={airplaneVariants}
        initial="initial"
        animate="animate"
      >
        ✈️
      </motion.div>

      {/* 404 Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center z-10"
      >
        <h1 className="text-6xl md:text-8xl font-extrabold text-blue-800 mb-4 tracking-tight">
          404
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-700 mb-6">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Looks like your flight got lost in the clouds. Let's get you back on track!
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
        >
          Return to Homepage
        </Link>
      </motion.div>

      {/* Cloud Decorations */}
      <div className="absolute top-24 left-10 text-4xl opacity-50">☁️</div>
      <div className="absolute top-32 right-20 text-5xl opacity-50">☁️</div>
      <div className="absolute bottom-20 left-20 text-3xl opacity-50">☁️</div>
    </div>
  );
};

export default NotFound;