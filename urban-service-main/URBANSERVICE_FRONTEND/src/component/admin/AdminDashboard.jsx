import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { People, Category, Layers, Business } from "@mui/icons-material";
import axios from "axios";
import { getToken } from "../../utils/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    subcategories: 0,
    serviceProviders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:4000/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setStats(res.data);
        }
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = {
    labels: ["Categories", "Subcategories", "Service Providers", "Users"],
    datasets: [
      {
        data: [
          stats.categories,
          stats.subcategories,
          stats.serviceProviders,
          stats.users,
        ],
        backgroundColor: ["#3f51b5", "#f50057", "#ff9800", "#4caf50"],
        borderRadius: 5,
      },
    ],
  };
  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;

  return (
    <>
      <ToastContainer autoClose={1000} />
      <Container>
        <Card
          sx={{
            mt: 2,
            mb: 2,
            p: 1,
            backgroundColor: "rgb(36, 36, 39)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
          }}
          className="bg-gradient-dark"
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#fff" }}
              >
                Admin Dashboard
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <Grid container spacing={3}>
          {/* Categories */}
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                bgcolor: "#3f51b5",
                color: "white",
                textAlign: "center",
                p: 2,
              }}
            >
              <CardContent>
                <Category sx={{ fontSize: 40 }} />
                <Typography variant="h6" color={"white"}>
                  Categories
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={"white"}>
                  {stats.categories}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Subcategories */}
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                bgcolor: "#f50057",
                color: "white",
                textAlign: "center",
                p: 2,
              }}
            >
              <CardContent>
                <Layers sx={{ fontSize: 40 }} />
                <Typography variant="h6" color={"white"}>
                  Subcategories
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={"white"}>
                  {stats.subcategories}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Service Providers */}
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                bgcolor: "#ff9800",
                color: "white",
                textAlign: "center",
                p: 2,
              }}
            >
              <CardContent>
                <Business sx={{ fontSize: 40 }} />
                <Typography variant="h6" color={"white"}>
                  Service Providers
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={"white"}>
                  {stats.serviceProviders}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Users */}
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                bgcolor: "#4caf50",
                color: "white",
                textAlign: "center",
                p: 2,
              }}
            >
              <CardContent>
                <People sx={{ fontSize: 40 }} />
                <Typography variant="h6" color={"white"}>
                  Users
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={"white"}>
                  {stats.users}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Chart Section */}
        <Box
          sx={{ mt: 4, p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 3 }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2, textAlign: "center" }}
          >
            System Overview
          </Typography>
          <Bar data={chartData} options={chartOptions} />
        </Box>
      </Container>
    </>
  );
};
