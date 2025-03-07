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
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { getToken } from "../../utils/auth";
import { loadStripe } from "@stripe/stripe-js";

export function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const stripePromise = loadStripe("your-stripe-public-key");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:4000/bookings/get-booking/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
  };

  const handlePayment = async () => {
    if (!selectedBooking) return;
    try {
      const stripe = await stripePromise;
      const token = getToken();

      const response = await axios.post(
        "http://localhost:4000/payment/checkout",
        { bookingId: selectedBooking._id, amount: selectedBooking.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const session = response.data;
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      toast.error("Payment failed. Try again.");
    }
  };

  const statusColors = {
    pending: "#f57c00",
    accepted: "#388e3c",
    rejected: "#d32f2f",
    completed: "#1976d2",
    cancelled: "#757575",
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "service", headerName: "Service", width: 200, valueGetter: (params) => params.row.serviceId.name },
    { field: "date", headerName: "Date", width: 150, valueGetter: (params) => new Date(params.row.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
    { field: "address", headerName: "Address", width: 250 },
    { field: "price", headerName: "Amount (₹)", width: 120 },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 180,
      renderCell: (params) => (
        <Box sx={{
          bgcolor: params.value === "paid" ? "#388e3c" : "#d32f2f",
          color: "white",
          px: 2,
          py: 0.5,
          borderRadius: 1,
          textAlign: "center",
        }}>
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        params.row.paymentStatus === "pending" && (
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog(params.row)}>
            Pay Now
          </Button>
        )
      ),
    },
  ];

  return (
    <>
      <ToastContainer autoClose={1000} />
      <Container>
        <Card sx={{ mt: 2, mb: 2, p: 1, backgroundColor: "rgb(36, 36, 39)", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", borderRadius: "8px" }}>
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
              My Bookings
            </Typography>
          </CardContent>
        </Card>
        {loading ? (
          <CircularProgress />
        ) : (
          <Paper elevation={4} sx={{ p: 2, borderRadius: 3, bgcolor: "grey.900", color: "white" }}>
            <DataGrid
              rows={bookings.map((booking, index) => ({ ...booking, id: index + 1 }))}
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

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to proceed with the payment of ₹{selectedBooking?.price}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="error">
              Cancel
            </Button>
            <Button onClick={handlePayment} color="primary">
              Pay Now
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
