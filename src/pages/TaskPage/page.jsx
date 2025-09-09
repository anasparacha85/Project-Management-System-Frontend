import { AlertCircle, CheckCircle2, ChevronDown, Circle, Clock, Filter, Grid3X3, List, MoreHorizontal, Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import TaskCard from "../../components/Cards/TaskCard/TaskCard";
import './page.css'
import { useParams } from "react-router-dom";
import TaskModal from "../../modals/TaskModal";
import ApiServices from "../../ApiService/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../Slices/TaskSlice";

const KanbanColumn = ({ title, tasks, onAddTask, color }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);

  const getColumnIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'backlog subtasks': return <Circle size={16} />;
      case 'in progress': return <Clock size={16} />;
      case 'completed': return <CheckCircle2 size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="kanban-column">
      <div className="column-header">
        <div className="column-title-section">
          <div className="column-icon" style={{ color }}>
            {getColumnIcon(title)}
          </div>
          <h3 className="column-title">{title}</h3>
          <span className="task-count">{tasks.length}</span>
        </div>
        <div className="column-actions">
          <button className="column-action-btn">
            <Plus size={14} />
          </button>
          <button className="column-action-btn">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
      
      <div className="tasks-container">
        {tasks.map((task, index) => (
        <TaskCard 
  key={task._id} 
  task={task} 
  index={index} 
/>

        ))}
        
        <button 
          className={`add-task-btn ${isAddingTask ? 'active' : ''}`}
          onClick={() => setIsAddingTask(!isAddingTask)}
        >
          <Plus size={16} />
          <span>Add task</span>
        </button>
      </div>
    </div>
  );
};

//task page
const TasksPage = () => {
  const groupTasksByStatus = (tasks) => {
  return {
    "To Do": tasks.filter(task => task.status === "todo"),
    "In Progress": tasks.filter(task => task.status === "in-progress"),
    "Review": tasks.filter(task => task.status === "review"),
    "Completed": tasks.filter(task => task.status === "completed"),
  };
};

  const [ProjectId, setProjectId] = useState('')
  const [viewMode, setViewMode] = useState('board');
  const [filterOpen, setFilterOpen] = useState(false);
  const [ShowTaskModal, setShowTaskModal] = useState(false)
  const [projectId, setprojectId] = useState('')
  //  const {tasks,error,loading}=useSelector((state)=>state.Task)
   const dispatch=useDispatch()

  // Dummy Tasks
const dummyTasks = [
  {
    _id: "1",
    title: "Design Homepage",
    description: "Create wireframes and final UI design for the homepage.",
    status: "todo",
    priority: "high",
    startDate: "2025-08-20",
    dueDate: "2025-08-30",
    progress: 20,
    assignees: [
      {
        _id: "u1",
        user: {
          name: "Ali Raza",
          avatarUrl: "https://i.pravatar.cc/150?img=1",
          email: "ali@example.com"
        }
      },
      {
        _id: "u2",
        user: {
          name: "Sara Khan",
          avatarUrl: "https://i.pravatar.cc/150?img=2",
          email: "sara@example.com"
        }
      }
    ],
    attachments: [ { id: "a1", name: "homepage.png" } ]
  },
  {
    _id: "2",
    title: "API Integration",
    description: "Integrate login & register API endpoints with frontend.",
    status: "in-progress",
    priority: "medium",
    startDate: "2025-08-22",
    dueDate: "2025-09-02",
    progress: 60,
    assignees: [
      {
        _id: "u3",
        user: {
          name: "Bilal Ahmed",
          avatarUrl: "https://i.pravatar.cc/150?img=3",
          email: "bilal@example.com"
        }
      }
    ],
    attachments: []
  },
  {
    _id: "3",
    title: "Write Unit Tests",
    description: "Add tests for task reducer and components.",
    status: "review",
    priority: "low",
    startDate: "2025-08-24",
    dueDate: "2025-09-01",
    progress: 80,
    assignees: [
      {
        _id: "u4",
        user: {
          name: "Zain Malik",
          avatarUrl: "https://i.pravatar.cc/150?img=4",
          email: "zain@example.com"
        }
      }
    ],
    attachments: []
  },
  {
    _id: "4",
    title: "Deploy on Vercel",
    description: "Deploy the staging branch to Vercel and test.",
    status: "completed",
    priority: "medium",
    startDate: "2025-08-18",
    dueDate: "2025-08-25",
    progress: 100,
    assignees: [
      {
        _id: "u2",
        user: {
          name: "Sara Khan",
          avatarUrl: "https://i.pravatar.cc/150?img=2",
          email: "sara@example.com"
        }
      }
    ],
    attachments: [{ id: "a2", name: "deployment-log.txt" }]
  }
];

  const tasks=dummyTasks
  const params=useParams()
   useEffect(()=>{
    dispatch(fetchTasks(params.id))
   },[params.id])
  const onOpenTaskModal=()=>{
    setShowTaskModal(true)
    setProjectId(params.id)
  }
  const groupedTasks = groupTasksByStatus(tasks);

const columns = {
  "To Do": { color: "#6b7280", tasks: groupedTasks["To Do"] || [] },
  "In Progress": { color: "#3b82f6", tasks: groupedTasks["In Progress"] || [] },
  "Review": { color: "#f59e0b", tasks: groupedTasks["Review"] || [] },
  "Completed": { color: "#10b981", tasks: groupedTasks["Completed"] || [] },
};
 const onTaskCreated = async (task) => {
  try {
    console.log(task);
    
    const formdata = new FormData();

    // simple fields append karo
    formdata.append("title", task.title);
    formdata.append("description", task.description);
    formdata.append("priority", task.priority);
    formdata.append("startDate", task.startDate);
    formdata.append("dueDate", task.dueDate);
    formdata.append("milestone", task.milestone);

    // array fields (assigneeIds, dependencies) ko JSON stringify karke bhejna behtar hoga
    formdata.append("assigneeIds", JSON.stringify(task.assigneeIds));
    formdata.append("dependencies", JSON.stringify(task.dependencies));

    // attachments agar multiple files hain
    task.attachments.forEach((file) => {
      formdata.append("attachments", file);
    });
console.log(projectId,"h");

    // ab api call
    const res = await ApiServices.createTask(formdata, params.id);

    console.log("Task created: ", res);
  } catch (error) {
    console.error("Task creation error: ", error.message);
  }
};

  
  return (
    <div className="tasks-page">
     {/* {
        ShowTaskModal&&(
        
               <TaskModal onTaskCreated={onTaskCreated} isOpen={ShowTaskModal} onClose={()=>setShowTaskModal(false)} projectId={ProjectId}/>
        
       
        )
      }
      <div className="page-header">
        <div className="page-title-section">
          <div className="breadcrumb">
            <span>Projects</span>
            <ChevronDown size={14} />
            <span>Tasks</span>
          </div>
          <h1 className="page-title">Task Management</h1>
          <p className="page-subtitle">Organize and track your team's progress across all projects</p>
        </div>
        
        <div className="page-actions">
          <button className="action-btn secondary">
            <Users size={16} />
            <span>Invite Team</span>
          </button>
          <button onClick={onOpenTaskModal} className="action-btn primary">
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>
      
      <div className="page-controls">
        <div className="controls-left">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => setViewMode('board')}
            >
              <Grid3X3 size={16} />
              <span>Board</span>
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
              <span>List</span>
            </button>
          </div>
          
          <div className="search-filter">
            <div className="search-projects">
              <Search size={16} />
              <input type="text" placeholder="Search tasks..." />
            </div>
            
            <button 
              className={`filter-btn ${filterOpen ? 'active' : ''}`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        <div className="controls-right">
          <div className="team-avatars">
            {['JD', 'AM', 'SK', 'RK'].map((initials, idx) => (
              <div key={idx} className="team-avatar" style={{ zIndex: 4 - idx }}>
                {initials}
              </div>
            ))}
            <div className="team-avatar-more">+12</div>
          </div>
        </div>
      </div>
       */}
     <div className="kanban-board">
  {Object.entries(columns).map(([columnTitle, { color, tasks }]) => (
    <KanbanColumn 
      key={columnTitle}
      title={columnTitle}
      tasks={tasks}
      color={color}
    />
  ))}
</div>

     
    </div>
  );
};
export default TasksPage