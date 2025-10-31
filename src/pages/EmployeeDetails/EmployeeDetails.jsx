import React, { useEffect, useState } from "react";
import { Clock, ClipboardList, ListChecks } from "lucide-react";
import ApiServices from "../../ApiService/ApiService";
import { useParams } from "react-router-dom";

const EmployeeDetailReport = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();
  console.log(params);
  
  const fetchEmployeeProjectReport = async () => {
    try {
      const data = await ApiServices.getEmployeeReportByProjectId(params.teamId, params.id);
      console.log(data);
      setReport(data);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };
  
  useEffect(() => {
    fetchEmployeeProjectReport();
  }, [params.id, params.teamId]);

  // useEffect(() => {
  //   // 🔹 Dummy Data for ek project only
  //   const dummyReport = {
  //     employee: {
  //       id: params.teamId,
  //       name: "Ali Khan",
  //       email: "ali@example.com",
  //       avatar: "https://i.pravatar.cc/150?u=ali",
  //       role: "Frontend Developer",
  //     },
  //     project: {
  //       id: params.id,
  //       name: "Project A",
  //       duration: "15h 20m",
  //       tasks: [
  //         {
  //           name: "Task 1 - API Integration",
  //           duration: "5h 10m",
  //           subtasks: [
  //             { name: "Subtask 1.1 - Auth API", duration: "2h" },
  //             { name: "Subtask 1.2 - CRUD Endpoints", duration: "3h 10m" },
  //           ],
  //         },
  //         {
  //           name: "Task 2 - UI Implementation",
  //           duration: "10h 10m",
  //           subtasks: [],
  //         },
  //       ],
  //     },
  //     totalDuration: "15h 20m",
  //   };

  //   setReport(dummyReport);
  // }, [params.teamId, params.id]);

  if (error) return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md text-center">
        <div className="w-12 h-12 text-red-500 mx-auto mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Report</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchEmployeeProjectReport}
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
        <p className="text-gray-600">Loading employee report...</p>
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

        {/* 🔹 Project Detail */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="flex items-center justify-between text-xl font-semibold text-gray-800 mb-6">
            <div className="flex items-center gap-2">
              {report.project.title}
            </div>
            <span className="flex items-center gap-1 text-sm font-normal bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
              <Clock size={14} /> 
              {report.project.duration}
            </span>
          </h3>

          <div className="space-y-4 mt-6">
            {report.project.milestones.map((task, j) => (
              <div key={j} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={16} className="text-indigo-600" />
                    <span className="font-medium text-gray-800">{task.title}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    <Clock size={12} /> 
                    {task.duration}
                  </span>
                </div>

                {/* Uncomment if subtasks are needed
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="pl-6 mt-3 space-y-2">
                    {task.subtasks.map((sub, k) => (
                      <div key={k} className="flex items-center justify-between py-2 px-3 bg-white rounded border border-gray-100">
                        <div className="flex items-center gap-2">
                          <ListChecks size={14} className="text-indigo-500" />
                          <span className="text-sm text-gray-700">{sub.name}</span>
                        </div>
                        <span className="flex items-center gap-1 text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded">
                          <Clock size={10} /> 
                          {sub.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                )} */}
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 Total */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-white" /> 
            <span className="font-medium">Total Time Spent</span>
          </div>
          <span className="text-xl font-bold">{report.totalDuration}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailReport;
