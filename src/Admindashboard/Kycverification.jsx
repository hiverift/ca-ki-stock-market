// src/components/KycVerificationAdminList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../pages/config";
import { Eye } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const KycVerificationAdminList = ({ userId = null }) => {
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch KYC List
  const fetchKycList = async () => {
    try {
      setLoading(true);
      setError("");
      const url = `${config.BASE_URL}kyc/list${userId ? `?userId=${userId}` : ""}`;
      const res = await axios.get(url, { headers: authHeader });

      if (res.data?.statusCode === 200 && res.data?.result?.items) {
        setKycList(res.data.result.items);
      } else if (res.data?.statusCode === 200 && Array.isArray(res.data.result)) {
        setKycList(res.data.result);
      } else {
        setKycList([]);
        setError(res.data?.message || "No KYC records found.");
      }
    } catch (err) {
      console.error("Error fetching KYC list:", err);
      setError(err.response?.data?.message || "Failed to fetch KYC list.");
      setKycList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Document Preview
  const handlePreview = (src, label) => {
    Swal.fire({
      title: label,
      imageUrl: src,
      imageAlt: label,
      width: "60%",
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  // Update Status with optional remark (shows a prompt for remark)
  const updateKycStatus = async (kycItem, newStatus) => {
    // Show confirmation + remark input
    const { value: remark, isConfirmed } = await Swal.fire({
      title: `Mark KYC as "${newStatus}"`,
      input: "textarea",
      inputLabel: "Remark (optional)",
      inputPlaceholder: "Add a remark (e.g. reason for rejection or notes)...",
      inputValue: kycItem.remark || "",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      preConfirm: (val) => val, // return remark
    });

    if (!isConfirmed) return;

    const kycId = kycItem._id;
    const userIdForApi = kycItem.userId;

    try {
      setUpdatingId(kycId);

      // Primary: try /kyc/approve/:kycId (use kycId here)
      try {
        const approveRes = await axios.put(
          `${config.BASE_URL}kyc/approve/${userIdForApi}`,
          { headers: authHeader }
        );

        if (approveRes.data?.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: `KYC ${newStatus}`,
            text: approveRes.data?.message || `KYC marked ${newStatus}`,
            timer: 1600,
            showConfirmButton: false,
          });

          // Update local state for this row only
          setKycList((prev) =>
            prev.map((it) =>
              it._id === kycId ? { ...it, status: newStatus, remark, approvedAt: new Date().toString() } : it
            )
          );
          return;
        }
      } catch (e) {
        console.warn("Approve endpoint failed, trying fallback:", e?.response?.data || e);
      }

      // Fallback: /kyc/update-status/:userId (send kycId in body too)
      if (!userIdForApi) {
        throw new Error("Missing userId for fallback update.");
      }

      const fallbackRes = await axios.put(
        `${config.BASE_URL}kyc/update-status/${userIdForApi}`,
        { status: newStatus, remark, kycId },
        { headers: authHeader }
      );

    } catch (err) {
      console.error("Error updating KYC:", err);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          err.response?.data?.message ||
          err.message ||
          "Something went wrong while updating KYC.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading KYC list...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!kycList.length) return <p className="text-gray-500">No KYC records to show.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border text-gray-700 rounded shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium">KYC ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium">User ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Remark</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Uploaded</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Documents</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {kycList.map((k) => {
            const documents = [
              { label: "Aadhaar Front", src: k.aadhaarFrontDoc },
              { label: "Aadhaar Back", src: k.aadhaarBackDoc },
              { label: "PAN Front", src: k.panFrontDoc },
              { label: "PAN Back", src: k.panBackDoc },
            ];

            return (
              <tr key={k._id}>
                <td className="px-4 py-3 text-sm break-all">{k._id}</td>
                <td className="px-4 py-3 text-sm break-all">{k.userId}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full font-medium capitalize text-sm ${
                      k.status === "verified"
                        ? "bg-green-100 text-green-700"
                        : k.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {k.status || "pending"}
                  </span>
                </td>

                <td className="px-4 py-3 text-sm">{k.remark || "No remark"}</td>

                <td className="px-4 py-3 text-sm">
                  {k.uploadedDate ? new Date(k.uploadedDate).toLocaleString() : "—"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    {documents.map(
                      (doc, idx) =>
                        doc.src && (
                          <div
                            key={idx}
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => handlePreview(doc.src, doc.label)}
                            title={`Preview ${doc.label}`}
                          >
                            <Eye className="w-5 h-5 text-blue-600 hover:scale-110 transition" />
                            <span className="text-xs mt-1">{doc.label}</span>
                          </div>
                        )
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    {k.status === "verified" ? (
                      <button
                        onClick={() => updateKycStatus(k)}
                        disabled={updatingId === k.userId}
                        className="flex-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                      >
                        {updatingId === k.userId ? "Processing..." : "approved "}
                      </button>
                    ) : (
                      <button
                        onClick={() => updateKycStatus(k)}
                        disabled={updatingId === k.userId}
                        className="flex-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                      >
                        {updatingId === k.userId ? "Processing..." : "Approve"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default KycVerificationAdminList;
