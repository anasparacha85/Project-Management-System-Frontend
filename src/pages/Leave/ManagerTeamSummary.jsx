"use client"
import { useState, useEffect } from "react"
import { Users, TrendingUp, Calendar, AlertCircle } from "lucide-react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const ManagerTeamSummary = () => {
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamSummary()
  }, [])

  const fetchTeamSummary = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await ApiServices.getTeamLeaveSummary();

      // Mock data
      const mockSummary = [
        {
          employeeId: 1,
          employeeName: "Alice Johnson",
          employeeEmail: "alice@company.com",
          approvedLeaveDays: 12,
          pendingRequests: 1,
          upcomingLeaves: [{ startDate: "2024-02-01", endDate: "2024-02-09" }],
        },
        {
          employeeId: 2,
          employeeName: "Bob Smith",
          employeeEmail: "bob@company.com",
          approvedLeaveDays: 5,
          pendingRequests: 2,
          upcomingLeaves: [],
        },
        {
          employeeId: 3,
          employeeName: "Carol Davis",
          employeeEmail: "carol@company.com",
          approvedLeaveDays: 8,
          pendingRequests: 0,
          upcomingLeaves: [{ startDate: "2024-01-25", endDate: "2024-01-26" }],
        },
        {
          employeeId: 4,
          employeeName: "David Wilson",
          employeeEmail: "david@company.com",
          approvedLeaveDays: 15,
          pendingRequests: 1,
          upcomingLeaves: [],
        },
        {
          employeeId: 5,
          employeeName: "Emma Brown",
          employeeEmail: "emma@company.com",
          approvedLeaveDays: 3,
          pendingRequests: 0,
          upcomingLeaves: [],
        },
      ]

      setSummary(mockSummary)
    } catch (error) {
      console.error("Error fetching team summary:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team summary...</p>
        </div>
      </div>
    )
  }

  const totalApprovedDays = summary.reduce((acc, emp) => acc + emp.approvedLeaveDays, 0)
  const totalPendingRequests = summary.reduce((acc, emp) => acc + emp.pendingRequests, 0)
  const employeesWithUpcomingLeave = summary.filter((emp) => emp.upcomingLeaves.length > 0).length

  // Chart data
  const leaveBreakdownData = summary.map((emp) => ({
    name: emp.employeeName.split(" ")[0],
    approved: emp.approvedLeaveDays,
    pending: emp.pendingRequests,
  }))

  const pieChartData = [
    { name: "Approved", value: totalApprovedDays, color: "#10b981" },
    { name: "Pending", value: totalPendingRequests, color: "#f59e0b" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Team Leave Summary</h1>
        <p className="text-gray-600 mt-1">Overview of your team's leave status and analytics</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Team Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summary.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Approved Days</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{totalApprovedDays}</p>
            </div>
            <Calendar className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Requests</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{totalPendingRequests}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Upcoming Leaves</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{employeesWithUpcomingLeave}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Leave Breakdown Bar Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Breakdown by Employee</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={leaveBreakdownData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="approved" fill="#10b981" name="Approved Days" />
            <Bar dataKey="pending" fill="#f59e0b" name="Pending Requests" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leave Distribution Pie Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Total Leave Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Approved Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Upcoming
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {summary.map((emp) => (
                <tr key={emp.employeeId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{emp.employeeName}</p>
                      <p className="text-xs text-gray-600">{emp.employeeEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700">
                      {emp.approvedLeaveDays} days
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-amber-50 text-amber-700">
                      {emp.pendingRequests} request{emp.pendingRequests !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {emp.upcomingLeaves.length > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700">
                        {emp.upcomingLeaves.length} upcoming
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">No upcoming</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManagerTeamSummary
