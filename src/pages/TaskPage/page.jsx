import { AlertCircle, CheckCircle2, Circle, Clock, MoreHorizontal, Plus, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import TaskCard from "../../components/Cards/TaskCard/TaskCard";
import './page.css';
import { useParams } from "react-router-dom";
import TaskModal from "../../modals/TaskModal";
import ApiServices from "../../ApiService/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubTasksBytaskId, setError, setSubTasks } from "../../Slices/TaskSlice";
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";

const KanbanColumn = ({ title, tasks, color }) => {
  const getColumnIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'to do': return <Circle size={16} />;
      case 'in progress': return <Clock size={16} />;
      case 'ready for review': return <Eye size={16} />;
      case 'review': return <AlertCircle size={16} />;
      case 'completed': return <CheckCircle2 size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="kanban-column-header">
      <div className="column-title-section">
        <div className="column-icon" style={{ color }}>
          {getColumnIcon(title)}
        </div>
        <h3 className="column-title">{title}</h3>
        <span className="task-count">{tasks.length}</span>
        <div style={{ marginLeft: 'auto' }} className="column-actions">
          <button className="column-action-btn"><Plus size={14} /></button>
          <button className="column-action-btn"><MoreHorizontal size={14} /></button>
        </div>
      </div>
    </div>
  );
};

const TasksPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { SubTasks } = useSelector((state) => state.Task);
  const {user}=useSelector((state)=>state.User)
   const role =  user.role
  const [loadingColumn, setLoadingColumn] = useState(null)
  const fetchEmployeeSubTask=async()=>{
    try {
      const response=await ApiServices.getEmployeeSubTasksByTaskId(params.id)
      console.log("hi",response);
      dispatch(setSubTasks(response.subtasks))
      
     
    } catch (error) {
      dispatch(setError(error.message))
      
      
    }
  }
  // const fetchManagerSubTasks=async()=>{
  //     const response=await ApiServices.getSubTaskByTaskid(TaskId)
  //     console.log("hi2",response);
  //     dispatch(setSubTasks(response))
      
  // }
  useEffect(()=>{
    if(role==='manager'){
    dispatch(fetchSubTasksBytaskId(params.id))
    }
    else{
      fetchEmployeeSubTask()
      
      
    }
  },[dispatch,params.id])
  // Dummy role (yeh tum login user se le sakte ho)
 

  // Status mapping
  const statusMap = {
    "To Do": "todo",
    "In Progress": "in-progress",
    "Ready for Review": "ready-for-review",
    "Review": "review",
    "Completed": "completed"
  };

  const groupTasksByStatus = (tasks = []) => {
    return {
      "To Do": tasks.filter(t => t.status === "todo"),
      "In Progress": tasks.filter(t => t.status === "in-progress"),
      "Ready for Review": tasks.filter(t => t.status === "review"),
      "Review": tasks.filter(t => t.status === "review"),
      "Completed": tasks.filter(t => t.status === "completed"),
    };
  };


console.log("subtasks",SubTasks);

  const tasks = SubTasks || [];
  console.log("tasks",tasks);
  
  const groupedTasks = groupTasksByStatus(tasks);

  // Role based columns
  const availableColumns = role === "manager"
    ? {
        "To Do": { color: "#6b7280", tasks: groupedTasks["To Do"] || [] },
        "In Progress": { color: "#3b82f6", tasks: groupedTasks["In Progress"] || [] },
        "Review": { color: "#f59e0b", tasks: groupedTasks["Review"] || [] },
        "Completed": { color: "#10b981", tasks: groupedTasks["Completed"] || [] },
      }
    : {
        "To Do": { color: "#6b7280", tasks: groupedTasks["To Do"] || [] },
        "In Progress": { color: "#3b82f6", tasks: groupedTasks["In Progress"] || [] },
        "Ready for Review": { color: "#f59e0b", tasks: groupedTasks["Ready for Review"] || [] },
      };

  const [boardData, setBoardData] = useState(availableColumns);
      useEffect(() => {
  setBoardData(availableColumns);
}, [SubTasks, params.id]);
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
 // ✅ Same column + same index => do nothing
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) {
    return;
  }
    const sourceCol = boardData[source.droppableId];
    const destCol = boardData[destination.droppableId];

    if (!sourceCol || !destCol) return;

    // Employee restriction: can't move to Completed
    if (role === "employee" && destination.droppableId === "Completed") {
      alert("Employees cannot directly mark tasks as Completed!");
      return;
    }

    const sourceTasks = Array.from(sourceCol.tasks);
    const destTasks = Array.from(destCol.tasks);

    const [moved] = sourceTasks.splice(source.index, 1);
    const updatedTask = { ...moved, status: statusMap[destination.droppableId] };

    destTasks.splice(destination.index, 0, updatedTask);

    setBoardData(prev => ({
      ...prev,
      [source.droppableId]: { ...sourceCol, tasks: sourceTasks },
      [destination.droppableId]: { ...destCol, tasks: destTasks },
    }));

 try {
  setLoadingColumn(destination.droppableId);
   // start loading

  if (role !== 'manager') {
      const res= await ApiServices.updateEmployeeSubTaskStatusById({
      Id: updatedTask._id,
      status: updatedTask.status,
    });
    console.log(res.UpdatedData);
    dispatch(fetchSubTasksBytaskId(params.id))
    setBoardData(availableColumns)
    return
 
    // dispatch(setSubTasks(res.UpdatedData))
  } else {
     const res=  await ApiServices.updateManagerSubTaskStatusById({
      Id: updatedTask._id,
      status: updatedTask.status,
    });
      console.log(res.UpdatedData);
      dispatch(fetchSubTasksBytaskId(params.id))
      setBoardData(availableColumns)
      return
 
  // dispatch(setSubTasks(res.UpdatedData))
  }
  


} catch (error) {
  alert(error.message);
} finally {
  setLoadingColumn(null); // stop loading
}
  };

  return (
    <div className="tasks-page" >
   
    
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {Object.entries(boardData).map(([columnTitle, { color, tasks }]) => (
            <Droppable key={columnTitle} droppableId={columnTitle}>
              {(provided, snapshot) => (
                <div
                  className="kanban-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{position:'relative'}}
                >
                  <KanbanColumn title={columnTitle} tasks={tasks} color={color} />
                  {loadingColumn==columnTitle &&(
                    <div className="column-overlay">
            <div className="spinner"></div>
          </div>
                  )}
                  <div className={`tasks-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}>
                    {tasks.map((task, index) => {
                      const idForDraggable = `${columnTitle}::${task._id}`;
                      return (
                        <Draggable key={idForDraggable} draggableId={idForDraggable} index={index}>
                          {(providedDraggable) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              {...providedDraggable.dragHandleProps}
                              style={{
                                userSelect: "none",
                                marginBottom: 8,
                                ...providedDraggable.draggableProps.style
                              }}
                            >
                              <TaskCard task={task} index={index} />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TasksPage;
