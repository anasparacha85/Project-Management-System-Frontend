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
        const resp = await ApiServices.GetLeaveDetailsByLeaveId(id);
        console.log(resp);
    
        setLeave(resp.leaveDetails || resp)
    } catch (err) {
      console.error(err);
      setError('Failed to load leave details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
  const handleLeaveStatusChange = async() => {
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
                        if (ApiServices.UpdateLeaveStatus) {
                          await ApiServices.UpdateLeaveStatus({ leaveId: leave._id, status: 'pending' });
                        } else {
                          alert('Setting to pending requires a backend endpoint; implement `UpdateLeaveStatus` in ApiService');
                          setActionLoading(false);
                          return;
                        }
                      }

                      setLeave(prev => prev ? { ...prev, status: newStatus, rejectionReason: newStatus === 'rejected' ? rejectionReasonInput : undefined } : prev);
                      alert('Status updated successfully!');
                    } catch (err) {
                      console.error(err);
                      alert('Failed to change status');
                    } finally {
                      setActionLoading(false);
                    }
                  }
          

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!leave) return <div className="p-6">No leave found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="mb-4 text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-4xl font-bold text-slate-800">Leave Request Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employee & Manager Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Requested By</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {leave.employee?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-xl text-slate-800">{leave.employee?.name}</div>
                      <div className="text-sm text-slate-500">{leave.employee?.email}</div>
                    </div>
                  </div>
                </div>
              </div>

              {leave.manager && (
                <div className="pt-6 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-500 mb-2">Manager</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                      {leave.manager?.name?.charAt(0)?.toUpperCase() || 'M'}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{leave.manager?.name}</div>
                      <div className="text-sm text-slate-500">{leave.manager?.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Leave Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Leave Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Leave Type</div>
                  <div className="text-lg font-bold text-slate-800 capitalize">{leave.leaveType}</div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Duration</div>
                  <div className="text-lg font-bold text-slate-800">{leave.numberOfDays} {leave.numberOfDays === 1 ? 'Day' : 'Days'}</div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Start Date</div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Calendar size={18} className="text-blue-500"/>
                    <span className="font-semibold">{new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">End Date</div>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Calendar size={18} className="text-blue-500"/>
                    <span className="font-semibold">{new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Reason for Leave</div>
                <p className="text-slate-700 leading-relaxed">{leave.reason}</p>
              </div>

              {leave.rejectionReason && (
                <div className="mt-6 bg-red-50 rounded-xl p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle size={18} className="text-red-600"/>
                    <div className="text-xs font-semibold text-red-700 uppercase tracking-wider">Rejection Reason</div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{leave.rejectionReason}</p>
                </div>
              )}

              {leave.approvedBy && leave.approvalDate && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {leave.status === 'approved' ? 'Approved By' : 'Processed By'}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                        {leave.approvedBy?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{leave.approvedBy?.name}</div>
                        <div className="text-xs text-slate-500">{new Date(leave.approvalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Current Status</h3>
              <div className="flex justify-center">
                <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg ${
                  leave.status === 'approved' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200' 
                    : leave.status === 'rejected' 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200' 
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-200'
                }`}>
                  {leave.status === 'approved' && <CheckCircle size={20} />}
                  {leave.status === 'rejected' && <XCircle size={20} />}
                  {leave.status?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Change Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Change Status</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Select New Status
                  </label>
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)} 
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-semibold text-slate-700"
                  >
                    <option value="pending">⏱️ Pending</option>
                    <option value="approved">✅ Approved</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>

                {newStatus === 'rejected' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Rejection Reason
                    </label>
                    <textarea 
                      value={rejectionReasonInput} 
                      onChange={(e) => setRejectionReasonInput(e.target.value)} 
                      placeholder="Please provide a reason for rejection..." 
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all resize-none"
                    />
                  </div>
                )}

                <button
                  onClick={handleLeaveStatusChange}
                   
                  disabled={actionLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Update Status'
                  )}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">Quick Actions</p>
                <div className="space-y-2">
                  <button 
                    onClick={handleApprove} 
                    disabled={actionLoading}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Quick Approve
                  </button>
                  <button 
                    onClick={handleReject} 
                    disabled={actionLoading}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Quick Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetailPage;
