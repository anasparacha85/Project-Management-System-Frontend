import { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, XCircle, FileText
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate,  NavLink } from 'react-router-dom';

const LeaveManagement = () => {
  const navigate = useNavigate();
 
  const { user } = useSelector(state => state.User);
  const userRole = user.role;

  // Mock data for stats - In real app, fetch this from API
  const [myLeaves] = useState([
    {
      _id: '1',
      leaveType: 'sick',
      startDate: '2024-12-01',
      endDate: '2024-12-03',
      numberOfDays: 3,
      reason: 'Medical appointment and recovery',
      status: 'approved',
      approvalDate: '2024-11-25',
      approvedBy: { name: 'John Manager', email: 'john@company.com' }
    },
    {
      _id: '2',
      leaveType: 'casual',
      startDate: '2024-12-15',
      endDate: '2024-12-16',
      numberOfDays: 2,
      reason: 'Family event',
      status: 'pending'
    },
    {
      _id: '3',
      leaveType: 'earned',
      startDate: '2024-11-10',
      endDate: '2024-11-12',
      numberOfDays: 3,
      reason: 'Personal work',
      status: 'rejected',
      rejectionReason: 'Peak project period',
      approvedBy: { name: 'John Manager', email: 'john@company.com' }
    }
  ]);

  const leaveStats = {
    total: myLeaves.length,
    approved: myLeaves.filter(l => l.status === 'approved').length,
    pending: myLeaves.filter(l => l.status === 'pending').length,
    rejected: myLeaves.filter(l => l.status === 'rejected').length
  };

  // Determine active tab based on current route
 

 

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Leave Management</h1>
            <p className="text-blue-100">Manage your time off requests and track leave balance</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Requests', value: leaveStats.total, icon: FileText, color: 'from-blue-500 to-blue-600' },
          { label: 'Approved', value: leaveStats.approved, icon: CheckCircle, color: 'from-green-500 to-green-600' },
          { label: 'Pending', value: leaveStats.pending, icon: Clock, color: 'from-amber-500 to-amber-600' },
          { label: 'Rejected', value: leaveStats.rejected, icon: XCircle, color: 'from-red-500 to-red-600' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-t-2xl shadow-lg p-1 mb-0">
  <div className="flex gap-2">
    <NavLink
      to="/dashboard/leave-management/my-leaves"
      className={({ isActive }) =>
        `flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-700 shadow-xl'
            : 'text-gray-600 hover:bg-gray-50'
        }`
      }
      end
    >
      My Leaves
    </NavLink>

    {userRole === 'manager' && (
      <NavLink
        to="/dashboard/leave-management/team-requests"
        className={({ isActive }) =>
          `flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-700 shadow-xl'
              : 'text-gray-600 hover:bg-gray-50'
          }`
        }
      >
        Team Requests
      </NavLink>
    )}
  </div>
</div>

      {/* Main Content - Outlet for nested routes */}
      <div className="bg-white rounded-b-2xl shadow-lg p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default LeaveManagement;
