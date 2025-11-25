import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Eye, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ApiServices from '../../ApiService/ApiService';
import RejectLeaveModal from '../../modals/RejectionLeaveModal';

const TeamRequests = () => {
  // State management
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  
  const navigate = useNavigate();

  // Constants
  const LEAVE_TYPE_COLORS = {
    sick: 'bg-red-100 text-red-700 border-red-200',
    casual: 'bg-blue-100 text-blue-700 border-blue-200',
    earned: 'bg-green-100 text-green-700 border-green-200',
    unpaid: 'bg-gray-100 text-gray-700 border-gray-200',
    maternity: 'bg-pink-100 text-pink-700 border-pink-200',
    paternity: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  const FILTER_OPTIONS = [
    { value: 'all', label: 'All', color: 'bg-blue-600' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { value: 'approved', label: 'Approved', color: 'bg-green-600' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-600' }
  ];

  const EMPTY_STATES = {
    all: {
      icon: Inbox,
      title: 'No Leave Requests',
      message: 'There are no leave requests to display.'
    },
    pending: {
      icon: CheckCircle,
      title: 'No Pending Requests',
      message: 'All leave requests have been processed.'
    },
    approved: {
      icon: CheckCircle,
      title: 'No Approved Requests',
      message: 'There are no approved leave requests yet.'
    },
    rejected: {
      icon: XCircle,
      title: 'No Rejected Requests',
      message: 'There are no rejected leave requests.'
    }
  };

  // Fetch team requests on mount
  useEffect(() => {
    fetchTeamRequests();
  }, []);

  // API Functions
  const fetchTeamRequests = async () => {
    setIsLoading(true);
    try {
      const response = await ApiServices.GetAllLeaveRequests();
      setTeamLeaves(response.leaves || []);
    } catch (error) {
      console.error('Error fetching team requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveLeave = async (leaveId) => {
    setIsAcceptLoading(true);
    try {
      const response = await ApiServices.ApproveLeaveRequest(leaveId);
      alert(response.SuccessMessage);
      await fetchTeamRequests();
    } catch (error) {
      console.error('Error approving leave request:', error.message);
    } finally {
      setIsAcceptLoading(false);
    }
  };

  const handleRejectLeave = async ({ leaveId, reason }) => {
    setIsRejectLoading(true);
    try {
      const response = await ApiServices.RejectLeaveRequest({
        leaveId,
        rejectionReason: reason
      });
      alert(response.SuccessMessage);
      await fetchTeamRequests();
      setShowRejectModal(false);
      setSelectedLeave(null);
    } catch (error) {
      console.error('Error rejecting leave request:', error.message);
    } finally {
      setIsRejectLoading(false);
    }
  };

  // Computed values
  const filteredLeaves = teamLeaves.filter((leave) => {
    if (filter === 'all') return true;
    return leave.status === filter;
  });

  // Render empty state
  const renderEmptyState = () => {
    const emptyState = EMPTY_STATES[filter];
    const Icon = emptyState.icon;

    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
          <Icon size={40} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {emptyState.title}
        </h3>
        <p className="text-gray-600">{emptyState.message}</p>
      </div>
    );
  };

  // Render leave card
  const renderLeaveCard = (leave) => {
    const isApproved = leave.status === 'approved';
    const isRejected = leave.status === 'rejected';
    const isPending = leave.status === 'pending';

    return (
      <div
        key={leave._id}
        className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50"
      >
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          {/* Employee Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {leave.employee.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {leave.employee.name}
                </h3>
                <p className="text-sm text-gray-600">{leave.employee.email}</p>
              </div>
            </div>

            {/* Leave Type and Duration */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
                  LEAVE_TYPE_COLORS[leave.leaveType]
                }`}
              >
                {leave.leaveType.charAt(0).toUpperCase() +
                  leave.leaveType.slice(1)}{' '}
                Leave
              </span>
              <span className="bg-amber-50 px-3 py-1 rounded-full text-sm font-semibold text-amber-700">
                {leave.numberOfDays} {leave.numberOfDays === 1 ? 'day' : 'days'}
              </span>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <Calendar size={18} className="text-blue-500" />
              <span className="text-sm">
                {new Date(leave.startDate).toLocaleDateString()}
              </span>
              <span className="text-gray-400">→</span>
              <span className="text-sm">
                {new Date(leave.endDate).toLocaleDateString()}
              </span>
            </div>

            {/* Reason */}
            <div className="bg-white border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
              <p className="text-gray-800">{leave.reason}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex lg:flex-col gap-3">
            <button
              onClick={() => handleApproveLeave(leave._id)}
              className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isApproved || isAcceptLoading}
            >
              <CheckCircle size={20} />
              {isApproved ? 'Approved' : isAcceptLoading ? 'Approving...' : 'Approve'}
            </button>

            <button
              onClick={() => {
                setSelectedLeave(leave);
                setShowRejectModal(true);
              }}
              className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isRejected || isRejectLoading}
            >
              <XCircle size={20} />
              {isRejected ? 'Rejected' : isRejectLoading ? 'Rejecting...' : 'Reject'}
            </button>

            <button
              onClick={() =>
                navigate(`/dashboard/leave-management/leave/${leave._id}`)
              }
              className="flex-0 px-4 py-3 bg-white border border-gray-200 rounded-xl font-semibold shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-150 flex items-center justify-center gap-2"
            >
              <Eye size={18} />
              View
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                filter === option.value
                  ? `${option.color} text-white shadow-md`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {filteredLeaves.length} request{filteredLeaves.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      ) : (
        <>
          {/* Leave Cards or Empty State */}
          {filteredLeaves.length > 0 ? (
            filteredLeaves.map((leave) => renderLeaveCard(leave))
          ) : (
            renderEmptyState()
          )}
        </>
      )}

      {/* Reject Modal */}
      <RejectLeaveModal
        show={showRejectModal}
        leave={selectedLeave}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedLeave(null);
        }}
        onSubmit={handleRejectLeave}
      />
    </div>
  );
};

export default TeamRequests;