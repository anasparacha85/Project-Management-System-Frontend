"use client"

import { useState, useEffect } from "react"
import { SearchIcon } from "../../utils/iconutils"
import LeaveCard from "../../components/Cards/LeaveCard/LeaveCard"
import LeaveDetailsModal from "../../modals/LeaveDetailsModal"

const EmployeeMyLeaves = () => {
  const [leaves, setLeaves] = useState([])
  const [filteredLeaves, setFilteredLeaves] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaves()
  }, [])

  const fetchLeaves = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await ApiServices.getMyLeaves();

      // Mock data
      const mockLeaves = [
        {
          id: 1,
          leaveType: "casual",
          startDate: "2024-01-15",
          endDate: "2024-01-17",
          numberOfDays: 3,
          reason: "Family vacation",
          status: "approved",
          approvedBy: { name: "John Manager" },
          approvalDate: "2024-01-10",
        },
        {
          id: 2,
          leaveType: "sick",
          startDate: "2024-01-20",
          endDate: "2024-01-20",
          numberOfDays: 1,
          reason: "Medical appointment",
          status: "pending",
          approvedBy: null,
          approvalDate: null,
        },
        {
          id: 3,
          leaveType: "earned",
          startDate: "2024-02-05",
          endDate: "2024-02-09",
          numberOfDays: 5,
          reason: "Annual leave",
          status: "rejected",
          approvedBy: { name: "John Manager" },
          approvalDate: "2024-01-20",
          rejectionReason: "Insufficient coverage in your department",
        },
      ]

      setLeaves(mockLeaves)
      setFilteredLeaves(mockLeaves)
    } catch (error) {
      console.error("Error fetching leaves:", error)
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
          leave.reason.toLowerCase().includes(searchValue.toLowerCase()) ||
          leave.leaveType.toLowerCase().includes(searchValue.toLowerCase()),
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

  const handleCancel = async (leave) => {
    try {
      // TODO: Replace with actual API call
      // await ApiServices.cancelLeaveRequest(leave.id);
      alert("Leave request cancelled successfully")
      fetchLeaves()
    } catch (error) {
      alert("Failed to cancel leave request")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your leaves...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Leaves</h1>
        <p className="text-gray-600 mt-1">View and manage your leave requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-3xl font-bold text-gray-900">{leaves.filter((l) => l.status === "approved").length}</div>
          <p className="text-sm text-gray-600 mt-1">Approved Leaves</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-3xl font-bold text-amber-600">{leaves.filter((l) => l.status === "pending").length}</div>
          <p className="text-sm text-gray-600 mt-1">Pending Requests</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-3xl font-bold text-rose-600">{leaves.filter((l) => l.status === "rejected").length}</div>
          <p className="text-sm text-gray-600 mt-1">Rejected Leaves</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by reason or type..."
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Leaves List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeaves.length > 0 ? (
          filteredLeaves.map((leave) => (
            <LeaveCard
              key={leave.id}
              leave={leave}
              onViewDetails={handleViewDetails}
              onCancel={leave.status === "pending" ? () => handleCancel(leave) : null}
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
        isManager={false}
      />
    </div>
  )
}

export default EmployeeMyLeaves
