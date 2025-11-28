import {
  MapPin,
  Phone,
  Mail,
  Home,
  BookOpen,
  Users,
  HelpCircle,
  Shield,
  FileText,
  Headphones,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-6">
              CA ki Stock Market
            </h3>

            <div className="space-y-3">
              {/* <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>CA GLH 16/1 Kaju Nagar</p>
                  <p>G BLOCK NEAR GURUDWARA</p>
                  <p>GHAZIABAD-201002 INDIA</p>
                </div>
              </div> */}

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-300">+91 96675 20027</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-300">
                  info@accountantskipathshala.com
                </span>
              </div>
            </div>
          </div>

          {/* Site Map */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Site Map</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm">Home</span>
                </a>
              </li>
              <li>
                <a
                  href="/courses"
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">Courses</span>
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Our Mentors</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Our Organization</span>
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-sm">FAQ</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Testimonials</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Privacy Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Terms of Service</span>
                </a>
              </li>
              <li>
                <a
                  href="/Contact"
                  className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <Headphones className="w-4 h-4" />
                  <span className="text-sm">Contact Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Subscribe</h4>
            <p className="text-sm text-gray-300 mb-4">
              Stay updated with market insights and course announcements
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter Email Address"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-2 px-4 rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © CA ki Stock Market | All Rights Reserved
            </div>
            <div className="text-sm text-gray-400">
              Designed By{" "}
              <a
                href="https://hiverift.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 font-semibold hover:underline"
              >
                hiverift.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
