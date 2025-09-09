import { Calendar, CheckCircle2, Circle, Clock, Eye, MoreHorizontal, Paperclip } from "lucide-react";
import './TaskCard.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const TaskCard = ({ task, index }) => {
  const [isHovered, setIsHovered] = useState(false);
const navigate=useNavigate()
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} className="status-completed" />;
      case 'in-progress': return <Clock size={14} className="status-progress" />;
      case 'review': return <Clock size={14} className="status-review" />;
      default: return <Circle size={14} className="status-todo" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // ✅ Now using populated user data from assignees
  const assignees = (task.assignees || []).map((a, idx) => {
    const user = a.user || {};
    return {
      initials: user.name ? user.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "US",
      name: user.name || `User ${idx + 1}`,
      avatar: user.avatarUrl || null,
      color: "#3b82f6"
    };
  });

  return (
    <div 
      className={`task-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ '--delay': `${index * 0.1}s` }}
    >
      {/* Priority Line */}
      <div className="task-priority" style={{ backgroundColor: getPriorityColor(task.priority) }}></div>
       
      {/* Header */}
      <div className="task-header">
        <div className="task-status">{getStatusIcon(task.status)}</div>
        <div className="task-actions">
           <button onClick={()=>navigate(`/dashboard/subTask/${task._id}`)} className="task-action-btn">
            <Eye size={18} />
          </button>
        </div>
      </div>
      
      {/* Title & Description */}
      <h4 className="t-title">{task.title}</h4>
      <p className="task-description">{task.description}</p>
      
      {/* Footer: Dates & Attachments */}
      <div className="task-footer">
        <div className="task-meta">
          <div className="task-duration">
            <Calendar size={12} />
            <span>{formatDate(task.startDate)} - {formatDate(task.dueDate)}</span>
          </div>
          <div className="task-stats">
            {task.attachments?.length > 0 && (
              <div className="stat-item">
                <Paperclip size={12} />
                <span>{task.attachments.length}</span>
              </div>
            )}
            
          </div>
            {/* agar comments ka feature baad me add karna ho to yahan rakh lena */}
            {/* {task.comments?.length > 0 && (
              <div className="stat-item">
                <MessageSquare size={12} />
                <span>{task.comments.length}</span>
              </div>
            )} */}
        </div>
        
        {/* Assignees */}
        <div className="task-assignees">
          {assignees.slice(0, 3).map((avatar, idx) => (
            avatar.avatar ? (
              <img
                key={idx}
                src={avatar.avatar}
                alt={avatar.name}
                className="avatar-img"
                style={{ zIndex: assignees.length - idx }}
                title={avatar.name}
              />
            ) : (
              <div
                key={idx}
                className="avatar"
                style={{ 
                  backgroundColor: avatar.color,
                  zIndex: assignees.length - idx
                }}
                title={avatar.name}
              >
                {avatar.initials}
              </div>
            )
          ))}
          {assignees.length > 3 && (
            <div className="avatar-more">
              +{assignees.length - 3}
            </div>
          )}
        </div>
      </div>
      
      {/* Progress */}
      <div className="task-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${task.progress || 0}%` }}
          ></div>
        </div>
        <span className="prog-text">{task.progress || 0}%</span>
      </div>
    </div>
  );
};

export default TaskCard;



