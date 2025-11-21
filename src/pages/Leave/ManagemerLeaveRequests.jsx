"use client"

import { useState, useEffect } from "react"
import { SearchIcon } from "../../utils/iconutils"
import LeaveCard from "../../components/Cards/LeaveCard/LeaveCard"
import LeaveDetailsModal from "../../modals/LeaveDetailsModal"

const ManagerLeaveRequests = () => {
  const [leaves, setLeaves] = useState([])
  const [filteredLeaves, setFilteredLeaves] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaveRequests()
  }, [])

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await ApiServices.getAllLeaveRequests();

      // Mock data
      const mockLeaves = [
        {
          id: 1,
          employee: { name: "Alice Johnson", email: "alice@company.com" },
          leaveType: "casual",
          startDate: "2024-01-22",
          endDate: "2024-01-24",
          numberOfDays: 3,
          reason: "Personal trip",
          status: "pending",
          createdAt: "2024-01-20",
        },
        {
          id: 2,
          employee: { name: "Bob Smith", email: "bob@company.com" },
          leaveType: "sick",
          startDate: "2024-01-23",
          endDate: "2024-01-23",
          numberOfDays: 1,
          reason: "Doctor appointment",
          status: "pending",
          createdAt: "2024-01-21",
        },
        {
          id: 3,
          employee: { name: "Carol Davis", email: "carol@company.com" },
          leaveType: "earned",
          startDate: "2024-02-01",
          endDate: "2024-02-09",
          numberOfDays: 7,
          reason: "Annual vacation",
          status: "pending",
          createdAt: "2024-01-18",
        },
      ]

      setLeaves(mockLeaves)
      setFilteredLeaves(mockLeaves.filter((l) => l.status === "pending"))
    } catch (error) {
      console.error("Error fetching leave requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (searchValue, filterValue) => {
    let filtered = leaves

    if (filterValue !== "all") {
      filtered = filtered.filter((leave) => leave.status === filterValue)
    }

    if (searchValue.trim()) {
      filtered = filtered.filter(
        (leave) =>
          leave.employee.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          leave.employee.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          leave.reason.toLowerCase().includes(searchValue.toLowerCase()),
      )
    }

    setFilteredLeaves(filtered)
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    handleFilter(value, statusFilter)
  }

  const handleStatusFilter = (value) => {
    setStatusFilter(value)
    handleFilter(searchTerm, value)
  }

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave)
    setIsModalOpen(true)
  }

  const handleApprove = async (leave) => {
    try {
      // TODO: Replace with actual API call
      // await ApiServices.approveLeave(leave.id);
      alert(`Leave for ${leave.employee.name} approved!`)
      fetchLeaveRequests()
      setIsModalOpen(false)
    } catch (error) {
      alert("Failed to approve leave")
    }
  }

  const handleReject = async (leave, reason) => {
    try {
      // TODO: Replace with actual API call
      // await ApiServices.rejectLeave(leave.id, { rejectionReason: reason });
      alert(`Leave for ${leave.employee.name} rejected!`)
      fetchLeaveRequests()
      setIsModalOpen(false)
    } catch (error) {
      alert("Failed to reject leave")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leave requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leave Requests</h1>
        <p className="text-gray-600 mt-1">Review and approve team member leave requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-3xl font-bold text-amber-600">{leaves.filter((l) => l.status === "pending").length}</div>
          <p className="text-sm text-gray-600 mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-3xl font-bold text-emerald-600">
            {leaves.filter((l) => l.status === "approved").length}
          </div>
          <p className="text-sm text-gray-600 mt-1">Approved</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-3xl font-bold text-rose-600">{leaves.filter((l) => l.status === "rejected").length}</div>
          <p className="text-sm text-gray-600 mt-1">Rejected</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-3xl font-bold text-blue-600">{leaves.length}</div>
          <p className="text-sm text-gray-600 mt-1">Total</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, or reason..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Only</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeaves.length > 0 ? (
          filteredLeaves.map((leave) => (
            <LeaveCard
              key={leave.id}
              leave={leave}
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
              isManager={true}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No leave requests found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <LeaveDetailsModal
        leave={selectedLeave}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        isManager={true}
      />
    </div>
  )
}

export default ManagerLeaveRequests
