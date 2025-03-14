const API_URL = "https://localhost:7228/api/tasks"; // Backend API URL for tasks

// Fetch all tasks or filter by EntityId
export const fetchTasks = async (entityId = null) => {
  try {
    // If an entityId is provided, filter tasks by it, otherwise fetch all tasks
    const url = entityId ? `${API_URL}?entityId=${entityId}` : API_URL;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to fetch tasks");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Fetch a task by ID
export const fetchTaskById = async (id) => {
  try {
    if (!id) {
      throw new Error("Task ID is required.");
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to fetch task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};

// Create a new task with EntityId
export const createTask = async (task) => {
  try {
    // Ensure all required fields are provided, including entityId which is set on the client side based on the user role
    if (!task.title || !task.description || !task.dueDate || !task.entityId) {
      throw new Error("All fields (title, description, dueDate, entityId) are required.");
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to create task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (updatedTask) => {
  try {
    if (!updatedTask.id) {
      throw new Error("Task ID is required for update.");
    }

    // The entityId should be maintained based on the user role on the client side.
    const response = await fetch(`${API_URL}/${updatedTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to update task");
    }

    // If the server responds with 204 (No Content), return an empty object
    return response.status === 204 ? {} : await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    if (!id) {
      throw new Error("Task ID is required for deletion.");
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if deletion was successful (status 204 indicates no content)
    if (!response.ok && response.status !== 204) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Failed to delete task");
    }

    return {};
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
