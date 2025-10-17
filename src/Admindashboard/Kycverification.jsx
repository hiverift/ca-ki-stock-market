// src/components/KycVerificationAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../pages/config";
import { Eye } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const KycVerificationAdmin = ({ userId = "68ec95c27f98ff5a8ffc26ae" }) => {
  const [kycDetails, setKycDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Fetch KYC details
  const fetchKyc = async () => {
    try {
      setLoading(true);
      setError(""); // reset error
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${config.BASE_URL}kyc/status/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.statusCode === 200) {
        setKycDetails(res.data.result);
      } else {
        setError(res.data?.message || "Failed to fetch KYC details");
      }
    } catch (err) {
      console.error("Error fetching KYC:", err);

      // Handle 404 separately
      if (err.response?.status === 404) {
        setError("No KYC record found for this user.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong while fetching KYC details.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchKyc();
  }, [userId]);

  // Update KYC status (verified/rejected)
  const handleUpdateStatus = async (status) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("accessToken");

      const res = await axios.put(
        `${config.BASE_URL}kyc/update-status/${userId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.statusCode === 200) {
        Swal.fire({
          icon: "success",
          title: `KYC ${status}`,
          text: `User KYC has been ${status} successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
        setKycDetails((prev) => ({ ...prev, status }));
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: res.data?.message || "Unable to update KYC status",
        });
      }
    } catch (err) {
      console.error("Error updating KYC status:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong while updating KYC",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Preview document
  const handlePreview = (src, label) => {
    Swal.fire({
      title: label,
      imageUrl: src,
      imageAlt: label,
      width: "50%",
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  if (loading) return <p className="text-gray-500">Loading KYC details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!kycDetails)
    return <p className="text-gray-500">No KYC details to display.</p>;

  const documents = [
    { label: "Aadhaar Front", src: kycDetails.aadhaarFrontDoc },
    { label: "Aadhaar Back", src: kycDetails.aadhaarBackDoc },
    { label: "PAN Front", src: kycDetails.panFrontDoc },
    { label: "PAN Back", src: kycDetails.panBackDoc },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border text-gray-700 rounded shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Remark</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Uploaded</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Documents</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            {/* Status */}
            <td className="px-4 py-3">
              <span
                className={`px-3 py-1 rounded-full font-medium capitalize text-sm ${kycDetails.status === "verified"
                    ? "bg-green-100 text-green-700"
                    : kycDetails.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {kycDetails.status}
              </span>
            </td>

            {/* Remark */}
            <td className="px-4 py-3 text-sm">{kycDetails.remark || "No remark"}</td>

            {/* Uploaded */}
            <td className="px-4 py-3 text-sm">
              {new Date(kycDetails.uploadedDate).toLocaleString()}
            </td>

            {/* Documents */}
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-3">
                {documents.map(
                  (doc, idx) =>
                    doc.src && (
                      <div
                        key={idx}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => handlePreview(doc.src, doc.label)}
                      >
                        <Eye className="w-5 h-5 text-blue-600 hover:scale-110 transition" />
                        <span className="text-xs mt-1">{doc.label}</span>
                      </div>
                    )
                )}
              </div>
            </td>

            {/* Actions */}
            <td className="px-4 py-3 text-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus("verified")}
                  disabled={updating}
                  className="flex-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus("rejected")}
                  disabled={updating}
                  className="flex-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                >
                  Reject
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default KycVerificationAdmin;
