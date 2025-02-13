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
    entityId: "", // EntityId field in state
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // When taskToEdit changes, update the form state or reset the form
  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit);
    } else {
      resetForm();
    }
  }, [taskToEdit]);

  // Reset form fields
  const resetForm = () => {
    setTask({
      title: "",
      description: "",
      dueDate: "",
      status: "Pending",
      entityId: "", // Reset EntityId
    });
  };

  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Handle form submission with validation based on user role
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate common required fields
    if (!task.title || !task.description || !task.dueDate) {
      setSnackbarMessage(t("allFieldsRequired"));
      setOpenSnackbar(true);
      return;
    }
    // For admin users, entityId must be selected
    if (userRole.toLowerCase() === "admin" && !task.entityId) {
      setSnackbarMessage(t("entitySelectionRequired"));
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
      setSnackbarMessage(t("taskAddUpdateFailed"));
      setOpenSnackbar(true);
    }
  };

  // Cancel update operation
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
        {t("taskManagement")}
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

        {/* Render entity selection only for admin users */}
        {userRole.toLowerCase() === "admin" && (
          <FormControl fullWidth className="form-field">
            <InputLabel>{t("entity")}</InputLabel>
            <Select
              name="entityId"
              value={task.entityId}
              onChange={handleChange}
              label={t("entity")}
              required
            >
              <MenuItem value="">
                <em>{t("none")}</em>
              </MenuItem>
              <MenuItem value="1">User1</MenuItem>
              <MenuItem value="2">User2</MenuItem>
            </Select>
          </FormControl>
        )}

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
