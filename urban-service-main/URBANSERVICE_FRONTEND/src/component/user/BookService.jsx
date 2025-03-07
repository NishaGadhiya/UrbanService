import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { getToken, getUserInfo } from "../../utils/auth";
import { ToastContainer, toast } from "react-toastify";
import { BookingDialog } from "./BookingDialog ";

export const BookService = () => {
  const [services, setServices] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:4000/services/all-service", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(res.data.data);
        setTopServices(res.data.data.slice(0, 5)); // Select top 5 services
      } catch (error) {
        console.error("Error fetching services", error);
      }
    };
    fetchServices();
  }, []);

  // Handle search filtering
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.city?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle booking
  const handleBooking = async (date, address) => {
    if (!selectedService || !date || !address) {
      toast.error("Please select all required fields!");
      return;
    }

    try {
      const token = getToken();
      const user = getUserInfo();

      if (!user?._id) {
        toast.error("User information is missing. Please log in again.");
        return;
      }

      if (!selectedService?.providerId?._id) {
        toast.error("Service provider information is missing!");
        return;
      }

      const bookingData = {
        userId: user._id,
        serviceId: selectedService._id,
        serviceProviderId: selectedService.providerId._id,
        address,
        date,
        price: selectedService.price
      };

      toast.loading("Booking your service..."); // Show loading toast

      const response = await axios.post("http://localhost:4000/bookings/create-booking", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.dismiss(); // Remove loading toast
      toast.success("Service booked successfully!");

      // Reset form after successful booking
      setSelectedService(null);
    } catch (error) {
      toast.dismiss(); // Remove loading toast

      // Improved error handling
      if (error.response?.data?.message) {
        toast.error(`Booking failed: ${error.response.data.message}`);
      } else {
        toast.error("Booking failed! Please try again.");
      }

      console.error("Booking Error:", error);
    }
  };


  return (
    <Container className="p-5" sx={{ minHeight: "100vh", color: "white" }}>
      <ToastContainer autoClose={1000} />

      {/* Search Bar */}
      <TextField
        fullWidth
        label="Search Services by Name or City"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, bgcolor: "#1e1e1e", borderRadius: "10px", input: { color: "white" } }}
        InputLabelProps={{ style: { color: "gray" } }}
      />

      {/* Top Services Slider */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Top Services
      </Typography>
      <Swiper
        spaceBetween={10}
        slidesPerView={3}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        modules={[Pagination, Autoplay]}
        style={{ paddingBottom: "20px" }}
      >
        {topServices.map((service) => (
          <SwiperSlide key={service._id}>
            <Card
              className="bg-gradient-dark border border-dark rounded"
              sx={{
                color: "white",
                boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardMedia component="img" height="180" image={`data:${service.image.contentType};base64,${service.image.data?.toString("base64")}`} alt={service.name} />
              <CardContent>
                <Typography variant="h6">{service.name}</Typography>
                <Typography variant="body2">{service.city}</Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#6200ea", mt: 1, "&:hover": { backgroundColor: "#3700b3" } }}
                  onClick={() => setSelectedService(service)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* All Services Grid */}
      <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>
        All Services
      </Typography>
      <Grid container spacing={3}>
        {filteredServices.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card
              className="bg-gradient-dark border border-dark rounded"
              sx={{
                color: "white",
                boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardMedia component="img" height="180" image={`data:${service.image.contentType};base64,${service.image.data?.toString("base64")}`} alt={service.name} />
              <CardContent>
                <Typography variant="h6">{service.name}</Typography>
                <Typography variant="body2">{service.city}</Typography>
                <Typography variant="body2">₹{service.price}</Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#6200ea", mt: 1, "&:hover": { backgroundColor: "#3700b3" } }}
                  onClick={() => setSelectedService(service)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Booking Modal */}
      <BookingDialog
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        handleBooking={handleBooking}
      />
    </Container>
  );
};
