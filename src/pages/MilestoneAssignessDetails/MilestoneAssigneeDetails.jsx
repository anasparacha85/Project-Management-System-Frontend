// 🔹 Milestone Assignee Details
import React, { useEffect, useState } from "react";
import { Clock, ListChecks, Flag } from "lucide-react";
import { useParams } from "react-router-dom";
import ApiServices from "../../ApiService/ApiService";

const MilestoneAssigneesDetails = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();
  
  const fetchEmployeeDetails = async () => {
    try {
      const data = await ApiServices.getEmployeeReportByMilestoneId(params.employeeId, params.id);
      console.log(data);
      setReport(data.report);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };
  
  useEffect(() => {
    fetchEmployeeDetails();
  }, [params.employeeId, params.id]);

  // useEffect(() => {
  //   // 🔹 Dummy Data (Milestone = Task)
  //   const dummyReport = {
  //     employee: {
  //       id: params.employeeId,
  //       name: "Ali Khan",
  //       email: "ali@example.com",
  //       avatar: "https://i.pravatar.cc/150?u=ali",
  //       role: "Frontend Developer",
  //     },
  //     milestone: {
  //       id: params.id,
  //       title: "Milestone 1 - Authentication Module",
  //       duration: "6h 40m",
  //       subtasks: [
  //         { name: "Design Login Form", duration: "1h 30m" },
  //         { name: "Validation & Error States", duration: "1h" },
  //         { name: "JWT Integration", duration: "2h 30m" },
  //         { name: "Role-based Access", duration: "1h 40m" },
  //       ],
  //     },
  //     totalDuration: "6h 40m",
  //   };

  //   setReport(dummyReport);
  // }, [params.id,params.employeeId]);

  if (error) return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md text-center">
        <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Report</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchEmployeeDetails}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!report) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading milestone report...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 🔹 Employee Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex items-center gap-6">
          <img
            src={report.employee.avatar}
            alt={report.employee.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{report.employee.name}</h2>
            <p className="text-indigo-600 font-medium">{report.employee.role}</p>
            <span className="text-gray-500 text-sm">{report.employee.email}</span>
          </div>
        </div>

        {/* 🔹 Milestone Detail */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="flex items-center justify-between text-xl font-semibold text-gray-800 mb-4">
            <div className="flex items-center gap-2">
              <Flag size={18} className="text-indigo-600" /> 
              {report.milestone.title}
            </div>
            <span className="flex items-center gap-1 text-sm font-normal bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
              <Clock size={14} /> 
              {report.milestone.duration}
            </span>
          </h3>

          {report.milestone.subtasks && report.milestone.subtasks.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Subtasks</h4>
              <ul className="space-y-3">
                {report.milestone.subtasks.map((sub, k) => (
                  <li key={k} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <ListChecks size={16} className="text-indigo-500" />
                      <span className="text-gray-700">{sub.name}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      <Clock size={12} /> 
                      {sub.duration}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 🔹 Total */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-4 text-white flex items-center justify-between">
          <div className="flex items-center  gap-2">
            <Clock size={20} className="text-white" /> 
            <span className="font-medium">Total Time Spent</span>
          </div>
          <span className="text-xl font-bold">{report.totalDuration}</span>
        </div>
      </div>
    </div>
  );
};

export default MilestoneAssigneesDetails;
