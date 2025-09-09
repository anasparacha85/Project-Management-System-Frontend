import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart
} from "recharts";
import { 
  Calendar, Users, FileText, Target, Clock, TrendingUp, 
  AlertCircle, CheckCircle, Pause, PlayCircle, Archive,
  Eye, EyeOff, RefreshCw, Download, Share2, Filter
} from "lucide-react";
import { useParams } from "react-router-dom";
import ApiServices from "../../ApiService/ApiService";
import "./ProjectReport.css";

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

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function calculateDaysRemaining(endDate) {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getStatusIcon(status) {
  switch (status?.toLowerCase()) {
    case 'completed': case 'complete': return <CheckCircle className="status-icon" />;
    case 'active': case 'in-progress': return <PlayCircle className="status-icon" />;
    case 'on-hold': case 'onhold': return <Pause className="status-icon" />;
    case 'archive': case 'archieve': return <Archive className="status-icon" />;
    default: return <AlertCircle className="status-icon" />;
  }
}
// Mock API service for demo
const ApiService = {
  fetchProjectById: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      name: "Website Redesign Project",
      description: "Complete overhaul of the company website with modern design, improved UX, and mobile responsiveness. This project aims to increase user engagement by 40% and improve conversion rates.",
      projectStatus: "active",
      startDate: "2024-01-15T00:00:00Z",
      endDate: "2024-06-30T00:00:00Z",
      priority: "High",
      numberOfFiles: 127,
      numberOfTasks: 45,
      numberOfTeamMembers: 8,
      numberOfUniqueAssignees: 6,
      averageProgress: 67.5,
      taskStatusBreakdown: [
        { status: "Completed", count: 22 },
        { status: "In Progress", count: 15 },
        { status: "Todo", count: 6 },
        { status: "On Hold", count: 2 }
      ],
      progressHistory: [
        { week: "Week 1", progress: 5 },
        { week: "Week 2", progress: 12 },
        { week: "Week 3", progress: 28 },
        { week: "Week 4", progress: 35 },
        { week: "Week 5", progress: 48 },
        { week: "Week 6", progress: 55 },
        { week: "Week 7", progress: 67.5 }
      ],
      budget: { allocated: 50000, spent: 33750 },
      milestones: [
        { name: "Design Phase", status: "completed", date: "2024-02-15" },
        { name: "Development Phase", status: "in-progress", date: "2024-04-30" },
        { name: "Testing Phase", status: "pending", date: "2024-06-15" },
        { name: "Launch", status: "pending", date: "2024-06-30" }
      ]
    };
  }
};

export default function ProjectReport() {
  const params = useParams();
  const [report, setReport] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [showDetails, setShowDetails] = useState({});
  const [chartAnimations, setChartAnimations] = useState(true);

  const fetchProjectById = async () => {
    try {
      setLoading(true);
      const data = await ApiServices.fetchProjectById(params.id);
      console.log(data);
      
      setReport(data);
      setError(null);
    } catch (error) {
      console.error(error.message);
      setError(error.message || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectById();
  }, []);
  useEffect(() => {
  if (report?.progressHistory) {
    let lastVal = 0;
    report.progressHistory.forEach(p => {
      if (p.actual === 0 && lastVal > 0) {
        p.actual = lastVal;
      } else {
        lastVal = p.actual;
      }
    });
  }
}, [report]);


  const daysRemaining = useMemo(() => 
    calculateDaysRemaining(report.endDate), [report.endDate]
  );

  const taskData = useMemo(() => 
    (report.taskStatusBreakdown || []).map(item => ({
      name: item.status,
      value: item.count,
      fill: STATUS_COLORS[item.status] || COLORS.primary,
      percentage: Math.round((item.count / (report.numberOfTasks || 1)) * 100)
    })), [report.taskStatusBreakdown, report.numberOfTasks]
  );

  const teamData = [
    { name: "Team Members", value: report.numberOfTeamMembers || 0, icon: Users },
    { name: "Active Assignees", value: report.numberOfUniqueAssignees || 0, icon: Target },
  ];

  const progressValue = Number(report.averageProgress || 0);

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
              {entry.name}: {entry.value} {entry.payload?.percentage && `(${entry.payload.percentage}%)`}
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
          <p className="loading-text">Loading project report...</p>
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
            onClick={fetchProjectById}
            className="error-retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-report-container">
      {/* Header */}
      <div className="report-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-nav">
              <h1 className="head-title" style={{"font-size":" 1.5rem",
  "fontWeight": 700,
  "color": "#111827",
  "margin": 0
}}>Project Dashboard</h1>
              <div className="nav-tabs">
                {['overview', 'analytics', 'team'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`nav-tab ${activeView === view ? 'nav-tab-active' : ''}`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>
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
              onClick={fetchProjectById}
              className="action-btn"
            >
              <RefreshCw className={`action-icon ${loading ? 'spinning' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="report-content">
        {/* Project Header Card */}
        <div className="project-header-card">
          <div className="project-header-main">
            <div className="project-info">
              <div className="project-title-row">
                <h2 className="project-title">{report.name}</h2>
                <span className={`project-status-badge status-${(report.projectStatus || 'draft').toLowerCase()}`}>
                  {getStatusIcon(report.projectStatus)}
                  <span className="status-text">{report.projectStatus}</span>
                </span>
              </div>
              <p className="project-description">{report.description || "No description provided."}</p>
              
              {daysRemaining !== null && (
                <div className={`days-remaining ${
                  daysRemaining > 30 ? 'days-safe' :
                  daysRemaining > 7 ? 'days-warning' :
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
              <p className="stat-label">End Date</p>
              <p className="st-value">{formatDate(report.endDate)}</p>
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
                <FileText className="icon" />
              </div>
              <p className="stat-label">Files</p>
              <p className="st-value">{report.numberOfFiles || 0}</p>
            </div>
            <div className="stat-card stat-purple">
              <div className="stat-icon">
                <Target className="icon" />
              </div>
              <p className="stat-label">Tasks</p>
              <p className="st-value">{report.numberOfTasks || 0}</p>
            </div>
            <div className="stat-card stat-indigo">
              <div className="stat-icon">
                <Users className="icon" />
              </div>
              <p className="stat-label">Team Size</p>
              <p className="st-value">{report.numberOfTeamMembers || 0}</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Task Status Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Task Status Distribution</h3>
              <button
                onClick={() => toggleDetails('tasks')}
                className="details-toggle"
              >
                {showDetails.tasks ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskData}
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
                    {taskData.map((entry, index) => (
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

            {showDetails.tasks && (
              <div className="task-details">
                {taskData.map((item, index) => (
                  <div key={index} className="task-detail-item">
                    <div className="task-detail-left">
                      <div className="task-color-dot" style={{ backgroundColor: item.fill }}></div>
                      <span className="task-name">{item.name}</span>
                    </div>
                    <span className="task-count">{item.value} tasks ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress History Chart */}
         {/* // Alternative: Area Chart implementation */}
<div className="chart-card">
    <h3 className="chart-title">Progress Timeline - Actual vs Planned</h3>
    <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={report.progressHistory || []}>
                <defs>
                    <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                    dataKey="week" 
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
                    labelFormatter={(label) => `Week: ${label}`}
                />
                <Legend 
                    formatter={(value) => value === 'actual' ? 'Actual Progress' : 'Planned Progress'}
                />
                <Area
                    type="monotone"
                    dataKey="planned"
                    stroke="#8884d8"
                    fill="url(#plannedGradient)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="planned"
                    animationDuration={chartAnimations ? 1000 : 0}
                />
                <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#82ca9d"
                    fill="url(#actualGradient)"
                    strokeWidth={3}
                    name="actual"
                    animationDuration={chartAnimations ? 1000 : 0}
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
</div>
        </div>

        {/* Team & Budget Overview */}
        <div className="bottom-grid">
          {/* Team Statistics */}
          <div className="chart-card">
            <h3 className="chart-title">Team Overview</h3>
            <div className="chart-container team-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamData} margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    animationDuration={chartAnimations ? 600 : 0}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="team-utilization">
              <div className="utilization-row">
                <span className="utilization-label">Team Utilization</span>
                <span className="utilization-value">
                  {Math.round(((report.numberOfUniqueAssignees || 0) / (report.numberOfTeamMembers || 1)) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Budget Overview */}
          <div className="chart-card">
            <h3 className="chart-title">Budget Status</h3>
            {report.budget ? (
              <div className="budget-content">
                <div className="budget-row">
                  <span className="budget-label">Allocated Budget</span>
                  <span className="budget-allocated">
                    ${report.budget.toLocaleString()}
                  </span>
                </div>
                <div className="budget-row">
                  <span className="budget-label">Spent</span>
                  <span className="budget-spent">
                    ${report.budget.spent?.toLocaleString()}
                  </span>
                </div>
                <div className="budget-progress-bar">
                  <div 
                    className="budget-progress-fill"
                    style={{ 
                      width: `${Math.min((report.budget.spent / report.budget.allocated) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="budget-summary">
                  <span className="budget-used">
                    {Math.round((0 / report.budget) * 100)}% used
                  </span>
                  <span className="budget-remaining">
                    ${(report.budget - 0).toLocaleString()} remaining
                  </span>
                </div>
              </div>
            ) : (
              <div className="no-budget">
                <TrendingUp className="no-budget-icon" />
                <p>Budget information not available</p>
              </div>
            )}
            
            {/* Milestones */}
            {report.milestones && (
              <div className="milestones-section">
                <h4 className="milestones-title">Project Milestones</h4>
                <div className="milestones-list">
                  {report.milestones.map((milestone, index) => (
                    <div key={index} className={`milestone-item milestone-${milestone.status}`}>
                      <div className="milestone-left">
                        {getStatusIcon(milestone.status)}
                        <span className="milestone-name">{milestone.name}</span>
                      </div>
                      <span className="milestone-date">
                        {formatDate(milestone.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}