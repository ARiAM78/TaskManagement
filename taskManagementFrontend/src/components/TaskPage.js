import React, { useState, useEffect } from "react";
import { fetchTasks, fetchTaskById, createTask, updateTask, deleteTask, fetchTasksByCategory, fetchTasksByPriority } from "../api";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { Typography, Container, Button, CircularProgress, Snackbar, Alert, TextField, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

const TasksPage = ({ userRole, selectedEntity, onLogout }) => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const getTasks = async () => {
      setLoading(true);
      try {
        let data = [];
        if (selectedCategory && selectedPriority) {
          // If both filters are applied, fetch all tasks then filter on client side
          const allTasks = await fetchTasks(selectedEntity);
          data = allTasks.filter(
            (task) =>
              task.category === selectedCategory && task.priority === selectedPriority
          );
        } else if (selectedCategory) {
          // Use API endpoint to filter by category
          data = await fetchTasksByCategory(selectedCategory);
        } else if (selectedPriority) {
          // Use API endpoint to filter by priority
          data = await fetchTasksByPriority(selectedPriority);
        } else {
          // No filter applied
          data = await fetchTasks(selectedEntity);
        }
        setTasks(data);
      } catch (err) {
        setError(t("errorFetchingTasks") + " " + err.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    getTasks();
  }, [selectedEntity, t, selectedCategory, selectedPriority]);

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
        {userRole === "admin"
          ? t("adminDashboard")
          : `${t("userDashboard")} (${userRole})`}
      </Typography>

      {/* Logout Button */}
      <Button variant="contained" color="secondary" onClick={onLogout}>
        {t("logout")}
      </Button>

      {/* Filter Controls (Dropdowns styled like the search view) */}
      <TextField
        select
        label={t("category")}
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      >
        <MenuItem value="">
          <em>{t("allCategories")}</em>
        </MenuItem>
        <MenuItem value="Professional">{t("professional")}</MenuItem>
        <MenuItem value="Academic">{t("academic")}</MenuItem>
        <MenuItem value="Appointments">{t("appointments")}</MenuItem>
      </TextField>

      <TextField
        select
        label={t("priority")}
        value={selectedPriority}
        onChange={(e) => setSelectedPriority(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      >
        <MenuItem value="">
          <em>{t("allPriorities")}</em>
        </MenuItem>
        <MenuItem value="Red">{t("red")}</MenuItem>
        <MenuItem value="Green">{t("green")}</MenuItem>
        <MenuItem value="Gray">{t("gray")}</MenuItem>
      </TextField>

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
