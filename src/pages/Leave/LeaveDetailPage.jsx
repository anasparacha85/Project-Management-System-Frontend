import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiServices from '../../ApiService/ApiService';
import { Calendar, User, XCircle, CheckCircle } from 'lucide-react';

const LeaveDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const fetchLeave = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Try to fetch single leave if API exposes it; otherwise fetch all and find
      if (ApiServices.GetLeaveById) {
        const resp = await ApiServices.GetLeaveById(id);
        setLeave(resp.leave || resp);
      } else {
        const resp = await ApiServices.GetAllLeaveRequests();
        const found = (resp.leaves || []).find(l => l._id === id);
        setLeave(found || null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load leave details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchLeave();
  }, [id]);

  // initialize selector when leave loads
  useEffect(() => {
    if (leave) {
      setNewStatus(leave.status || 'pending');
      setRejectionReasonInput(leave.rejectionReason || '');
    }
  }, [leave]);

  const handleApprove = async () => {
    if (!leave) return;
    setActionLoading(true);
    try {
      const resp = await ApiServices.ApproveLeaveRequest(leave._id);
      alert(resp?.SuccessMessage || 'Leave approved');
      setLeave(prev => prev ? { ...prev, status: 'approved' } : prev);
    } catch (err) {
      console.error(err);
      alert('Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!leave) return;
    const reason = window.prompt('Enter rejection reason:', leave.rejectionReason || '');
    if (reason === null) return; // user cancelled
    setActionLoading(true);
    try {
      const resp = await ApiServices.RejectLeaveRequest({ leaveId: leave._id, rejectionReason: reason });
      alert(resp?.SuccessMessage || 'Leave rejected');
      setLeave(prev => prev ? { ...prev, status: 'rejected', rejectionReason: reason } : prev);
    } catch (err) {
      console.error(err);
      alert('Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!leave) return <div className="p-6">No leave found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Leave Details</h2>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="px-3 py-1 rounded bg-gray-100">Back</button>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">{leave.employee?.name?.charAt(0) || 'U'}</div>
          <div>
            <div className="font-semibold text-lg">{leave.employee?.name}</div>
            <div className="text-sm text-gray-500">{leave.employee?.email}</div>
          </div>
          <div className="ml-auto text-sm">
            <span className={`px-3 py-1 rounded-full font-semibold ${leave.status==='approved' ? 'bg-green-100 text-green-700' : leave.status==='rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>{leave.status?.toUpperCase()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">Type</div>
            <div className="font-medium">{leave.leaveType}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Days</div>
            <div className="font-medium">{leave.numberOfDays}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Start</div>
            <div className="font-medium"><Calendar size={14} className="inline mr-2"/>{new Date(leave.startDate).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">End</div>
            <div className="font-medium">{new Date(leave.endDate).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-500">Reason</div>
          <div className="mt-2 text-gray-800">{leave.reason}</div>
        </div>

        {leave.rejectionReason && (
          <div className="mb-4 bg-red-50 border border-red-100 p-3 rounded"> 
            <div className="text-sm text-red-700 font-semibold">Rejection Reason</div>
            <div className="text-sm text-gray-800">{leave.rejectionReason}</div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Change status:</label>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="px-3 py-1 border rounded">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {newStatus === 'rejected' && (
            <div className="flex-1">
              <label className="text-sm text-gray-600">Rejection reason</label>
              <input value={rejectionReasonInput} onChange={(e) => setRejectionReasonInput(e.target.value)} placeholder="Enter reason" className="w-full mt-1 px-3 py-2 border rounded" />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={async () => {
                if (!leave) return;
                if (newStatus === leave.status) return alert('Status not changed');
                setActionLoading(true);
                try {
                  if (newStatus === 'approved') {
                    await ApiServices.ApproveLeaveRequest(leave._id);
                  } else if (newStatus === 'rejected') {
                    if (!rejectionReasonInput) {
                      alert('Please provide rejection reason');
                      setActionLoading(false);
                      return;
                    }
                    await ApiServices.RejectLeaveRequest({ leaveId: leave._id, rejectionReason: rejectionReasonInput });
                  } else if (newStatus === 'pending') {
                    // If backend supports a status update endpoint, use it. Otherwise inform the user.
                    if (ApiServices.UpdateLeaveStatus) {
                      await ApiServices.UpdateLeaveStatus({ leaveId: leave._id, status: 'pending' });
                    } else {
                      alert('Setting to pending requires a backend endpoint; implement `UpdateLeaveStatus` in ApiService');
                      setActionLoading(false);
                      return;
                    }
                  }

                  setLeave(prev => prev ? { ...prev, status: newStatus, rejectionReason: newStatus === 'rejected' ? rejectionReasonInput : undefined } : prev);
                  alert('Status updated');
                } catch (err) {
                  console.error(err);
                  alert('Failed to change status');
                } finally {
                  setActionLoading(false);
                }
              }}
              disabled={actionLoading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold"
            >{actionLoading ? 'Processing...' : 'Change Status'}</button>

            {/* Keep quick approve/reject buttons for convenience */}
            <button onClick={handleApprove} disabled={actionLoading} className="px-5 py-2 bg-green-600 text-white rounded-lg font-semibold">Quick Approve</button>
            <button onClick={handleReject} disabled={actionLoading} className="px-5 py-2 bg-red-600 text-white rounded-lg font-semibold">Quick Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetailPage;
