import React, { useState, useEffect } from "react";
import { fetchTasks, fetchTaskById, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import { Button, Typography, Container } from "@mui/material";
import SideMenu from "./components/SideMenu";
import { useTranslation } from 'react-i18next'; 
import "./index.css";
import './i18next';

const App = () => {
  const { i18n } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch tasks when component mounts
  useEffect(() => {
    const getTasks = async () => {
      const data = await fetchTasks();
      setTasks(data);
    };
    getTasks();
  }, []);

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
  const handleEditComplete = () => {
    setTaskToEdit(null);
  };

  // Change status of a task
  const handleStatusChange = async (taskId, status) => {
    const updatedTask = tasks.find((task) => task.id === taskId);
    if (updatedTask) {
      updatedTask.status = status;
      await updateTask(updatedTask);
      const data = await fetchTasks();
      setTasks(data);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
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
  };

  return (
    <Container maxWidth="sm" className="app-container">
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
        ))}
      </div>
    </Container>
  );
};

export default App;