import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { getToken } from "../../utils/auth";
import { Loader } from "../Loader";

export const UpdateService = () => {
  const { id } = useParams();
  const {
    handleSubmit,
    reset,
    setValue,
    register,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  const fetchServiceDetails = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`http://localhost:4000/services/service/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data;
      setService(data);
      reset({
        name: data.name,
        price: data.price,
        city: data.city,
        state: data.state,
      });

      if (data.image && data.image.data) {
        setImagePreview(`data:${data.image.contentType};base64,${data.image.data}`);
      }
    } catch (error) {
      console.error("Error fetching service details", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      console.log(file)
      // setValue("image", file);
    }
  };

  const submitHandler = async (formData) => {
    setLoading(true);
    const updatedData = new FormData();
    debugger
    // Append only the fields that can be updated
    if (formData.name !== service.name) updatedData.append("name", formData.name);
    if (formData.price !== service.price) updatedData.append("price", formData.price);
    if (formData.city !== service.city) updatedData.append("city", formData.city);
    if (formData.state !== service.state) updatedData.append("state", formData.state);
    // Ensure image is correctly appended
    if (formData.image && formData.image.length > 0) {
      updatedData.append("image", formData.image[0]);
    }

    // Debugging: Check FormData content before sending
    for (let pair of updatedData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const token = getToken();
      const res = await axios.put(
        `http://localhost:4000/services/update-service/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        toast.success("Service Updated Successfully!");
        fetchServiceDetails(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating service", error);
      toast.error("Failed to update service!");
    }
    setLoading(false);
  };

  if (!service) return <Typography>Loading...</Typography>;

  if (loading) return <Loader></Loader>

  return (
    <>
      <ToastContainer />
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item>
                <Typography variant="h5" fontWeight="bold">Update Service</Typography>
              </Grid>
            </Grid>
            <form onSubmit={handleSubmit(submitHandler)} style={{ marginTop: "20px" }}>
              <TextField
                fullWidth
                label="Service Name"
                variant="outlined"
                margin="normal"
                {...register("name", { required: "Service name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <TextField fullWidth label="Category" variant="outlined" margin="normal" value={service.category.name} disabled />
              <TextField fullWidth label="SubCategory" variant="outlined" margin="normal" value={service.subcategory.name} disabled />

              <TextField
                fullWidth
                label="Price"
                variant="outlined"
                type="number"
                margin="normal"
                {...register("price", { required: "Price is required" })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />

              <TextField
                fullWidth
                label="City"
                variant="outlined"
                margin="normal"
                {...register("city")}
              />

              <TextField
                fullWidth
                label="State"
                variant="outlined"
                margin="normal"
                {...register("state")}
              />

              <TextField
                fullWidth
                label="Upload New Image"
                variant="outlined"
                type="file"
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...register("image")}
                onChange={handleImageChange}
              />
              {imagePreview && <img src={imagePreview} alt="Service" style={{ width: "100px", height: "100px", marginTop: "10px" }} />}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                sx={{ mt: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Service"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

