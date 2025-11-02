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
    case 'completed': case 'complete': return <CheckCircle className="w-4 h-4" />;
    case 'active': case 'in-progress': return <PlayCircle className="w-4 h-4" />;
    case 'on-hold': case 'onhold': return <Pause className="w-4 h-4" />;
    case 'archive': case 'archieve': return <Archive className="w-4 h-4" />;
    default: return <AlertCircle className="w-4 h-4" />;
  }
}

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
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading project report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200 max-w-sm text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Report</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchProjectById}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 m-0">Project Dashboard</h1>
              {/* <div className="flex gap-2 mt-2">
                {['overview', 'analytics', 'team'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeView === view 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div> */}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setChartAnimations(!chartAnimations)}
              className="p-2 text-gray-500 bg-transparent border-none rounded-lg cursor-pointer transition-all hover:text-gray-700 hover:bg-gray-100"
              title={chartAnimations ? "Disable animations" : "Enable animations"}
            >
              {chartAnimations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            {/* <button className="p-2 text-gray-500 bg-transparent border-none rounded-lg cursor-pointer transition-all hover:text-gray-700 hover:bg-gray-100">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 bg-transparent border-none rounded-lg cursor-pointer transition-all hover:text-gray-700 hover:bg-gray-100">
              <Share2 className="w-4 h-4" />
            </button> */}
            <button 
              onClick={fetchProjectById}
              className="p-2 text-gray-500 bg-transparent border-none rounded-lg cursor-pointer transition-all hover:text-gray-700 hover:bg-gray-100"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Project Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-3xl font-bold text-gray-900">{report.name}</h2>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  (report.projectStatus || 'draft').toLowerCase() === 'active' ? 'bg-green-100 text-green-800' :
                  (report.projectStatus || 'draft').toLowerCase() === 'completed' || 'complete' ? 'bg-blue-100 text-blue-800' :
                  (report.projectStatus || 'draft').toLowerCase() === 'on-hold' || 'onhold' ? 'bg-yellow-100 text-yellow-800' :
                  (report.projectStatus || 'draft').toLowerCase() === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {getStatusIcon(report.projectStatus)}
                  <span className="capitalize">{report.projectStatus}</span>
                </span>
              </div>
            <div
  className="text-gray-600 text-lg leading-relaxed mb-4 prose max-w-none"
  dangerouslySetInnerHTML={{ __html: report.description || "No description provided." }}
/>

              
              {daysRemaining !== null && (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
                  daysRemaining > 30 ? 'bg-green-100 text-green-800' :
                  daysRemaining > 7 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>
                    {daysRemaining > 0 ? `${daysRemaining} days remaining` :
                     daysRemaining === 0 ? 'Due today' : 
                     `${Math.abs(daysRemaining)} days overdue`}
                  </span>
                </div>
              )}
            </div>
            
            {/* Progress Ring */}
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
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
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{Math.round(progressValue)}%</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Calendar className="w-4 h-4 text-blue-700" />
              </div>
              <p className="text-xs text-gray-600 font-medium mb-1">Start Date</p>
              <p className="text-sm font-bold text-gray-900">{formatDate(report.startDate)}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                <Calendar className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium mb-1">End Date</p>
              <p className="text-sm font-bold text-gray-900">{formatDate(report.endDate)}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <Target className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium mb-1">Priority</p>
              <p className="text-sm font-bold text-gray-900">{report.priority}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium mb-1">Attachments</p>
              <p className="text-sm font-bold text-gray-900">{report.numberOfFiles || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Target className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium mb-1">Milestones</p>
              <p className="text-sm font-bold text-gray-900">{report.numberOfTasks || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xs text-gray-600 font-medium mb-1">Team Size</p>
              <p className="text-sm font-bold text-gray-900">{report.numberOfTeamMembers || 0}</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Task Status Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 m-0">Task Status Distribution</h3>
              <button
                onClick={() => toggleDetails('tasks')}
                className="text-blue-600 bg-transparent border-none text-sm font-medium cursor-pointer transition-colors hover:text-blue-800"
              >
                {showDetails.tasks ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            <div className="h-80 w-full">
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
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                {taskData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                    <span className="text-gray-600 text-sm">{item.value} tasks ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress History Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Progress Timeline - Actual vs Planned</h3>
            <div className="h-80 w-full">
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Team Statistics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Team Overview</h3>
            <div className="h-64 w-full">
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
            
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">Team Utilization</span>
                <span className="text-green-900 font-bold">
                  {Math.round(((report.numberOfUniqueAssignees || 0) / (report.numberOfTeamMembers || 1)) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Budget Overview */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Budget Status</h3>
            {report.budget ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Allocated Budget</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${report.budget.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Spent</span>
                  <span className="text-xl font-semibold text-blue-600">
                    ${report.budget.spent?.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min((report.budget.spent / report.budget.allocated) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {Math.round((0 / report.budget) * 100)}% used
                  </span>
                  <span className="text-green-600 font-medium">
                    ${(report.budget - 0).toLocaleString()} remaining
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Budget information not available</p>
              </div>
            )}
            
            {/* Milestones */}
            {report.milestones && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Project Milestones</h4>
                <div className="flex flex-col gap-2">
                  {report.milestones.map((milestone, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      milestone.status === 'completed' ? 'bg-green-50' :
                      milestone.status === 'in-progress' ? 'bg-blue-50' :
                      'bg-gray-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(milestone.status)}
                        <span className="font-medium">{milestone.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">
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