import React, { useState, useEffect } from "react";
import { fetchTasks, fetchTaskById, createTask, updateTask, deleteTask } from "../api";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { Typography, Container, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

const TasksPage = ({ userRole, selectedEntity, onLogout }) => {
  const { t } = useTranslation();
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
      } catch (err) {
        setError(t("errorFetchingTasks") + " " + err.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, [selectedEntity, t]);

  // Handle task creation with validation and auto-assigning entityId for non-admin users
  const handleTaskCreated = async (task) => {
    try {
      // If the user is not admin, assign entityId automatically based on userRole
      if (userRole.toLowerCase() !== "admin") {
        const mapping = {
          user1: "1",
          user2: "2"
        };
        task.entityId = mapping[userRole.toLowerCase()] || "";
      }
      // For admin, entityId must be provided via the form
      if (
        !task.title ||
        !task.description ||
        !task.dueDate ||
        (userRole.toLowerCase() === "admin" && !task.entityId)
      ) {
        setError(t("allFieldsRequired"));
        setSnackbarOpen(true);
        return;
      }

      await createTask(task);
      const updatedTasks = await fetchTasks(selectedEntity);
      setTasks(updatedTasks);
    } catch (err) {
      setError(t("failedCreateTask") + " " + err.message);
      setSnackbarOpen(true);
    }
  };

  // Handle task update
  const handleTaskUpdate = async (updatedTask) => {
    try {
      if (!updatedTask.id) {
        setError(t("taskIdRequiredUpdate"));
        setSnackbarOpen(true);
        return;
      }
      await updateTask(updatedTask);
      const data = await fetchTasks(selectedEntity);
      setTasks(data);
    } catch (err) {
      setError(t("failedUpdateTask") + " " + err.message);
      setSnackbarOpen(true);
    }
  };

  // Fetch task for editing
  const handleTaskEdit = async (taskId) => {
    try {
      const task = await fetchTaskById(taskId);
      setTaskToEdit(task);
    } catch (err) {
      setError(t("errorFetchingTaskEdit") + " " + err.message);
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
        setError(t("taskNotFound"));
        setSnackbarOpen(true);
        return;
      }
      const updatedTask = { ...task, status };
      await updateTask(updatedTask);
      const data = await fetchTasks(selectedEntity);
      setTasks(data);
    } catch (err) {
      setError(t("errorUpdatingStatus") + " " + err.message);
      setSnackbarOpen(true);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      if (!id) {
        setError(t("taskIdRequiredDeletion"));
        setSnackbarOpen(true);
        return;
      }
      await deleteTask(id);
      const data = await fetchTasks(selectedEntity);
      setTasks(data);
    } catch (err) {
      setError(t("errorDeletingTask") + " " + err.message);
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="sm" className="tasks-page">
      <Typography variant="h4" gutterBottom>
        {userRole === "admin" ? t("adminDashboard") : `${t("userDashboard")} (${userRole})`}
      </Typography>

      {/* Logout Button */}
      <Button variant="contained" color="secondary" onClick={onLogout}>
        {t("logout")}
      </Button>

      {/* Task Form with userRole passed as a prop */}
      <TaskForm
        onTaskCreated={handleTaskCreated}
        taskToEdit={taskToEdit}
        onEditComplete={handleEditComplete}
        onUpdateTask={handleTaskUpdate}
        userRole={userRole}
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
        <Typography variant="body1">{t("noTasksAvailable")}</Typography>
      )}

      {/* Snackbar for error messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TasksPage;
