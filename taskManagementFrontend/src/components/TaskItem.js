import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "./style.css";
import { Button, Snackbar, Alert } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const TaskItem = ({ task, onEdit, onDelete, onStatusChange, onShareTask }) => {
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Format Due Date
  const formattedDueDate = task.dueDate ? task.dueDate.split("T")[0] : "N/A";

  // Save PDF: Saves the file locally
  const saveTaskAsPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text(`Title: ${task.title}`, 10, 20);
      doc.text(`Description: ${task.description}`, 10, 30);
      doc.text(`Due Date: ${formattedDueDate}`, 10, 40); // Include Due Date
      doc.text(`Status: ${task.status}`, 10, 50);

      doc.save(`${task.title}.pdf`); // Save the PDF locally
      setNotificationMessage("PDF Saved Successfully!");
      setOpenNotification(true); // Show notification
    } catch (error) {
      console.error("Error saving PDF:", error);
      setNotificationMessage("Failed to save PDF. Please try again.");
      setOpenNotification(true);
    }
  };

  return (
    <div
      className="task-item"
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "5px",
      }}
    >
      <h3>{task.title}</h3>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Due Date:</strong> {formattedDueDate}</p> {/* Include Due Date */}
      <p>
        <strong>Status:</strong>{" "}
        {task.status === "Pending" ? (
          <span style={{ color: "orange" }}>Pending</span>
        ) : (
          <span style={{ color: "green" }}>Completed</span>
        )}
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        {/* Edit button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => onEdit(task.id)}
        >
          Edit
        </Button>

        {/* Delete button */}
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>

        {/* Save as PDF button */}
        <Button
          variant="contained"
          color="info"
          startIcon={<SaveIcon />}
          onClick={saveTaskAsPDF}
        >
          Save
        </Button>

        {/* Share PDF button */}
        <Button
          variant="contained"
          color="success"
          startIcon={<ShareIcon />}
          onClick={() => onShareTask(task)}
        >
          Share
        </Button>

        {/* Toggle Status button */}
        <Button
          variant="contained"
          color="secondary"
          startIcon={
            task.status === "Pending" ? <DoneIcon /> : <PendingActionsIcon />
          }
          onClick={() =>
            onStatusChange(
              task.id,
              task.status === "Pending" ? "Completed" : "Pending"
            )
          }
        >
          {task.status === "Pending" ? "Complete" : "Pending"}
        </Button>
      </div>

      {/* Snackbar notification for Save */}
      <Snackbar
        open={openNotification}
        autoHideDuration={3000}
        onClose={() => setOpenNotification(false)}
      >
        <Alert severity={notificationMessage.includes("Successfully") ? "success" : "error"}>
          {notificationMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TaskItem;
