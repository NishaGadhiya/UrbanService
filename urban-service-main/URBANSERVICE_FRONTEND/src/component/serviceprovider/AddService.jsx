import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
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
import { Autocomplete } from "@mui/material";
import { AddCircleOutline, Category as CategoryIcon } from "@mui/icons-material";
import { getToken } from "../../utils/auth";

export const AddService = () => {
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
    register: addService,
  } = useForm({ mode: "onChange" });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    loadCategories();
    loadServiceProviders();
  }, []);

  const loadCategories = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:4000/admin/categories/allcategories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const loadServiceProviders = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:4000/serviceproviders/all-provider", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServiceProviders(res.data.data);
    } catch (error) {
      console.error("Error fetching service providers", error);
    }
  };

  const handleCategoryChange = async (_, newValue) => {
    setSelectedCategory(newValue);
    setValue("category", newValue ? newValue._id : "");
    setSelectedSubCategory(null);
    setSubCategories([]);

    if (newValue) {
      try {
        const token = getToken();
        const res = await axios.get(`http://localhost:4000/admin/subcategories/subcategory-by-category-id/${newValue._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching subcategories", error);
      }
    }
  };

  const submitHandler = async (data) => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.append("image", data.image[0]);

    try {
      const token = getToken();
      const res = await axios.post("http://localhost:4000/services/add-service", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 201) {
        toast.success("Service Added Successfully!");
        reset();
        setSelectedCategory(null);
        setSelectedSubCategory(null);
        setSelectedProvider(null);
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Error adding service", error);
      toast.error("Failed to add service!");
    }
    setLoading(false);
  };

  return (
    <>
      <ToastContainer />
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item>
                <CategoryIcon sx={{ fontSize: 40, color: "primary.main" }} />
              </Grid>
              <Grid item>
                <Typography variant="h5" fontWeight="bold">Add Service</Typography>
              </Grid>
            </Grid>

            <form onSubmit={handleSubmit(submitHandler)} style={{ marginTop: "20px" }}>
              <TextField fullWidth label="Service Name" variant="outlined" margin="normal" {...addService("name", { required: "Service name is required" })} error={!!errors.name} helperText={errors.name?.message} />

              {/* Searchable Category Dropdown */}
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.name}
                value={selectedCategory}
                onChange={handleCategoryChange}
                renderInput={(params) => (
                  <TextField {...params} label="Category" variant="outlined" margin="normal" error={!!errors.category} helperText={errors.category?.message} />
                )}
              />

              {/* Searchable SubCategory Dropdown */}
              <Autocomplete
                options={subCategories}
                getOptionLabel={(option) => option.name}
                value={selectedSubCategory}
                onChange={(_, newValue) => {
                  setSelectedSubCategory(newValue);
                  setValue("subcategory", newValue ? newValue._id : "");
                }}
                disabled={subCategories.length === 0}
                renderInput={(params) => (
                  <TextField {...params} label="SubCategory" variant="outlined" margin="normal" error={!!errors.subcategory} helperText={errors.subcategory?.message} />
                )}
              />

              <TextField fullWidth label="Price" variant="outlined" type="number" margin="normal" {...addService("price", { required: "Price is required" })} error={!!errors.price} helperText={errors.price?.message} />

              {/* Searchable Service Provider Dropdown */}
              <Autocomplete
                options={serviceProviders}
                getOptionLabel={(option) => option.name}
                value={selectedProvider}
                onChange={(_, newValue) => {
                  setSelectedProvider(newValue);
                  setValue("providerId", newValue ? newValue._id : "");
                }}
                getOptionKey={(option, index) => option._id || index}
                renderInput={(params) => (
                  <TextField {...params} label="Service Provider" variant="outlined" margin="normal" error={!!errors.providerId} helperText={errors.providerId?.message} />
                )}
              />

              <TextField fullWidth label="City" variant="outlined" margin="normal" {...addService("city", { required: "City is required" })} error={!!errors.city} helperText={errors.city?.message} />

              <TextField fullWidth label="State" variant="outlined" margin="normal" {...addService("state", { required: "State is required" })} error={!!errors.state} helperText={errors.state?.message} />

              <TextField fullWidth label="Upload Image" variant="outlined" type="file" margin="normal" InputLabelProps={{ shrink: true }} {...addService("image", { required: "Please upload an image" })} error={!!errors.image} helperText={errors.image?.message} />

              <Button type="submit" fullWidth variant="contained" color="primary" startIcon={<AddCircleOutline />} sx={{ mt: 2, py: 1.5 }} >
                {loading ? "Adding..." : "Add Service"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};
  