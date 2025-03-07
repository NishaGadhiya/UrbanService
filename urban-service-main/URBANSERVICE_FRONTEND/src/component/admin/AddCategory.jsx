import React, { useState } from "react";
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
import { dark } from "@mui/material/styles/createPalette";
import { getToken, getUserInfo } from "../../utils/auth";

export const AddCategory = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm({ mode: "onChange" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      let token = getToken();

      const res = await axios.post(
        "http://localhost:4000/admin/categories/add-category",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 201) {
        reset();
        toast.success("Category added successfully!");
        // navigate("/admin/mycategories")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add category.");
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
                    Add Category
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
                {loading ? "Adding..." : "Add Category"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};
