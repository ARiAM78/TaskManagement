const express = require('express');
const app = express();
const PORT = 5253;

app.use(express.json());

const tasks = []; // Array to hold tasks

// GET all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// POST a new task
app.post('/tasks', (req, res) => {
    const newTask = req.body;
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT (update) a task by ID
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const updatedTask = req.body;

    // Find task by ID
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found." });
    }

    // Update the task
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    res.json(tasks[taskIndex]);  // Return updated task
});

// DELETE a task by ID
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;

    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found." });
    }

    // Delete task
    tasks.splice(taskIndex, 1);
    res.status(204).send();  // Return 204 No Content after deletion
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});