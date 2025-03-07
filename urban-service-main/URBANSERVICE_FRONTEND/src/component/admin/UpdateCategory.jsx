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

export const UpdateCategory = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const res = await axios.get(
          `http://localhost:4000/admin/categories/category/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 200) {
          const { name, description, status } = res.data.data;
          setCategory(res.data.data);
          setValue("name", name);
          setValue("description", description || "_");
          setValue("status", status ? "true" : "false");
        }
      } catch (error) {
        navigate("/admin/mycategories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, setValue]);

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const token = getToken();
      const updatedData = {
        ...data,
        status: data.status === "true", // Convert string back to boolean
      };
      await axios.put(
        `http://localhost:4000/admin/categories/category/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Category updated successfully!");
      navigate("/admin/mycategories"); // Redirect after update
    } catch (error) {
      toast.error("Failed to update category.");
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
                    Edit Category
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
              {/* Category Name */}
              <TextField
                fullWidth
                label="Category Name"
                variant="outlined"
                margin="normal"
                {...register("name", { required: "Category name is required" })}
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
                defaultValue={category?.status ? "true" : "false"}
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
                {loading ? "Updating..." : "Update Category"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};
