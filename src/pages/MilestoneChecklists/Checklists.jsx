import React, { useEffect, useState } from "react";
import { Calendar, Plus, Filter, Search, ChevronDown, Edit3, Save, X, Target, Clock, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ApiServices from "../../ApiService/ApiService";
import { useDispatch } from "react-redux";
import { setSubTaskModalOpen, setTaskModalOpen } from "../../Slices/UiSlice";
import TaskModal from "../../modals/TaskModal";
import { useSelector } from "react-redux";

const EditableCell = ({ value, onSave, type = "text", options = [], placeholder = "Click to edit" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    if (type === "select") {
      return (
        <div className="relative rounded-lg bg-white border-2 border-purple-500 shadow-sm cursor-default p-1">
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            autoFocus
            className="w-full border-none outline-none text-sm font-medium bg-transparent px-2 py-1"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === "date") {
      return (
        <div className="relative rounded-lg bg-white border-2 border-purple-500 shadow-sm cursor-default p-1">
          <input
            type="date"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full border-none outline-none text-sm font-medium bg-transparent px-2 py-1"
          />
        </div>
      );
    }

    return (
      <div className="relative rounded-lg bg-white border-2 border-purple-500 shadow-sm cursor-default p-1">
        <input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full border-none outline-none text-sm font-medium bg-transparent px-2 py-1"
          placeholder={placeholder}
        />
        <div className="flex gap-1 ml-2">
          <button onClick={handleSave} className="w-6 h-6 border-none rounded bg-green-500 text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-green-600">
            <Save size={12} />
          </button>
          <button onClick={handleCancel} className="w-6 h-6 border-none rounded bg-red-500 text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-red-600">
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg transition-all duration-200 cursor-pointer p-2 min-h-9 flex items-center justify-between bg-transparent hover:bg-slate-50 hover:border hover:border-slate-200" 
         onClick={() => setIsEditing(true)}>
      <span className={`flex-1 font-medium ${!value ? 'text-gray-400 italic' : ''}`}>
        {value || placeholder}
      </span>
      <Edit3 size={12} className="text-slate-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </div>
  );
};

const StatusBadge = ({ status, onChange }) => {
  const statusConfig = {
    pending: { color: '#ef4444', bg: '#fef2f2', label: 'Pending' },
    inprogress: { color: '#f59e0b', bg: '#fffbeb', label: 'In Progress' },
    completed: { color: '#10b981', bg: '#f0fdf4', label: 'Completed' },
    onhold: { color: '#6b7280', bg: '#f9fafb', label: 'On Hold' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <EditableCell
      value={status}
      onSave={onChange}
      type="select"
      options={Object.keys(statusConfig).map(key => ({
        value: key,
        label: statusConfig[key].label
      }))}
    />
  );
};

const ProgressBar = ({ progress, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-200 rounded overflow-hidden max-w-[100px]">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="font-semibold text-gray-700 text-xs min-w-[35px]">{progress}%</span>
      </div>
      <EditableCell
        value={progress}
        onSave={onChange}
        type="number"
        placeholder="0"
      />
    </div>
  );
};

const MilestonesChecklists = () => {
  const [checklists, setChecklists] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const [ProjectId, setProjectId] = useState('');
  const { user } = useSelector((state) => state.User);
  const role = user.role;
  const navigate = useNavigate();

  const fetchMilestones = async () => {
    setLoading(true);
    try {
      const data = await ApiServices.getMilestonesByProjectId(params.id);
      console.log(data);
      setMilestones(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

   const getSubTasksById = async () => {
    try {
      const data = await ApiServices.getSubTaskByTaskid(params.id);
      setChecklists(data.subTasks || []);
    } catch (error) {
      console.error(error.message);
    }
  };
    const getEmployeeSubTask = async () => {
      try {
        const response = await ApiServices.getEmployeeSubTasksByTaskId(params.id);
        console.log("hi", response);
        dispatch(setChecklists(response.subtasks));
      } catch (error) {
      console.log(error.message);
      
      }
    };
  

  useEffect(() => {
    if (role === 'manager') {
      getSubTasksById()
    } else {
     getEmployeeSubTask()
    }
  }, []);

  const handleUpdateMilestone = (milestoneId, field, newValue) => {
    setChecklists(prev => prev.map(milestone => 
      milestone._id === milestoneId 
        ? { ...milestone, [field]: newValue }
        : milestone
    ));
  };

  const filteredMilestones = checklists.filter(milestone => {
    const matchesFilter = filter === "All" || milestone.status === filter;
    const matchesSearch = milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         milestone.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStats = () => {
    const stats =checklists.reduce((acc, milestone) => {
      acc[milestone.status] = (acc[milestone.status] || 0) + 1;
      return acc;
    }, {});
    return stats;
  };

  const stats = getStatusStats();

  const openMilestoneModal = () => {
    setProjectId(params.id);
    dispatch(setSubTaskModalOpen(true));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-purple-500 rounded-full animate-spin"></div>
        <p>Loading milestones...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-8 font-sans text-slate-800">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3 mb-2">
            <Target className="text-purple-500" />
            Project Milestones
            <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 font-semibold">
              ({milestones.length})
            </span>
          </h1>
          <p className="text-slate-800 text-base mt-2">Track and manage project milestones with real-time progress</p>
        </div>
        {role === 'manager' &&
          <button 
            onClick={openMilestoneModal} 
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none py-3.5 px-6 rounded-xl font-semibold text-sm cursor-pointer flex items-center gap-2 transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
            title="new milestone"
          >
            <Plus size={16} />
            New Milestone
          </button>
        }
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-6 rounded-xl flex items-center gap-4 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white">
            <Clock size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-800">{stats.todo || 0}</span>
            <span className="text-sm text-slate-600 font-semibold uppercase tracking-wide">Todo</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl flex items-center gap-4 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white">
            <Target size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-800">{stats.inprogress || 0}</span>
            <span className="text-sm text-slate-600 font-semibold uppercase tracking-wide">In Progress</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl flex items-center gap-4 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
            <Users size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-800">{stats.completed || 0}</span>
            <span className="text-sm text-slate-600 font-semibold uppercase tracking-wide">Completed</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl flex items-center gap-4 border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white">
            <Filter size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-800">{milestones.length}</span>
            <span className="text-sm text-slate-600 font-semibold uppercase tracking-wide">Total</span>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex gap-5 mb-6 items-center flex-wrap">
        {role === "manager" ?
          <div className="relative flex items-center gap-3 bg-white py-3.5 px-5 rounded-xl border-2 border-slate-200 cursor-pointer transition-all duration-300 hover:border-slate-300">
            <Filter size={16} className="text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border-none bg-transparent text-sm font-semibold text-gray-700 cursor-pointer outline-none appearance-none"
            >
              <option value="All">All Status</option>
              <option value="pending">todo</option>
              <option value="inprogress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown size={16} className="text-slate-500 pointer-events-none" />
          </div> :
          <div className="relative flex items-center gap-3 bg-white py-3.5 px-5 rounded-xl border-2 border-slate-200 cursor-pointer transition-all duration-300 hover:border-slate-300">
            <Filter size={16} className="text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border-none bg-transparent text-sm font-semibold text-gray-700 cursor-pointer outline-none appearance-none"
            >
              <option value="All">All Status</option>
              <option value="todo">todo</option>
              <option value="inprogress">In Progress</option>
              <option value="review">Ready for Review</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown size={16} className="text-slate-500 pointer-events-none" />
          </div>
        }
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="bg-gradient-to-br from-slate-50 to-slate-100 py-5 px-6 border-b-2 border-slate-200 text-left font-bold text-gray-700 uppercase tracking-wide text-xs sticky top-0 z-10 w-[35%]">
                <span className="flex items-center gap-2">
                  <Target size={16} />
                  Milestone
                </span>
              </th>
              <th className="bg-gradient-to-br from-slate-50 to-slate-100 py-5 px-6 border-b-2 border-slate-200 text-left font-bold text-gray-700 uppercase tracking-wide text-xs sticky top-0 z-10 w-[15%]">
                <span className="flex items-center gap-2">Status</span>
              </th>
              <th className="bg-gradient-to-br from-slate-50 to-slate-100 py-5 px-6 border-b-2 border-slate-200 text-left font-bold text-gray-700 uppercase tracking-wide text-xs sticky top-0 z-10 w-[15%]">
                <span className="flex items-center gap-2">Progress</span>
              </th>
              <th className="bg-gradient-to-br from-slate-50 to-slate-100 py-5 px-6 border-b-2 border-slate-200 text-left font-bold text-gray-700 uppercase tracking-wide text-xs sticky top-0 z-10 w-[10%]">
                <span className="flex items-center gap-2">Priority</span>
              </th>
              <th className="bg-gradient-to-br from-slate-50 to-slate-100 py-5 px-6 border-b-2 border-slate-200 text-left font-bold text-gray-700 uppercase tracking-wide text-xs sticky top-0 z-10 w-[15%]">
                <span className="flex items-center gap-2">
                  <Users size={16} />
                  Assignees
                </span>
              </th>
              <th className="bg-gradient-to-br from-slate-50 to-slate-100 py-5 px-6 border-b-2 border-slate-200 text-left font-bold text-gray-700 uppercase tracking-wide text-xs sticky top-0 z-10 w-[20%]">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  Timeline
                </span>
              </th>
              <th className="bg-gradient-to-br from-slate-50 to-slate-100 py-5 px-6 border-b-2 border-slate-200 text-left font-bold text-gray-700 uppercase tracking-wide text-xs sticky top-0 z-10 w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMilestones.map((milestone) => (
              <tr key={milestone._id} className="transition-all duration-200 border-b border-slate-100 hover:bg-gradient-to-r hover:from-white hover:to-slate-50 group relative">
                <td className="py-6 px-6 align-top max-w-[300px]">
                  <div className="flex flex-col gap-2">
                    <EditableCell
                      value={milestone.title}
                      onSave={(newValue) => handleUpdateMilestone(milestone._id, 'title', newValue)}
                      placeholder="Milestone title"
                    />
                  </div>
                </td>
                
                <td className="py-6 px-6 align-top">
                  <div className={`flex items-center gap-2 py-2 px-4 rounded-full font-semibold text-xs uppercase tracking-wide min-w-[120px] ${
                    milestone.status === 'pending' ? 'bg-red-50 text-red-800 border border-red-200' :
                    milestone.status === 'inprogress' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    milestone.status === 'completed' ? 'bg-green-50 text-green-800 border border-green-200' :
                    'bg-slate-50 text-slate-800 border border-slate-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      milestone.status === 'pending' ? 'bg-red-500' :
                      milestone.status === 'inprogress' ? 'bg-amber-500 animate-pulse' :
                      milestone.status === 'completed' ? 'bg-green-500' :
                      'bg-slate-500'
                    }`}></span>
                    {role === "manager" ? (
                      <EditableCell
                        value={milestone.status}
                        onSave={(newValue) => handleUpdateMilestone(milestone._id, 'status', newValue)}
                        type="select"
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'inprogress', label: 'In Progress' },
                          { value: 'review', label: 'Review' },
                          { value: 'completed', label: 'Completed' },
                        ]}
                      />
                    ) : (
                      <EditableCell
                        value={milestone.status}
                        onSave={(newValue) => handleUpdateMilestone(milestone._id, 'status', newValue)}
                        type="select"
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'inprogress', label: 'In Progress' },
                          { value: 'review', label: 'Ready for Review' },
                        ]}
                      />
                    )}
                  </div>
                </td>
                
                <td className="py-6 px-6 align-top">
                  <ProgressBar
                    progress={milestone.progress}
                    onChange={(newValue) => handleUpdateMilestone(milestone._id, 'progress', Math.max(0, Math.min(100, newValue)))}
                  />
                </td>
                
                <td className="py-6 px-6 align-top">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getPriorityColor(milestone.priority) }}
                    ></div>
                    <EditableCell
                      value={milestone.priority}
                      onSave={(newValue) => handleUpdateMilestone(milestone._id, 'priority', newValue)}
                      type="select"
                      options={[
                        { value: 'Low', label: 'Low' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'High', label: 'High' },
                      ]}
                    />
                  </div>
                </td>
                
                <td className="py-6 px-6 align-top">
                  <div className="flex items-center -space-x-2 flex-wrap">
                    {milestone.assignees?.slice(0, 3).map((assignee, index) => (
                      <div key={index} className="relative" title={assignee?.user?.name}>
                        <img 
                          src={assignee?.user?.avatarUrl} 
                          alt={assignee?.user?.name}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover transition-all duration-200 hover:scale-110 hover:z-10 hover:shadow-md"
                        />
                      </div>
                    ))}
                    {milestone.assignees?.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-semibold border-2 border-white">
                        +{milestone?.assignees?.length - 3}
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="py-6 px-6 align-top">
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase min-w-[32px]">Start:</span>
                      <EditableCell
                        value={milestone.startDate}
                        onSave={(newValue) => handleUpdateMilestone(milestone._id, 'startDate', newValue)}
                        type="date"
                        placeholder="Set start date"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase min-w-[32px]">Due:</span>
                      <EditableCell
                        value={milestone.dueDate}
                        onSave={(newValue) => handleUpdateMilestone(milestone._id, 'dueDate', newValue)}
                        type="date"
                        placeholder="Set due date"
                      />
                    </div>
                  </div>
                </td>
                
                <td className="py-6 px-6 align-top">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/dashboard/milestone/${milestone._id}`)} 
                      className="w-20 h-8 border-none rounded-lg bg-blue-100 text-blue-700 cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-blue-200 hover:scale-105 text-xs font-medium"
                      title="View details"
                    >
                      👁️ View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMilestones.length === 0 && (
          role === "manager" ? (
            <div className="text-center py-20 px-10 text-slate-500">
              <Target size={48} className="text-slate-300 mb-4 mx-auto" />
              <h3 className="text-xl mb-2 text-slate-700">No milestones found</h3>
              <p className="mb-6 text-base">
                {searchTerm 
                  ? `No milestones match "${searchTerm}"`
                  : filter !== "All" 
                    ? `No milestones with status "${filter}"`
                    : "Start by creating your first milestone"
                }
              </p>
              <button 
                onClick={openMilestoneModal} 
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none py-3 px-6 rounded-lg font-semibold cursor-pointer flex items-center gap-2 mx-auto transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Plus size={16} />
                Create First Milestone
              </button>
            </div>
          ) : (
            <div className="text-center py-20 px-10 text-slate-500">
              <Target size={48} className="text-slate-300 mb-4 mx-auto" />
              <h3 className="text-xl mb-2 text-slate-700">You are not assigned to any milestone yet</h3>
              <p className="mb-6 text-base">
                {searchTerm 
                  ? `No milestones match "${searchTerm}"`
                  : filter !== "All" 
                    ? `No milestones with status "${filter}"`
                    : "Wait until your reporting manager assign you your first milestone"
                }
              </p>
            </div>
          )
        )}
      </div>

      {/* Summary Footer */}
      <div className="bg-white mt-8 p-6 rounded-2xl shadow-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Total Milestones:</span>
            <span className="text-2xl font-extrabold text-slate-800">{milestones.length}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Average Progress:</span>
            <span className="text-2xl font-extrabold text-slate-800">
              {milestones.length > 0 
                ? Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length)
                : 0}%
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Completed:</span>
            <span className="text-2xl font-extrabold text-slate-800">{stats.completed || 0}</span>
          </div>
        </div>
      </div>
      
      <TaskModal projectId={ProjectId} />

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default MilestonesChecklists;