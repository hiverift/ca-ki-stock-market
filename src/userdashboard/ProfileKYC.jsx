import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Download,
  Edit,
  Save,
  X,
} from "lucide-react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { LuFileText } from "react-icons/lu";
import { BiSolidArrowToTop } from "react-icons/bi";

import axios from "axios";
import Swal from "sweetalert2";
import config from "../pages/config";

const ProfileKYC = () => {
  // tabs
  const [activeTab, setActiveTab] = useState("profile");
  const [userId, setUserId] = useState("68b1a01074ad0c19f272b438"); // Default userId
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editProfileData, setEditProfileData] = useState(null); // State for editing profile data

  // refs for file inputs
  const aadharFrontInputRef = useRef(null);
  const aadharBackInputRef = useRef(null);
  const panFrontInputRef = useRef(null);
  const panBackInputRef = useRef(null);

  // states for data
  const [profileData, setProfileData] = useState({
    fullName: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 9876543210",
    dateOfBirth: "06/15/1985",
    address: "Mumbai, Maharashtra",
    occupation: "Software Engineer",
  });
  const [accountSummary, setAccountSummary] = useState({
    memberSince: "Aug 2024",
    coursesEnrolled: 12,
    webinarsAttended: 24,
    groupsJoined: 5,
    kycStatus: "Pending",
  });
  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: 1,
      course: "Advanced Options Trading Course",
      date: "2024-08-25",
      amount: "₹12,999",
      status: "Completed",
    },
    {
      id: 2,
      course: "Technical Analysis Webinar",
      date: "2024-08-20",
      amount: "₹999",
      status: "Completed",
    },
    {
      id: 3,
      course: "Elite Options Trading Circle (Monthly)",
      date: "2024-08-15",
      amount: "₹2,999",
      status: "Completed",
    },
  ]);
  const [tradingPreferences, setTradingPreferences] = useState({
    experience: "Intermediate (2-5 years)",
    investmentStyle: ["Day Trading", "Options Trading", "Long-term Investment"],
    riskTolerance: "Moderate",
  });

  // state to track uploaded files and their previews
  const [uploadedFiles, setUploadedFiles] = useState({
    aadhar_front: null,
    aadhar_back: null,
    pan_front: null,
    pan_back: null,
  });
  const [filePreviews, setFilePreviews] = useState({
    aadhar_front: null,
    aadhar_back: null,
    pan_front: null,
    pan_back: null,
  });

  const [loading, setLoading] = useState(false);

  // helper: trigger file input click
  const handleFileInputClick = (ref) => {
    if (ref && ref.current) ref.current.click();
  };

  // handler: update uploaded files and previews with validation
  const handleFileChange = (type, file) => {
    if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: file,
      }));
      setFilePreviews((prev) => ({
        ...prev,
        [type]: URL.createObjectURL(file),
      }));
    } else {
      Swal.fire({
        title: "Invalid File",
        text: "Please upload a valid JPG or PNG file.",
        icon: "error",
      });
    }
  };

  // Upload handler: sends multipart/form-data to backend with userId
  const handleFileUpload = async () => {
    if (
      !uploadedFiles.aadhar_front ||
      !uploadedFiles.aadhar_back ||
      !uploadedFiles.pan_front ||
      !uploadedFiles.pan_back
    ) {
      Swal.fire(
        "Missing Documents",
        "Please upload Aadhaar Front, Aadhaar Back, PAN Front, and PAN Back before submitting.",
        "warning"
      );
      return;
    }

    const formData = new FormData();
    // Use field names expected by the backend (update these based on API documentation)
    formData.append("aadhaar_front", uploadedFiles.aadhar_front);
    formData.append("aadhaar_back", uploadedFiles.aadhar_back);
    formData.append("pan_front", uploadedFiles.pan_front);
    formData.append("pan_back", uploadedFiles.pan_back);
    formData.append("userId", userId);

    // Log FormData entries for debugging
    for (let pair of formData.entries()) {
      console.log(`FormData: ${pair[0]}: ${pair[1]}`);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      console.log('token after login', token);

      if (!token) {
        Swal.fire({
          title: "Authentication Error",
          text: "No access token found. Please log in again.",
          icon: "error",
        });
        return;
      }

      const res = await axios.post(`${config.BASE_URL}kyc/submit `, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.data?.statusCode === 200) {
        Swal.fire({
          title: "Uploaded",
          text: "All documents uploaded successfully. " + res.data.message,
          icon: "success",
        });

        // Update KYC status in accountSummary
        setAccountSummary((prev) => ({
          ...prev,
          kycStatus: res.data.result.status || "Pending",
        }));

        // Fetch fresh KYC status
        try {
          const statusRes = await axios.get(
            `${config.BASE_URL}kyc/status/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (statusRes?.data?.result) {
            setAccountSummary((prev) => ({
              ...prev,
              kycStatus: statusRes.data.result.status || prev.kycStatus,
            }));
          }
        } catch (statusErr) {
          console.warn("KYC status fetch failed:", statusErr.message);
          setAccountSummary((prev) => ({
            ...prev,
            kycStatus: res.data.result.status || prev.kycStatus,
          }));
        }

        // Reset file inputs but keep previews for viewing/replacing
        if (aadharFrontInputRef.current) aadharFrontInputRef.current.value = null;
        if (aadharBackInputRef.current) aadharBackInputRef.current.value = null;
        if (panFrontInputRef.current) panFrontInputRef.current.value = null;
        if (panBackInputRef.current) panBackInputRef.current.value = null;
      } else {
        throw new Error(res?.data?.message || "Unexpected response");
      }
    } catch (err) {
      console.error("KYC upload error:", err.response?.data || err.message);
      Swal.fire({
        title: "Upload failed",
        text:
          err.response?.data?.message ||
          "Please try again. Ensure the file format is correct (e.g., JPG, PNG).",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // onChange handlers for hidden inputs
  const onAadharFrontChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange("aadhar_front", file);
  };
  const onAadharBackChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange("aadhar_back", file);
  };
  const onPanFrontChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange("pan_front", file);
  };
  const onPanBackChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange("pan_back", file);
  };

  // Handler for Edit Profile
  const handleEditProfile = () => {
    setEditProfileData({ ...profileData });
    setIsEditing(true);
  };

  // Handler for saving profile changes
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Swal.fire({
          title: "Authentication Error",
          text: "No access token found. Please log in again.",
          icon: "error",
        });
        return;
      }

      const res = await axios.put(
        `${config.BASE_URL}/kyc/status/${userId}`,
        editProfileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res?.data?.statusCode === 200) {
        setProfileData(editProfileData);
        localStorage.setItem("user", JSON.stringify(editProfileData));
        Swal.fire({
          title: "Success",
          text: "Profile updated successfully",
          icon: "success",
        });
        setIsEditing(false);
      } else {
        throw new Error(res?.data?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to update profile",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler for canceling edit
  const handleCancelEdit = () => {
    setEditProfileData(null);
    setIsEditing(false);
  };

  // Handler for input changes in edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // On mount: Fetch user profile and KYC status
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch user profile
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setProfileData((prev) => ({
              ...prev,
              fullName: parsed.fullName || parsed.name || prev.fullName,
              email: parsed.email || prev.email,
              phone: parsed.mobile || parsed.phone || prev.phone,
              dateOfBirth: parsed.dob || parsed.dateOfBirth || prev.dateOfBirth,
              address: parsed.address || prev.address,
              occupation: parsed.occupation || prev.occupation,
            }));
          } catch (parseErr) {
            console.warn("Could not parse stored user", parseErr);
          }
        }

        // Fetch KYC status
        if (token) {
          try {
            const statusRes = await axios.get(
              `${config.BASE_URL}kyc/status/${userId}`,
              { headers }
            );
            if (statusRes?.data?.statusCode === 200 && statusRes?.data?.result) {
              setAccountSummary((prev) => ({
                ...prev,
                kycStatus: statusRes.data.result.status || prev.kycStatus,
              }));
            } else {
              throw new Error(statusRes?.data?.message || "Failed to fetch KYC status");
            }
          } catch (err) {
            console.warn("KYC status fetch failed:", err.message);
            Swal.fire({
              title: "Error",
              text: err.message || "Failed to fetch KYC status",
              icon: "error",
            });
            setAccountSummary((prev) => ({
              ...prev,
              kycStatus: "Pending",
            }));
          }
        } else {
          Swal.fire({
            title: "Authentication Error",
            text: "No access token found. Please log in again.",
            icon: "error",
          });
        }
      } catch (err) {
        console.error("init error", err);
        Swal.fire({
          title: "Error",
          text: err.message || "Failed to initialize profile",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      init();
    }

    // Cleanup previews on unmount to avoid memory leaks
    return () => {
      Object.values(filePreviews).forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [userId]);

  // Render Sidebar
  const renderSidebar = () => (
    <div className="space-y-8">
      <div className="bg-gray-50 rounded-lg p-6 shadow border border-gray-300">
        <h3 className="text-lg text-gray-900 mb-6">Account Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Member Since</span>
            <span className="text-sm text-gray-900">{accountSummary?.memberSince}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Courses Enrolled</span>
            <span className="text-sm text-gray-900">{accountSummary?.coursesEnrolled}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Webinars Attended</span>
            <span className="text-sm text-gray-900">{accountSummary?.webinarsAttended}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Groups Joined</span>
            <span className="text-sm text-gray-900">{accountSummary?.groupsJoined}</span>
          </div>
          <hr />
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">KYC Status</span>
            <span className="inline-flex px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
              {accountSummary?.kycStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 shadow border border-gray-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg text-gray-900">Payment History</h3>
          <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
        <div className="space-y-4">
          {paymentHistory.map((payment) => (
            <div
              key={payment.id}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-gray-900 text-sm">{payment.course}</h4>
                <span className="text-gray-900 text-sm">{payment.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600">{payment.date}</p>
                <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full h-10 mt-4 text-blue-600 hover:bg-yellow-400 text-md rounded-2xl">
          View All Payments
        </button>
      </div>
    </div>
  );

  // Render Profile Tab
  const renderProfileTab = () => (
    <div className="space-y-8">
      <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg text-gray-900 mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  name="fullName"
                  value={editProfileData?.fullName || ""}
                  onChange={handleEditInputChange}
                  className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-600"
                  placeholder="Enter full name"
                />
              </div>
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{profileData?.fullName}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            {isEditing ? (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="email"
                  name="email"
                  value={editProfileData?.email || ""}
                  onChange={handleEditInputChange}
                  className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-600"
                  placeholder="Enter email"
                />
              </div>
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{profileData?.email}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            {isEditing ? (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  name="phone"
                  value={editProfileData?.phone || ""}
                  onChange={handleEditInputChange}
                  className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-600"
                  placeholder="Enter phone number"
                />
              </div>
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{profileData?.phone || profileData?.mobile}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            {isEditing ? (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  name="dateOfBirth"
                  value={editProfileData?.dateOfBirth || ""}
                  onChange={handleEditInputChange}
                  className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-600"
                  placeholder="Enter date of birth (MM/DD/YYYY)"
                />
              </div>
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{profileData?.dateOfBirth}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            {isEditing ? (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  name="address"
                  value={editProfileData?.address || ""}
                  onChange={handleEditInputChange}
                  className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-600"
                  placeholder="Enter address"
                />
              </div>
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{profileData?.address}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
            {isEditing ? (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  name="occupation"
                  value={editProfileData?.occupation || ""}
                  onChange={handleEditInputChange}
                  className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-600"
                  placeholder="Enter occupation"
                />
              </div>
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{profileData?.occupation}</span>
              </div>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleCancelEdit}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>
      <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg text-gray-900 mb-6">Trading Preferences</h3>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Trading Experience</p>
          <h1 className="text-base text-gray-900">{tradingPreferences?.experience}</h1>
        </div>
        <div className="mb-4">
          <h3 className="text-sm text-gray-600 mb-2">Investment Style</h3>
          <div className="flex flex-wrap gap-2">
            {tradingPreferences?.investmentStyle?.map((style, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full border border-indigo-200"
              >
                {style}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-600">Risk Tolerance</h3>
          <h1 className="text-base text-gray-900">{tradingPreferences?.riskTolerance}</h1>
        </div>
      </div>
    </div>
  );

  // Render KYC Tab
  const renderKYCTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-lg text-gray-900">KYC Verification Status</h1>
        <div className="flex items-center gap-2 bg-amber-100 border border-yellow-300 text-yellow-700 px-3 py-1.5 rounded-md shadow-sm">
          <AiOutlineExclamationCircle className="w-4 h-4" />
          <p className="text-xs font-medium">{accountSummary.kycStatus}</p>
        </div>
      </div>
      <div>
        <h1 className="text-lg text-gray-900 mb-4">Document Status</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-3">
          <div className="flex items-center gap-3">
            <LuFileText className="w-6 h-6 text-gray-500" />
            <div>
              <h1 className="text-sm font-medium text-gray-900">Aadhaar Card (Front)</h1>
              <p className="text-xs text-gray-600">Identity verification</p>
            </div>
          </div>
          <span className="mt-2 sm:mt-0 inline-flex px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            {uploadedFiles.aadhar_front ? "Uploaded" : "Pending"}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-3">
          <div className="flex items-center gap-3">
            <LuFileText className="w-6 h-6 text-gray-500" />
            <div>
              <h1 className="text-sm font-medium text-gray-900">Aadhaar Card (Back)</h1>
              <p className="text-xs text-gray-600">Identity verification</p>
            </div>
          </div>
          <span className="mt-2 sm:mt-0 inline-flex px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            {uploadedFiles.aadhar_back ? "Uploaded" : "Pending"}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-3">
          <div className="flex items-center gap-3">
            <LuFileText className="w-6 h-6 text-gray-500" />
            <div>
              <h1 className="text-sm font-medium text-gray-900">PAN Card (Front)</h1>
              <p className="text-xs text-gray-600">Identity verification</p>
            </div>
          </div>
          <span className="mt-2 sm:mt-0 inline-flex px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            {uploadedFiles.pan_front ? "Uploaded" : "Pending"}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <LuFileText className="w-6 h-6 text-gray-500" />
            <div>
              <h1 className="text-sm font-medium text-gray-900">PAN Card (Back)</h1>
              <p className="text-xs text-gray-600">Identity verification</p>
            </div>
          </div>
          <span className="mt-2 sm:mt-0 inline-flex px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            {uploadedFiles.pan_back ? "Uploaded" : "Pending"}
          </span>
        </div>
      </div>
      <div>
        <h1 className="text-lg text-gray-900 mb-4">Upload and View Documents</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "aadhar_front", label: "Aadhaar Card (Front)", ref: aadharFrontInputRef, onChange: onAadharFrontChange },
            { key: "aadhar_back", label: "Aadhaar Card (Back)", ref: aadharBackInputRef, onChange: onAadharBackChange },
            { key: "pan_front", label: "PAN Card (Front)", ref: panFrontInputRef, onChange: onPanFrontChange },
            { key: "pan_back", label: "PAN Card (Back)", ref: panBackInputRef, onChange: onPanBackChange },
          ].map(({ key, label, ref, onChange }) => (
            <div
              key={key}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h2 className="text-sm font-medium text-gray-900 mb-2">{label}</h2>
              {filePreviews[key] ? (
                <img
                  src={filePreviews[key]}
                  alt={label}
                  className="w-full h-48 object-contain rounded-md mb-4"
                  onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md mb-4">
                  <p className="text-gray-500 text-sm">No file uploaded</p>
                </div>
              )}
              <input
                type="file"
                ref={ref}
                className="hidden"
                onChange={onChange}
                accept="image/jpeg,image/png"
              />
              <button
                onClick={() => handleFileInputClick(ref)}
                className="w-full flex items-center justify-center gap-2 hover:bg-yellow-200 text-black py-5 rounded-lg shadow border border-gray-400"
              >
                <BiSolidArrowToTop className="w-5 h-5" />
                {uploadedFiles[key] ? `Replace ${label.split(' ')[0]} (${label.split(' ')[2]})` : `Upload ${label.split(' ')[0]} (${label.split(' ')[2]})`}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleFileUpload}
          className="w-full mt-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
        >
          Submit All Documents
        </button>
      </div>
      <div>
        <h1 className="text-lg text-gray-900 mb-4">Verification Process</h1>
        <div className="space-y-4 pl-3">
          <div className="flex items-start gap-3">
            <span className="w-3 h-3 mt-1 rounded-full bg-green-500"></span>
            <div>
              <p className="text-sm font-medium text-gray-900">Documents uploaded</p>
              <p className="text-xs text-gray-500">Aug 20, 2024</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-3 h-3 mt-1 rounded-full bg-yellow-400"></span>
            <div>
              <p className="text-sm font-medium text-gray-900">Under review</p>
              <p className="text-xs text-gray-500">Currently being verified</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-3 h-3 mt-1 rounded-full bg-gray-400"></span>
            <div>
              <p className="text-sm font-medium text-gray-900">Verification complete</p>
              <p className="text-xs text-gray-500">Pending final approval</p>
            </div>
          </div>
          <div className="bg-yellow-100 border border-amber-300 h-30 shadow rounded-xl">
            <div className="px-5 pt-5">
              <h1 className="text-lg text-gray-900">Add remark</h1>
              <p className="text-sm text-gray-600">Documents under review by our team</p>
            </div>
          </div>
          <div className="mt-6">
            <h1 className="text-lg text-gray-900 mb-4">Benefits of KYC Verification</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-green-100 border border-green-400 rounded-lg p-4 shadow-sm">
              <div className="flex gap-4">
                <span className="text-green-700 font-bold">✔</span>
                <p className="text-sm text-gray-900">Access to premium trading groups</p>
              </div>
              <div className="flex gap-4">
                <span className="text-green-700 font-bold">✔</span>
                <p className="text-sm text-gray-900">Buy/sell discussions in groups</p>
              </div>
              <div className="flex gap-4">
                <span className="text-green-700 font-bold">✔</span>
                <p className="text-sm text-gray-900">Enhanced security features</p>
              </div>
              <div className="flex gap-4">
                <span className="text-green-700 font-bold">✔</span>
                <p className="text-sm text-gray-900">Priority customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main Render
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="md:ml-64">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl text-gray-900">Profile & KYC</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and verification status</p>
          </div>
          <button
            onClick={handleEditProfile}
            className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>
        <div className="flex border-b border-gray-200 mb-8">
          {["profile", "kyc"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "profile" ? "Profile" : "KYC Status"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-lg">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "kyc" && renderKYCTab()}
          </div>
          <div>{renderSidebar()}</div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default ProfileKYC;