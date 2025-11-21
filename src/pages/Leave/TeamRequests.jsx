import React, { useEffect, useState } from 'react';
import { 
  Calendar, CheckCircle, XCircle
} from 'lucide-react';
import ApiServices from '../../ApiService/ApiService';
import RejectLeaveModal from '../../modals/RejectionLeaveModal';

const TeamRequests = () => {
    const [showRejectModal, setShowRejectModal] = useState(false);
const [selectedLeave, setSelectedLeave] = useState(null);

  const [teamLeaves, setTeamLeaves] = useState([
   
  ]);
  const fetchTeamRequests=async()=>{
    try {
        const  response=await ApiServices.GetAllLeaveRequests()
        console.log(response);
        
        setTeamLeaves(response.leaves)
    } catch (error) {
        console.error("Error fetching team requests:", error);
    }
   

  }
  useEffect(()=>{
    fetchTeamRequests()
  },[])

  const leaveTypeColors = {
    sick: 'bg-red-100 text-red-700 border-red-200',
    casual: 'bg-blue-100 text-blue-700 border-blue-200',
    earned: 'bg-green-100 text-green-700 border-green-200',
    unpaid: 'bg-gray-100 text-gray-700 border-gray-200',
    maternity: 'bg-pink-100 text-pink-700 border-pink-200',
    paternity: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      const response = await ApiServices.ApproveLeaveRequest(leaveId)
      console.log(response);
    
       alert(response.SuccessMessage);
       fetchTeamRequests()
    } catch (error) {
      console.error("Error approving/rejecting leave request:", error.message);
     
    }
  
  };
  const handleRejectLeave = async ({leaveId,reason}) => {
    try {
      const response = await ApiServices.RejectLeaveRequest({leaveId, rejectionReason: reason})
      console.log(response);
      alert(response.SuccessMessage);
      fetchTeamRequests()
      setShowRejectModal(false);
    } catch (error) {
      console.error("Error rejecting leave request:", error.message);
    }
  }

  return (
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
                onClick={() => handleApproveLeave(leave._id)}
                className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Approve
              </button>
              <button
               onClick={() => {
                setSelectedLeave(leave);
                setShowRejectModal(true);
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
      <RejectLeaveModal 
  show={showRejectModal}
  leave={selectedLeave}
  onClose={() => setShowRejectModal(false)}
  onSubmit={(data) => {
    handleRejectLeave(data);
   
  }}
/>

    </div>
  );
};

export default TeamRequests;

