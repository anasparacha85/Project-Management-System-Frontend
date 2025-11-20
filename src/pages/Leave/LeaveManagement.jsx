import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Clock, CheckCircle, XCircle, 
  AlertCircle, Filter, FileText, Paperclip, X,
  ChevronDown, User, Mail, CalendarDays, Users
} from 'lucide-react';
import RequestLeaveModal from '../../modals/RequestsModal';
import { useSelector } from 'react-redux';
import ApiServices from '../../ApiService/ApiService';

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('my-leaves');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
const [Managers, setManagers] = useState([])
  const {user}=useSelector(state=>state.User)// Change to 'manager' to see manager view
  const userRole=user.role
  // Mock data
  const [myLeaves, setMyLeaves] = useState([
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

  const [teamLeaves, setTeamLeaves] = useState([
    {
      _id: '4',
      employee: { name: 'Alice Smith', email: 'alice@company.com' },
      leaveType: 'sick',
      startDate: '2024-12-05',
      endDate: '2024-12-07',
      numberOfDays: 3,
      reason: 'Flu symptoms',
      status: 'pending'
    },
    {
      _id: '5',
      employee: { name: 'Bob Johnson', email: 'bob@company.com' },
      leaveType: 'casual',
      startDate: '2024-12-20',
      endDate: '2024-12-22',
      numberOfDays: 3,
      reason: 'Holiday vacation',
      status: 'pending'
    }
  ]);

  const [formData, setFormData] = useState({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
    attachments: [],
    managerId:""
  });

  useEffect(() => {
    fetchAllManagers();
  }, []);

  const fetchAllManagers = async () => {
    try {
      const response = await ApiServices.fetchAllManagers();
      setManagers(response);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const leaveTypeColors = {
    sick: 'bg-red-100 text-red-700 border-red-200',
    casual: 'bg-blue-100 text-blue-700 border-blue-200',
    earned: 'bg-green-100 text-green-700 border-green-200',
    unpaid: 'bg-gray-100 text-gray-700 border-gray-200',
    maternity: 'bg-pink-100 text-pink-700 border-pink-200',
    paternity: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  const statusConfig = {
    pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    approved: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
  };

  const calculateWorkingDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    let count = 0;
    let current = new Date(startDate);

    while (current <= endDate) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  };


  const handleSubmit = async() => {
    if (!formData.startDate || !formData.endDate || !formData.reason || !formData.managerId) {
      alert('Please fill all required fields including selecting a manager');
      return;
    }
    try {
      // Log the payload before sending
      console.log('Leave Request Payload:', formData);
      
      // Call API to submit leave request
     const response = await ApiServices.RequestForLeave(formData);
     console.log('API Response:', response);
     alert('Leave request submitted successfully');
     setShowRequestModal(false);
    setFormData({ leaveType: 'casual', startDate: '', endDate: '', reason: '', attachments: [], managerId: '' });
     
      // On success, update local state
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Failed to submit leave request. Please try again.');
      return;
    }

    // const numberOfDays = calculateWorkingDays(formData.startDate, formData.endDate);
    
    // const newLeave = {
    //   _id: Date.now().toString(),
    //   ...formData,
    //   numberOfDays,
    //   status: 'pending',
    //   createdAt: new Date().toISOString()
    // };

    // setMyLeaves([newLeave, ...myLeaves]);
    
  };

  const handleApproveReject = (leaveId, action, reason = '') => {
    setTeamLeaves(teamLeaves.map(leave => 
      leave._id === leaveId 
        ? { ...leave, status: action, rejectionReason: reason }
        : leave
    ));
  };

  const filteredLeaves = filterStatus === 'all' 
    ? myLeaves 
    : myLeaves.filter(leave => leave.status === filterStatus);

  const leaveStats = {
    total: myLeaves.length,
    approved: myLeaves.filter(l => l.status === 'approved').length,
    pending: myLeaves.filter(l => l.status === 'pending').length,
    rejected: myLeaves.filter(l => l.status === 'rejected').length
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Leave Management</h1>
            <p className="text-blue-100">Manage your time off requests and track leave balance</p>
          </div>
          {/* <button
            onClick={() => setUserRole(userRole === 'employee' ? 'manager' : 'employee')}
            className="px-6 py-3 bg-white bg-opacity-20 text-gray-600 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
          >
            Switch to {userRole === 'employee' ? 'Manager' : 'Employee'} View
          </button> */}
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
          <button
            onClick={() => setActiveTab('my-leaves')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'my-leaves'
                ? 'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-700 shadow-xl'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            My Leaves
          </button>
          {userRole === 'manager' && (
            <button
              onClick={() => setActiveTab('team-requests')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'team-requests'
                  ? 'bg-gradient-to-r from-gray-100 to-gray-300 text-gray-700 shadow-xl'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Team Requests
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-b-2xl shadow-lg p-6">
        {activeTab === 'my-leaves' && (
          <>
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex gap-2 flex-wrap">
                {['all', 'pending', 'approved', 'rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                      filterStatus === status
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRequestModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Plus size={20} />
                Request Leave
              </button>
            </div>

            {/* Leave Cards */}
            <div className="space-y-4">
              {filteredLeaves.map(leave => {
                const StatusIcon = statusConfig[leave.status].icon;
                return (
                  <div key={leave._id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${leaveTypeColors[leave.leaveType]}`}>
                            {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave
                          </span>
                          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-2 ${statusConfig[leave.status].color}`}>
                            <StatusIcon size={16} />
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </span>
                        </div>
                        
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

                        <div className="flex items-center gap-2 text-gray-700 mb-3">
                          <Clock size={18} className="text-amber-500" />
                          <span className="font-medium">Duration:</span>
                          <span className="bg-amber-50 px-3 py-1 rounded-full text-sm font-semibold text-amber-700">
                            {leave.numberOfDays} working days
                          </span>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                          <p className="text-gray-800">{leave.reason}</p>
                        </div>

                        {leave.status === 'approved' && leave.approvedBy && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg">
                            <CheckCircle size={16} />
                            Approved by {leave.approvedBy.name} on {new Date(leave.approvalDate).toLocaleDateString()}
                          </div>
                        )}

                        {leave.status === 'rejected' && leave.rejectionReason && (
                          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-red-700 mb-1">Rejection Reason:</p>
                            <p className="text-sm text-red-600">{leave.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredLeaves.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">No {filterStatus !== 'all' ? filterStatus : ''} leave requests found</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'team-requests' && userRole === 'manager' && (
          <div className="space-y-4">
            {teamLeaves.filter(l => l.status === 'pending').map(leave => (
              <div key={leave._id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {leave.employee.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{leave.employee.name}</h3>
                        <p className="text-sm text-gray-600">{leave.employee.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${leaveTypeColors[leave.leaveType]}`}>
                        {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave
                      </span>
                      <span className="bg-amber-50 px-3 py-1 rounded-full text-sm font-semibold text-amber-700">
                        {leave.numberOfDays} days
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={18} className="text-blue-500" />
                        <span>{new Date(leave.startDate).toLocaleDateString()}</span>
                        <span className="text-gray-400">→</span>
                        <span>{new Date(leave.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="bg-white border border-blue-200 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                      <p className="text-gray-800">{leave.reason}</p>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3">
                    <button
                      onClick={() => handleApproveReject(leave._id, 'approved')}
                      className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason:');
                        if (reason) handleApproveReject(leave._id, 'rejected', reason);
                      }}
                      className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <XCircle size={20} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {teamLeaves.filter(l => l.status === 'pending').length === 0 && (
              <div className="text-center py-12">
                <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No pending leave requests</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request Leave Modal */}
      {showRequestModal && (
        <RequestLeaveModal
  show={showRequestModal}
  onClose={() => {
    setShowRequestModal(false);
    setFormData({ leaveType: 'casual', startDate: '', endDate: '', reason: '', attachments: [], managerId: '' });
  }}
  formData={formData}
  setFormData={setFormData}
  calculateWorkingDays={calculateWorkingDays}
  onSubmit={handleSubmit}
  Managers={Managers}
/>

      )}
    </div>


  );
};

export default LeaveManagement;