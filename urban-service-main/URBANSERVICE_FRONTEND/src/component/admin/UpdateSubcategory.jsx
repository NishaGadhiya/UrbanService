import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { Edit, Update } from "@mui/icons-material";
import { Loader } from "../Loader";
import { getToken } from "../../utils/auth";

export const UpdateSubcategory = () => {
  const { id } = useParams(); // Get subcategory ID from URL
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm({ mode: "onChange" });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); // List of categories
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all categories for selection
    const fetchCategories = async () => {
      try {
        const token = getToken();
        const res = await axios.get(
          "http://localhost:4000/admin/categories/active-categories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 200) setCategories(res.data.data);
      } catch (error) {
        toast.error("Failed to load categories.");
      }
    };

    // Fetch existing subcategory details
    const fetchSubCategory = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const res = await axios.get(
          `http://localhost:4000/admin/subcategories/subcategory/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 200) {
          const { name, description, status, category } = res.data.data;
          setValue("name", name);
          setValue("description", description || "-");
          setValue("status", status ? "true" : "false");
          setValue("category", category || "", { shouldValidate: true });
        }
      } catch (error) {
        navigate("/admin/subcategories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchSubCategory();
  }, [id, setValue]);

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:4000/admin/subcategories/subcategory/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Subcategory updated successfully!");
      navigate("/admin/mysubcategories"); // Redirect after update
    } catch (error) {
      toast.error("Failed to update subcategory.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
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
                  <Edit sx={{ fontSize: 40, color: "white" }} />
                </Grid>
                <Grid item>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#fff" }}
                  >
                    Edit SubCategory
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
                  required: "Subcategory name is required",
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
              />

              {/* Select Parent Category */}
              <TextField
                select
                fullWidth
                label="Parent Category"
                variant="outlined"
                margin="normal"
                {...register("category", {
                  required: "Category is required",
                })}
                error={!!errors.categoryId}
                helperText={errors.categoryId ? errors.categoryId.message : ""}
                value={watch("category") || ""}
                onChange={(e) =>
                  setValue("category", e.target.value, {
                    shouldValidate: true,
                  })
                }
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
                {...register("status", { required: true })}
                error={!!errors.status}
                helperText={errors.status?.message}
                value={watch("status") || ""}
                InputLabelProps={{ shrink: true }}
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
                className="btn bg-gradient-dark"
                startIcon={<Update />}
                sx={{ mt: 2, py: 1.5 }}
                disabled={!isValid || loading}
              >
                {loading ? "Updating..." : "Update SubCategory"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};
