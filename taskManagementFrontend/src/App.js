import React, { useState, useEffect } from "react";
import { fetchTasks, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";

const App = () => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  const handleTaskCreated = () => {
    loadTasks();
  };

  const handleTaskDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      <h1>Task Management</h1>
      <TaskForm onTaskCreated={handleTaskCreated} />
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.status}
            <button onClick={() => handleTaskDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
