const API_URL = "https://localhost:7228/api/tasks"; // Backend API URL for tasks

// Fetch all tasks with error handling
export const fetchTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok'); // Handle network errors
    }
    return await response.json();  // Convert response to JSON
  } catch (error) {
    console.error('Error fetching tasks:', error);  // Log any errors
    throw error;  // Rethrow the error for further handling in the component
  }
};

// Create a new task with error handling
export const createTask = async (task) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),  // Send the task as JSON
    });
    if (!response.ok) {
      throw new Error('Failed to create task'); // Handle failed creation
    }
    return await response.json();  // Return the created task
  } catch (error) {
    console.error('Error creating task:', error);  // Log any errors
    throw error;  // Rethrow the error for further handling
  }
};

// Update an existing task with error handling
export const updateTask = async (updatedTask) => {
  try {
    if (!updatedTask.id) {
      throw new Error('Task ID is missing');  // Ensure the task ID is provided
    }

    const response = await fetch(`${API_URL}/${updatedTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),  // Send updated task as JSON
    });

    if (!response.ok) {
      throw new Error('Failed to update task'); // Handle failed update
    }

    // Handle empty response for 204 (no content)
    return response.status === 204 ? {} : await response.json();  
  } catch (error) {
    console.error('Error updating task:', error);  // Log any errors
    throw error;  // Rethrow the error for further handling
  }
};

// Delete a task with error handling
export const deleteTask = async (id) => {
  try {
    if (!id) {
      throw new Error('Task ID is missing');  // Ensure the task ID is provided
    }

    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error('Failed to delete task');  // Handle failed deletion
    }

    // Handle empty response for 200 (successful deletion)
    return response.status === 200 ? {} : await response.json();  
  } catch (error) {
    console.error('Error deleting task:', error);  // Log any errors
    throw error;  // Rethrow the error for further handling
  }
};
