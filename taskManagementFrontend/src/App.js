import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { fetchTasks, fetchTaskById, createTask, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem"; 
import { Typography, Container } from "@mui/material";
import SideMenu from "./components/SideMenu";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import "./index.css";
import "./i18next";
=======
import { fetchTasks, fetchTaskById, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import { Button, Typography, Container } from "@mui/material";
import SideMenu from "./components/SideMenu";
import { useTranslation } from 'react-i18next'; 
import "./index.css";
import './i18next';
>>>>>>> f026b913190b8260536db58d1f540ca307ad751c

const App = () => {
  const { i18n } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);

<<<<<<< HEAD
  // Fetch tasks when the component mounts
=======
  // Fetch tasks when component mounts
>>>>>>> f026b913190b8260536db58d1f540ca307ad751c
  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    getTasks();
  }, []);

<<<<<<< HEAD
  // Handle task creation (Add New Task)
  const handleTaskCreated = async (task) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const newTask = await createTask(task);
      const updatedTasks = await fetchTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Error creating the task. Please try again.");
    }
  };

  // Handle task update
  const handleTaskUpdate = async (updatedTask) => {
    try {
      await updateTask(updatedTask);
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Error updating the task. Please try again.");
    }
  };

  // Fetch task for editing
  const handleTaskEdit = async (taskId) => {
    try {
      const task = await fetchTaskById(taskId);
      setTaskToEdit(task);
    } catch (error) {
      console.error("Error fetching task for editing:", error);
    }
  };

  // Clears editing mode after updating
=======
  // Update task list after creating a new task
  const handleTaskCreated = (newTask) => {
    const addTask = async () => {
      await updateTask(newTask); // Assuming you add tasks via API
      const data = await fetchTasks();
      setTasks(data);
    };
    addTask();
  };

  // Fetch task for editing
  const handleTaskEdit = async (taskId) => {
    try {
      const task = await fetchTaskById(taskId);
      setTaskToEdit(task); 
    } catch (error) {
      console.error("Error fetching task for editing:", error);
    }
  };

  // Clear task to edit after editing is complete
>>>>>>> f026b913190b8260536db58d1f540ca307ad751c
  const handleEditComplete = () => {
    setTaskToEdit(null);
  };

<<<<<<< HEAD
  // Toggle task status
  const handleStatusChange = async (taskId, status) => {
    try {
      const updatedTask = tasks.find((task) => task.id === taskId);
      if (updatedTask) {
        updatedTask.status = status;
        await updateTask(updatedTask);
        const data = await fetchTasks();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
=======
  // Change status of a task
  const handleStatusChange = async (taskId, status) => {
    const updatedTask = tasks.find((task) => task.id === taskId);
    if (updatedTask) {
      updatedTask.status = status;
      await updateTask(updatedTask);
      const data = await fetchTasks();
      setTasks(data);
>>>>>>> f026b913190b8260536db58d1f540ca307ad751c
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
<<<<<<< HEAD
    try {
      await deleteTask(id);
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Function to generate and share task PDF via WhatsApp
  const shareTask = async (task) => {
    try {
      const doc = new jsPDF();
      
      // Add task details to the PDF
      doc.text(`Title: ${task.title}`, 10, 20);
      doc.text(`Description: ${task.description}`, 10, 30);
      doc.text(`Due Date: ${task.dueDate ? task.dueDate.split("T")[0] : "N/A"}`, 10, 40);
      doc.text(`Status: ${task.status}`, 10, 50);

      // Generate PDF as Blob
      const pdfBlob = doc.output("blob");

      // Convert Blob to Object URL
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a temporary download link (for user convenience)
      const downloadLink = document.createElement("a");
      downloadLink.href = pdfUrl;
      downloadLink.download = `${task.title}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Construct WhatsApp message (compact version)
      const message = `*Task Details:*\n`
        + `*Title:* ${task.title}\n`
        + `*Due Date:* ${task.dueDate ? task.dueDate.split("T")[0] : "N/A"}\n`
        + `*Status:* ${task.status}\n\n`
        + `*Download PDF:* ${pdfUrl}`;

      // Generate WhatsApp sharing URL
      const whatsappUrl = `https://wa.me/966582144870?text=${encodeURIComponent(message)}`;

      // Open WhatsApp link
      window.open(whatsappUrl, "_blank");

      // Clean up Blob URL after 30 seconds (to prevent memory leaks)
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 30000);
    } catch (error) {
      console.error("Error sharing task:", error);
      alert("Failed to share task via WhatsApp.");
    }
=======
    await deleteTask(id);
    const data = await fetchTasks();
    setTasks(data);
  };

  // Toggle between English and Arabic languages
  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
    i18n.changeLanguage(newLang); 
    document.body.dir = newLang === "ar" ? "rtl" : "ltr"; 
  };

  // Toggle side menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
>>>>>>> f026b913190b8260536db58d1f540ca307ad751c
  };

  return (
    <Container maxWidth="sm" className="app-container">
<<<<<<< HEAD
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
      />
      <Typography variant="h4" gutterBottom>
        {i18n.t("taskManagement")}
      </Typography>
      <TaskForm
        onTaskCreated={handleTaskCreated} // Ensures adding new tasks
        taskToEdit={taskToEdit}
        onEditComplete={handleEditComplete}
        onUpdateTask={handleTaskUpdate} // Pass handleTaskUpdate correctly
      />
      <div className="task-list">
        {tasks.length > 0 && tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={handleTaskEdit}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onShareTask={shareTask}
          />
=======
      <SideMenu menuOpen={menuOpen} toggleMenu={toggleMenu} toggleLanguage={toggleLanguage} lang={lang} />

      <Typography variant="h4" gutterBottom>{i18n.t('taskManagement')}</Typography>

      {/* Task form */}
      <TaskForm 
        onTaskCreated={handleTaskCreated} 
        taskToEdit={taskToEdit} 
        onEditComplete={handleEditComplete} 
      />

      {/* List of tasks */}
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body1">{task.description}</Typography>
            <Typography variant="body2">{i18n.t('dueDate')}: {task.dueDate.split('T')[0]}</Typography>
            <Typography variant="body2">{i18n.t('status')}: {i18n.t(task.status === 'Pending' ? 'pending' : 'completed')}</Typography>

            <div className="task-actions">
              {/* Edit and Delete buttons on the same row */}
              <div className="edit-delete-buttons">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleTaskEdit(task.id)}
                  className="full-width-button"
                >
                  {i18n.t('edit')}
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteTask(task.id)}
                  className="full-width-button"
                >
                  {i18n.t('delete')}
                </Button>
              </div>

              {/* Change status button */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleStatusChange(task.id, task.status === 'Pending' ? 'Completed' : 'Pending')}
                className="full-width-button"
              >
                {task.status === 'Pending' ? i18n.t('Completed') : i18n.t('Pending')}
              </Button>
            </div>
          </div>
>>>>>>> f026b913190b8260536db58d1f540ca307ad751c
        ))}
      </div>
    </Container>
  );
};

export default App;