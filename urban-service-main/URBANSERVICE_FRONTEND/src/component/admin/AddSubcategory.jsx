import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "../Loader";
import {
  Container,
  Grid,
  Card,
  Box,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import {
  Category as CategoryIcon,
  AddCircleOutline,
} from "@mui/icons-material";
import { getToken } from "../../utils/auth";

export const AddSubcategory = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    trigger,
  } = useForm({ mode: "onChange" });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let token = getToken();
        const res = await axios.get(
          "http://localhost:4000/admin/categories/active-categories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(res.data.data || []);
      } catch (error) {
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // Submit subcategory
  const submitHandler = async (data) => {
    setLoading(true);
    try {
      let token = getToken();
      const res = await axios.post(
        "http://localhost:4000/admin/subcategories/add-subcategory",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 201) {
        reset();
        toast.success("Subcategory added successfully!");
        // navigate("/admin/mysubcategories");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add subcategory."
      );
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <ToastContainer autoClose={1000} />
      <Container maxWidth="md">
        <Card
          sx={{
            mt: 10,
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
              <Grid alignItems="left" spacing={2} container>
                <Grid item>
                  <CategoryIcon sx={{ fontSize: 40, color: "white" }} />
                </Grid>
                <Grid item>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#fff" }}
                  >
                    Add SubCategory
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
          <CardContent>
            <form
              onSubmit={handleSubmit(submitHandler)}
              style={{ marginTop: "20px" }}
            >
              {/* SubCategory Name */}
              <TextField
                fullWidth
                label="SubCategory Name"
                variant="outlined"
                margin="normal"
                {...register("name", {
                  required: "SubCategory name is required",
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description (Optional)"
                variant="outlined"
                margin="normal"
                multiline
                rows={3}
                {...register("description")}
              />

              {/* Select Category */}
              <TextField
                select
                fullWidth
                label="Select Category"
                variant="outlined"
                margin="normal"
                {...register("category", {
                  required: "Please select a category",
                })}
                error={!!errors.category}
                helperText={errors.category ? errors.category.message : ""}
                onChange={(e) => {
                  setValue("category", e.target.value);
                  trigger("category");
                }}
              >
                <MenuItem value="" disabled>
                  {categories.length === 0
                    ? "No categories available"
                    : "Select a category"}
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* Status */}
              <TextField
                select
                fullWidth
                label="Status"
                variant="outlined"
                margin="normal"
                {...register("status", { required: "status is required" })}
                error={!!errors.status}
                helperText={errors.status?.message}
                onChange={(e) =>
                  setValue("status", e.target.value, { shouldValidate: true })
                }
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </TextField>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                // color="primary"
                className="btn bg-gradient-dark"
                startIcon={<AddCircleOutline />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  "&.Mui-disabled": {
                    color: (theme) => theme.palette.grey[400],
                  },
                }}
                disabled={!isValid || loading}
              >
                {loading ? "Adding..." : "Add SUBCategory"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};
