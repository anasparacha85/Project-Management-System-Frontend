import React, { useEffect, useState } from "react";
import {
  Calendar,
  Plus,
  Filter,
  Edit3,
  Target,
  Clock,
  Users,
  CheckSquare,
  TrendingUp,
  Square,
  ChevronRight,
  AlertCircle,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ApiServices from "../../ApiService/ApiService";
import { useDispatch } from "react-redux";
import { setSubTaskModalOpen } from "../../Slices/UiSlice";
import { useSelector } from "react-redux";
import SubTaskModal from "../../modals/SubTaskModal";

const EditableField = ({
  value,
  onSave,
  type = "text",
  options = [],
  placeholder = "Add...",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    if (type === "select") {
      return (
        <select
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            onSave(e.target.value);
            setIsEditing(false);
          }}
          onBlur={handleSave}
          autoFocus
          className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:border-blue-500 bg-white"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === "date") {
      return (
        <input
          type="date"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          autoFocus
          className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:border-blue-500"
        />
      );
    }

    if (type === "number") {
      return (
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
            min="0"
            max="100"
            className="w-16 px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSave}
            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Check size={12} />
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <X size={12} />
          </button>
        </div>
      );
    }

    return (
      <input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        autoFocus
        className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:border-blue-500"
        placeholder={placeholder}
      />
    );
  }

  return (
    <div
      className="group cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-2"
      onClick={() => setIsEditing(true)}
    >
      <span className={!value ? "text-slate-400 text-xs" : "text-xs font-medium"}>
        {value || placeholder}
      </span>
      <Edit2
        size={10}
        className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
};

const MilestonesChecklists = () => {
  const [checklists, setChecklists] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.User);
  const role = user.role;
  const navigate = useNavigate();
  const { taskDetails } = useSelector((state) => state.Task);

  const getSubTasksById = async () => {
    try {
      const data = await ApiServices.getSubTaskByTaskid(params.id);
      setChecklists(data.subTasks || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeSubTask = async () => {
    try {
      const response = await ApiServices.getEmployeeSubTasksByTaskId(params.id);
      dispatch(setChecklists(response.subtasks));
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "manager") {
      getSubTasksById();
    } else {
      getEmployeeSubTask();
    }
  }, [role, params.id]);

  const handleUpdateMilestone = (milestoneId, field, newValue) => {
    setChecklists((prev) =>
      prev.map((milestone) =>
        milestone._id === milestoneId ? { ...milestone, [field]: newValue } : milestone
      )
    );
  };

  const filteredChecklists = checklists.filter(
    (checklist) => filter === "All" || checklist.status === filter
  );

  const getStatusStats = () => {
    return checklists.reduce((acc, checklist) => {
      acc[checklist.status] = (acc[checklist.status] || 0) + 1;
      return acc;
    }, {});
  };

  const stats = getStatusStats();
  const avgProgress =
    checklists.length > 0
      ? Math.round(checklists.reduce((acc, c) => acc + c.progress, 0) / checklists.length)
      : 0;

  const openMilestoneModal = () => {
    dispatch(setSubTaskModalOpen(true));
  };

  const statusConfig = {
    todo: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-300",
      dot: "bg-slate-400",
      icon: Square,
    },
    inprogress: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-300",
      dot: "bg-blue-500",
      icon: Clock,
    },
    review: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-300",
      dot: "bg-amber-500",
      icon: AlertCircle,
    },
    completed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-300",
      dot: "bg-emerald-500",
      icon: CheckSquare,
    },
  };

  const priorityConfig = {
    low: { color: "bg-emerald-500", text: "text-emerald-700" },
    medium: { color: "bg-amber-500", text: "text-amber-700" },
    high: { color: "bg-orange-500", text: "text-orange-700" },
    critical: { color: "bg-red-500", text: "text-red-700" },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 md:p-8">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center shadow-lg">
                <CheckSquare size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  Milestone Checkpoints
                  <span className="text-lg font-semibold text-blue-600">({checklists.length})</span>
                </h1>
                <p className="text-slate-600 text-sm mt-0.5">
                  Manage and track your Milestone Checkpoint efficiently
                </p>
              </div>
            </div>
            {role === "manager" && (
              <button
                onClick={() => dispatch(setSubTaskModalOpen(true))}
                className="bg-gradient-to-r from-[#667eea] to-indigo-600 hover:to-purple-800 cursor-pointer text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus size={18} />
                Add New Checkpoint
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Square size={18} className="text-slate-600" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{stats.todo || 0}</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase">To Do</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock size={18} className="text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{stats.inprogress || 0}</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase">In Progress</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle size={18} className="text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{stats.review || 0}</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase">Review</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckSquare size={18} className="text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{stats.completed || 0}</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase">Completed</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
              <span className="text-2xl font-bold">{avgProgress}%</span>
            </div>
            <p className="text-xs font-semibold uppercase opacity-90">Avg Progress</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-4 py-3 flex items-center gap-3">
          <Filter size={18} className="text-slate-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer bg-white"
          >
            <option value="All">All Status</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-[1600px] mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-x-auto scroll-smooth">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
               <tr className="bg-gradient-to-br from-slate-50 to-slate-200 text-left text-xs font-bold uppercase tracking-wide text-slate-700 sticky top-0 z-10">
                  <th className="text-left py-5 px-6 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <CheckSquare size={14} />
                      Checkpoint
                    </div>
                  </th>
                  <th className="text-left py-5 px-6 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-5 px-6 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="text-left py-5 px-6 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left py-5 px-6 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      Assignees
                    </div>
                  </th>
                  <th className="text-left py-5 px-6 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      Timeline
                    </div>
                  </th>
                  <th className="text-left py-5 px-6 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredChecklists.map((checklist, index) => {
                  const status = statusConfig[checklist.status] || statusConfig.todo;
                  const StatusIcon = status.icon;
                  const priority = priorityConfig[checklist.priority?.toLowerCase()] || priorityConfig.low;

                  return (
                    <tr
                      key={checklist._id}
                      className="border-b border-slate-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-colors"
                    >
                      {/* Checklist Item */}
                      <td className="py-4 px-5">
                        <EditableField
                          value={checklist.title}
                          onSave={(newValue) =>
                            handleUpdateMilestone(checklist._id, "title", newValue)
                          }
                          placeholder="Checklist title"
                        />
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} ${status.text} border ${status.border}`}
                        >
                          <StatusIcon size={12} />
                          <EditableField
                            value={checklist.status}
                            onSave={(newValue) =>
                              handleUpdateMilestone(checklist._id, "status", newValue)
                            }
                            type="select"
                            options={
                              role === "manager"
                                ? [
                                    { value: "todo", label: "To Do" },
                                    { value: "inprogress", label: "In Progress" },
                                    { value: "review", label: "Review" },
                                    { value: "completed", label: "Completed" },
                                  ]
                                : [
                                    { value: "todo", label: "To Do" },
                                    { value: "inprogress", label: "In Progress" },
                                    { value: "review", label: "Ready for Review" },
                                  ]
                            }
                          />
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="py-4 px-5">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden min-w-[80px]">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                                style={{ width: `${checklist.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-slate-700 min-w-[35px]">
                              {checklist.progress}%
                            </span>
                          </div>
                          <EditableField
                            value={checklist.progress}
                            onSave={(newValue) =>
                              handleUpdateMilestone(
                                checklist._id,
                                "progress",
                                Math.max(0, Math.min(100, newValue))
                              )
                            }
                            type="number"
                            placeholder="0"
                          />
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${priority.color}`}></div>
                          <EditableField
                            value={checklist.priority}
                            onSave={(newValue) =>
                              handleUpdateMilestone(checklist._id, "priority", newValue)
                            }
                            type="select"
                            options={[
                              { value: "low", label: "Low" },
                              { value: "medium", label: "Medium" },
                              { value: "high", label: "High" },
                              { value: "critical", label: "Critical" },
                            ]}
                          />
                        </div>
                      </td>

                      {/* Assignees */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1">
                          {checklist.assignee?.slice(0, 3).map((assignee, idx) => (
                            <div key={idx} className="relative group" title={assignee}>
                              {/* Assuming assignee is just a string, replace with actual avatar if needed */}
                              <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover group-hover:scale-110 transition-transform bg-slate-300 flex items-center justify-center text-slate-700 text-xs font-medium">
                                {assignee.substring(0, 2).toUpperCase()}
                              </div>
                            </div>
                          ))}
                          {checklist.assignee?.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                              +{checklist.assignee?.length - 3}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Timeline */}
                      <td className="py-4 px-5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-500 font-semibold min-w-[40px]">
                              Start:
                            </span>
                            <EditableField
                              value={formatDate(checklist.startDate)}
                              onSave={(newValue) =>
                                handleUpdateMilestone(checklist._id, "startDate", newValue)
                              }
                              type="date"
                              placeholder="Set date"
                            />
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-500 font-semibold min-w-[40px]">
                              Due:
                            </span>
                            <EditableField
                              value={formatDate(checklist.dueDate)}
                              onSave={(newValue) =>
                                handleUpdateMilestone(checklist._id, "dueDate", newValue)
                              }
                              type="date"
                              placeholder="Set date"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => navigate(`/dashboard/subTask/${checklist._id}`)}
                          className="px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          View
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredChecklists.length === 0 && (
            <div className="text-center py-16 px-6">
              <CheckSquare size={56} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">No checkpoint found</h3>
              <p className="text-slate-600 text-sm mb-6">
                {filter !== "All"
                  ? `No checkpoint with status "${filter}"`
                  : role === "manager"
                  ? "Start by Adding your first checkpoint"
                  : "You haven't been assigned any task yet"}
              </p>
              {role === "manager" && (
                <button
                  onClick={openMilestoneModal}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Plus size={18} />
                  Create your first Checkpoint
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="max-w-[1600px] mx-auto mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase mb-1">
                Total Checkpoints
              </p>
              <p className="text-3xl font-bold text-slate-800">{checklists.length}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase mb-1">
                Average Progress
              </p>
              <p className="text-3xl font-bold text-blue-600">{avgProgress}%</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase mb-1">
                Completed Items
              </p>
              <p className="text-3xl font-bold text-emerald-600">{stats.completed || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <SubTaskModal parentTask={taskDetails} />

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MilestonesChecklists;