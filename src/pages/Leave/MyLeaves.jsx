import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Clock, CheckCircle, XCircle, 
  AlertCircle,
  SearchIcon
} from 'lucide-react';
import RequestLeaveModal from '../../modals/RequestsModal';
import { useSelector } from 'react-redux';
import ApiServices from '../../ApiService/ApiService';
import LeaveCard from '../../components/Cards/LeaveCard/LeaveCard';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';

const MyLeaves = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [Managers, setManagers] = useState([]);
  const { user } = useSelector(state => state.User);
  const navigate=useNavigate()
  const [myLeaves, setMyLeaves] = useState([]);
  
  const fetchEmployeeLeaves = async () => {
    try {
      const filters = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
     

      const response = await ApiServices.GetEmployeeByIdLeaves(filters);
      setMyLeaves(response.leaves);
    } catch (error) {
      console.error("Error fetching employee leaves:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeLeaves();
  }, [filterStatus]); 
  const [formData, setFormData] = useState({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
    attachments: [],
    managerId: ""
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
  const [searchTerm, setSearchTerm] = useState(null)

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

  const handleSubmit = async () => {
    if (!formData.startDate || !formData.endDate || !formData.reason || !formData.managerId) {
      alert('Please fill all required fields including selecting a manager');
      return;
    }
    try {
      console.log('Leave Request Payload:', formData);
      
      const response = await ApiServices.RequestForLeave(formData);
      console.log('API Response:', response);
      alert('Leave request submitted successfully');
      setShowRequestModal(false);
      setFormData({ leaveType: 'casual', startDate: '', endDate: '', reason: '', attachments: [], managerId: '' });
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert(error.message || 'Failed to submit leave request');
    }
  };

  const filteredLeaves = filterStatus === 'all' 
    ? myLeaves 
    : myLeaves.filter(leave => leave.status === filterStatus);
      const handleSearch = (value) => {
    setSearchTerm(value)
    // handleFilter(value, statusFilter)
  }
  const handleViewDetails = (leaveId) => {
    // Logic to view leave details can be implemented here
    navigate(`/dashboard/leave-management/leave/${leaveId}`)
    ;
  }


  return (
    <>
      {/* Actions Bar */}
     <div className="space-y-6">
        <div>
              <h1 className="text-3xl font-bold text-gray-900">My Leaves</h1>
              <p className="text-gray-600 mt-1">View and manage your leave requests</p>
            </div>
      
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-3xl font-bold text-gray-900">{filteredLeaves.filter((l) => l.status === "approved").length}</div>
                <p className="text-sm text-gray-600 mt-1">Approved Leaves</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-3xl font-bold text-amber-600">{filteredLeaves.filter((l) => l.status === "pending").length}</div>
                <p className="text-sm text-gray-600 mt-1">Pending Requests</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-3xl font-bold text-rose-600">{filteredLeaves.filter((l) => l.status === "rejected").length}</div>
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
      
              
            </div>
            <div className='flex justify-between items-center py-3'>
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
      </div>

      {/* Leave Cards */}
      <div className="space-y-4">
       {/* Leave Cards */}
<div className="space-y-4">
  {filteredLeaves.map(leave => (
    <LeaveCard
      key={leave._id}
      leave={leave}
      leaveTypeColors={leaveTypeColors}
      statusConfig={statusConfig}
        onViewDetails={handleViewDetails}

    />
  ))}

  {filteredLeaves.length === 0 && (
    <div className="text-center py-12">
      <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600 text-lg">
        No {filterStatus !== "all" ? filterStatus : ""} leave requests found
      </p>
    </div>
  )}
</div>
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
    </>
  );
};

export default MyLeaves;

