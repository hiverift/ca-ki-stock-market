import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // <- important: triggers on route change

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

  // Safe reader of auth info from storage
  const readAuthFromStorage = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    const adminFlag = localStorage.getItem("admin");
    const userRaw = localStorage.getItem("user");
    let userRole = null;

    try {
      if (userRaw) {
        const parsed = JSON.parse(userRaw);
        userRole = parsed?.role;
      }
    } catch (e) {
      // ignore parse error
    }

    return {
      isLoggedIn: !!token,
      isAdmin: adminFlag === "true" || userRole === "admin" || !!localStorage.getItem("adminId"),
    };
  }, []);

  // Check login status initially, on global event, and on route change
  useEffect(() => {
    const checkLoginStatus = () => {
      const { isLoggedIn, isAdmin } = readAuthFromStorage();
      setIsLoggedIn(isLoggedIn);
      setIsAdmin(isAdmin);
    };

    checkLoginStatus();

    window.addEventListener("loginStatusChanged", checkLoginStatus);

    // route changes also re-check because `location` is in deps
    checkLoginStatus();

    return () => {
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, [readAuthFromStorage, location]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    window.dispatchEvent(new Event("loginStatusChanged"));

    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  // when a regular (non-admin) user is logged in
  const showUserControls = isLoggedIn && !isAdmin;

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
              {showUserControls ? (
                <>
                  {/* Dashboard button left of Logout */}
                  <Link
                    to="/user-dashboard"
                    className="px-4 py-2 bg-yellow-100 text-black rounded-lg hover:bg-gray-200 transition flex items-center"
                    aria-label="Go to dashboard"
                  >
                     User Dashboard
                  </Link>

                  <button onClick={handleLogout} className="text-red-500 hover:underline">
                    Logout
                  </button>
                </>
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
              <button onClick={toggleMenu}>{isOpen ? <X size={28} /> : <Menu size={28} />}</button>
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
                {showUserControls ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-center transition"
                    >
                      User Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="hover:bg-red-500 text-white px-4 py-2 rounded-lg transition text-center"
                    >
                      Logout
                    </button>
                  </>
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
