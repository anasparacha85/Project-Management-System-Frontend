import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksById, setTaskDetails } from "../Slices/TaskSlice";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ApiServices from "../ApiService/ApiService";
import { FetchProjectDetailsById } from "../Slices/ProjectSlice";
import { AlertCircle, Plus, Check, Circle, Trash2, ChevronDown, ChevronRight, Eye, Calendar, Users, Flag, Target, MessageSquare, Save, Edit2, Loader } from "lucide-react";
import { setSubTaskModalOpen } from "../Slices/UiSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const AssigneesSelector = ({ assignees, team, onUpdate, userRole }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = team.filter(
    (u) =>
      u.user.name.toLowerCase().includes(search.toLowerCase()) ||
      u.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAssignee = (user) => {
    const exists = assignees.find((a) => a.user._id === user._id);
    if (exists) {
      onUpdate(assignees.filter((a) => a.user._id !== user._id));
    } else {
      onUpdate([...assignees, { _id: user._id, user }]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Users className="w-4 h-4" />
        Team Members
      </label>
      <div className="flex flex-wrap gap-2 items-center p-3 bg-white rounded-lg border border-gray-200 min-h-[52px]">
        {assignees?.length > 0 ? (
          assignees.map((assignee) => (
            <div key={assignee._id} className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 rounded-lg border border-indigo-200">
              <img
                src={assignee?.user?.avatarUrl}
                alt={assignee?.user?.name}
                className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
              />
              <span className="text-sm font-medium text-gray-800">{assignee?.user?.name}</span>
              {userRole === "manager" && (
                <button
                  onClick={() => toggleAssignee(assignee.user)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              )}
            </div>
          ))
        ) : (
          <span className="text-sm text-gray-400 italic">No team members assigned</span>
        )}

        {userRole === "manager" && (
          <button
            className="flex items-center gap-2 px-3 py-2 bg-white text-indigo-600 rounded-lg border-2 border-dashed border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-sm font-medium"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Plus className="w-4 h-4" />
            Assign
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-3 max-h-72 overflow-y-auto">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
          />

          {filteredUsers.length > 0 ? (
            <div className="space-y-1">
              {filteredUsers.map((user) => {
                console.log("===========",user)
                  console.log("+++++++++++",assignees)
               const isChecked = !!assignees.find((a) => a.user?._id === user?.user?._id );

                return (
                  <div
                    key={user?.user?._id}
                    className="flex items-center gap-3 p-2.5 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => toggleAssignee(user?.user)}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleAssignee(user?.user)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <img
                      src={user?.user?.avatarUrl}
                      alt={user?.user?.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{user.user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.user.email}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">No users found</p>
          )}
        </div>
      )}
    </div>
  );
};
const ChecklistSection = ({ subtasks, onUpdate, userRole, onDelete }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const completedCount = subtasks.filter(st => st.status === 'completed').length;
  const totalCount = subtasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const percentagePerTask = totalCount > 0 ? Math.round((100 / totalCount) * 10) / 10 : 0;

  const handleAddChecklist = () => {
    dispatch(setSubTaskModalOpen(true));
  };

  const handleToggleComplete = (id) => {
    onUpdate(subtasks.map(st => 
      st._id === id ? { ...st, completed: !st.status.completed } : st
    ));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div 
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">CheckPoints</h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
            {completedCount}/{totalCount}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-semibold text-gray-700 min-w-[45px] text-right">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {isExpanded && (
        <div>
          <div className="p-5 space-y-3">
            {subtasks.length > 0 ? (
              subtasks.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => handleToggleComplete(item._id)}
                      className="flex-shrink-0"
                    >
                      {item.status === 'completed' ? (
                        <div className="w-5 h-5 bg-green-500 rounded-md flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        </div>
                      ) : item.status === 'in-progress' ? (
                        <div className="w-5 h-5 bg-orange-500 rounded-md flex items-center justify-center">
                          <Loader className="w-3.5 h-3.5 text-white stroke-[3]" />
                        </div>
                      ) : item.status === 'review' ? (
                        <div className="w-5 h-5 bg-blue-500 rounded-md flex items-center justify-center shadow-sm">
                          <Eye className="w-3.5 h-3.5 text-white stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-md hover:border-indigo-500 transition-colors flex items-center justify-center">
                          <Circle className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                    </button>

                    <span
                      className={`flex-1 text-sm ${
                        item.status === 'completed' 
                          ? 'text-gray-400 line-through' 
                          : 'text-gray-900 font-medium'
                      }`}
                    >
                      {item.title}
                    </span>

                   
                      <button
                        onClick={() => navigate(`/dashboard/subtask/${item._id}`)}
                        className="opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity p-2 hover:bg-indigo-50 rounded-lg text-indigo-600"
                      >
                        <Eye className="w-5  h-5" />
                      </button>
                   
                  </div>

                  <div className="flex items-center gap-3 pl-8">
                    <div className="flex-1 bg-indigo-50 rounded-lg px-3 py-2 border border-indigo-100">
                      <div className="flex items-center  gap-2 text-xs">
                        <span className="text-gray-600 font-medium">Contains </span>
                        <div className="flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="text-indigo-700 font-bold">{percentagePerTask}%</span>
                        </div>
                        <span className="text-gray-600 font-medium">of the milestone </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Circle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No checkpoints yet</p>
                <p className="text-xs text-gray-400 mt-1">Break down this task into smaller steps</p>
              </div>
            )}
          </div>

          {userRole === "manager" && (
            <div className="p-4 flex justify-end bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleAddChecklist}
                className="w-[50%] px-4 py-2.5 bg-indigo-600 cursor-pointer text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
             {subtasks.length>0?"Add More checkpoints to Your milestone ":"Add your first checkpoint"}   
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const InfoCard = ({ icon: Icon, label, value, type = "text", editing, onEdit, onChange, onSave, options = [], disabled }) => {
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'review':
      case 'ready-for-review': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'todo': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const displayValue = type === "date" && value 
    ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : value || "Not set";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-indigo-200 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <Icon className="w-4 h-4 text-gray-400" />
          {label}
        </label>
        {!disabled && !editing && (
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      
      {editing ? (
        type === "select" ? (
          <select
            className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            value={value}
            onChange={onChange}
            onBlur={onSave}
            autoFocus
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : type === "date" ? (
          <input
            className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            type="date"
            value={value}
            onChange={onChange}
            onBlur={onSave}
            autoFocus
            disabled={disabled}
          />
        ) : (
          <input
            className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onSave}
            autoFocus
          />
        )
      ) : (
        <div className={`px-3 py-2 rounded-lg border text-sm font-medium ${
          label === 'Priority' ? getPriorityStyle(value) : 
          label === 'Status' ? getStatusStyle(value) :
          value ? 'bg-gray-50 text-gray-900 border-gray-200' : 'bg-gray-50 text-gray-400 border-gray-200'
        }`}>
          {displayValue}
        </div>
      )}
    </div>
  );
};

const TaskDetailPage = () => {
  const [subtasks, setSubtasks] = useState([]);
  const [projectId, setProjectId] = useState(false);
  const [project, setProject] = useState({});
  const [newComment, setNewComment] = useState("");
  const [editingFields, setEditingFields] = useState({});
  const descriptionRef = useRef();
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const [IsLoading, setIsLoading] = useState(false)
  const { taskDetails, loading, error } = useSelector((state) => state.Task);
  const { team } = useSelector((state) => state.Project);
  const { user } = useSelector((state) => state.User);
  const role = user.role;
  const [comments, setComments] = useState([]);
  console.log(taskDetails,"===============taskDetails");
  
  const fetchComments = async () => {
  try {
    const response = await ApiServices.GetCommentsByTargetId({type:'task',targetId:params.id});
    console.log("========",response);
    
    setComments(response?.comments || []); // assuming response.comments array milega
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};


const playCommentSound = () => {
  const audio = new Audio("/public/sound/comment-sound.mp3");
  audio.volume = 0.5; // optional - sound thoda soft karne ke liye
  audio.play().catch((e) => console.error("Audio play failed:", e));
};
 
 useEffect(() => {
 
  fetchComments(); // 👈 yahan call kar
}, []);
 const handleAddComment=async()=>{
  setIsLoading(true)
  try {
    const response=await ApiServices.PostComment({type:"task",targetId:params.id,content:newComment})
    console.log(response);
    
  setNewComment("");
    playCommentSound();
    fetchComments(); // 👈 refresh comments list
    
  } catch (error) {
    alert(error.message)
    
  }
  finally{
    setIsLoading(false)
  }
}

  const getSubTasksById = async () => {
    try {
      const data = await ApiServices.getSubTaskByTaskid(params.id);
      setSubtasks(data.subTasks);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getSubTasksByEmployeeId = async () => {
    try {
      const data = await ApiServices.getEmployeeSubTasksByTaskId(params.id);
      setSubtasks(data.subtasks);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (role === 'manager') {
      getSubTasksById();
    } else {
      getSubTasksByEmployeeId();
    }
  }, [params.id]);

  useEffect(() => {
    dispatch(fetchTasksById(params.id))
      .unwrap()
      .then((data) => {
        setProjectId(data.project);
      });
  }, []);

  useEffect(() => {
    if (projectId) {
      dispatch(FetchProjectDetailsById(projectId))
        .unwrap()
        .then((data) => {
          setProject(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [projectId]);

  const handleSaveTask = async () => {
    try {
      setIsLoading(true)
      const payload = {
        ...taskDetails,
        ...(taskDetails.startDate ? { startDate: taskDetails.startDate } : {}),
        ...(taskDetails.dueDate ? { dueDate: taskDetails.dueDate } : {})
      };
      if (role === 'manager') {
        const data = await ApiServices.updateTaskById(params.id, payload);
        alert(data.SuccessMessage);
      } else {
        const data = await ApiServices.updateEmployeeTaskById(params.id, payload);
        alert(data.SuccessMessage);
      }
      dispatch(fetchTasksById(params.id));
    } catch (error) {
      alert(error.message);
    }
    finally{
      setIsLoading(false)
    }
  };

  const handleDeleteTask = async () => {
    try {
      const data = await ApiServices.deleteTaskById(params.id);
      alert(data.SuccessMessage);
      navigate(-1);
      dispatch(FetchProjectDetailsById(projectId));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFieldEdit = (fieldName) => {
    setEditingFields({ ...editingFields, [fieldName]: true });
  };

  const handleFieldSave = (fieldName, value) => {
    dispatch(setTaskDetails({ ...taskDetails, [fieldName]: value }));
    setEditingFields({ ...editingFields, [fieldName]: false });
  };

  const handleAssigneesUpdate = (newAssignees) => {
    dispatch(setTaskDetails({ ...taskDetails, assignees: newAssignees }));
  };

  const getStatusOptions = () => {
    if (role === "manager") {
      return ["todo", "in-progress", "review", "completed"];
    } else {
      return ["todo", "in-progress", "ready-for-review"];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Task</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              dispatch(fetchTasksById(params.id))
                .unwrap()
                .then((data) => {
                  setProjectId(data.project);
                });
            }}
            className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const completionPercentage = taskDetails.progress || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span>Projects</span>
            <span>/</span>
            <span>{taskDetails.project || 'Project'}</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Milestone Details</span>
          </div>
          
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{taskDetails.title || "Task Title"}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm">
                  Milestone
                </span>
                <span className="text-xs text-gray-500 font-mono bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                  ID: {taskDetails._id?.slice(-8)}
                </span>
              </div>
            </div>
            
           
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-2xl font-bold text-gray-900">{completionPercentage}%</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Properties */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Flag className="w-5 h-5 text-indigo-600" />
                Task Properties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={Target}
                  label="Status"
                  value={(role === 'employee' && taskDetails.status === 'review') ? 'ready-for-review' : taskDetails.status}
                  type="select"
                  options={getStatusOptions()}
                  editing={editingFields.status}
                  onEdit={() => handleFieldEdit('status')}
                  onChange={(e) => handleFieldSave('status', e.target.value)}
                  onSave={() => setEditingFields({ ...editingFields, status: false })}
                />
                
                <InfoCard
                  icon={Flag}
                  label="Priority"
                  value={taskDetails.priority}
                  type="select"
                  options={["Low", "Medium", "High", "Critical"]}
                  editing={editingFields.priority}
                  onEdit={() => handleFieldEdit('priority')}
                  onChange={(e) => handleFieldSave('priority', e.target.value)}
                  onSave={() => setEditingFields({ ...editingFields, priority: false })}
                />
                
                <InfoCard
                  icon={Calendar}
                  label="Start Date"
                  value={taskDetails.startDate}
                  type="date"
                  disabled={role !== "manager"}
                  editing={editingFields.startDate}
                  onEdit={() => handleFieldEdit('startDate')}
                  onChange={(e) => handleFieldSave('startDate', e.target.value)}
                  onSave={() => setEditingFields({ ...editingFields, startDate: false })}
                />
                
                <InfoCard
                  icon={Calendar}
                  label="Due Date"
                  value={taskDetails.dueDate}
                  type="date"
                  disabled={role !== "manager"}
                  editing={editingFields.dueDate}
                  onEdit={() => handleFieldEdit('dueDate')}
                  onChange={(e) => handleFieldSave('dueDate', e.target.value)}
                  onSave={() => setEditingFields({ ...editingFields, dueDate: false })}
                />
              </div>
            </div>
              {/* Checklist */}
            <ChecklistSection
              subtasks={subtasks}
              onUpdate={setSubtasks}
              userRole={role}
            />

            {/* Team Members */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <AssigneesSelector
                assignees={taskDetails.assignees || []}
                team={team || []}
                onUpdate={handleAssigneesUpdate}
                userRole={role}
              />
            </div>

           <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold text-gray-900">Description</h2>
    <button
      onClick={() =>
        setEditingFields((prev) => ({
          ...prev,
          description: !prev.description,
        }))
      }
      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
    >
      <Edit2 className="w-3.5 h-3.5" />
      {editingFields.description ? "Save" : "Edit"}
    </button>
  </div>

  {editingFields.description ? (
    <ReactQuill
      theme="snow"
      value={taskDetails.description || ""}
      onChange={(value) =>
        dispatch(setTaskDetails({ ...taskDetails, description: value }))
      }
      className="bg-white rounded-lg border border-gray-200"
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      }}
    />
  ) : (
    <div
      className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border border-gray-200"
      dangerouslySetInnerHTML={{ __html: taskDetails.description || "<p>No description added.</p>" }}
    />
  )}
</div>


          
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Project Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Start Date</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">End Date</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                Activity & Comments
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                {/* Task Created Activity */}
                <div className="flex gap-3">
                  <img
                    src={taskDetails.createdBy?.avatarUrl || 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png'}
                    alt={taskDetails.createdBy?.name || 'User'}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{taskDetails.createdBy?.name || 'Unknown'}</span>
                      <span className="text-gray-500"> created this task</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {taskDetails.createdAt ? new Date(taskDetails.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Assignment Activities */}
                {taskDetails.assignees?.map((assignee) => (
                  <div key={assignee._id} className="flex gap-3">
                    <img
                      src={assignee?.user?.avatarUrl || 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png'}
                      alt={assignee.user?.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{taskDetails.createdBy?.name}</span>
                        <span className="text-gray-500"> assigned </span>
                        <span className="font-semibold">{assignee.user?.name}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {taskDetails.updatedAt ? new Date(taskDetails.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Comments */}
                {comments?.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <img
                      src={comment.createdBy?.avatarUrl || 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png'}
                      alt={comment.createdBy?.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {comment.createdBy?.name}
                      </p>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {(!comments || comments.length === 0) && taskDetails.assignees?.length <= 1 && (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No activity yet</p>
                    <p className="text-xs text-gray-400 mt-1">Start collaborating by adding a comment</p>
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment or update..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows="3"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="mt-3 w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
              {IsLoading?"Posting....":" Post Comment"}   
                </button>
              </div>
            </div>
             <div className="flex gap-2  flex-col mt-10">
              <button
                onClick={handleSaveTask}
                disabled={IsLoading?true:false}
                className={`px-5 py-2.5 bg-green-600  text-white rounded-lg ${IsLoading?"cursor-not-allowed":"cursor-pointer"} text-center font-medium hover:bg-green-700 transition-all shadow-sm hover:shadow-md flex justify-center items-center gap-2`}
              >
            
                  <Save className="w-4 h-4" />
               
                {IsLoading?"Saving changes....":" Save changes"}

              
              
              </button>
              {role === 'manager' && (
                <button
                  onClick={handleDeleteTask}
                  className="px-5 py-2.5 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors border border-red-200 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;