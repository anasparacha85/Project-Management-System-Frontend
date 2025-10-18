// 🔹 Dummy Data for ek milestone-as-task
import React, { useEffect, useState } from "react";
import { Clock, ListChecks, Flag } from "lucide-react";
import "./MilestoneAssigneesDetails.css";
import { useParams } from "react-router-dom";
import ApiServices from "../../ApiService/ApiService";

const MilestoneAssigneesDetails = () => {
   const [report, setReport] = useState(null);
    const params=useParams()
const fetchEMployeeDetails=async()=>{
  try {
    const data=await ApiServices.getEmployeeReportByMilestoneId(params.employeeId,params.id)
    console.log(data);
    setReport(data.report)
    
  } catch (error) {
    console.log(error);
    setReport
    
    
  }
}
useEffect(()=>{
  fetchEMployeeDetails()
},[params.employeeId,params.id])
 
  

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

  if (!report) return <p className="loading">Loading milestone report...</p>;

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

      {/* 🔹 Milestone Detail */}
      <div className="project-card">
        <h3>
          <Flag size={16} className="icon" /> {report.milestone.title}
          <span className="duration">
            <Clock size={14} /> {report.milestone.duration}
          </span>
        </h3>

        {report.milestone.subtasks.length > 0 && (
          <ul className="subtask-list">
            {report.milestone.subtasks.map((sub, k) => (
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

      {/* 🔹 Total */}
      <div className="total-duration">
        <Clock size={18} /> Total Time Spent:{" "}
        <strong>{report.totalDuration}</strong>
      </div>
    </div>
  );
};

export default MilestoneAssigneesDetails;
