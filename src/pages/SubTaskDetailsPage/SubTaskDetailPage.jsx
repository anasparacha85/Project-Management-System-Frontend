import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ApiServices from "../../ApiService/ApiService";
import { fetchSubTaskById, setSubTaskDetails } from "../../Slices/SubTaskSlice";
import { ArrowLeft } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AssigneesSelector = ({ allUsers, taskData, setTaskData }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useSelector((state) => state.User);

  const filteredUsers = allUsers.filter(
    (u) =>
      u.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      u.user?.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAssignee = (user) => {
    const exists = taskData.assignees.find((a) => a.user?._id === user?._id);
    if (exists) {
      setTaskData({
        ...taskData,
        assignees: taskData.assignees.filter((a) => a.user?._id !== user?._id),
      });
    } else {
      setTaskData({
        ...taskData,
        assignees: [...taskData.assignees, { user, status: "todo" }],
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <span className="text-sm font-semibold text-gray-700">Assignees</span>
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white border-2 border-gray-200 rounded-lg min-h-12">
        {taskData.assignees?.length > 0 ? (
          taskData.assignees.map((assignee) => (
            <div key={assignee._id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
              <img
                src={assignee?.user?.avatarUrl}
                alt={assignee?.user?.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700">{assignee?.user?.name}</span>
              <button
                className="ml-2 border-none bg-transparent cursor-pointer text-red-500 text-sm"
                onClick={() => toggleAssignee(assignee?.user)}
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-400 italic">No assignees</span>
        )}

        {user.role === "manager" && (
          <button
            className="bg-blue-50 border border-dashed border-blue-300 text-purple-700 px-3 py-1.5 rounded-full cursor-pointer text-sm font-semibold transition-all hover:bg-blue-100 hover:border-blue-400"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            + Add
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="mt-2 border border-gray-300 rounded-lg bg-white p-3 max-h-48 overflow-y-auto shadow-lg">
          <input
            type="text"
            placeholder="Search assignees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-3 p-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-3 focus:ring-purple-100 outline-none"
          />

          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isChecked = !!taskData.assignees.find(
                (a) => a.user._id === user.user._id
              );
              return (
                <div
                  key={user?.user?._id}
                  className="flex items-center gap-2 p-1.5 border-b border-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAssignee(user?.user)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <img
                    src={user?.user?.avatarUrl}
                    alt={user?.user?.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{user?.user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.user?.email}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-400">No users found</p>
          )}
        </div>
      )}
    </div>
  );
};

const EditableField = ({ label, value, placeholder, name, type = "text", options = [], onUpdate, disabled }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value || "");

  useEffect(() => {
    setText(value || "");
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    onUpdate(name, text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setText(value || "");
      setEditing(false);
    }
  };

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 border-red-200 bg-red-50';
      case 'Medium': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'Low': return 'text-green-600 border-green-200 bg-green-50';
      default: return '';
    }
  };

  if (type === "select") {
    return (
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        {editing ? (
          <select
            className="p-3 border-2 border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-100"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            autoFocus
            name={name}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <span
            className={`p-3 border-2 border-gray-200 rounded-lg min-h-12 flex items-center cursor-pointer transition-all hover:border-purple-500 hover:shadow-sm ${!text ? "text-gray-400 italic" : ""} ${getPriorityClasses(text)}`}
            onClick={() => setEditing(true)}
          >
            {text || placeholder}
          </span>
        )}
      </div>
    );
  }

  if (type === "date") {
    return (
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        {editing ? (
          <input
            className="p-3 border-2 border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-100"
            type="date"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            autoFocus
            name={name}
            disabled={disabled || false}
          />
        ) : (
          <span
            className={`p-3 border-2 border-gray-200 rounded-lg min-h-12 flex items-center cursor-pointer transition-all hover:border-purple-500 hover:shadow-sm ${!text ? "text-gray-400 italic" : ""}`}
            onClick={() => setEditing(true)}
          >
            {text ? new Date(text).toLocaleDateString() : placeholder}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mb-4">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      {editing ? (
        <input
          className="p-3 border-2 border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-100"
          type={type}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          autoFocus
          name={name}
        />
      ) : (
        <span
          className={`p-3 border-2 border-gray-200 rounded-lg min-h-12 flex items-center cursor-pointer transition-all hover:border-purple-500 hover:shadow-sm ${!text ? "text-gray-400 italic" : ""}`}
          onClick={() => setEditing(true)}
        >
          {text || placeholder}
        </span>
      )}
    </div>
  );
};

const UserAvatar = ({ user }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
    <img 
      src={user?.avatarUrl || 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png'} 
      alt={user?.name || 'User'} 
      className="w-6 h-6 rounded-full object-cover"
    />
    <span className="text-sm font-medium text-gray-700">{user?.name || 'Unassigned'}</span>
  </div>
);

const SubTaskDetailPage = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [newComment, setNewComment] = useState("");
  const [subTaskData, setSubTaskData] = useState({});
  const descriptionRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { user } = useSelector((state) => state.User);
  const role = user.role;
  const [IsLoading, setIsLoading] = useState(false)
  const { SubTaskDetails, SubTaskLoading, SubTaskError } = useSelector((state) => state.SubTask);
  const { taskDetails } = useSelector((state) => state.Task);
  const team = taskDetails.assignees;
  const [comments, setComments] = useState([]);
  const fetchComments = async () => {
  try {
    const response = await ApiServices.GetCommentsByTargetId({type:'subtask',targetId:params.id});
    console.log("========",response);
    
    setComments(response?.comments || []); // assuming response.comments array milega
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

// Use a ref to initialize the audio once and reuse it.
const commentAudioRef = useRef(null);

useEffect(() => {
  // Files in `public/` are served from the site root in production (Vercel).
  // Use `/sound/comment-sound.mp3` (no `/public` prefix) and initialize once.
  try {
    commentAudioRef.current = new Audio("/sound/comment-sound.mp3");
    commentAudioRef.current.preload = "auto";
    commentAudioRef.current.volume = 0.5;
  } catch (e) {
    console.warn("Failed to initialize comment sound:", e);
    commentAudioRef.current = null;
  }
}, []);

const playCommentSound = async () => {
  const audio = commentAudioRef.current;
  if (!audio) return;
  try {
    // Some browsers block play() unless triggered by a user gesture.
    await audio.play();
  } catch (e) {
    // Log the error so we can distinguish 404/path vs autoplay block in production.
    console.warn("Audio play failed (autoplay or other):", e);
  }
};
 
  const fetchSubTask = () => {
    dispatch(fetchSubTaskById(params.id)).unwrap().then((data) => {
      setSubTaskData(data);
    }).catch((error) => {
      console.log(error);
    });
  };

 useEffect(() => {
  fetchSubTask();
  fetchComments(); // 👈 yahan call kar
}, []);

  const timeLogs = subTaskData.timeLogs || [];
  const latestLog = timeLogs[timeLogs.length - 1];
  const latestAction = latestLog?.action;
const handleAddComment=async()=>{
  try {
    const response=await ApiServices.PostComment({type:"subtask",targetId:params.id,content:newComment})
    console.log(response);
    
  setNewComment("");
    playCommentSound();
    fetchComments(); // 👈 refresh comments list
    
  } catch (error) {
    alert(error.message)
    
  }
}
  const handlePause = async () => {
    try {
      const response = await ApiServices.takeBreakForEmployee(params.id);
      alert(response.SuccessMessage);
      fetchSubTask();
    } catch (error) {
      console.log(error);
    }
  };

  const handleResume = async () => {
    try {
      const response = await ApiServices.FinishBreakForEmployee(params.id);
      alert(response.SuccessMessage);
      fetchSubTask();
    } catch (error) {
      alert(error.message || "Something went wrong");
    }
  };

  const isOnBreak = latestLog?.action === "paused";
  let buttonLabel = "";
  let buttonAction = null;
  let buttonDisabled = false;

  switch (latestAction) {
    case "started":
    case "resumed":
      buttonLabel = "Take Break";
      buttonAction = handlePause;
      break;
    case "paused":
      buttonLabel = "Finish Break";
      buttonAction = handleResume;
      break;
    case "completed":
      buttonLabel = "Task Completed";
      buttonDisabled = true;
      break;
    default:
      buttonLabel = "Start Task";
  }

  const handleUpdateField = (field, value) => {
    setSubTaskData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSubTask = async () => {
    try {
      setIsLoading(true)
      const payload = {
        ...subTaskData,
        ...(subTaskData.startDate ? { startDate: subTaskData.startDate } : {}),
        ...(subTaskData.dueDate ? { dueDate: subTaskData.dueDate } : {})
      };
      if (role === 'manager') {
        const data = await ApiServices.updateManagerSubTaskById(params.id, payload);
        // alert(data.SuccessMessage);
        alert("checkpoint updated successfully")
      } else {
        const data = await ApiServices.updateEmployeeSubTaskById(params.id, payload);
       // alert(data.SuccessMessage);
          alert("checkpoint updated successfully")
      }
      fetchSubTask();
    } catch (error) {
      alert(error.message);
    }
    finally{
      setIsLoading(false)
    }
  };

  const handleDeleteSubTask = async () => {
    try {
      const data = await ApiServices.deleteSubTaskById(params.id);
      alert(data.SuccessMessage);
      navigate(-1);
    } catch (error) {
      alert(error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'todo': return 'bg-red-100 text-red-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusOptions = () => {
    if (role === "manager") {
      return ["todo", "in-progress", "review", "completed"];
    } else {
      return ["todo", "in-progress", "ready-for-review"];
    }
  };

  if (SubTaskLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-5">
        <div className="w-10 h-10 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p>Loading subtask details...</p>
      </div>
    );
  }

  if (SubTaskError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 text-red-600">
        <h3 className="text-xl font-semibold">Error loading subtask</h3>
        <p>{SubTaskError}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 max-w-7xl mx-5 my-5 ">
      {/* LEFT CONTENT */}
      <div className="flex-1 max-w-4xl p-8 bg-white rounded-r-xl shadow-sm overflow-y-auto">
        <div className="text-sm text-gray-500 font-medium mb-6">
          Team Space / Projects / {subTaskData.task?.project || 'Project'} / {subTaskData.task?.title || 'Task'} / Subtasks
        </div>

        <div className="w-full flex justify-between items-center mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              Subtask
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono">
              {subTaskData._id?.slice(-8) || '86et84ncr'}
            </span>
            <button 
              onClick={() => navigate(-1)} 
              className="bg-gradient-to-r from-purple-500 to-blue-500 border-none px-4 py-2 rounded-xl cursor-pointer text-sm text-white font-semibold flex items-center gap-1 transition-all hover:-translate-y-0.5 shadow-lg shadow-purple-200"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {user.role !== "manager" && (
              <button 
                disabled={buttonDisabled}
                onClick={buttonAction} 
                className="bg-gradient-to-r from-purple-500 to-blue-500 border-none px-4 py-2 rounded-xl cursor-pointer text-sm text-white font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buttonLabel}
              </button>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 my-5">
          {subTaskData.title || "Subtask Title"}
        </h1>
        
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 my-6">
          <div className="flex justify-between items-center mb-3 font-semibold">
            <span>Progress: {subTaskData.progress || 0}%</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusBadgeClass(subTaskData.status)}`}>
              {subTaskData.status?.toUpperCase() || 'TODO'}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
              style={{ width: `${subTaskData.progress || 0}%` }}
            ></div>
          </div>
        </div>

        <p className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl text-sm text-gray-500 border-l-4 border-purple-500 my-6">
          ✨ Ask Brain to write a description, generate similar subtasks or find similar tasks
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <EditableField 
            label="Status" 
            value={(role === 'employee' && subTaskData.status === 'review') ? "ready-for-review" : subTaskData.status} 
            placeholder="Select status"
            name="status"
            type="select"
            options={getStatusOptions()}
            onUpdate={handleUpdateField}
          />
          
          <AssigneesSelector
            allUsers={team || []}
            taskData={subTaskData}
            setTaskData={setSubTaskData}
          />

          <EditableField 
            label="Start Date" 
            value={subTaskData.startDate} 
            placeholder="Set start date"
            name="startDate"
            type="date"
            onUpdate={handleUpdateField}
            disabled={user.role === "manager" ? false : true}
          />
          
          <EditableField 
            label="Due Date" 
            value={subTaskData.dueDate} 
            placeholder="Set due date"
            name="dueDate"
            type="date"
            onUpdate={handleUpdateField}
            disabled={user.role === "manager" ? false : true}
          />
          
          <EditableField 
            label="Priority" 
            value={subTaskData.priority} 
            placeholder="Select priority"
            name="priority"
            type="select"
            options={["Low", "Medium", "High", "Critical"]}
            onUpdate={handleUpdateField}
          />
        </div>

    <div className="my-8 p-6 bg-white border border-gray-200 rounded-xl">
  <div className="flex flex-col gap-2">
    <span className="text-sm font-semibold text-gray-700">Description</span>

    {!subTaskData.isEditingDescription ? (
      <div
        className="p-4 rounded-lg  min-h-24 leading-relaxed prose max-w-none  cursor-pointer"
        onClick={() =>
          setSubTaskData((prev) => ({ ...prev, isEditingDescription: true }))
        }
        dangerouslySetInnerHTML={{
          __html: subTaskData.description || "Click to add a description...",
        }}
      />
    ) : (
      <ReactQuill
        theme="snow"
        value={subTaskData.description || ""}
        onChange={(value) => handleUpdateField("description", value)}
        className="min-h-40 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-3 focus:ring-purple-100"
      />
    )}

    {subTaskData.isEditingDescription && (
      <div className="flex gap-3 mt-3">
        <button
          onClick={() => {
            setSubTaskData((prev) => ({
              ...prev,
              isEditingDescription: false,
            }));
          }}
          className="bg-green-600 text-white border-none px-4 py-2 rounded-lg cursor-pointer font-semibold transition-all hover:bg-green-700 hover:-translate-y-0.5"
        >
          Save
        </button>
        <button
          onClick={() =>
            setSubTaskData((prev) => ({
              ...prev,
              isEditingDescription: false,
              description: subTaskData.description, // reset to original
            }))
          }
          className="bg-gray-100 text-gray-600 border border-gray-300 px-4 py-2 rounded-lg cursor-pointer font-semibold transition-all hover:bg-gray-200 hover:-translate-y-0.5"
        >
          Cancel
        </button>
      </div>
    )}
  </div>
</div>

        <div className="flex gap-0 mt-10 border-b-2 border-gray-200 bg-white rounded-t-xl px-6">
          <button 
            className={`px-6 py-4 border-none text-base cursor-pointer font-semibold transition-all relative ${activeTab === "details" ? "text-purple-600" : "text-gray-500"} hover:text-purple-600`}
            onClick={() => setActiveTab("details")}
          >
            Details
            {activeTab === "details" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded"></div>
            )}
          </button>
          <button 
            className={`px-6 py-4 border-none text-base cursor-pointer font-semibold transition-all relative ${activeTab === "attachments" ? "text-purple-600" : "text-gray-500"} hover:text-purple-600`}
            onClick={() => setActiveTab("attachments")}
          >
            Attachments ({subTaskData.attachments?.length || 0})
            {activeTab === "attachments" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded"></div>
            )}
          </button>
        </div>

        <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl p-6 min-h-48">
          {activeTab === "details" && (
            <div className="py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Created by</span>
                  <UserAvatar user={subTaskData.createdBy} />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Parent Task</span>
                  <span>{subTaskData.task?.title || "No parent task"}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Created</span>
                  <span>{formatDate(subTaskData.createdAt)}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Updated</span>
                  <span>{formatDate(subTaskData.updatedAt)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attachments" && (
            <div className="py-5">
              {subTaskData.attachments?.length > 0 ? (
                <div className="space-y-3">
                  {subTaskData.attachments.map((attachment) => (
                    <div key={attachment._id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="text-lg">📎</div>
                      <div className="flex-1">
                        <div className="font-medium">{attachment.filename}</div>
                        <div className="text-sm text-gray-500">{new Date(attachment.uploadedAt).toLocaleDateString()}</div>
                      </div>
                      <button className="text-purple-600 font-medium">Download</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No attachments yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="flex-none w-96 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
  <h3 className="text-lg font-bold text-gray-900 mb-6">Comments</h3>

  {comments?.length > 0 ? (
    <div className="space-y-4 mb-8">
      {comments.map((comment) => (
        <div key={comment._id} className="flex gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <img
            src={comment.createdBy?.avatarUrl}
            alt={comment.createdBy?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm">
              <strong>{comment.createdBy?.name}</strong> {comment.content}
            </p>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-400 text-sm mb-6">No comments yet</p>
  )}

  {/* Existing Activity Section */}
   <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Activity</h3>
          <div className="space-y-5">
            <div className="flex gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex-shrink-0">
                <img 
                  src={subTaskData.createdBy?.avatarUrl} 
                  alt={subTaskData.createdBy?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-1">
                  <strong>{subTaskData.createdBy?.name}</strong> created this subtask
                </p>
                <span className="text-xs text-gray-500">
                  {formatDate(subTaskData.createdAt)} at {new Date(subTaskData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            
            {subTaskData.assignees?.map((assignee, index) => (
              <div key={assignee._id} className="flex gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex-shrink-0">
                  <img 
                    src={assignee.user?.avatarUrl} 
                    alt={assignee.user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">
                    <strong>{subTaskData.createdBy?.name}</strong> assigned <strong>{assignee.user?.name}</strong> to this subtask
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDate(subTaskData.updatedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

 
</div>

       
        <div className="p-6 border-t border-gray-200">
          <div className="flex flex-col gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="p-3 border-2 border-gray-200 rounded-lg text-sm font-inherit resize-vertical min-h-20 focus:border-purple-500 focus:ring-3 focus:ring-purple-100 outline-none"
              rows="3"
            />
            <button 
            onClick={handleAddComment}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none px-5 py-3 rounded-lg cursor-pointer font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed self-end"
              disabled={!newComment.trim()}
            >
              <span>📤</span>
              Send
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex flex-col gap-3">
          <button disabled={IsLoading?true:false} onClick={handleSaveSubTask} className={`bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 border-none rounded-lg cursor-pointer font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-green-200 ${IsLoading&&'cursor-not-allowed '}`}>
         {IsLoading?"Saving Changes...":"Save Changes"}   
          </button>
          <button onClick={handleDeleteSubTask} className="bg-red-50 text-red-600 border border-red-200 px-5 py-3 rounded-lg cursor-pointer font-semibold text-sm transition-all hover:bg-red-100 hover:border-red-300">
            Delete Subtask
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubTaskDetailPage;