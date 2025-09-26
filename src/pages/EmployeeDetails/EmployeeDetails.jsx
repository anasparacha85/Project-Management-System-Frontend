import React, { useEffect, useState } from "react";
import { Clock, ClipboardList, ListChecks } from "lucide-react";
import "./EmployeeDetailsReport.css";

const EmployeeDetailReport = ({ employeeId, projectId }) => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    // 🔹 Dummy Data for ek project only
    const dummyReport = {
      employee: {
        id: employeeId,
        name: "Ali Khan",
        email: "ali@example.com",
        avatar: "https://i.pravatar.cc/150?u=ali",
        role: "Frontend Developer",
      },
      project: {
        id: projectId,
        name: "Project A",
        duration: "15h 20m",
        tasks: [
          {
            name: "Task 1 - API Integration",
            duration: "5h 10m",
            subtasks: [
              { name: "Subtask 1.1 - Auth API", duration: "2h" },
              { name: "Subtask 1.2 - CRUD Endpoints", duration: "3h 10m" },
            ],
          },
          {
            name: "Task 2 - UI Implementation",
            duration: "10h 10m",
            subtasks: [],
          },
        ],
      },
      totalDuration: "15h 20m",
    };

    setReport(dummyReport);
  }, [employeeId, projectId]);

  if (!report) return <p className="loading">Loading employee report...</p>;

  return (
    <div className="employee-report">
      {/* 🔹 Employee Header */}
      <div className="employee-header">
        <img
          src={report.employee.avatar}
          alt={report.employee.name}
          className="avatar"
        />
        <div className="employee-info">
          <h2>{report.employee.name}</h2>
          <p>{report.employee.role}</p>
          <span>{report.employee.email}</span>
        </div>
      </div>

      {/* 🔹 Project Detail */}
      <div className="project-card">
        <h3>
          {report.project.name}
          <span className="duration">
            <Clock size={14} /> {report.project.duration}
          </span>
        </h3>

        {report.project.tasks.map((task, j) => (
          <div key={j} className="task-block">
            <p className="task-title">
              <ClipboardList size={16} className="icon" />
              {task.name}
              <span className="duration">
                <Clock size={14} /> {task.duration}
              </span>
            </p>

            {task.subtasks.length > 0 && (
              <ul className="subtask-list">
                {task.subtasks.map((sub, k) => (
                  <li key={k}>
                    <ListChecks size={14} className="icon" />
                    {sub.name}
                    <span className="duration">
                      <Clock size={12} /> {sub.duration}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* 🔹 Total */}
      <div className="total-duration">
        <Clock size={18} /> Total Time Spent:{" "}
        <strong>{report.totalDuration}</strong>
      </div>
    </div>
  );
};

export default EmployeeDetailReport;
