import { Calendar, CheckCircle2, Circle, Clock, Eye, MoreHorizontal, Paperclip } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const TaskCard = ({ task, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

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
      case 'completed': return <CheckCircle2 size={14} className="text-green-500" />;
      case 'in-progress': return <Clock size={14} className="text-yellow-500" />;
      case 'review': return <Clock size={14} className="text-yellow-500" />;
      default: return <Circle size={14} className="text-gray-400" />;
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
      className={`relative bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 cursor-pointer animate-fadeInUp overflow-hidden
        ${isHovered ? 'bg-gradient-to-br from-gray-50 to-gray-100' : ''}
        hover:-translate-y-1 hover:shadow-xl hover:border-blue-200`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Priority Line */}
      <div 
        className="absolute top-0 left-0 w-1 h-full rounded-l"
        style={{ backgroundColor: getPriorityColor(task.priority) }}
      ></div>
       
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="task-status">{getStatusIcon(task.status)}</div>
        <div className={`transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={() => navigate(`/dashboard/subTask/${task._id}`)} 
            className="w-7 h-7 border-none bg-transparent rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>
      
      {/* Title & Description */}
      <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">{task.title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
        {task.description}
      </p>
      
      {/* Footer: Dates & Attachments */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-500 text-xs font-medium">
            <Calendar size={12} />
            <span>{formatDate(task.startDate)} - {formatDate(task.dueDate)}</span>
          </div>
          <div className="flex gap-3">
            {task.attachments?.length > 0 && (
              <div className="flex items-center gap-1 text-gray-500 text-xs font-medium">
                <Paperclip size={12} />
                <span>{task.attachments.length}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Assignees */}
        <div className="flex items-center">
          {assignees.slice(0, 3).map((avatar, idx) => (
            avatar.avatar ? (
              <img
                key={idx}
                src={avatar.avatar}
                alt={avatar.name}
                className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
                style={{ 
                  zIndex: assignees.length - idx,
                  marginLeft: idx > 0 ? '-0.5rem' : '0'
                }}
                title={avatar.name}
              />
            ) : (
              <div
                key={idx}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-white shadow-sm"
                style={{ 
                  backgroundColor: avatar.color,
                  zIndex: assignees.length - idx,
                  marginLeft: idx > 0 ? '-0.5rem' : '0'
                }}
                title={avatar.name}
              >
                {avatar.initials}
              </div>
            )
          ))}
          {assignees.length > 3 && (
            <div 
              className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-semibold border-2 border-white shadow-sm"
              style={{ marginLeft: '-0.5rem' }}
            >
              +{assignees.length - 3}
            </div>
          )}
        </div>
      </div>
      
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${task.progress || 0}%` }}
          ></div>
        </div>
        <span className="text-xs font-semibold text-gray-600 min-w-8">
          {task.progress || 0}%
        </span>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TaskCard;