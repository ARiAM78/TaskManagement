import React, { useState, useEffect } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./style.css";

const TaskForm = ({ onTaskCreated, taskToEdit, onEditComplete, onUpdateTask, userRole }) => {
  const { t } = useTranslation();
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
    entityId: "", // Added EntityId
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit);
    } else {
      resetForm();
    }
  }, [taskToEdit]);

  const resetForm = () => {
    setTask({
      title: "",
      description: "",
      dueDate: "",
      status: "Pending",
      entityId: "", // Reset EntityId
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.title || !task.description || !task.dueDate || !task.entityId) {
      setSnackbarMessage("All fields are required!");
      setOpenSnackbar(true);
      return;
    }

    try {
      if (taskToEdit) {
        await onUpdateTask(task);
        onEditComplete();
      } else {
        await onTaskCreated({ ...task });
      }
      resetForm();
    } catch (error) {
      console.error("Error handling task submission:", error);
      setSnackbarMessage("Failed to add/update task. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleCancelUpdate = () => {
    resetForm();
    onEditComplete();
  };

  return (
    <>
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        className="task-management-title"
      >
        Task Management
      </Typography>

      <form className="task-form" onSubmit={handleSubmit}>
        <TextField
          label={t("title")}
          name="title"
          value={task.title}
          onChange={handleChange}
          fullWidth
          required
          className="form-field"
        />
        <TextField
          label={t("description")}
          name="description"
          value={task.description}
          onChange={handleChange}
          fullWidth
          required
          multiline
          rows={4}
          className="form-field"
        />
        <TextField
          label={t("dueDate")}
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
          className="form-field"
        />

        <FormControl fullWidth className="form-field">
          <InputLabel>{t("status")}</InputLabel>
          <Select
            value={task.status}
            onChange={handleChange}
            label={t("status")}
            name="status"
          >
            <MenuItem value="Pending">{t("pending")}</MenuItem>
            <MenuItem value="Completed">{t("completed")}</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="full-width-button"
        >
          {taskToEdit ? t("update Task") : t("add Task")}
        </Button>

        {taskToEdit && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCancelUpdate}
            className="full-width-button"
          >
            {t("cancel Update")}
          </Button>
        )}
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
};

export default TaskForm;
