"use client"

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import ApiServices from "../../ApiService/ApiService"
import { fetchSubTaskById } from "../../Slices/SubTaskSlice"
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Send,
  Trash2,
  Save,
  Calendar,
  Flag,
  Pause,
  Play,
} from "lucide-react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const AssigneesSelector = ({ allUsers, taskData, setTaskData }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [search, setSearch] = useState("")
  const { user } = useSelector((state) => state.User)

  const filteredUsers = allUsers.filter(
    (u) =>
      u.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      u.user?.email.toLowerCase().includes(search.toLowerCase()),
  )

  const toggleAssignee = (user) => {
    const exists = taskData.assignees.find((a) => a.user?._id === user?._id)
    if (exists) {
      setTaskData({
        ...taskData,
        assignees: taskData.assignees.filter((a) => a.user?._id !== user?._id),
      })
    } else {
      setTaskData({
        ...taskData,
        assignees: [...taskData.assignees, { user, status: "todo" }],
      })
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-900">Team Members</label>
      <div className="flex flex-wrap items-center gap-2 p-4 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl min-h-14">
        {taskData.assignees?.length > 0 ? (
          taskData.assignees.map((assignee) => (
            <div
              key={assignee._id}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={assignee?.user?.avatarUrl || "/placeholder.svg"}
                alt={assignee?.user?.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700">{assignee?.user?.name}</span>
              <button
                className="ml-1 border-none bg-transparent cursor-pointer text-gray-400 hover:text-red-500 text-lg transition-colors"
                onClick={() => toggleAssignee(assignee?.user)}
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-400 italic text-sm">No assignees selected</span>
        )}

        {user.role === "manager" && (
          <button
            className="bg-white border border-dashed border-slate-300 text-slate-600 px-3 py-2 rounded-full cursor-pointer text-sm font-semibold transition-all hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            + Add Member
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="mt-2 border border-slate-300 rounded-xl bg-white p-3 max-h-56 overflow-y-auto shadow-lg z-10">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-3 p-3 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
          />

          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isChecked = !!taskData.assignees.find((a) => a.user._id === user.user._id)
              return (
                <div
                  key={user?.user?._id}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-100 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAssignee(user?.user)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <img
                    src={user?.user?.avatarUrl || "/placeholder.svg"}
                    alt={user?.user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{user?.user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.user?.email}</div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No users found</p>
          )}
        </div>
      )}
    </div>
  )
}

const EditableField = ({
  label,
  value,
  placeholder,
  name,
  type = "text",
  options = [],
  onUpdate,
  disabled,
  icon: Icon,
}) => {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(value || "")

  useEffect(() => {
    setText(value || "")
  }, [value])

  const handleSave = () => {
    setEditing(false)
    onUpdate(name, text)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && type !== "select") handleSave()
    if (e.key === "Escape") {
      setText(value || "")
      setEditing(false)
    }
  }

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200"
      case "Critical":
        return "text-red-700 bg-red-100 border-red-300 font-semibold"
      case "Medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "Low":
        return "text-emerald-600 bg-emerald-50 border-emerald-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  if (type === "select") {
    return (
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          {Icon && <Icon size={16} />}
          {label}
        </label>
        {editing ? (
          <select
            className="p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm font-medium"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            autoFocus
            name={name}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <span
            className={`p-3 border rounded-lg min-h-11 flex items-center cursor-pointer transition-all hover:shadow-md font-medium ${!text ? "text-gray-400 italic" : ""} ${getPriorityClasses(text)}`}
            onClick={() => setEditing(true)}
          >
            {text || placeholder}
          </span>
        )}
      </div>
    )
  }

  if (type === "date") {
    return (
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          {Icon && <Icon size={16} />}
          {label}
        </label>
        {editing ? (
          <input
            className="p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm font-medium"
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
            className={`p-3 border rounded-lg min-h-11 flex items-center cursor-pointer transition-all hover:shadow-md font-medium border-slate-200 bg-white ${!text ? "text-gray-400 italic" : "text-gray-900"}`}
            onClick={() => !disabled && setEditing(true)}
          >
            {text
              ? new Date(text).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
              : placeholder}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        {Icon && <Icon size={16} />}
        {label}
      </label>
      {editing ? (
        <input
          className="p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm font-medium"
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
          className={`p-3 border rounded-lg min-h-11 flex items-center cursor-pointer transition-all hover:shadow-md font-medium border-slate-200 bg-white ${!text ? "text-gray-400 italic" : "text-gray-900"}`}
          onClick={() => setEditing(true)}
        >
          {text || placeholder}
        </span>
      )}
    </div>
  )
}

const UserAvatar = ({ user }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-full shadow-sm">
    <img
      src={
        user?.avatarUrl ||
        "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png" ||
        "/placeholder.svg"
      }
      alt={user?.name || "User"}
      className="w-6 h-6 rounded-full object-cover"
    />
    <span className="text-sm font-medium text-gray-700">{user?.name || "Unassigned"}</span>
  </div>
)

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "todo":
        return { bg: "bg-slate-100", text: "text-slate-700", icon: AlertCircle }
      case "in progress":
        return { bg: "bg-blue-100", text: "text-blue-700", icon: Clock }
      case "completed":
        return { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle2 }
      case "in-progress":
        return { bg: "bg-blue-100", text: "text-blue-700", icon: Clock }
      case "ready-for-review":
        return { bg: "bg-purple-100", text: "text-purple-700", icon: AlertCircle }
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", icon: AlertCircle }
    }
  }

  const config = getStatusConfig(status)
  const IconComponent = config.icon

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-xs uppercase tracking-wide ${config.bg} ${config.text}`}
    >
      <IconComponent size={14} />
      {status?.toUpperCase() || "TODO"}
    </div>
  )
}

const SubTaskDetailPage = () => {
  const [activeTab, setActiveTab] = useState("details")
  const [newComment, setNewComment] = useState("")
  const [subTaskData, setSubTaskData] = useState({})
  const descriptionRef = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()
  const { user } = useSelector((state) => state.User)
  const role = user.role
  const [IsLoading, setIsLoading] = useState(false)
  const { SubTaskDetails, SubTaskLoading, SubTaskError } = useSelector((state) => state.SubTask)
  const { taskDetails } = useSelector((state) => state.Task)
  const team = taskDetails.assignees
  const [comments, setComments] = useState([])

  const fetchComments = async () => {
    try {
      const response = await ApiServices.GetCommentsByTargetId({ type: "subtask", targetId: params.id })
      setComments(response?.comments || [])
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const commentAudioRef = useRef(null)

  useEffect(() => {
    try {
      commentAudioRef.current = new Audio("/sound/comment-sound.mp3")
      commentAudioRef.current.preload = "auto"
      commentAudioRef.current.volume = 0.5
    } catch (e) {
      console.warn("Failed to initialize comment sound:", e)
      commentAudioRef.current = null
    }
  }, [])

  const playCommentSound = async () => {
    const audio = commentAudioRef.current
    if (!audio) return
    try {
      await audio.play()
    } catch (e) {
      console.warn("Audio play failed:", e)
    }
  }

  const fetchSubTask = () => {
    dispatch(fetchSubTaskById(params.id))
      .unwrap()
      .then((data) => {
        setSubTaskData(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    fetchSubTask()
    fetchComments()
  }, [])

  const timeLogs = subTaskData.timeLogs || []
  const latestLog = timeLogs[timeLogs.length - 1]
  const latestAction = latestLog?.action

  const handleAddComment = async () => {
    try {
      const response = await ApiServices.PostComment({ type: "subtask", targetId: params.id, content: newComment })
      setNewComment("")
      playCommentSound()
      fetchComments()
    } catch (error) {
      alert(error.message)
    }
  }

  const handlePause = async () => {
    try {
      const response = await ApiServices.takeBreakForEmployee(params.id)
      alert(response.SuccessMessage)
      fetchSubTask()
    } catch (error) {
      console.log(error)
    }
  }

  const handleResume = async () => {
    try {
      const response = await ApiServices.FinishBreakForEmployee(params.id)
      alert(response.SuccessMessage)
      fetchSubTask()
    } catch (error) {
      alert(error.message || "Something went wrong")
    }
  }

  const isOnBreak = latestLog?.action === "paused"
  let buttonLabel = ""
  let buttonAction = null
  let buttonDisabled = false

  switch (latestAction) {
    case "started":
    case "resumed":
      buttonLabel = "Take Break"
      buttonAction = handlePause
      break
    case "paused":
      buttonLabel = "Finish Break"
      buttonAction = handleResume
      break
    case "completed":
      buttonLabel = "Task Completed"
      buttonDisabled = true
      break
    default:
      buttonLabel = "Start Task"
  }

  const handleUpdateField = (field, value) => {
    setSubTaskData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveSubTask = async () => {
    try {
      setIsLoading(true)
      const payload = {
        ...subTaskData,
        ...(subTaskData.startDate ? { startDate: subTaskData.startDate } : {}),
        ...(subTaskData.dueDate ? { dueDate: subTaskData.dueDate } : {}),
      }
      if (role === "manager") {
        const data = await ApiServices.updateManagerSubTaskById(params.id, payload)
        alert("Checkpoint updated successfully")
      } else {
        const data = await ApiServices.updateEmployeeSubTaskById(params.id, payload)
        alert("Checkpoint updated successfully")
      }
      fetchSubTask()
    } catch (error) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSubTask = async () => {
    if (window.confirm("Are you sure you want to delete this checkpoint?")) {
      try {
        const data = await ApiServices.deleteSubTaskById(params.id)
        alert(data.SuccessMessage)
        navigate(-1)
      } catch (error) {
        alert(error.message)
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusOptions = () => {
    if (role === "manager") {
      return ["todo", "in-progress", "review", "completed"]
    } else {
      return ["todo", "in-progress", "ready-for-review"]
    }
  }

  if (SubTaskLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-5 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading checkpoint details...</p>
      </div>
    )
  }

  if (SubTaskError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 text-red-600 bg-red-50">
        <AlertCircle size={48} />
        <h3 className="text-xl font-semibold">Error loading checkpoint</h3>
        <p className="text-red-500">{SubTaskError}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 text-gray-800">
      {/* LEFT CONTENT - MAIN SECTION */}
      <div className="flex-1 max-w-6xl p-8 overflow-y-auto">
        {/* BREADCRUMB */}
        <div className="text-xs text-gray-500 font-medium mb-8 bg-white px-4 py-3 rounded-lg border border-slate-200 inline-flex items-center gap-2">
          Team Space / Projects /{" "}
          <span className="font-semibold text-gray-700">{subTaskData.task?.project || "Project"}</span> /{" "}
          <span className="font-semibold text-gray-700">{subTaskData.task?.title || "Task"}</span> / Checkpoints
        </div>

        {/* TOP ACTION BAR */}
        <div className="flex justify-between items-center gap-6 mb-8 flex-wrap bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
              Checkpoint
            </span>
            <span className="text-xs text-gray-600 bg-slate-100 px-3 py-2 rounded-lg font-mono border border-slate-200">
              {subTaskData._id?.slice(-8) || "ID"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="bg-white border border-slate-300 hover:border-gray-400 px-4 py-2 rounded-lg cursor-pointer text-sm text-gray-700 font-semibold flex items-center gap-2 transition-all hover:shadow-md hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
        </div>

        {/* HEADER SECTION WITH TITLE */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{subTaskData.title || "Checkpoint Title"}</h1>
          <p className="text-gray-500 text-sm">Last updated {formatDate(subTaskData.updatedAt)}</p>
        </div>

        {user.role !== "manager" && (
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-full shadow-lg">
                  {isOnBreak ? <Play size={24} className="text-white" /> : <Pause size={24} className="text-white" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{isOnBreak ? "On Break" : "Work in Progress"}</h3>
                  <p className="text-sm text-gray-600">
                    {isOnBreak ? "Resume your work when ready" : "Take a break whenever you need"}
                  </p>
                </div>
              </div>
              <button
                disabled={buttonDisabled}
                onClick={buttonAction}
                className={`px-6 py-3 rounded-lg cursor-pointer text-sm text-white font-bold transition-all shadow-lg flex items-center gap-2 whitespace-nowrap ${
                  isOnBreak
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                    : "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                } ${buttonDisabled ? "opacity-50 cursor-not-allowed hover:shadow-none" : "hover:shadow-xl"}`}
              >
                {isOnBreak ? <Play size={18} /> : <Pause size={18} />}
                {buttonLabel}
              </button>
            </div>
          </div>
        )}

        {/* PROGRESS SECTION - SEPARATED CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-blue-600" />
              <span className="text-sm font-bold text-gray-900">Progress & Status</span>
              <span className="text-2xl font-bold text-gray-900">{subTaskData.progress || 0}%</span>
            </div>
            <StatusBadge status={subTaskData.status} />
          </div>
          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${subTaskData.progress || 0}%` }}
            ></div>
          </div>
        </div>

        {/* DETAILS SECTION - SEPARATED CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-200">
            <AlertCircle size={20} className="text-blue-600" />
            Checkpoint Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EditableField
              label="Status"
              value={role === "employee" && subTaskData.status === "review" ? "ready-for-review" : subTaskData.status}
              placeholder="Select status"
              name="status"
              type="select"
              options={getStatusOptions()}
              onUpdate={handleUpdateField}
              icon={AlertCircle}
            />

            <EditableField
              label="Priority"
              value={subTaskData.priority}
              placeholder="Select priority"
              name="priority"
              type="select"
              options={["Low", "Medium", "High", "Critical"]}
              onUpdate={handleUpdateField}
              icon={Flag}
            />

            <EditableField
              label="Start Date"
              value={subTaskData.startDate}
              placeholder="Set start date"
              name="startDate"
              type="date"
              onUpdate={handleUpdateField}
              disabled={user.role === "manager" ? false : true}
              icon={Calendar}
            />

            <EditableField
              label="Due Date"
              value={subTaskData.dueDate}
              placeholder="Set due date"
              name="dueDate"
              type="date"
              onUpdate={handleUpdateField}
              disabled={user.role === "manager" ? false : true}
              icon={Calendar}
            />
          </div>
        </div>

        {/* TEAM MEMBERS SECTION - SEPARATED CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-4 border-b border-slate-200">
            <span className="text-xl">👥</span>
            Team & Assignees
          </h2>
          <AssigneesSelector allUsers={team || []} taskData={subTaskData} setTaskData={setSubTaskData} />
        </div>

        {/* DESCRIPTION SECTION - SEPARATED CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-4 border-b border-slate-200">
            <span className="text-xl">📝</span>
            Description
          </h2>

          {!subTaskData.isEditingDescription ? (
            <div
              className="p-5 rounded-lg prose prose-sm max-w-none cursor-pointer hover:bg-slate-50 transition-colors border border-slate-200 min-h-32 bg-gradient-to-br from-slate-50 to-white"
              onClick={() => setSubTaskData((prev) => ({ ...prev, isEditingDescription: true }))}
              dangerouslySetInnerHTML={{
                __html: subTaskData.description || "<p class='text-gray-400 italic'>Click to add a description...</p>",
              }}
            />
          ) : (
            <ReactQuill
              theme="snow"
              value={subTaskData.description || ""}
              onChange={(value) => handleUpdateField("description", value)}
              className="border border-slate-300 rounded-lg overflow-hidden focus:ring-2 focus:ring-blue-100"
            />
          )}

          {subTaskData.isEditingDescription && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setSubTaskData((prev) => ({
                    ...prev,
                    isEditingDescription: false,
                  }))
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-none px-5 py-2 rounded-lg cursor-pointer font-semibold transition-all shadow-lg"
              >
                Save
              </button>
              <button
                onClick={() =>
                  setSubTaskData((prev) => ({
                    ...prev,
                    isEditingDescription: false,
                    description: subTaskData.description,
                  }))
                }
                className="bg-slate-100 hover:bg-slate-200 text-gray-700 border border-slate-300 px-5 py-2 rounded-lg cursor-pointer font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* DETAILS & ATTACHMENTS TABS SECTION - SEPARATED CARD */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="flex gap-0 border-b border-slate-200 px-6">
            <button
              className={`px-6 py-4 border-b-2 text-sm cursor-pointer font-semibold transition-all ${activeTab === "details" ? "border-b-blue-600 text-blue-600" : "border-b-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`px-6 py-4 border-b-2 text-sm cursor-pointer font-semibold transition-all ${activeTab === "attachments" ? "border-b-blue-600 text-blue-600" : "border-b-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("attachments")}
            >
              Attachments ({subTaskData.attachments?.length || 0})
            </button>
          </div>

          <div className="p-6 min-h-64">
            {activeTab === "details" && (
              <div className="py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Created By</span>
                    <UserAvatar user={subTaskData.createdBy} />
                  </div>
                  <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Parent Checkpoint</span>
                    <span className="text-sm font-medium text-gray-900">
                      {subTaskData.task?.title || "No parent checkpoint"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Created On</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(subTaskData.createdAt)}</span>
                  </div>
                  <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Last Updated</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(subTaskData.updatedAt)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "attachments" && (
              <div className="py-2">
                {subTaskData.attachments?.length > 0 ? (
                  <div className="space-y-3">
                    {subTaskData.attachments.map((attachment) => (
                      <div
                        key={attachment._id}
                        className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="text-2xl">📎</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{attachment.filename}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(attachment.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm whitespace-nowrap">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-12">No attachments yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR - COMMENTS & ACTIONS */}
      <div className="flex-none w-96 bg-white border-l border-slate-200 flex flex-col overflow-hidden shadow-lg">
        {/* COMMENTS SECTION */}
        <div className="flex-1 p-6 overflow-y-auto border-b border-slate-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <MessageCircle size={20} className="text-blue-600" />
            Comments
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </p>

          {comments?.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-sm transition-shadow"
                >
                  <img
                    src={comment.createdBy?.avatarUrl || "/placeholder.svg"}
                    alt={comment.createdBy?.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{comment.createdBy?.name}</p>
                    <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* ACTIVITY SECTION */}
        <div className="flex-1 p-6 overflow-y-auto border-b border-slate-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-slate-600" />
            Activity
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <img
                src={subTaskData.createdBy?.avatarUrl || "/placeholder.svg"}
                alt={subTaskData.createdBy?.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{subTaskData.createdBy?.name}</p>
                <p className="text-gray-600 text-xs mt-1">Created this checkpoint</p>
                <span className="text-xs text-gray-500 mt-2 block">{formatDate(subTaskData.createdAt)}</span>
              </div>
            </div>

            {subTaskData.assignees?.map((assignee, index) => (
              <div key={assignee._id} className="flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <img
                  src={assignee.user?.avatarUrl || "/placeholder.svg"}
                  alt={assignee.user?.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{subTaskData.createdBy?.name}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Assigned to <span className="font-medium">{assignee.user?.name}</span>
                  </p>
                  <span className="text-xs text-gray-500 mt-2 block">{formatDate(subTaskData.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ADD COMMENT SECTION */}
        <div className="p-6 border-t border-slate-200">
          <label className="text-sm font-semibold text-gray-900 block mb-3">Add Comment</label>
          <div className="flex flex-col gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="p-3 border border-slate-300 rounded-lg text-sm font-inherit resize-vertical min-h-24 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
              rows="3"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-600 hover:bg-blue-700 text-white border-none px-5 py-2 rounded-lg cursor-pointer font-semibold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newComment.trim()}
            >
              <Send size={16} />
              Send
            </button>
          </div>
        </div>

        {/* ACTION BUTTONS SECTION */}
        <div className="p-6 border-t border-slate-200 flex flex-col gap-3">
          <button
            disabled={IsLoading}
            onClick={handleSaveSubTask}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 border-none rounded-lg cursor-pointer font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {IsLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleDeleteSubTask}
            className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 px-5 py-3 rounded-lg cursor-pointer font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Delete Checkpoint
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubTaskDetailPage
