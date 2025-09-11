import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./EmployeeReport.css";

const EmployeeReport = ({ projectId }) => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Dummy Data instead of API
    const dummyReport = [
      {
        employee: {
          id: "64fabc1234567890aaa11111",
          name: "Ali Khan",
          email: "ali@example.com",
          avatar: "https://i.pravatar.cc/150?u=ali",
          role: "employee",
        },
        stats: {
          tasksAssigned: 3,
          tasksCompleted: 2,
          subtasksAssigned: 4,
          subtasksCompleted: 2,
          totalAssigned: 7,
          totalCompleted: 4,
          completionRate: "57.1%",
          timeSpent: "5h 30m",
        },
      },
      {
        employee: {
          id: "64fabc1234567890aaa22222",
          name: "Sara Ahmed",
          email: "sara@example.com",
          avatar: "https://i.pravatar.cc/150?u=sara",
          role: "employee",
        },
        stats: {
          tasksAssigned: 2,
          tasksCompleted: 1,
          subtasksAssigned: 3,
          subtasksCompleted: 1,
          totalAssigned: 5,
          totalCompleted: 2,
          completionRate: "40.0%",
          timeSpent: "3h 15m",
        },
      },
      {
        employee: {
          id: "64fabc1234567890aaa33333",
          name: "Manager User",
          email: "manager@example.com",
          avatar: "https://i.pravatar.cc/150?u=manager",
          role: "manager",
        },
        stats: {
          tasksAssigned: 0,
          tasksCompleted: 0,
          subtasksAssigned: 0,
          subtasksCompleted: 0,
          totalAssigned: 0,
          totalCompleted: 0,
          completionRate: "0%",
          timeSpent: "0h 0m",
        },
      },
    ];

    // Simulate API delay
    setTimeout(() => {
      setReport(dummyReport);
      setLoading(false);
    }, 1000);
  }, [projectId]);

  if (loading) return <p className="loading">Loading report...</p>;

  return (
    <div className="report-container">
      <h2 className="report-title">Employee Performance Report</h2>

      {/* 🔹 Table View */}
      <table className="report-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Tasks Assigned</th>
            <th>Tasks Completed</th>
            <th>Subtasks Assigned</th>
            <th>Subtasks Completed</th>
            <th>Completion Rate</th>
            <th>Time Spent</th>
          </tr>
        </thead>
        <tbody>
          {report.map((r) => (
            <tr key={r.employee.id}>
              <td>
                <div className="employee-info">
                  <img
                    src={r.employee.avatar}
                    alt={r.employee.name}
                    className="avatar"
                  />
                  <span>{r.employee.name}</span>
                </div>
              </td>
              <td>{r.stats.tasksAssigned}</td>
              <td>{r.stats.tasksCompleted}</td>
              <td>{r.stats.subtasksAssigned}</td>
              <td>{r.stats.subtasksCompleted}</td>
              <td>{r.stats.completionRate}</td>
              <td>{r.stats.timeSpent}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Comparison Graph */}
      <div className="chart-container">
        <h3>Task Completion Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={report}>
            <XAxis dataKey="employee.name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="stats.tasksCompleted"
              fill="#4CAF50"
              name="Tasks Completed"
            />
            <Bar
              dataKey="stats.subtasksCompleted"
              fill="#2196F3"
              name="Subtasks Completed"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeeReport;
