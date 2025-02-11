import React, { useState, useEffect } from "react";
import { fetchTasks, fetchTaskById, createTask, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import SideMenu from "./components/SideMenu";
import { Typography, Container, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import "./index.css";
import "./i18next";
import "./components/style.css";


// LoginPage Component for user selection
const LoginPage = ({ setUserRole }) => {
  return (
    <Container maxWidth="sm" className="app-container">
      <Typography variant="h4" gutterBottom>
        Select a User
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginBottom: "1rem" }}
        onClick={() => setUserRole("admin")}
      >
        Admin
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginBottom: "1rem" }}
        onClick={() => setUserRole("user1")}
      >
        User 1
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => setUserRole("user2")}
      >
        User 2
      </Button>
    </Container>
  );
};

const App = () => {
  const { i18n } = useTranslation();

  // State for logged in user role; if null, user is not logged in
  const [userRole, setUserRole] = useState(null);

  // State for tasks and editing mode
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // States for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Additional states for language, side menu and selected entity
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState("");

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Fetch tasks when component mounts or when the selected entity changes
  useEffect(() => {
    if (!userRole) return; // Don't fetch tasks if not logged in
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
  }, [selectedEntity, userRole]);

  // Automatically set the selected entity based on the logged in user (if not admin)
  useEffect(() => {
    if (!userRole) return;
    if (userRole.toLowerCase() !== "admin") {
      const mapping = {
        user1: "1",
        user2: "2"
      };
      setSelectedEntity(mapping[userRole.toLowerCase()] || "");
    }
  }, [userRole]);

  // Handle task creation
  const handleTaskCreated = async (task) => {
    try {
      // Validate required fields
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

  // Function to generate and share task PDF via WhatsApp
  const shareTask = async (task) => {
    try {
      const doc = new jsPDF();
      doc.text(`Title: ${task.title}`, 10, 20);
      doc.text(`Description: ${task.description}`, 10, 30);
      doc.text(
        `Due Date: ${task.dueDate ? task.dueDate.split("T")[0] : "N/A"}`,
        10,
        40
      );
      doc.text(`Status: ${task.status}`, 10, 50);
      const pdfDataUri = doc.output("dataurlstring");
      const message =
        `*Task Details:*\n` +
        `*Title:* ${task.title}\n` +
        `*Due Date:* ${task.dueDate ? task.dueDate.split("T")[0] : "N/A"}\n` +
        `*Status:* ${task.status}\n\n` +
        `*Download PDF:* ${pdfDataUri}`;
      const whatsappUrl = `https://wa.me/966582144870?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error sharing task:", error);
      setError("Failed to share task via WhatsApp: " + error.message);
      setSnackbarOpen(true);
    }
  };

  // If user is not logged in, show the LoginPage
  if (!userRole) {
    return <LoginPage setUserRole={setUserRole} />;
  }

  // Main Task Management Page (when user is logged in)
  return (
    <>
      <Container maxWidth="sm" className="app-container">
        <SideMenu
          menuOpen={menuOpen}
          toggleMenu={() => setMenuOpen(!menuOpen)}
          toggleLanguage={() => {
            const newLang = lang === "en" ? "ar" : "en";
            setLang(newLang);
            i18n.changeLanguage(newLang);
            document.body.dir = newLang === "ar" ? "rtl" : "ltr";
          }}
          lang={lang}
          userRole={userRole}
          onLogout={() => setUserRole(null)}
        />

        {/* Show entity selection dropdown only for Admin */}
        {userRole.toLowerCase() === "admin" && (
          <select
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="form-field"
            value={selectedEntity}
          >
            <option value="">All Tasks</option>
            <option value="1">User1</option>
            <option value="2">User2</option>
          </select>
        )}

        {/* Task Form */}
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
                onShareTask={shareTask}
              />
            ))}
          </div>
        ) : (
          <Typography variant="body1">No tasks available.</Typography>
        )}

        {/* Snackbar for error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default App;
