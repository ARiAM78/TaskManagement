const API_URL = "http://localhost:5253"; // Backend API URL

// Fetch all tasks with error handling
export const fetchTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Create a new task with error handling
export const createTask = async (task) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update an existing task with error handling
export const updateTask = async (id, updatedTask) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task with error handling
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
