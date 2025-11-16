import apiClient from "../apiclient/ApiClient";

const ApiServices = {
  getUserData(){
    return apiClient("/api/auth/user")
  },
  fetchAllManagers() {
    return apiClient("/api/manager/fetchAllManagers");
  },

  fetchAllEmployees() {
    return apiClient("/api/manager/fetchAllEmployees");
  },

  fetchEmployees(search) {
    return apiClient("/api/manager/fetchEmployees", {
      params: { search },
      
    });
  },

  createProject(data) {
    return apiClient("/api/manager/createProject", {
      method: "POST",
      body: data,
    });
  },
  fetchAllProjects(){
    return apiClient("/api/manager/fetchAllProjects",{
      method:'GET'
    })
  },
   InviteMoreMembersByProjectId(data){
    return apiClient('/api/manager/InviteTeam',{
      method:'POST',
      body:data
    })
  },
  fetchProjectById(projectId){
    return apiClient(`/api/project/fetchProject/${projectId}`)
  },
  fetchProjectDetailsById(projectId){
    return apiClient(`/api/project/fetchProjectDetailsById/${projectId}`)
  },
  updateProjectDetailsById(data){
    return apiClient('/api/project/updateProject',{
      method:'PUT',
      body:data
    })
  },
  //uploading files
  uploadFilesByProjectId(selectedFiles,id){
    return apiClient(`/api/project/uploadFiles/${id}`,{
      method:'POST',
      body:selectedFiles
    })
  },
   uploadFilesBytaskId(selectedFiles,id){
    return apiClient(`/api/tasks/uploadTaskFiles/${id}`,{
      method:'POST',
      body:selectedFiles
    })
  },

 
  getMembersByProjectId(projectId){
    return apiClient(`/api/tasks/getTeam/${projectId}`,{
        method:'GET'
    });
    
  },
  getMilestonesByProjectId(projectId){
    return apiClient(`/api/project/fetchMilestone/${projectId}`)
  },

  getFilesByProjectId(projectId){
    return apiClient(`/api/project/fetchProjectFiles/${projectId}`)
  },

  createTask(data,projectId){
    return apiClient(`/api/tasks/createTask/${projectId}`,{
        method:'POST',
        body:data,
        
    })
  },
  getTasksByProjectId(projectId){
    return apiClient(`/api/tasks/getTasks/${projectId}`,{
        method:'GET'
    })
  },
  getTasksByTaskId(TaskId){
    return apiClient(`/api/tasks/getTaskById/${TaskId}`,{
      method:'GET'
    })
  },
  updateTaskById(TaskId,updates){
    return apiClient(`/api/tasks/updateTaskById/${TaskId}`,{
      method:'PUT',
      body:updates
    })
  },
  deleteTaskById(TaskId){
    return apiClient(`/api/tasks/deleteTaskById/${TaskId}`,{
      method:'DELETE'
    })
  },
    getTaskReportById(TaskId){
      return apiClient(`/api/tasks/report/${TaskId}`,{
        method:'GET'
      })
    },
  createSubtask(data,TaskId){
    return apiClient(`/api/subTask/create-subTask/${TaskId}`,{
      method:'POST',
      body:data
    })
  },
  getSubTaskByTaskid(TaskId){
    return apiClient(`/api/subTask/getSubTasks/${TaskId}`)
  },
  getSubTaskBySUbTaskId(SubTaskId){
    return apiClient(`/api/subtask/getSubTaskById/${SubTaskId}`)
  },
  getTeamByTaskId(TaskId){
    return apiClient(`/api/subTask/getTeamByTaskId/${TaskId}`)
  },
  updateManagerSubTaskById(SubTaskId,data){
    return apiClient(`/api/subTask/updateManagerSubTaskById/${SubTaskId}`,{
      method:'PUT',
      body:data
    })
  },
   updateEmployeeSubTaskById(SubTaskId,data){
    return apiClient(`/api/subTask/updateEmployeeSubTaskById/${SubTaskId}`,{
      method:'PUT',
      body:data
    })
  },
  deleteSubTaskById(SubTaskId){
    return apiClient(`/api/subTask/deleteSubTaskById/${SubTaskId}`,{
      method:'DELETE',
    
  })},
  updateManagerSubTaskStatusById(data){
    return apiClient(`/api/subTask/updateManagerSubTaskStatus`,{
      method:'PATCH',
      body:data
    })
  },
  updateEmployeeSubTaskStatusById(data){
    return apiClient(`/api/subTask/updateEmployeeSubTaskStatus`,{
      method:'PATCH',
      body:data
    })
  },
  //Getting Projects,Tasks,SubTasks assigned to Particular Employees
  getProjectByEmployee(){
    return apiClient(`/api/employee/getEmployeeProjects`)
  },
  getEmployeeMilestonesByProjectid(projectId){
    return apiClient(`/api/employee/getEmployeeTasksByProject/${projectId}`)
  },
   getEmployeeMilestonesByProjectid(projectId){
    return apiClient(`/api/employee/getEmployeeTasksByProject/${projectId}`)
  },
    getEmployeeSubTasksByTaskId(taskId){
    return apiClient(`/api/employee/getEmployeeSubTasksByTask/${taskId}`)
  },
    updateEmployeeTaskById(TaskId,updates){
    return apiClient(`/api/tasks/updateEmployeeTaskById/${TaskId}`,{
      method:'PUT',
      body:updates
    })
  },
  getEmployeeReportByMilestoneId(userId,MilestoneId){
    return apiClient(`/api/employee/getEmployeeTaskReport`,{
      method:'POST',
      body:{userId,MilestoneId}

    })
    
  },
   getEmployeeReportByProjectId(userId,projectId){
    return apiClient(`/api/employee/getEmployeeProjectReport`,{
      method:'POST',
      body:{userId,projectId}

    })
    
},
  takeBreakForEmployee(subTaskId){
    return apiClient(`/api/employee/takeBreak`,{
      method:'POST',
      body:{subTaskId}
    })
  },
  FinishBreakForEmployee(subTaskId){
    return apiClient(`/api/employee/resumeBreak`,{
      method:'POST',
      body:{subTaskId}
    })
  },
  GenerateDescription({name,type,parent}){
    return apiClient(`/api/ai/generate-description`,{
      method:'POST',
      body:{name,type,parent}
    })
  },
  PostComment({type,targetId,content}){
    return apiClient(`/api/comments/post-comment`,{
      method:'POST',
      body:{type,targetId,content}
    })

  },
  GetCommentsByTargetId({type,targetId}){
    return apiClient(`/api/comments/get-comments/${type}/${targetId}`)
  },
  GetNotifications(){
    return apiClient(`/api/notifications/get-notification`)
  },
  MarkAsReadNotification(notificationId){
    return apiClient(`/api/notifications/mark-as-read/${notificationId}`,{
      method:'PATCH'
    })
}
}


export default ApiServices;
