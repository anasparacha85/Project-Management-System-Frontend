"use client"
import { useState } from "react"
import { X, Download, FileText } from "lucide-react"
import StatusBadge from "../utils/StatusBadge"

const LeaveDetailsModal = ({ leave, isOpen, onClose, onApprove, onReject, isManager = false }) => {
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectForm, setShowRejectForm] = useState(false)

  if (!isOpen || !leave) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Leave Request Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</label>
              <div className="mt-2">
                <StatusBadge status={leave.status} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Leave Type</label>
              <p className="mt-2 text-sm font-medium text-gray-900 capitalize">{leave.leaveType}</p>
            </div>
          </div>

          {/* Employee Info (if manager view) */}
          {isManager && leave.employee && (
            <div className="bg-blue-50 rounded-lg p-4">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Requested By</label>
              <p className="mt-1 text-sm font-medium text-gray-900">{leave.employee.name}</p>
              <p className="text-xs text-gray-600">{leave.employee.email}</p>
            </div>
          )}

          {/* Date Range */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Period</label>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">From:</span> {formatDate(leave.startDate)}
              </p>
              <p className="text-sm text-gray-900">
                <span className="font-medium">To:</span> {formatDate(leave.endDate)}
              </p>
              <p className="text-sm font-medium text-blue-600 mt-2">
                Total: {leave.numberOfDays} working day{leave.numberOfDays !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Reason</label>
            <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">{leave.reason}</p>
          </div>

          {/* Attachments */}
          {leave.attachments && leave.attachments.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Attachments</label>
              <div className="mt-2 space-y-2">
                {leave.attachments.map((attachment, idx) => (
                  <a
                    key={idx}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 truncate flex-1">{attachment.filename}</span>
                    <Download className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Approval Info */}
          {leave.status !== "pending" && leave.approvedBy && (
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {leave.status === "approved" ? "Approved" : "Rejected"} By
              </label>
              <p className="mt-1 text-sm font-medium text-gray-900">{leave.approvedBy.name || leave.approvedBy}</p>
              <p className="text-xs text-gray-600 mt-1">{new Date(leave.approvalDate).toLocaleDateString()}</p>
            </div>
          )}

          {/* Rejection Reason */}
          {leave.status === "rejected" && leave.rejectionReason && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <label className="text-xs font-semibold text-rose-700 uppercase tracking-wide">Rejection Reason</label>
              <p className="mt-2 text-sm text-rose-700">{leave.rejectionReason}</p>
            </div>
          )}

          {/* Manager Actions */}
          {isManager && leave.status === "pending" && !showRejectForm && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => onApprove(leave)}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Approve Leave
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                className="flex-1 px-4 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors"
              >
                Reject Leave
              </button>
            </div>
          )}

          {/* Reject Form */}
          {showRejectForm && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Rejection Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                rows="3"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onReject(leave, rejectReason)
                    setRejectReason("")
                    setShowRejectForm(false)
                  }}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Submit Rejection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeaveDetailsModal
