import React, { useState, useEffect } from "react";
import { fetchTasks, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import { Button, Typography, Container } from "@mui/material";
import "./index.css";

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const data = await fetchTasks();
      setTasks(data);
    };
    getTasks();
  }, []);

  const handleTaskCreated = () => {
    const getTasks = async () => {
      const data = await fetchTasks();
      setTasks(data);
    };
    getTasks();
  };

  const handleStatusChange = async (id, status) => {
    await updateTask(id, { status });
    const data = await fetchTasks();
    setTasks(data);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    const data = await fetchTasks();
    setTasks(data);
  };

  return (
    <Container maxWidth="sm" className="app-container">
      <Typography variant="h4" gutterBottom>Task Management</Typography>
      <TaskForm onTaskCreated={handleTaskCreated} />
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body1">{task.description}</Typography>
            <Typography variant="body2">Due Date: {task.dueDate}</Typography>
            <Typography variant="body2">Status: {task.status}</Typography>
            <div className="task-actions">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleStatusChange(task.id, task.status === "Pending" ? "Completed" : "Pending")}
                style={{ backgroundColor: '#4A628A', marginRight: '10px' }}
              >
                Edit
              </Button>
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
