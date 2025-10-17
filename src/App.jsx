import React from "react";
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ---------------- Main site pages ----------------
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Courses from "./pages/Course";
import Consultancy from "./pages/Consultancy";
import Webinars from "./pages/Webinars";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CheckoutPage from "./pages/CheckoutPage";
import Appointment from "./pages/Appointment";
import NotFound from "./NotFound";

// ---------------- User Dashboard pages ----------------
import UserDashboard from "./userdashboard/UserDashboard";
import DashboardHome from "./userdashboard/DashboardHome";
import MyCourses from "./userdashboard/MyCourses";
import MyAppointment from "./userdashboard/MyAppointment";
import MyWebinars from "./userdashboard/MyWebinars";
import ProfileKYC from "./userdashboard/ProfileKYC";

// ---------------- Admin Dashboard pages ----------------
import AdminDashboard from "./Admindashboard/AdminDashboard";
import AdminDashboardHome from "./Admindashboard/AdminDashboardHome";
import AdminCourse from "./Admindashboard/AdminCourse";
import AdminWebinar from "./Admindashboard/AdminWebinar";
import AdminAppoinment from "./Admindashboard/AdminAppoinment";
import Adminpayments from "./Admindashboard/Adminpayments";
import UserManagement from "./Admindashboard/UserManagment";
import KycVerification from "./Admindashboard/Kycverification";
import CategorySection from "./Admindashboard/CategorySection";
import SubcategorySection from "./Admindashboard/SubcategorySection";
import AdminServiceAdd from "./Admindashboard/AdminServices";
import AdminProfile from "./Admindashboard/AdminProfile";
import Adminorder from "./Admindashboard/Adminorder";

// Premium Admin Pages
import PremiumWebinars from "./Admindashboard/PremiumWebinars";
import PremiumCourses from "./Admindashboard/PremiumCourses";
import PremiumAppointments from "./Admindashboard/PremiumAppointments";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// ---------------- Protected Route ----------------
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
};

// ---------------- Navbar Wrapper ----------------
// const AppWrapper = ({ children }) => {
//   const location = window.location.pathname;
//   const hideNavbarPaths = ["/user-dashboard", "/admin-dashboard"];
//   const hideNavbar = hideNavbarPaths.some(path => location.startsWith(path));
//   return (
//     <>
//       {!hideNavbar && <Navbar />}
//       {children}
//     </>
//   );
// };


const AppWrapper = ({ children }) => {
  const location = useLocation(); // ✅ reactive
  const hideNavbarPaths = ["/user-dashboard", "/admin-dashboard"];
  const hideNavbar = hideNavbarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};



function App() {
  return (
    <Router>
      <AppWrapper>
        <Routes>
          {/* ---------------- Main site routes ---------------- */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/consultancy" element={<Consultancy />} />
          <Route path="/webinars" element={<Webinars />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
           <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/appointment" element={<Appointment />} />

          {/* ---------------- User Dashboard routes ---------------- */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="my-consultations" element={<MyAppointment />} />
            <Route path="my-webinars" element={<MyWebinars />} />
            <Route path="profile-kyc" element={<ProfileKYC />} />
          </Route>

          {/* ---------------- Admin Dashboard routes ---------------- */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">


                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardHome />} />
            <Route path="courses" element={<AdminCourse />} />
            <Route path="webinars" element={<AdminWebinar />} />
            <Route path="appointments" element={<AdminAppoinment />} />
            <Route path="payments" element={<Adminpayments />} />
            <Route path="services" element={<AdminServiceAdd />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="kyc-verification" element={<KycVerification />} />
            <Route path="CategorySection" element={<CategorySection />} />
            <Route path="SubcategorySection" element={<SubcategorySection />} />
            <Route path="adminProfile" element={<AdminProfile />} />
            <Route path="Adminorder" element={<Adminorder />} />

            {/* ---------------- Premium pages ---------------- */}
            <Route path="premium-webinars" element={<PremiumWebinars />} />
            <Route path="premium-courses" element={<PremiumCourses />} />
            <Route path="premium-appointments" element={<PremiumAppointments />} />
          </Route>

          {/* ---------------- Catch all ---------------- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppWrapper>

      {/* ---------------- Toaster ---------------- */}
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
