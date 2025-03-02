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
import { useTranslation } from "react-i18next";

const TaskItem = ({ task, onEdit, onDelete, onStatusChange, onShareTask, userRole }) => {
  const { t } = useTranslation();
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const formattedDueDate = task.dueDate ? task.dueDate.split("T")[0] : t("na");

// Function to determine the owner of the task
  const getTaskOwner = () => {
    
    if (task.userName) {
      return task.userName;
    }
    if (userRole.toLowerCase() !== "admin") {
      return userRole;
    }
    if (task.entityId) {
      const mapping = {
        "1": "User1",
        "2": "User2"
      };
      return mapping[task.entityId] || t("unknownUser");
    }
    return t("unknownUser");
  };

  // Save PDF: Saves the file locally
  const saveTaskAsPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text(`${t("pdfTitle")} ${task.title}`, 10, 20);
      doc.text(`${t("pdfDescription")} ${task.description}`, 10, 30);
      doc.text(`${t("pdfDueDate")} ${formattedDueDate}`, 10, 40);
      doc.text(`${t("pdfStatus")} ${task.status}`, 10, 50);
      doc.text(`${t("pdfUserName")}: ${getTaskOwner()}`, 10, 60);
      doc.save(`${task.title}.pdf`);
      setNotificationMessage(t("pdfSavedSuccess"));
      setOpenNotification(true);
    } catch (error) {
      console.error(t("pdfSaveFailed"), error);
      setNotificationMessage(t("pdfSaveFailed"));
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
      <p>
        <strong>{t("pdfDescription")}</strong> {task.description}
      </p>
      <p>
        <strong>{t("pdfDueDate")}</strong> {formattedDueDate}
      </p>
      <p>
        <strong>{t("pdfStatus")}</strong>{" "}
        {task.status === "Pending" ? (
          <span style={{ color: "orange" }}>{t("pending")}</span>
        ) : (
          <span style={{ color: "green" }}>{t("completed")}</span>
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
          {t("edit")}
        </Button>

        {/* Delete button */}
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(task.id)}
        >
          {t("delete")}
        </Button>

        {/* Save as PDF button */}
        <Button
          variant="contained"
          color="info"
          startIcon={<SaveIcon />}
          onClick={saveTaskAsPDF}
        >
          {t("save")}
        </Button>

        {/* Share PDF button */}
        <Button
          variant="contained"
          color="success"
          startIcon={<ShareIcon />}
          onClick={() => onShareTask(task)}
        >
          {t("share")}
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
          {task.status === "Pending" ? t("complete") : t("pending")}
        </Button>
      </div>

      {/* Snackbar notification for Save */}
      <Snackbar
        open={openNotification}
        autoHideDuration={3000}
        onClose={() => setOpenNotification(false)}
      >
        <Alert
          severity={
            notificationMessage.includes(t("pdfSavedSuccess"))
              ? "success"
              : "error"
          }
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TaskItem;