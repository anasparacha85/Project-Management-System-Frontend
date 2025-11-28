import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ListTodo,
  AlertCircle,
  FileBarChart
} from "lucide-react";
import ApiServices from "../../ApiService/ApiService";
import { useParams } from "react-router-dom";

const EmployeeReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {id}=useParams()

  // Keep your existing fetchReport and useEffect logic
  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      // Your API call here
      const response = await ApiServices.getEmployeesComparisonReportByProjectId(id);
      setReport(response.data);
    } catch (error) {
      console.log(error);
      setError(error.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <FileBarChart className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-lg font-medium text-slate-700">Loading report...</p>
          <p className="text-sm text-slate-500 mt-2">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to Load Report</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={fetchReport}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!report || report.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">No Data Available</h3>
          <p className="text-slate-600 mb-6">
            There are no employee performance records for this project yet. 
            Data will appear here once employees start working on tasks.
          </p>
          <button
            onClick={fetchReport}
            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Calculate summary stats
  const totalEmployees = report.length;
  const totalTasksCompleted = report.reduce((sum, r) => sum + r.stats.tasksCompleted, 0);
  const totalSubtasksCompleted = report.reduce((sum, r) => sum + r.stats.subtasksCompleted, 0);
  const avgCompletionRate = (
    report.reduce((sum, r) => sum + parseFloat(r.stats.completionRate), 0) / totalEmployees
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Employee Performance Report
              </h1>
              <p className="text-slate-600">
                Comprehensive overview of team productivity and task completion
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileBarChart className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{totalEmployees}</h3>
            <p className="text-sm text-slate-600 mt-1">Total Employees</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{totalTasksCompleted}</h3>
            <p className="text-sm text-slate-600 mt-1">Milestones Completed</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ListTodo className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{totalSubtasksCompleted}</h3>
            <p className="text-sm text-slate-600 mt-1">Checkpoints Completed</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{avgCompletionRate}%</h3>
            <p className="text-sm text-slate-600 mt-1">Avg Completion Rate</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Detailed Performance Metrics</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Milestones Assigned
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Milestones Completed
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Checkpoints Assigned
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Checkpoints Completed
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Time Spent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.map((r) => (
                  <tr key={r.employee.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.employee.avatar}
                          alt={r.employee.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
                        />
                        <div>
                          <div className="font-medium text-slate-900">{r.employee.name}</div>
                          <div className="text-sm text-slate-500">{r.employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-700 font-semibold rounded-lg">
                        {r.stats.tasksAssigned}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-green-50 text-green-700 font-semibold rounded-lg">
                        {r.stats.tasksCompleted}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-50 text-purple-700 font-semibold rounded-lg">
                        {r.stats.subtasksAssigned}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-indigo-50 text-indigo-700 font-semibold rounded-lg">
                        {r.stats.subtasksCompleted}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="font-semibold text-slate-900">{r.stats.completionRate}</span>
                        <div className="w-full bg-slate-200 rounded-full h-2 max-w-[80px]">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: r.stats.completionRate }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg font-medium">
                        <Clock className="w-4 h-4" />
                        {r.stats.totalDuration}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Task Completion Comparison</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={report} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="employee.name" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: '#475569', fontSize: 12 }}
              />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Bar
                dataKey="stats.tasksCompleted"
                fill="#10b981"
                name="Milestones Completed"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="stats.subtasksCompleted"
                fill="#3b82f6"
                name="Checkpoints Completed"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReport;