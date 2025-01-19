import React, { useState, useEffect } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./styleForm.css";

const TaskForm = ({ onTaskCreated, taskToEdit, onEditComplete }) => {
  const { t } = useTranslation();
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",  // Default status is "Pending"
  });

  // Update form state when taskToEdit changes
  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit);
    } else {
      setTask({
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
      });
    }
  }, [taskToEdit]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskToEdit) {
      onEditComplete(task);
    } else {
      onTaskCreated(task);
    }
    setTask({
      title: "",
      description: "",
      dueDate: "",
      status: "Pending",
    });
  };

  return (
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

      {/* Add Select for status */}
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
        <div className="edit-buttons">
          <Button variant="outlined" onClick={() => onEditComplete(null)} className="full-width-button">
            {t("cancel Edit")}
          </Button>
        </div>
      )}
    </form>
  );
};

export default TaskForm;
