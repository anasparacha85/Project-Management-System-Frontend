import { AlertCircle, CheckCircle2, Circle, Clock, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import TaskCard from "../../components/Cards/TaskCard/TaskCard";
import './page.css';
import { useParams } from "react-router-dom";
import TaskModal from "../../modals/TaskModal";
import ApiServices from "../../ApiService/ApiService";
import { useDispatch } from "react-redux";
import { fetchSubTasksBytaskId, fetchTasks } from "../../Slices/TaskSlice";
import { Draggable, Droppable, DragDropContext } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { fetchSubTaskById } from "../../Slices/SubTaskSlice";

const KanbanColumn = ({ title, tasks, color }) => {
  const getColumnIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'to do': return <Circle size={16} />;
      case 'in progress': return <Clock size={16} />;
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
  // status mapping between column title and backend status
  const statusMap = {
    "To Do": "todo",
    "In Progress": "in-progress",
    "Review": "review",
    "Completed": "completed"
  };

const groupTasksByStatus = (tasks = []) => {
  return {
    "To Do": tasks.filter(task => task.status === "todo"),
    "In Progress": tasks.filter(task => task.status === "in-progress"),
    "Review": tasks.filter(task => task.status === "review"),
    "Completed": tasks.filter(task => task.status === "completed"),
  };
};


  const [ProjectId, setProjectId] = useState('');
  const [viewMode, setViewMode] = useState('board');
  const [filterOpen, setFilterOpen] = useState(false);
  const [ShowTaskModal, setShowTaskModal] = useState(false);
  const [projectId, setprojectId] = useState('');
  const dispatch = useDispatch();
  const params = useParams();
  const {taskDetails,SubTasks}=useSelector((state)=>state.Task)
    console.log("hi",SubTasks);

  useEffect(() => {
    // fetch tasks for this project (keeps your existing behavior)
    if (params.id)   dispatch(fetchSubTasksBytaskId(params.id));
  }, [ dispatch]);



  

  const onTaskCreated = async (task) => {
    try {
      const formdata = new FormData();
      formdata.append("title", task.title);
      formdata.append("description", task.description);
      formdata.append("priority", task.priority);
      formdata.append("startDate", task.startDate);
      formdata.append("dueDate", task.dueDate);
      formdata.append("milestone", task.milestone);
      formdata.append("assigneeIds", JSON.stringify(task.assigneeIds || []));
      formdata.append("dependencies", JSON.stringify(task.dependencies || []));
      (task.attachments || []).forEach((file) => formdata.append("attachments", file));
      const res = await ApiServices.createTask(formdata, params.id);
      console.log("Task created: ", res);
      // optionally refresh or insert into boardData
    } catch (error) {
      console.error("Task creation error: ", error.message);
    }
  };
// ensure SubTasks exists, otherwise default to []
const tasks = SubTasks?.subTasks || [];

const groupedTasks = groupTasksByStatus(tasks);


  const initialColumns = {
    "To Do": { color: "#6b7280", tasks: groupedTasks["To Do"] || [] },
    "In Progress": { color: "#3b82f6", tasks: groupedTasks["In Progress"] || [] },
    "Review": { color: "#f59e0b", tasks: groupedTasks["Review"] || [] },
    "Completed": { color: "#10b981", tasks: groupedTasks["Completed"] || [] },
  };

  const [boardData, setBoardData] = useState(initialColumns);

  const handleDragEnd = async(result) => {
    const { source, destination } = result;
    console.log(source,destination);
    
    if (!destination) return;

    // same column reorder
    if (source.droppableId === destination.droppableId) {
      const column = boardData[source.droppableId];
      console.log(column);
      
      const copied = Array.from(column.tasks);
      console.log(copied);
      
      const [moved] = copied.splice(source.index, 1);
      console.log(moved);
      
      copied.splice(destination.index, 0, moved);
      
      

      setBoardData(prev => ({
        ...prev,
        [source.droppableId]: { ...column, tasks: copied }
      }));
      return;
    }

    // move between columns
    const sourceCol = boardData[source.droppableId];
    const destCol = boardData[destination.droppableId];

    const sourceTasks = Array.from(sourceCol.tasks);
    const destTasks = Array.from(destCol.tasks);

  const [moved] = sourceTasks.splice(source.index, 1);

// clone to avoid mutating Redux / frozen object
const updatedTask = { ...moved, status: statusMap[destination.droppableId] || moved.status };

destTasks.splice(destination.index, 0, updatedTask);

setBoardData(prev => ({
  ...prev,
  [source.droppableId]: { ...sourceCol, tasks: sourceTasks },
  [destination.droppableId]: { ...destCol, tasks: destTasks },
}));
console.log(updatedTask._id,updatedTask.status);

try {
  const response=await ApiServices.updateSubTaskStatusById({Id:updatedTask._id,status:updatedTask.status})
  console.log(response);

  dispatch(fetchSubTasksBytaskId(params.id))
  // window.location.reload()
  
} catch (error) {
 alert(error.message)
  
  
}

    // update backend (uncomment and adapt ApiServices)
    // ApiServices.updateTaskStatus(moved._id, moved.status).catch(err => console.error(err));
  };

  return (
    <div className="tasks-page">
      {/* optional modal trigger */}
      {ShowTaskModal && <TaskModal onCreate={onTaskCreated} onClose={() => setShowTaskModal(false)} projectId={projectId} />}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {Object.entries(boardData).map(([columnTitle, { color, tasks }]) => (
            <Droppable key={columnTitle} droppableId={columnTitle}>
              {(provided, snapshot) => (
                <div
                  className="kanban-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {/* header */}
                  <KanbanColumn title={columnTitle} tasks={tasks} color={color} />

                  {/* droppable area (must include provided.placeholder inside this area) */}
                 <div
  className={`tasks-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
>
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
