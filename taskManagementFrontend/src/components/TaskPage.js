import React, { useState, useEffect } from "react";
import { fetchTasks, fetchTaskById, createTask, updateTask, deleteTask } from "../api";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { Typography, Container, Button, CircularProgress, Snackbar, Alert } from "@mui/material";

const TasksPage = ({ userRole, selectedEntity, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Fetch tasks based on the selected entity
  useEffect(() => {
    const getTasks = async () => {
      setLoading(true);
      try {
        const data = await fetchTasks(selectedEntity);
        setTasks(data);
      } catch (error) {
        setError("Error fetching tasks: " + error.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, [selectedEntity]);

  // Handle task creation
  const handleTaskCreated = async (task) => {
    try {
      if (!task.title || !task.description || !task.dueDate || !task.entityId) {
        setError("All fields are required.");
        setSnackbarOpen(true);
        return;
      }

      await createTask(task);
      const updatedTasks = await fetchTasks(selectedEntity);
      setTasks(updatedTasks);
    } catch (error) {
      setError("Failed to create task: " + error.message);
      setSnackbarOpen(true);
    }
  };

  // Handle task update
  const handleTaskUpdate = async (updatedTask) => {
    try {
      if (!updatedTask.id) {
        setError("Task ID is required for update.");
        setSnackbarOpen(true);
        return;
      }

      await updateTask(updatedTask);
      const data = await fetchTasks(selectedEntity);
      setTasks(data);
    } catch (error) {
      setError("Failed to update task: " + error.message);
      setSnackbarOpen(true);
    }
  };

  // Fetch task for editing
  const handleTaskEdit = async (taskId) => {
    try {
      const task = await fetchTaskById(taskId);
      setTaskToEdit(task);
    } catch (error) {
      setError("Error fetching task for editing: " + error.message);
      setSnackbarOpen(true);
    }
  };

  // Clears editing mode after updating
  const handleEditComplete = () => {
    setTaskToEdit(null);
  };

  // Toggle task status
  const handleStatusChange = async (taskId, status) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        setError("Task not found.");
        setSnackbarOpen(true);
        return;
      }

      const updatedTask = { ...task, status };
      await updateTask(updatedTask);
      const data = await fetchTasks(selectedEntity);
      setTasks(data);
    } catch (error) {
      setError("Error updating task status: " + error.message);
      setSnackbarOpen(true);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      if (!id) {
        setError("Task ID is required for deletion.");
        setSnackbarOpen(true);
        return;
      }

      await deleteTask(id);
      const data = await fetchTasks(selectedEntity);
      setTasks(data);
    } catch (error) {
      setError("Error deleting task: " + error.message);
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="sm" className="tasks-page">
      <Typography variant="h4" gutterBottom>
        {userRole === "admin" ? "Admin Dashboard" : `User Dashboard (${userRole})`}
      </Typography>

      {/* Logout Button */}
      <Button variant="contained" color="secondary" onClick={onLogout}>
        Logout
      </Button>

      {/* Task Form */}
      <TaskForm
        onTaskCreated={handleTaskCreated}
        taskToEdit={taskToEdit}
        onEditComplete={handleEditComplete}
        onUpdateTask={handleTaskUpdate}
      />

      {/* Task List */}
      {loading ? (
        <CircularProgress />
      ) : tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={handleTaskEdit}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <Typography variant="body1">No tasks available.</Typography>
      )}

      {/* Snackbar for error messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TasksPage;