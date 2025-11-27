"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Trash2,
  Download,
} from "lucide-react"
import ApiServices from "../../ApiService/ApiService"
import { useNavigate, useParams } from "react-router-dom"

const EmployeeLeaveDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [leaveData, setLeaveData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    fetchLeaveDetails()
  }, [id])

  const fetchLeaveDetails = async () => {
    try {
      setLoading(true)
      const resp = await ApiServices.GetLeaveDetailsByLeaveId(id)
      setLeaveData(resp.leaveDetails)
      setError(null)
    } catch (err) {
      console.error("Error fetching leave details:", err)
      setError("Failed to load leave details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelLeave = async () => {
    try {
      setIsCancelling(true)
      // Call API to cancel leave
      await ApiServices.CancelLeaveRequest(id)
      setCancelDialogOpen(false)
      // Refresh data after cancellation
      navigate(-1)
      await fetchLeaveDetails()

    } catch (err) {
      console.error("Error cancelling leave:", err)
      alert("Failed to cancel leave request. Please try again.")
    } finally {
      setIsCancelling(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "bg-amber-50 border-amber-200",
        textColor: "text-amber-700",
        bgColor: "bg-amber-100",
        icon: Clock,
      },
      approved: {
        color: "bg-green-50 border-green-200",
        textColor: "text-green-700",
        bgColor: "bg-green-100",
        icon: CheckCircle,
      },
      rejected: {
        color: "bg-red-50 border-red-200",
        textColor: "text-red-700",
        bgColor: "bg-red-100",
        icon: XCircle,
      },
    }
    return configs[status] || configs.pending
  }

  const getLeaveTypeColor = (type) => {
    const colors = {
      sick: "bg-red-100 text-red-700",
      casual: "bg-blue-100 text-blue-700",
      earned: "bg-green-100 text-green-700",
      unpaid: "bg-gray-100 text-gray-700",
      maternity: "bg-pink-100 text-pink-700",
      paternity: "bg-purple-100 text-purple-700",
    }
    return colors[type] || "bg-gray-100 text-gray-700"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading leave details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  if (!leaveData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Leaves
        </button>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No leave details found.</p>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(leaveData.status)
  const StatusIcon = statusConfig.icon
  const leaveTypeColor = getLeaveTypeColor(leaveData.leaveType)

  const canCancelLeave = leaveData.status === "pending" || leaveData.status === "approved"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Leaves
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Leave Request Details</h1>
            <p className="text-gray-600">
              Request ID: <span className="font-mono text-sm">{leaveData._id}</span>
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${statusConfig.color}`}>
            <StatusIcon size={20} className={statusConfig.textColor} />
            <span className={statusConfig.textColor}>
              {leaveData.status.charAt(0).toUpperCase() + leaveData.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Leave Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leave Period Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              Leave Period
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Start Date</p>
                <p className="text-2xl font-bold text-gray-900">{formatDate(leaveData.startDate)}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">End Date</p>
                <p className="text-2xl font-bold text-gray-900">{formatDate(leaveData.endDate)}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Number of Days</p>
                <p className="text-2xl font-bold text-blue-600">
                  {leaveData.numberOfDays} {leaveData.numberOfDays === 1 ? "Day" : "Days"}
                </p>
              </div>
            </div>
          </div>

          {/* Leave Type & Reason Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              Leave Information
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Leave Type</p>
                <span className={`inline-block px-4 py-2 rounded-lg font-semibold capitalize ${leaveTypeColor}`}>
                  {leaveData.leaveType}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Reason for Leave</p>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{leaveData.reason || "No reason provided"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Approval Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              Status Timeline
            </h2>

            <div className="space-y-6">
              {/* Requested */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="w-0.5 h-12 bg-gray-200 my-2"></div>
                </div>
                <div className="pb-6">
                  <p className="font-semibold text-gray-900">Request Submitted</p>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(leaveData.createdAt)}</p>
                </div>
              </div>

              {/* Approved/Rejected */}
              {(leaveData.status === "approved" || leaveData.status === "rejected") && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        leaveData.status === "approved" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {leaveData.status === "approved" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">
                      {leaveData.status === "approved" ? "Request Approved" : "Request Rejected"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{formatDate(leaveData.approvalDate)}</p>
                    {leaveData.status === "rejected" && leaveData.rejectionReason && (
                      <div className="mt-3 bg-red-50 rounded-lg p-3 border border-red-200">
                        <p className="text-xs font-medium text-red-700 uppercase mb-1">Rejection Reason</p>
                        <p className="text-sm text-red-700">{leaveData.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - People & Actions */}
        <div className="space-y-6">
          {/* Employee Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Employee
            </h3>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {leaveData.employee.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{leaveData.employee.name}</p>
                <p className="text-sm text-gray-600 break-all">{leaveData.employee.email}</p>
              </div>
            </div>
          </div>

          {/* Manager Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Manager
            </h3>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                {leaveData.manager.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{leaveData.manager.name}</p>
                <p className="text-sm text-gray-600 break-all">{leaveData.manager.email}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {canCancelLeave && (
              <button
                onClick={() => setCancelDialogOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-3 px-4 rounded-xl border border-red-200 transition-all duration-200"
              >
                <Trash2 size={18} />
                Cancel Leave Request
              </button>
            )}

            <button className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-3 px-4 rounded-xl border border-blue-200 transition-all duration-200">
              <Download size={18} />
              Download Details
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      {cancelDialogOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-in fade-in zoom-in">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Leave Request?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this leave request? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelDialogOpen(false)}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Keep Request
              </button>
              <button
                onClick={handleCancelLeave}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-red-600 rounded-full animate-spin"></div>
                    Cancelling...
                  </>
                ) : (
                  "Cancel Request"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeLeaveDetailsPage
