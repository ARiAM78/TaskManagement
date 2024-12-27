import React, { useState } from "react";
import { createTask, updateTask } from "../api"; // Ensure the updateTask function is imported from API
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const TaskForm = ({ onTaskCreated, taskToEdit, onEditComplete }) => {
  // Initialize taskDetails state. If taskToEdit exists, load its details; otherwise, use default values.
  const [taskDetails, setTaskDetails] = useState({
    title: taskToEdit ? taskToEdit.title : "",
    description: taskToEdit ? taskToEdit.description : "",
    dueDate: taskToEdit ? taskToEdit.dueDate : "",
    status: taskToEdit ? taskToEdit.status : "Pending",
  });

  // Handle form input changes and update the corresponding state values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission. If taskToEdit exists, update the task; otherwise, create a new task.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, dueDate, status } = taskDetails;

    if (taskToEdit) {
      // If editing an existing task, call the updateTask function with the updated task data.
      const updatedTask = { id: taskToEdit.id, title, description, dueDate, status };
      const response = await updateTask(updatedTask);

      if (response) {
        // Once the task is updated successfully, call onEditComplete to close the form.
        onEditComplete();
      }
    } else {
      // If adding a new task, call the createTask function with the new task data.
      const newTask = { title, description, dueDate, status };
      const createdTask = await createTask(newTask);

      if (createdTask) {
        // Once the task is created successfully, call onTaskCreated to close the form.
        onTaskCreated();
        // Reset the form fields after successful task creation.
        setTaskDetails({
          title: "",
          description: "",
          dueDate: "",
          status: "Pending",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto', backgroundColor: '#FBFBFB', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ marginBottom: '15px' }}>
        <TextField
          fullWidth
          label="Task Title"
          name="title"
          value={taskDetails.title}
          onChange={handleChange}
          required
          InputProps={{
            style: { backgroundColor: 'transparent', borderRadius: '5px' }
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <TextField
          fullWidth
          label="Task Description"
          name="description"
          value={taskDetails.description}
          onChange={handleChange}
          required
          InputProps={{
            style: { backgroundColor: 'transparent', borderRadius: '5px' }
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <TextField
          fullWidth
          label="Due Date"
          name="dueDate"
          type="date"
          value={taskDetails.dueDate}
          onChange={handleChange}
          required
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: { backgroundColor: 'transparent', borderRadius: '5px' }
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={taskDetails.status}
            onChange={handleChange}
            label="Status"
            style={{ backgroundColor: 'transparent', borderRadius: '5px' }}
          >
            <MenuItem value="Pending" style={{ backgroundColor: '#FBFBFB' }}>Pending</MenuItem>
            <MenuItem value="Completed" style={{ backgroundColor: '#FBFBFB' }}>Completed</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        fullWidth
        style={{ backgroundColor: '#4A628A', color: 'white', borderRadius: '5px', padding: '10px 0', marginBottom: '10px' }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#3A4F73'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4A628A'}
      >
        {taskToEdit ? "Edit Task" : "Add Task"}
      </Button>
      {taskToEdit && (
        <Button
          onClick={() => onEditComplete()}
          variant="outlined"
          color="secondary"
          fullWidth
          style={{ borderColor: '#4A628A', color: '#4A628A', borderRadius: '5px', padding: '10px 0' }}
        >
          Cancel Edit
        </Button>
      )}
    </form>
  );
};

export default TaskForm;
