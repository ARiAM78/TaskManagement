import React, { useState, useEffect } from "react";
import { fetchTasks, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import { Button, Typography, Container } from "@mui/material";
import "./index.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null); // Track task to edit

  // Fetch tasks from the backend when the component mounts
  useEffect(() => {
    const getTasks = async () => {
      const data = await fetchTasks();
      setTasks(data);
    };
    getTasks();
  }, []);

  // Handle new task creation by fetching the updated task list
  const handleTaskCreated = () => {
    const getTasks = async () => {
      const data = await fetchTasks();
      setTasks(data);
    };
    getTasks();
  };

  // Handle task edit: sets the task to be edited
  const handleTaskEdit = (task) => {
    setTaskToEdit(task); // Set the task that needs to be edited
  };

  // Handle completion of editing: clears the taskToEdit state
  const handleEditComplete = () => {
    setTaskToEdit(null); // Reset the task being edited
  };

  // Handle task status change and update the task list
  const handleStatusChange = async (taskId, status) => {
    const updatedTask = tasks.find((task) => task.id === taskId); 
    if (updatedTask) {
      updatedTask.status = status; // Update the status of the task
      await updateTask(updatedTask); // Send the updated task to the backend
      const data = await fetchTasks(); // Fetch updated task list
      setTasks(data); // Update the task list state
    }
  };

  // Handle task deletion and update the task list
  const handleDeleteTask = async (id) => {
    await deleteTask(id); // Delete the task
    const data = await fetchTasks(); // Fetch updated task list
    setTasks(data); // Update the task list state
  };

  return (
    <Container maxWidth="sm" className="app-container">
      <Typography variant="h4" gutterBottom>Task Management</Typography>

      {/* Render TaskForm if editing a task */}
      <TaskForm 
        onTaskCreated={handleTaskCreated} 
        taskToEdit={taskToEdit} 
        onEditComplete={handleEditComplete} 
      />

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body1">{task.description}</Typography>
            <Typography variant="body2">Due Date: {task.dueDate}</Typography>
            <Typography variant="body2">Status: {task.status}</Typography>
            <div className="task-actions">
              {/* Edit button opens the form to edit task */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleTaskEdit(task)}
                style={{ backgroundColor: '#4A628A', marginRight: '10px' }}
              >
                Edit
              </Button>
              {/* Delete button to remove task */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDeleteTask(task.id)}
                style={{ backgroundColor: '#4A628A' }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default App;
