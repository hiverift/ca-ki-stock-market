import { useEffect, useState } from "react";

const DashboardHome = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Example: login ke baad tumne localStorage.setItem("user", JSON.stringify(user))
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);

  return (
    <div className="md:ml-64 p-6">
      {/* Welcome Card */}
      <div className="bg-yellow-200 border border-yellow-600 rounded-lg p-6 mt-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {userName || "Trader"} 👋
        </h1>
        <p className="text-gray-700">
          Continue your trading journey with expert guidance
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;
