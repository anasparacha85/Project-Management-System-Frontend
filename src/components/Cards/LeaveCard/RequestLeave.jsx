"use client"
import { useState } from "react"
import { Upload, X, Calendar, FileText } from "lucide-react"

export const RequestLeaveForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    leaveType: "casual",
    startDate: "",
    endDate: "",
    reason: "",
    managerId: "",
  })

  const [attachments, setAttachments] = useState([])
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})

  const leaveTypes = [
    { value: "sick", label: "Sick Leave" },
    { value: "casual", label: "Casual Leave" },
    { value: "earned", label: "Earned Leave" },
    { value: "unpaid", label: "Unpaid Leave" },
    { value: "maternity", label: "Maternity Leave" },
    { value: "paternity", label: "Paternity Leave" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const newAttachments = files.map((file) => ({
      file,
      id: Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2),
    }))
    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.leaveType) newErrors.leaveType = "Leave type is required"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.endDate) newErrors.endDate = "End date is required"
    if (!formData.reason) newErrors.reason = "Reason is required"
    if (!formData.reason.trim()) newErrors.reason = "Reason cannot be empty"

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      if (end < start) {
        newErrors.endDate = "End date must be after start date"
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (start < today) {
        newErrors.startDate = "Start date cannot be in the past"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const submissionData = {
      ...formData,
      attachments: attachments.map((att) => ({
        filename: att.name,
        url: "",
      })),
    }

    onSubmit(submissionData)
  }

  const getTotalDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      let count = 0
      const current = new Date(start)

      while (current <= end) {
        const dayOfWeek = current.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          count++
        }
        current.setDate(current.getDate() + 1)
      }

      return count
    }
    return 0
  }

  const totalDays = getTotalDays()

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Leave</h2>

      {/* Leave Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Leave Type <span className="text-rose-500">*</span>
        </label>
        <select
          name="leaveType"
          value={formData.leaveType}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
            errors.leaveType ? "border-rose-300 focus:ring-rose-500" : "border-gray-200 focus:ring-blue-500"
          }`}
        >
          {leaveTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.leaveType && <p className="text-rose-600 text-xs mt-1">{errors.leaveType}</p>}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Start Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
              errors.startDate ? "border-rose-300 focus:ring-rose-500" : "border-gray-200 focus:ring-blue-500"
            }`}
          />
          {errors.startDate && <p className="text-rose-600 text-xs mt-1">{errors.startDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            End Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
              errors.endDate ? "border-rose-300 focus:ring-rose-500" : "border-gray-200 focus:ring-blue-500"
            }`}
          />
          {errors.endDate && <p className="text-rose-600 text-xs mt-1">{errors.endDate}</p>}
        </div>
      </div>

      {/* Working Days Preview */}
      {totalDays > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700">
            <span className="font-semibold">{totalDays}</span> working day{totalDays !== 1 ? "s" : ""} selected
          </span>
        </div>
      )}

      {/* Reason */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Reason <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleInputChange}
          placeholder="Please provide the reason for your leave request..."
          rows="4"
          className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
            errors.reason ? "border-rose-300 focus:ring-rose-500" : "border-gray-200 focus:ring-blue-500"
          }`}
        />
        {errors.reason && <p className="text-rose-600 text-xs mt-1">{errors.reason}</p>}
      </div>

      {/* Attachments */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Attachments <span className="text-gray-500 font-normal">(Optional)</span>
        </label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto mb-2 w-6 h-6 text-gray-400" />
            <p className="text-sm text-gray-700 font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
          </label>
        </div>

        {/* Attachment List */}
        {attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {attachments.map((att) => (
              <div key={att.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 flex-1">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{att.name}</p>
                    <p className="text-xs text-gray-500">{att.size} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Submitting..." : "Submit Leave Request"}
      </button>
    </form>
  )
}

export default RequestLeaveForm
