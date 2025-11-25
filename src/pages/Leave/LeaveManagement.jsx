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
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* NAV TABS */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <nav className="flex gap-4 overflow-x-auto">
              {user.role === "employee" ? (
                <>
                 

                  <NavLink
                    to="my-leaves"
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm rounded-lg ${
                        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
                      }`
                    }
                  >
                    My Leaves
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="manager-requests"
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm rounded-lg ${
                        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
                      }`
                    }
                  >
                    Leave Requests
                  </NavLink>

                  <NavLink
                    to="manager-summary"
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm rounded-lg ${
                        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600"
                      }`
                    }
                  >
                    Team Summary
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* ROUTES RENDER */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
