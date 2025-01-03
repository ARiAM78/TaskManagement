import React, { useState } from "react";
import { createTask, updateTask } from "../api"; // Import API functions for creating and updating tasks
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const TaskForm = ({ onTaskCreated, taskToEdit, onEditComplete }) => {
  // Initialize state for task details. If editing, pre-fill with existing task data.
  const [taskDetails, setTaskDetails] = useState({
    title: taskToEdit ? taskToEdit.title : "",
    description: taskToEdit ? taskToEdit.description : "",
    dueDate: taskToEdit ? taskToEdit.dueDate : "",
    status: taskToEdit ? taskToEdit.status : "Pending", // Default status is "Pending"
  });

  // Handle changes to input fields and update the taskDetails state.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value, // Dynamically update the relevant field in the state
    }));
  };

  // Handle form submission for adding or editing a task.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const { title, description, dueDate, status } = taskDetails;

    // Validate that all required fields are filled
    if (!title || !description || !dueDate) {
      alert("Please fill all required fields!"); // Display an error message if validation fails
      return;
    }

    try {
      if (taskToEdit) {
        // If editing an existing task
        const updatedTask = { id: taskToEdit.id, title, description, dueDate, status };
        
        // Ensure the updateTask API function is properly called
        const response = await updateTask(updatedTask);

        if (response) {
          alert("Task updated successfully!"); // Show success message
          onEditComplete(); // Trigger callback to close the form
        } else {
          alert("Failed to update task!"); // Handle case where update failed
        }
      } else {
        // If creating a new task
        const newTask = { title, description, dueDate, status };
        const createdTask = await createTask(newTask);

        if (createdTask) {
          alert("Task created successfully!"); // Show success message
          onTaskCreated(); // Trigger callback to refresh task list
          setTaskDetails({
            // Reset form fields to default values
            title: "",
            description: "",
            dueDate: "",
            status: "Pending",
          });
        }
      }
    } catch (error) {
      // Handle errors during API calls
      console.error("Error saving task:", error);
      alert("An error occurred while saving the task. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit} // Attach the form submission handler
      style={{
        maxWidth: "500px",
        margin: "auto",
        backgroundColor: "#FBFBFB",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Input field for task title */}
      <div style={{ marginBottom: "15px" }}>
        <TextField
          fullWidth
          label="Task Title"
          name="title"
          value={taskDetails.title}
          onChange={handleChange}
          required
          InputProps={{
            style: { backgroundColor: "transparent", borderRadius: "5px" },
          }}
        />
      </div>

      {/* Input field for task description */}
      <div style={{ marginBottom: "15px" }}>
        <TextField
          fullWidth
          label="Task Description"
          name="description"
          value={taskDetails.description}
          onChange={handleChange}
          required
          InputProps={{
            style: { backgroundColor: "transparent", borderRadius: "5px" },
          }}
        />
      </div>

      {/* Input field for task due date */}
      <div style={{ marginBottom: "15px" }}>
        <TextField
          fullWidth
          label="Due Date"
          name="dueDate"
          type="date"
          value={taskDetails.dueDate}
          onChange={handleChange}
          required
          InputLabelProps={{
            shrink: true, // Ensure the label stays visible for date inputs
          }}
          InputProps={{
            style: { backgroundColor: "transparent", borderRadius: "5px" },
          }}
        />
      </div>

      {/* Dropdown for selecting task status */}
      <div style={{ marginBottom: "15px" }}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={taskDetails.status}
            onChange={handleChange}
            label="Status"
            style={{ backgroundColor: "transparent", borderRadius: "5px" }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Submit button for adding or editing tasks */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        style={{
          backgroundColor: "#4A628A",
          color: "white",
          borderRadius: "5px",
          padding: "10px 0",
          marginBottom: "10px",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#3A4F73")} // Change color on hover
        onMouseOut={(e) => (e.target.style.backgroundColor = "#4A628A")}
      >
        {taskToEdit ? "Edit Task" : "Add Task"} {/* Change button text based on the mode */}
      </Button>

      {/* Cancel button for editing mode */}
      {taskToEdit && (
        <Button
          onClick={() => onEditComplete()} // Trigger callback to cancel editing
          variant="outlined"
          color="secondary"
          fullWidth
          style={{
            borderColor: "#4A628A",
            color: "white",
            borderRadius: "5px",
            padding: "10px 0",
          }}
        >
          Cancel Edit
        </Button>
      )}
    </form>
  );
};

export default TaskForm;
