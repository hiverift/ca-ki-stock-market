import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, BookOpen, DollarSign, Video, FileText, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid , Cell } from 'recharts';
import config from '../pages/config';

const AdminDashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${config.BASE_URL}admin/dashboard`);
        if (response.data.statusCode === 200) {
          setDashboardData(response.data.result);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong while fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const metrics = dashboardData
    ? [
        { title: 'Total Users', value: dashboardData.totalUsers, icon: Users, bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
        { title: 'Active Courses', value: dashboardData.activeCourses, icon: BookOpen, bgColor: 'bg-green-50', iconColor: 'text-green-500' },
        { title: 'Monthly Revenue', value: `₹${dashboardData.monthlyRevenue.toLocaleString()}`, icon: DollarSign, bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
        { title: 'Live Webinars', value: dashboardData.liveWebinars, icon: Video, bgColor: 'bg-red-50', iconColor: 'text-red-500' },
        { title: 'Pending KYC', value: dashboardData.pendingKYC, icon: FileText, bgColor: 'bg-orange-50', iconColor: 'text-orange-500' },
        { title: 'Growth Rate', value: `+${dashboardData.growthRate}%`, icon: TrendingUp, bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
      ]
    : [];

  const chartData = dashboardData
    ? [
        { name: 'Users', value: dashboardData.totalUsers },
        { name: 'Courses', value: dashboardData.activeCourses },
        { name: 'Revenue', value: dashboardData.monthlyRevenue },
        { name: 'Webinars', value: dashboardData.liveWebinars },
        { name: 'KYC', value: dashboardData.pendingKYC },
      ]
    : [];

  // Export metrics + chart data to CSV
  const exportToCSV = () => {
    if (!dashboardData) return;

    let csvContent = 'Metric,Value\n';

    // Add metrics
    metrics.forEach((m) => {
      const val = typeof m.value === 'string' ? m.value.replace(/[₹,+%]/g, '') : m.value;
      csvContent += `${m.title},${val}\n`;
    });

    csvContent += '\nChart Data\nName,Value\n';
    // Add chart data
    chartData.forEach((item) => {
      csvContent += `${item.name},${item.value}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><p>Loading dashboard...</p></div>;
  if (error) return <div className="min-h-screen flex justify-center items-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your platform and monitor performance</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" /> Export Data
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">{metric.title}</p>
                    <p className="text-2xl md:text-3xl text-gray-900">{metric.value}</p>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-xl`}>
                    <IconComponent className={`w-6 h-6 ${metric.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Graph Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Platform Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" barSize={40}>
      {chartData.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={
            [
              "#3b82f6", // Users - Blue
              "#10b981", // Courses - Green
              "#f59e0b", // Revenue - Amber
              "#ef4444", // Webinars - Red
              "#8b5cf6", // KYC - Purple
            ][index % 5]
          }
        />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
