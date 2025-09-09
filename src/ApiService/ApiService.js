import apiClient from "../apiclient/ApiClient";

const ApiServices = {
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
  updateSubTaskById(SubTaskId,data){
    return apiClient(`/api/subTask/updateSubTaskById/${SubTaskId}`,{
      method:'PUT',
      body:data
    })
  },
  deleteSubTaskById(SubTaskId){
    return apiClient(`/api/subTask/deleteSubTaskById/${SubTaskId}`,{
      method:'DELETE',
    
  })},
  updateSubTaskStatusById(data){
    return apiClient(`/api/subTask/updateSubTaskStatus`,{
      method:'PATCH',
      body:data
    })
  }
    
};


export default ApiServices;
