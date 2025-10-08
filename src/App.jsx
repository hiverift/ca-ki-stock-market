import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Courses from "./pages/Course";
import Consultancy from "./pages/Consultancy";
import Webinars from "./pages/Webinars";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
// import Admin from "./pages/Admin";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFount from "../src/NotFound";

// User Dashboard pages
import UserDashboard from "./userdashboard/UserDashboard";
import MyCourses from "./userdashboard/MyCourses";
import MyAppointment from "./userdashboard/MyAppointment";
import MyWebinars from "./userdashboard/MyWebinars";
// import Groups from "./userdashboard/Groups";
import ProfileKYC from "./userdashboard/ProfileKYC";
import DashboardHome from "./userdashboard/DashboardHome";
import CheckoutPage from "./pages/CheckoutPage";
import Appointment from "./pages/Appointment";

// ✅ Admin Dashboard pages
import AdminDashboard from "./Admindashboard/AdminDashboard";
import AdminSideBar from "./Admindashboard/AdminSideBar";
import AdminCourse from "./Admindashboard/AdminCourse";
import AdminWebinar from "./Admindashboard/AdminWebinar";
import AdminAppoinment from "./Admindashboard/AdminAppoinment";
import AdminDashboardHome from "./Admindashboard/AdminDashboardHome";
import Adminpayments from "./Admindashboard/Adminpayments";
import UserManagement from "./Admindashboard/UserManagment";
import KycVerification from "./Admindashboard/Kycverification";
// import AdminCategory from "./Admindashboard/AdminCategory";
import CategorySection from "./Admindashboard/CategorySection";
import SubcategorySection from "./Admindashboard/SubcategorySection";
import AdminServiceAdd from "./Admindashboard/AdminServices";
import AdminProfile from "./Admindashboard/AdminProfile";
import Adminorder from "./Admindashboard/Adminorder";

// -------- ProtectedRoute component --------
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("accessToken"); // ✅ login ke baad jo store karte ho
  const user = JSON.parse(localStorage.getItem("user")); // ✅ user ka pura object
  console.log("ProtectedRoute user:", user,token);
  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // Agar role mismatch hua
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppWrapper = ({ children }) => {
  const location = useLocation();
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

// Wrapper to conditionally show Navbar
// const AppWrapper = ({ children }) => {
//   const location = useLocation();
//   const hideNavbarPaths = [
//     "/user-dashboard",
//     "/admin-dashboard", //
//   ];

//   const hideNavbar = hideNavbarPaths.some((path) =>
//     location.pathname.startsWith(path)
//   );

//   return (
//     <>
//       {!hideNavbar && <Navbar />}
//       {children}
//     </>
//   );
// };

function App() {
  return (
    <Router>
      <AppWrapper>
        <Routes>
          {/* Main site routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/consultancy" element={<Consultancy />} />
          <Route path="/webinars" element={<Webinars />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/admin" element={<Admin />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/appointment" element={<Appointment />} />

          {/* ✅ User Dashboard nested routes */}

          {/* ✅ User Dashboard protected */}
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

          {/* ✅ Admin Dashboard protected */}
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
          </Route>

          <Route path="*" element={<NotFount />} />
        </Routes>
      </AppWrapper>
    </Router>
  );
}

export default App;
