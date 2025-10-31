import { AlertCircle, CheckCircle2, Circle, Clock, MoreHorizontal, Plus, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import TaskCard from "../../components/Cards/TaskCard/TaskCard";
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
    <div className="flex flex-col mb-4">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div style={{ color }} className="transition-colors duration-200">
            {getColumnIcon(title)}
          </div>
          <h3 className="text-base font-semibold text-gray-900 m-0">{title}</h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-xl text-xs font-semibold min-w-6 text-center">
            {tasks.length}
          </span>
          <div className="flex gap-1 ml-auto">
            <button className="w-8 h-8 border-none bg-transparent rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <Plus size={14} />
            </button>
            <button className="w-8 h-8 border-none bg-transparent rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TasksPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { SubTasks } = useSelector((state) => state.Task);
  const { user } = useSelector((state) => state.User);
  const role = user.role;
  const [loadingColumn, setLoadingColumn] = useState(null);

  const fetchEmployeeSubTask = async () => {
    try {
      const response = await ApiServices.getEmployeeSubTasksByTaskId(params.id);
      console.log("hi", response);
      dispatch(setSubTasks(response.subtasks));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  useEffect(() => {
    if (role === 'manager') {
      dispatch(fetchSubTasksBytaskId(params.id));
    } else {
      fetchEmployeeSubTask();
    }
  }, [dispatch, params.id]);

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

  console.log("subtasks", SubTasks);

  const tasks = SubTasks || [];
  console.log("tasks", tasks);

  const groupedTasks = groupTasksByStatus(tasks);

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
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceCol = boardData[source.droppableId];
    const destCol = boardData[destination.droppableId];

    if (!sourceCol || !destCol) return;

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

      if (role !== 'manager') {
        const res = await ApiServices.updateEmployeeSubTaskStatusById({
          Id: updatedTask._id,
          status: updatedTask.status,
        });
        console.log(res, "eeeeeeeeeeee");
        console.log(res.UpdatedData);
        dispatch(fetchSubTasksBytaskId(params.id));
        setBoardData(availableColumns);
        return;
      } else {
        const res = await ApiServices.updateManagerSubTaskStatusById({
          Id: updatedTask._id,
          status: updatedTask.status,
        });
        console.log(res.UpdatedData);
        dispatch(fetchSubTasksBytaskId(params.id));
        setBoardData(availableColumns);
        return;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingColumn(null);
    }
  };

  return (
    <div className="p-8   overflow-x-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6 items-start">
          {Object.entries(boardData).map(([columnTitle, { color, tasks }]) => (
            <Droppable key={columnTitle} droppableId={columnTitle}>
              {(provided, snapshot) => (
                <div
                  className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-md min-h-[600px] transition-all duration-200 hover:shadow-lg relative"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <KanbanColumn title={columnTitle} tasks={tasks} color={color} />
                  
                  {loadingColumn === columnTitle && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 rounded-2xl">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <div className={`flex flex-col gap-4 flex-1 overflow-y-auto ${
                    snapshot.isDraggingOver ? 'bg-gray-200' : ''
                  }`}>
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