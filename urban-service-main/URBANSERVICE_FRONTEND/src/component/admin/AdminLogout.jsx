import React, { useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AdminLogout = () => {
  const navigate = useNavigate();

  const adminLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <>
      <ToastContainer autoClose={1000} />
      <Container maxWidth="sm" sx={{ mt: 20 }}>
        <Card sx={{ boxShadow: 5, borderRadius: 3, textAlign: "center", p: 3 }}>
          <CardContent>
            <Logout sx={{ fontSize: 50, color: "error.main" }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 2, mb: 2 }}>
              Logging Out...
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Thank you for use Uerban Services.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                className="btn bg-gradient-dark"
                fullWidth
                onClick={() => adminLogout()}
              >
                Logout
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};
