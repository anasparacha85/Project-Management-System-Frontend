// RejectLeaveModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

const RejectLeaveModal = ({ show, onClose, onSubmit, leave }) => {
  const [reason, setReason] = useState("");

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Reject Leave Request
        </h2>

        {/* Info */}
        <p className="text-gray-700 mb-2">
          Rejecting leave for:  
          <span className="font-semibold"> {leave?.employee?.name}</span>
        </p>

        {/* Rejection Reason */}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-red-200 outline-none"
          rows={4}
          placeholder="Enter rejection reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!reason.trim()) return alert("Please enter a reason");
              onSubmit({ leaveId: leave._id, reason });
            //   setReason("");
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
          >
            Reject Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectLeaveModal;
