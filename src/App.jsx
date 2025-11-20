import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route,Routes } from 'react-router-dom'
import Dashboard from './pages/layout/dashboard'
import TasksPage from './pages/TaskPage/page'
import ProjectPage from './pages/projectPage/page'
import ManagerRegisterPage from './pages/Auth/managerAuth/signup/page'
import ManagerLoginPage from './pages/Auth/managerAuth/login/page'
import EmployeeRegisterPage from './pages/Auth/employeeAuth/signup/page'
import EmployeeLoginPage from './pages/Auth/employeeAuth/login/page'
import Logout from './pages/Auth/logout/page'
import TeamPage from './pages/Team/Page'
import ProjectLayout from './pages/ProjectDetailsPage/Layout/layout'
import ProjectReport from './pages/ReportPage/ReportPage'
import ProjectMilestonesPage from './pages/Milestones/ProjectMilestonepage'

import DocumentsPage from './pages/ProjectFilePage/DocumentsPage'

import TaskDetailPage from './modals/TaskDetailModal'
import MileStoneLayout from './pages/MilestonesDetails/Layout/Layout'
import ScrollToTop from './hooks/ScrollToTop'
import NotFoundPage from './pages/NotFoundPage'
import SubTaskDetailPage from './pages/SubTaskDetailsPage/SubTaskDetailPage'
import MilestoneTeam from './pages/MilestoneTeams/MilestoneTeam'
import MilestoneAnalytics from './pages/MilestoneAnalytics'
import EmployeeReport from './pages/EmployeesReport/EmployeeReport'
import EmployeeDetailReport from './pages/EmployeeDetails/EmployeeDetails'
import MilestoneAssigneesDetails from './pages/MilestoneAssignessDetails/MilestoneAssigneeDetails'
import MilestonesChecklists from './pages/MilestoneChecklists/Checklists'
import MilestoneDocs from './pages/MilestoneDocuments/MilestoneDocs'
import ProtectedRoute from './Routes/ProtectedRoute'
import PublicRoute from './Routes/PublicRoute'
import LeaveManagement from './pages/Leave/LeaveManagement'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
     <ScrollToTop />
      <Routes>
      <Route element={<PublicRoute/>}>
        <Route path='/' element={<ManagerLoginPage/>}/>
        <Route path='/manager-signup' element={<ManagerRegisterPage/>}/>
        <Route path='/employee-signup' element={<EmployeeRegisterPage/>}/>
        <Route path='/employee-login' element={<EmployeeLoginPage/>}/>
      </Route>
      
      <Route path='/logout' element={<Logout/>}/>
      
      <Route element={<ProtectedRoute/>}>
        <Route path='/dashboard' element={<Dashboard/>}>
          <Route path='' element={<ProjectPage/>}/>
          <Route path='leave-management' element={<LeaveManagement/>}/>
          <Route path='project/:id' element={<ProjectLayout/>}>
            <Route index element={<ProjectReport/>}/>
            <Route path='team' element={<TeamPage/>}/>
            <Route path='team/:teamId' element={<EmployeeDetailReport/>}/>
            <Route path='milestone' element={<ProjectMilestonesPage/>}/>
            <Route path='attachments' element={<DocumentsPage/>}/>
            <Route path='employees-report' element={<EmployeeReport/>}/>
          </Route>
          
          <Route path='milestone/:id' element={<MileStoneLayout/>}>
            <Route index element={<TaskDetailPage/>}/>
            <Route path='board' element={<TasksPage/>}/>
            <Route path='attachments' element={<MilestoneDocs/>}/>
            <Route path='team' element={<MilestoneTeam/>}/>
            <Route path='analytics' element={<MilestoneAnalytics/>}/>
            <Route path='team/:employeeId' element={<MilestoneAssigneesDetails/>}/>
            <Route path='checklists' element={<MilestonesChecklists/>}/>
          </Route>
          
          <Route path='subTask/:id' element={<SubTaskDetailPage/>}/>
        </Route>
      </Route>
      
      <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </>
  )
}

export default App
