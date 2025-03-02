import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import { useTranslation } from "react-i18next";
import "./style.css";

const Dashboard = ({ userRole, selectedEntity }) => {
  const { t } = useTranslation();
  const [data, setData] = useState({ tasksCount: 0, usersCount: 0 });

  useEffect(() => {
    let url = "https://localhost:7228/api/tasks/dashboard";
    if (userRole && userRole.toLowerCase() !== "admin" && selectedEntity) {
      url += `?entityId=${selectedEntity}`;
    }
    axios.get(url)
      .then(response => setData(response.data))
      .catch(err => console.error("Error fetching dashboard data:", err));
  }, [userRole, selectedEntity]);

  return (
    <div className="dashboard-container">
      <Typography variant="h4" gutterBottom>
        {userRole === "admin" 
          ? t("adminDashboard") 
          : `${t("userDashboard")} (${userRole})`}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card className="dashboard-card">
            <CardContent>
              <div className="dashboard-icon-container">
                <AssignmentIcon className="dashboard-icon" />
              </div>
              <Typography variant="h6" component="p">
                {t("totalTasks")}
              </Typography>
              <Typography variant="h4" component="p">
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
              <Typography variant="h6" component="p">
                {t("totalUsers")}
              </Typography>
              <Typography variant="h4" component="p">
                {data.usersCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
