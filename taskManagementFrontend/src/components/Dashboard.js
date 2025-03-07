import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import CircleIcon from "@mui/icons-material/Circle";
import { useTranslation } from "react-i18next";
import { fetchTasksByPriority } from "../api";
import "./style.css";

const Dashboard = ({ userRole, selectedEntity }) => {
  const { t } = useTranslation();
  const [data, setData] = useState({ tasksCount: 0, usersCount: 0 });
  const [priorityCounts, setPriorityCounts] = useState({});
  const [selectedPriority, setSelectedPriority] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const priorityList = [
    { value: "Red", label: t("highPriority"), color: "red" },
    { value: "Green", label: t("mediumPriority"), color: "green" },
    { value: "Gray", label: t("lowPriority"), color: "gray" },
  ];

  useEffect(() => {
    let url = "https://localhost:7228/api/tasks/dashboard";
    if (userRole && userRole.toLowerCase() !== "admin" && selectedEntity) {
      url += `?entityId=${selectedEntity}`;
    }
    axios
      .get(url)
      .then((response) => setData(response.data))
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, [userRole, selectedEntity]);

  // Fetch priority counts data
  useEffect(() => {
    let url = "https://localhost:7228/api/tasks/priority-count";
    if (userRole && userRole.toLowerCase() !== "admin" && selectedEntity) {
      url += `?entityId=${selectedEntity}`;
    }
    axios
      .get(url)
      .then((response) => setPriorityCounts(response.data))
      .catch((err) => console.error("Error fetching priority counts:", err));
  }, [userRole, selectedEntity]);

  // Handle click on a priority card: fetch tasks filtered by that priority
  const handlePriorityClick = (priorityValue) => {
    setSelectedPriority(priorityValue);
    fetchTasksByPriority(priorityValue)
      .then((tasks) => setFilteredTasks(tasks))
      .catch((err) =>
        console.error("Error fetching tasks by priority:", err)
      );
  };

  return (
    <div className="dashboard-container">
      <Typography variant="h4" gutterBottom className="dashboard-title">
        {userRole === "admin"
          ? t("adminDashboard")
          : `${t("userDashboard")} (${userRole})`}
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card className="dashboard-card">
            <CardContent>
              <div className="dashboard-icon-container">
                <AssignmentIcon className="dashboard-icon" />
              </div>
              <Typography variant="h6" className="dashboard-title">
                {t("totalTasks")}
              </Typography>
              <Typography variant="h4" className="dashboard-count">
                {data.tasksCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card className="dashboard-card">
            <CardContent>
              <div className="dashboard-icon-container">
                <PeopleIcon className="dashboard-icon" />
              </div>
              <Typography variant="h6" className="dashboard-title">
                {t("totalUsers")}
              </Typography>
              <Typography variant="h4" className="dashboard-count">
                {data.usersCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Priority Cards */}
      <Grid container spacing={2} marginTop={2}>
        {priorityList.map(({ value, label, color }) => (
          <Grid item xs={12} sm={4} key={value}>
            <Card
              className="dashboard-card"
              onClick={() => handlePriorityClick(value)}
              sx={{ cursor: "pointer" }}
            >
              <CardContent>
                <div className="dashboard-icon-container">
                  <CircleIcon sx={{ color, fontSize: 40 }} />
                </div>
                <Typography variant="h6" className="dashboard-title">
                  {label}
                </Typography>
                <Typography variant="h4" className="dashboard-count">
                  {priorityCounts[value] || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Display tasks filtered by selected priority */}
      {selectedPriority && (
        <>
          <Typography variant="h6" align="center" marginTop={2} className="dashboard-title">
            {t("tasksForPriority")} :{" "}
            {
              priorityList.find(
                (item) => item.value === selectedPriority
              )?.label
            }
          </Typography>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                variant="outlined"
                className="dashboard-card"
                sx={{ margin: "10px 0" }}
              >
                <CardContent>
                  <Typography variant="h6" className="dashboard-title">
                    {task.title}
                  </Typography>
                  <Typography variant="body2">
                    {task.description}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" align="center" marginTop={2}>
              {t("noTasksForPriority") || "No tasks available for this priority."}
            </Typography>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
