import React, { useState, useEffect } from "react";
import { fetchTasks, fetchTaskById, createTask, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem"; 
import { Typography, Container } from "@mui/material";
import SideMenu from "./components/SideMenu";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import "./index.css";
import "./i18next";

const App = () => {
  const { i18n } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch tasks when the component mounts
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
  const handleEditComplete = () => {
    setTaskToEdit(null);
  };

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
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
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
  };

  return (
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
        ))}
      </div>
    </Container>
  );
};

export default App;
