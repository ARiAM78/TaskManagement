import React, { useState } from "react";
import { createTask } from "../api";

const TaskForm = ({ onTaskCreated }) => {
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, dueDate, status } = taskDetails;
    const newTask = { title, description, dueDate, status };
    const createdTask = await createTask(newTask);

    if (createdTask) {
      onTaskCreated();
      setTaskDetails({
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <input
          type="text"
          placeholder="Task Title"
          name="title"
          value={taskDetails.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Task Description"
          name="description"
          value={taskDetails.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="date"
          name="dueDate"
          value={taskDetails.dueDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <select
          name="status"
          value={taskDetails.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <button type="submit" className="submit-button">Add Task</button>
    </form>
  );
};

export default TaskForm;
