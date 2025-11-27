// "use client"
// import { Calendar, FileText, Clock, User } from "lucide-react"
// import { StatusBadge } from "../../../utils/StatusBadge"

// export const LeaveCard = ({ leave, onViewDetails, onApprove, onReject, isManager = false }) => {
//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     })
//   }

//   const getLeaveTypeColor = (type) => {
//     const colors = {
//       sick: "bg-red-50 text-red-700",
//       casual: "bg-blue-50 text-blue-700",
//       earned: "bg-purple-50 text-purple-700",
//       unpaid: "bg-gray-50 text-gray-700",
//       maternity: "bg-pink-50 text-pink-700",
//       paternity: "bg-cyan-50 text-cyan-700",
//     }
//     return colors[type] || "bg-gray-50 text-gray-700"
//   }

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <div className="flex items-center gap-2 mb-2">
//             <span
//               className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize ${getLeaveTypeColor(leave.leaveType)}`}
//             >
//               {leave.leaveType}
//             </span>
//             <StatusBadge status={leave.status} />
//           </div>
//           {isManager && leave.employee && (
//             <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
//               <User className="w-4 h-4" />
//               <span>{leave.employee.name || "Employee"}</span>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="space-y-3 mb-4">
//         <div className="flex items-center gap-2 text-gray-700">
//           <Calendar className="w-4 h-4 text-gray-400" />
//           <span className="text-sm">
//             {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
//           </span>
//         </div>

//         <div className="flex items-center gap-2 text-gray-700">
//           <Clock className="w-4 h-4 text-gray-400" />
//           <span className="text-sm font-medium">
//             {leave.numberOfDays} day{leave.numberOfDays !== 1 ? "s" : ""}
//           </span>
//         </div>

//         <div className="flex items-start gap-2 text-gray-700">
//           <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
//           <p className="text-sm line-clamp-2">{leave.reason}</p>
//         </div>
//       </div>

//       <div className="flex gap-2 pt-4 border-t border-gray-100">
//         <button
//           onClick={() => onViewDetails && onViewDetails(leave)}
//           className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
//         >
//           View Details
//         </button>

//         {isManager && leave.status === "pending" && (
//           <>
//             <button
//               onClick={() => onApprove && onApprove(leave)}
//               className="flex-1 px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
//             >
//               Approve
//             </button>
//             <button
//               onClick={() => onReject && onReject(leave)}
//               className="flex-1 px-3 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-md hover:bg-rose-100 transition-colors"
//             >
//               Reject
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default LeaveCard
// LeaveCard.jsx
import React from "react";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";

const LeaveCard = ({ leave, leaveTypeColors, statusConfig, onViewDetails }) => {
  const StatusIcon = statusConfig[leave.status].icon;

  return (
    <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 relative">
      {/* View Details Button - Top Right */}
      <button
        onClick={() => onViewDetails?.(leave._id)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-blue-600 group"
        aria-label="View details"
      >
        <Eye size={20} className="group-hover:scale-110 transition-transform duration-200" />
      </button>

      <div className="flex flex-col lg:flex-row justify-between gap-4 pr-10">
        <div className="flex-1">
          {/* Leave Type + Status */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${leaveTypeColors[leave.leaveType]}`}>
              {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave
            </span>

            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-2 ${statusConfig[leave.status].color}`}>
              <StatusIcon size={16} />
              {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
            </span>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar size={18} className="text-blue-500" />
              <span className="font-medium">Start:</span>
              <span>{new Date(leave.startDate).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Calendar size={18} className="text-purple-500" />
              <span className="font-medium">End:</span>
              <span>{new Date(leave.endDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-gray-700 mb-3">
            <Clock size={18} className="text-amber-500" />
            <span className="font-medium">Duration:</span>
            <span className="bg-amber-50 px-3 py-1 rounded-full text-sm font-semibold text-amber-700">
              {leave.numberOfDays} working days
            </span>
          </div>

          {/* Reason */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
            <p className="text-gray-800">{leave.reason}</p>
          </div>

          {/* Approval */}
          {leave.status === "approved" && leave.approvedBy && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg">
              <CheckCircle size={16} />
              Approved by {leave.approvedBy.name} on{" "}
              {new Date(leave.approvalDate).toLocaleDateString()}
            </div>
          )}

          {/* Rejection Reason */}
          {leave.status === "rejected" && leave.rejectionReason && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-red-700 mb-1">Rejection Reason:</p>
              <p className="text-sm text-red-600">{leave.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveCard;
