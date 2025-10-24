import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Webinars", path: "/webinars" },
    { name: "About Us", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
    { name: "Appointment", path: "/appointment" },
  ];

  // ✅ Check login status and update whenever loginStatusChanged event fires
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("accessToken");
      const adminToken = localStorage.getItem("admin");
      setIsLoggedIn(!!token);
      setIsAdmin(!!adminToken);
    };

    checkLoginStatus(); // initial check

    // 👇 Listen for login status changes globally
    window.addEventListener("loginStatusChanged", checkLoginStatus);
    return () => window.removeEventListener("loginStatusChanged", checkLoginStatus);
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("admin");
    localStorage.removeItem("adminId");
    localStorage.removeItem("token"); // in case token used for auto-login

    // 👇 Notify all components that login status changed
    window.dispatchEvent(new Event("loginStatusChanged"));

    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white text-black border-b border-gray-200 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-up text-gray-900 bg-amber-400 rounded p-1"
              >
                <path d="M16 7h6v6"></path>
                <path d="m22 7-8.5 8.5-5-5L2 17"></path>
              </svg>
              <p className="text-xl">CA Stock Market</p>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-yellow-500 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoggedIn && !isAdmin ? (
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={toggleMenu}>
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? "max-h-120 mt-3" : "max-h-0"
            }`}
          >
            <div className="flex flex-col space-y-3 bg-gray-900 p-4 rounded-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-yellow-400 text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex flex-col space-y-2 mt-2">
                {isLoggedIn && !isAdmin ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="hover:bg-red-500 text-white px-4 py-2 rounded-lg transition text-center"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="hover:bg-yellow-400 text-white px-4 py-2 rounded-lg transition text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg transition text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
