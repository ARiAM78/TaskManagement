import React from "react";
import { jsPDF } from "jspdf";
import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

const TaskItem = ({ tasks }) => {
  const { i18n } = useTranslation();

  // Save a single task as a PDF
  const saveTaskAsPDF = (task) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.text(i18n.t("taskDetails"), 10, 10);
    doc.text(`${i18n.t("title")}: ${task.title}`, 10, 20);
    doc.text(`${i18n.t("description")}: ${task.description}`, 10, 30);
    doc.text(`${i18n.t("status")}: ${i18n.t(task.status === "Pending" ? "pending" : "completed")}`, 10, 40);
    doc.save(`${task.title}.pdf`);
  };

  return (
    <div>
      <h2>{i18n.t("taskList")}</h2>
      {tasks.map((task) => (
        <div key={task.id} className="task-item" style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0", borderRadius: "5px" }}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>{i18n.t("status")}: {i18n.t(task.status === "Pending" ? "pending" : "completed")}</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="contained" color="primary" startIcon={<EditIcon />}>
              {i18n.t("edit")}
            </Button>
            <Button variant="contained" color="error" startIcon={<DeleteIcon />}>
              {i18n.t("delete")}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => saveTaskAsPDF(task)}
              startIcon={<SaveIcon />}
            >
              {i18n.t("saveAsPDF")}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskItem;
