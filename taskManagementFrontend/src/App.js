import React, { useState, useEffect } from "react";
import { fetchTasks, fetchTaskById, createTask, updateTask, deleteTask, searchTasks, fetchTasksByCategory } from "./api";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import SideMenu from "./components/SideMenu";
import { Typography, Container, Button, CircularProgress, Snackbar, Alert, TextField, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import "./index.css";
import "./i18next";
import "./components/style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";

// LoginPage Component for user selection with translation
const LoginPage = ({ setUserRole }) => {
  const { t } = useTranslation();
  return (
    <Container maxWidth="sm" className="app-container">
      <Typography variant="h4" gutterBottom>
        {t("selectAUser")}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginBottom: "1rem" }}
        onClick={() => setUserRole("admin")}
      >
        {t("admin")}
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginBottom: "1rem" }}
        onClick={() => setUserRole("user1")}
      >
        {t("user1")}
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => setUserRole("user2")}
      >
        {t("user2")}
      </Button>
    </Container>
  );
};

const App = () => {
  const { i18n, t } = useTranslation();
  const [userRole, setUserRole] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassification, setSelectedClassification] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  useEffect(() => {
    if (!userRole) return;
    const getTasks = async () => {
      setLoading(true);
      try {
        let data = [];
        if (searchQuery.trim() !== "") {
          // If search query is provided, use searchTasks API
          data = await searchTasks(searchQuery);
        } else if (selectedClassification !== "") {
          // If classification filter is applied, use fetchTasksByCategory API
          data = await fetchTasksByCategory(selectedClassification);
        } else {
          // Otherwise fetch all tasks (optionally filtered by entity)
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
  }, [selectedEntity, userRole, t, searchQuery, selectedClassification]);

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
      // Automatically assign entityId for non-admin users
      if (userRole.toLowerCase() !== "admin") {
        const mapping = {
          user1: "1",
          user2: "2"
        };
        task.entityId = mapping[userRole.toLowerCase()] || "";
      }
      // Validate required fields
      if (!task.title || !task.description || !task.dueDate || !task.entityId) {
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

  return (
    <Router>
      <Routes>
        {/* Dashboard route wrapped in Container with SideMenu */}
        <Route
          path="/dashboard"
          element={
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
              <Dashboard userRole={userRole} selectedEntity={selectedEntity} />
            </Container>
          }
        />
        {/* Default route for main content */}
        <Route
          path="/*"
          element={
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
                  <option value="">{t("allTasks")}</option>
                  <option value="1">{t("user1")}</option>
                  <option value="2">{t("user2")}</option>
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

              {/* Search Bar */}
              <div className="search-container">
                <TextField
                  label={t("searchTasks") || "Search Tasks"}
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-field"
                />
              </div>

              {/* Classification Dropdown Filter */}
              <TextField
                select
                label={t("category")}
                variant="outlined"
                fullWidth
                value={selectedClassification}
                onChange={(e) => setSelectedClassification(e.target.value)}
                margin="normal"
              >
                <MenuItem value="">
                  <em>{t("allCategories")}</em>
                </MenuItem>
                <MenuItem value="Professional">{t("professional")}</MenuItem>
                <MenuItem value="Academic">{t("academic")}</MenuItem>
                <MenuItem value="Appointments">{t("appointments")}</MenuItem>
              </TextField>

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
                      userRole={userRole}
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
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
