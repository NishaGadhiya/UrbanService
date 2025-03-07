import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CheckCircle, Cancel, Visibility } from "@mui/icons-material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

export function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionType, setActionType] = useState("");
  const navigate = useNavigate();

  // Fetch all bookings for the service provider
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(
        `http://localhost:4000/bookings/get-booking/serviceprovider`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBookings(res.data.data);
    } catch (error) {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Open dialog box
  const handleOpenDialog = (booking, action) => {
    setSelectedBooking(booking);
    setActionType(action);
    setOpenDialog(true);
  };

  // Close dialog box
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
    setActionType("");
  };

  // Confirm and update booking status
  const handleConfirmAction = async () => {
    if (!selectedBooking) return;
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:4000/bookings/update-status/${selectedBooking._id}`,
        { status: actionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Booking status updated to ${actionType}!`);
      fetchBookings();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update booking status."
      );
    }
    handleCloseDialog();
  };

  // Status colors
  const statusColors = {
    pending: "#f57c00", // Orange
    accepted: "#388e3c", // Green
    rejected: "#d32f2f", // Red
    completed: "#1976d2", // Blue
    cancelled: "#757575", // Gray
  };

  const paymentStatusColors = {
    pending: "#f57c00", // Orange
    completed: "#388e3c", // Green
    failed: "#d32f2f", // Red
  };

  // Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "user",
      headerName: "User Name",
      width: 200,
      valueGetter: (params) => params.row?.user?.name || "N/A",
    },
    {
      field: "service",
      headerName: "Service",
      width: 200,
      valueGetter: (params) => params.row?.serviceId?.name || "N/A",
    },
    {
      field: "date",
      headerName: "Date",
      width: 150,
      valueGetter: (params) =>
        new Date(params.row.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    { field: "address", headerName: "Address", width: 300 },
    { field: "price", headerName: "Amount (₹)", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            bgcolor: statusColors[params.value] || "gray",
            color: "white",
            px: 2,
            py: 0.5,
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </Box>
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            bgcolor: paymentStatusColors[params.value] || "gray",
            color: "white",
            px: 2,
            py: 0.5,
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box>
          {params.row.status === "pending" && (
            <>
              <IconButton
                color="success"
                onClick={() => handleOpenDialog(params.row, "accepted")}
              >
                <CheckCircle />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleOpenDialog(params.row, "rejected")}
              >
                <Cancel />
              </IconButton>
            </>
          )}
          <IconButton
            color="primary"
            onClick={() =>
              navigate(`/service_provider/booking-details/${params.row._id}`)
            }
          >
            <Visibility />
          </IconButton>
        </Box>
      ),
    },
  ];

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
        >
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
              Booking Management
            </Typography>
          </CardContent>
        </Card>
        {loading ? (
          <CircularProgress />
        ) : (
          <Paper
            elevation={4}
            sx={{ p: 2, borderRadius: 3, bgcolor: "grey.900", color: "white" }}
          >
            <DataGrid
              rows={bookings.map((booking, index) => ({
                ...booking,
                id: index + 1,
              }))}
              columns={columns}
              pageSizeOptions={[25, 50, 75, 100]}
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-root": {
                  color: "#333",
                  borderColor: "oklab(0.24 0 0)",
                  backgroundColor: "white",
                },
                "& .MuiDataGrid-cell": {
                  color: "#222",
                  borderBottom: "1px solid oklab(0.24 0 0)",
                  fontSize: "15px",
                  fontWeight: "500",
                  padding: "12px",
                },
                "& .MuiDataGrid-row:nth-of-type(odd)": {
                  bgcolor: "#f8f9fa",
                },
                "& .MuiDataGrid-row:nth-of-type(even)": {
                  bgcolor: "white",
                },
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: "rgba(52, 71, 103, 0.5)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderBottom: "2px solid white",
                  textTransform: "uppercase",
                },
                "& .MuiDataGrid-footerContainer": {
                  bgcolor: "rgba(52, 71, 103, 0.5)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderBottom: "2px solid white",
                  textTransform: "uppercase",
                },
              }}
            />
          </Paper>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {actionType} this service?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="error">
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
