import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart
} from "recharts";
import { 
  Calendar, Users, FileText, Target, Clock, TrendingUp, 
  AlertCircle, CheckCircle, Pause, PlayCircle, Archive,
  Eye, EyeOff, RefreshCw, Download, Share2, Filter, Flag
} from "lucide-react";
import { useParams } from "react-router-dom";
import ApiServices from "../ApiService/ApiService";
import "./MilestoneAnalytics.css";

const COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981", 
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  indigo: "#6366f1",
  pink: "#ec4899",
  teal: "#14b8a6"
};

const STATUS_COLORS = {
  "Completed": COLORS.secondary,
  "In Progress": COLORS.primary,
  "Todo": COLORS.warning,
  "Review": COLORS.danger
};
// Mock API service for demo
const ApiService = {
  fetchMilestoneById: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      _id: "milestone1",
      title: "User Authentication System",
      description: "Implement secure user login, registration and authentication flow with JWT tokens and social login integration.",
      startDate: "2025-07-01T00:00:00Z",
      dueDate: "2025-07-15T00:00:00Z",
      priority: "High",
      status: "in-progress",
      numberOfSubtasks: 8,
      numberOfAssignees: 3,
      completedSubtasks: 5,
      milestoneProgress: 62.5,
      subtaskStatusBreakdown: [
        { status: "Completed", count: 5 },
        { status: "In Progress", count: 2 },
        { status: "Review", count: 0 },
        { status: "Todo", count: 1 }
      ],
      progressHistory: [
        { day: "Day 1", planned: 7, actual: 5 },
        { day: "Day 2", planned: 14, actual: 12 },
        { day: "Day 3", planned: 21, actual: 18 },
        { day: "Day 4", planned: 29, actual: 25 },
        { day: "Day 5", planned: 36, actual: 31 },
        { day: "Day 6", planned: 43, actual: 38 },
        { day: "Day 7", planned: 50, actual: 45 },
        { day: "Day 8", planned: 57, actual: 50 },
        { day: "Day 9", planned: 64, actual: 56 },
        { day: "Day 10", planned: 71, actual: 62.5 }
      ],
      assigneeDetails: [
        {
          _id: "user1",
          name: "Alex Johnson",
          email: "alex.johnson@skilltern.com",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        {
          _id: "user2",
          name: "Maria Garcia",
          email: "maria.garcia@skilltern.com",
          avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop&crop=face"
        },
        {
          _id: "user3",
          name: "David Kim",
          email: "david.kim@skilltern.com",
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
        }
      ],
      subTaskDetails: [
        {
          _id: "subtask1",
          title: "JWT Authentication Setup",
          status: "completed",
          progress: 100,
          startDate: "2025-07-01T00:00:00Z",
          dueDate: "2025-07-03T00:00:00Z",
          assignees: [{ user: "user1", status: "completed" }]
        },
        {
          _id: "subtask2",
          title: "User Registration Flow",
          status: "completed",
          progress: 100,
          startDate: "2025-07-02T00:00:00Z",
          dueDate: "2025-07-04T00:00:00Z",
          assignees: [{ user: "user2", status: "completed" }]
        },
        {
          _id: "subtask3",
          title: "Login & Session Management",
          status: "completed",
          progress: 100,
          startDate: "2025-07-03T00:00:00Z",
          dueDate: "2025-07-05T00:00:00Z",
          assignees: [{ user: "user1", status: "completed" }]
        },
        {
          _id: "subtask4",
          title: "Password Reset Functionality",
          status: "completed",
          progress: 100,
          startDate: "2025-07-04T00:00:00Z",
          dueDate: "2025-07-06T00:00:00Z",
          assignees: [{ user: "user3", status: "completed" }]
        },
        {
          _id: "subtask5",
          title: "Social Login Integration",
          status: "completed",
          progress: 100,
          startDate: "2025-07-05T00:00:00Z",
          dueDate: "2025-07-08T00:00:00Z",
          assignees: [{ user: "user2", status: "completed" }]
        },
        {
          _id: "subtask6",
          title: "Two-Factor Authentication",
          status: "in-progress",
          progress: 70,
          startDate: "2025-07-08T00:00:00Z",
          dueDate: "2025-07-12T00:00:00Z",
          assignees: [{ user: "user3", status: "in-progress" }]
        },
        {
          _id: "subtask7",
          title: "Security Audit & Testing",
          status: "in-progress",
          progress: 40,
          startDate: "2025-07-10T00:00:00Z",
          dueDate: "2025-07-14T00:00:00Z",
          assignees: [{ user: "user1", status: "in-progress" }]
        },
        {
          _id: "subtask8",
          title: "Documentation",
          status: "todo",
          progress: 0,
          startDate: "2025-07-12T00:00:00Z",
          dueDate: "2025-07-15T00:00:00Z",
          assignees: [{ user: "user2", status: "todo" }]
        }
      ]
    };
  }
};

function MilestoneAnalytics() {
  const params = useParams();
  const [report, setReport] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState({});
  const [chartAnimations, setChartAnimations] = useState(true);

  const fetchMilestoneById = async () => {
    try {
      setLoading(true);
      const data = await ApiServices.getTaskReportById(params.id);
      console.log(data);
      
      setReport(data);
      setError(null);
    } catch (error) {
      console.error(error.message);
      setError(error.message || 'Failed to fetch milestone report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestoneById();
  }, [params.id]);

  const daysRemaining = useMemo(() => {
    if (!report.dueDate) return null;
    const end = new Date(report.dueDate);
    const now = new Date();
    const diffTime = end - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [report.dueDate]);

  const subtaskData = useMemo(() => 
    (report.subtaskStatusBreakdown || []).map(item => ({
      name: item.status,
      value: item.count,
      fill: STATUS_COLORS[item.status] || COLORS.primary,
      percentage: Math.round((item.count / (report.numberOfSubtasks || 1)) * 100)
    })), [report.subtaskStatusBreakdown, report.numberOfSubtasks]
  );

  const progressValue = Number(report.milestoneProgress || 0);

  const toggleDetails = (section) => {
    setShowDetails(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="tooltip-entry">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <RefreshCw className="loading-spinner" />
          <p className="loading-text">Loading milestone report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <AlertCircle className="error-icon" />
          <h3 className="error-title">Error Loading Report</h3>
          <p className="error-message">{error}</p>
          <button 
            onClick={fetchMilestoneById}
            className="error-retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="milestone-report-container">
      {/* Header */}
      <div className="report-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="head-title">Milestone Dashboard</h1>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setChartAnimations(!chartAnimations)}
              className="action-btn"
              title={chartAnimations ? "Disable animations" : "Enable animations"}
            >
              {chartAnimations ? <Eye className="action-icon" /> : <EyeOff className="action-icon" />}
            </button>
            <button className="action-btn">
              <Download className="action-icon" />
            </button>
            <button className="action-btn">
              <Share2 className="action-icon" />
            </button>
            <button 
              onClick={fetchMilestoneById}
              className="action-btn"
            >
              <RefreshCw className={`action-icon ${loading ? 'spinning' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="report-content">
        {/* Milestone Header Card */}
        <div className="milestone-header-card">
          <div className="milestone-header-main">
            <div className="milestone-info">
              <div className="milestone-title-row">
                <h2 className="milestone-title">{report.title}</h2>
                <span className={`milestone-status-badge status-${(report.status || 'todo').toLowerCase()}`}>
                  {getStatusIcon(report.status)}
                  <span className="status-text">{report.status}</span>
                </span>
              </div>
              <p className="milestone-description">{report.description || "No description provided."}</p>
              
              {daysRemaining !== null && (
                <div className={`days-remaining ${
                  daysRemaining > 7 ? 'days-safe' :
                  daysRemaining > 0 ? 'days-warning' :
                  'days-danger'
                }`}>
                  <Clock className="days-icon" />
                  <span>
                    {daysRemaining > 0 ? `${daysRemaining} days remaining` :
                     daysRemaining === 0 ? 'Due today' : 
                     `${Math.abs(daysRemaining)} days overdue`}
                  </span>
                </div>
              )}
            </div>
            
            {/* Progress Ring */}
            <div className="progress-ring-container">
              <svg className="progress-ring" viewBox="0 0 36 36">
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray={`${progressValue}, 100`}
                  className="progress-path"
                />
              </svg>
              <div className="progress-text">
                <span className="progress-percentage">{Math.round(progressValue)}%</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card stat-blue">
              <div className="stat-icon">
                <Calendar className="icon" />
              </div>
              <p className="stat-label">Start Date</p>
              <p className="st-value">{formatDate(report.startDate)}</p>
            </div>
            <div className="stat-card stat-red">
              <div className="stat-icon">
                <Calendar className="icon" />
              </div>
              <p className="stat-label">Due Date</p>
              <p className="st-value">{formatDate(report.dueDate)}</p>
            </div>
            <div className="stat-card stat-orange">
              <div className="stat-icon">
                <Target className="icon" />
              </div>
              <p className="stat-label">Priority</p>
              <p className="st-value">{report.priority}</p>
            </div>
            <div className="stat-card stat-green">
              <div className="stat-icon">
                <Flag className="icon" />
              </div>
              <p className="stat-label">Subtasks</p>
              <p className="st-value">{report.numberOfSubtasks || 0}</p>
            </div>
            <div className="stat-card stat-purple">
              <div className="stat-icon">
                <CheckCircle className="icon" />
              </div>
              <p className="stat-label">Completed</p>
              <p className="st-value">{report.completedSubtasks || 0}</p>
            </div>
            <div className="stat-card stat-indigo">
              <div className="stat-icon">
                <Users className="icon" />
              </div>
              <p className="stat-label">Assignees</p>
              <p className="st-value">{report.numberOfAssignees || 0}</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Subtask Status Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Subtask Status Distribution</h3>
              <button
                onClick={() => toggleDetails('subtasks')}
                className="details-toggle"
              >
                {showDetails.subtasks ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subtaskData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    animationBegin={0}
                    animationDuration={chartAnimations ? 800 : 0}
                  >
                    {subtaskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>
                        {value} ({entry.payload?.percentage}%)
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {showDetails.subtasks && (
              <div className="subtask-details">
                {subtaskData.map((item, index) => (
                  <div key={index} className="subtask-detail-item">
                    <div className="subtask-detail-left">
                      <div className="subtask-color-dot" style={{ backgroundColor: item.fill }}></div>
                      <span className="subtask-name">{item.name}</span>
                    </div>
                    <span className="subtask-count">{item.value} tasks ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress History Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Progress Timeline - Actual vs Planned</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report.progressHistory || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name === 'actual' ? 'Actual Progress' : 'Planned Progress']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend 
                    formatter={(value) => value === 'actual' ? 'Actual Progress' : 'Planned Progress'}
                  />
                  <Line
                    type="monotone"
                    dataKey="planned"
                    stroke="#8884d8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="planned"
                    dot={{ r: 4 }}
                    animationDuration={chartAnimations ? 1000 : 0}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#82ca9d"
                    strokeWidth={3}
                    name="actual"
                    dot={{ r: 5 }}
                    animationDuration={chartAnimations ? 1000 : 0}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Subtask List */}
        <div className="chart-card">
          <h3 className="chart-title">Subtasks</h3>
          <div className="subtask-list">
            {report.subTaskDetails && report.subTaskDetails.length > 0 ? (
              report.subTaskDetails.map((subtask, index) => (
                <div key={index} className="subtask-item">
                  <div className="subtask-info">
                    <h4 className="subtask-title">{subtask.title}</h4>
                    <div className="subtask-meta">
                      <span className={`subtask-status status-${subtask.status}`}>
                        {subtask.status}
                      </span>
                      <span className="subtask-progress">{subtask.progress}% complete</span>
                      <span className="subtask-dates">
                        {formatDate(subtask.startDate)} - {formatDate(subtask.dueDate)}
                      </span>
                    </div>
                  </div>
                  <div className="subtask-progress-bar">
                    <div 
                      className="subtask-progress-fill"
                      style={{ width: `${subtask.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-subtasks">
                <p>No subtasks found for this milestone.</p>
              </div>
            )}
          </div>
        </div>

        {/* Assignees List */}
        <div className="chart-card">
          <h3 className="chart-title">Assignees</h3>
          <div className="assignee-list">
            {report.assigneeDetails && report.assigneeDetails.length > 0 ? (
              report.assigneeDetails.map((assignee, index) => (
                <div key={index} className="assignee-item">
                  <div className="assignee-avatar">
                    {assignee.avatar ? (
                      <img src={assignee.avatar} alt={assignee.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {assignee.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="assignee-info">
                    <h4 className="assignee-name">{assignee.name}</h4>
                    <p className="assignee-email">{assignee.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-assignees">
                <p>No assignees found for this milestone.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function getStatusIcon(status) {
  switch (status?.toLowerCase()) {
    case 'completed': return <CheckCircle className="status-icon" />;
    case 'in-progress': return <PlayCircle className="status-icon" />;
    case 'review': return <Eye className="status-icon" />;
    case 'todo': return <AlertCircle className="status-icon" />;
    default: return <AlertCircle className="status-icon" />;
  }
}

export default MilestoneAnalytics