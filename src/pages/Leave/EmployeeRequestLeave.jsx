"use client"

import { useState } from "react"
import RequestLeaveForm from "../../components/Cards/LeaveCard/RequestLeave"
import { AlertCircleIcon, CheckCircleIcon } from "../../utils/iconutils"

const EmployeeRequestLeave = () => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await ApiServices.requestLeave(formData);
      console.log("Form submitted:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStatus({
        type: "success",
        message: "Leave request submitted successfully! Your manager will review it shortly.",
      })

      setTimeout(() => {
        setStatus(null)
      }, 5000)
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to submit leave request. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Request Leave</h1>
        <p className="text-gray-600 mt-1">Submit a new leave request for your manager's approval</p>
      </div>

      {status && (
        <div
          className={`p-4 rounded-lg border flex items-center gap-3 ${
            status.type === "success" ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircleIcon className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <p className={`text-sm ${status.type === "success" ? "text-emerald-700" : "text-rose-700"}`}>
            {status.message}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RequestLeaveForm onSubmit={handleSubmit} loading={loading} />
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Tips</h3>
            <ul className="space-y-2 text-xs text-blue-800">
              <li className="flex gap-2">
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>Submit requests as early as possible</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>Weekends are automatically excluded</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>You can attach supporting documents</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>Check for overlapping leave requests</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-3">Leave Types</h3>
            <ul className="space-y-2 text-xs text-purple-800">
              <li>
                <span className="font-medium">Casual:</span> General leave
              </li>
              <li>
                <span className="font-medium">Sick:</span> Medical reasons
              </li>
              <li>
                <span className="font-medium">Earned:</span> Annual paid leave
              </li>
              <li>
                <span className="font-medium">Unpaid:</span> Without pay
              </li>
              <li>
                <span className="font-medium">Maternity/Paternity:</span> Family leave
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeRequestLeave
