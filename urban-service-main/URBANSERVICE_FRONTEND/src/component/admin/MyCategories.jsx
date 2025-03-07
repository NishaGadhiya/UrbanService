import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, ToggleOff, ToggleOn, AddCircle } from "@mui/icons-material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { Loader } from "../Loader";

export const MyCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const navigate = useNavigate();

  // Fetch Categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = getToken(); // Ensure token is fetched
      const res = await axios.get(
        "http://localhost:4000/admin/categories/allcategories",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(res.data.data);
    } catch (error) {
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Category

  const handleOpenDialog = (id) => {
    setSelectedId(id);
    setSelectedCategoryData(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategoryData(null);
    setSelectedId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = getToken();
      await axios.delete(
        `http://localhost:4000/admin/categories/category/${selectedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Category deleted successfully!");
      fetchCategories(); // Refresh categories
    } catch (error) {
      toast.error("Failed to delete category.");
    } finally {
      handleCloseDialog();
    }
  };
  // Handle Activate/Inactive Category
  const toggleCategoryStatus = async () => {
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:4000/admin/categories/category/toggle-status/${selectedCategoryData._id}`,
        { status: !selectedCategoryData.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        `Category ${!selectedCategoryData.status ? "Inactivated" : "Activated"}`
      );
      fetchCategories();
    } catch (error) {
      toast.error("Failed to update Category status.");
    } finally {
      handleCloseDialog();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Edit category
  const handleEdit = () => {};

  // Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Category Name", width: 200 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            bgcolor: params.value ? "green" : "red",
            color: "white",
            px: 2,
            py: 0.5,
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          {params.value ? "Active" : "Inactive"}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            sx={{ color: "primary.main", "&:hover": { color: "blue" } }}
            onClick={() => navigate(`/admin/update-category/${params.row._id}`)}
          >
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleOpenDialog(params.row)}>
            {params.row.status ? (
              <ToggleOn
                sx={{
                  color: "green",
                  fontSize: "2.2rem",
                }}
              />
            ) : (
              <ToggleOff
                sx={{
                  color: "red",
                  fontSize: "2.2rem",
                }}
              />
            )}
          </IconButton>
        </Box>
      ),
    },
  ];

  return loading ? (
    <Loader />
  ) : (
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
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#fff" }}
              >
                Category Management
              </Typography>
            </Box>
          </CardContent>
        </Card>
        {loading ? (
          <CircularProgress />
        ) : (
          <Paper
            elevation={4}
            sx={{ p: 2, borderRadius: 3, bgcolor: "grey.900", color: "white" }}
            className="bg-gradient-dark"
          >
            <Button
              variant="contained"
              color="inherit"
              startIcon={<AddCircle />}
              sx={{
                mb: 2,
                py: 1.5,
                fontSize: "16px",
                fontWeight: "bold",
                color: "black",
                background: "white",
              }}
              onClick={() => navigate("/admin/add-category")}
            >
              Add New Category
            </Button>
            <DataGrid
              rows={categories.map((cat, index) => ({ ...cat, id: index + 1 }))}
              columns={columns}
              pageSizeOptions={[25, 50, 75, 100]}
              paginationModel={{ pageSize, page }}
              onPaginationModelChange={(model) => {
                setPage(model.page);
                setPageSize(model.pageSize);
              }}
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
                "& .MuiDataGrid-row:hover": {
                  bgcolor: "#e0e0e0",
                },
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiTablePagination-selectLabel": {
                  color: "white",
                },
                "& .MuiSelect-select": {
                  color: "white",
                },
                "& .MuiTablePagination-displayedRows": {
                  color: "white",
                },
                "& .MuiIconButton-root.Mui-disabled": {
                  color: "white",
                },
                "& .MuiTablePagination-selectIcon": {
                  color: "white",
                },
              }}
            />
          </Paper>
        )}
      </Container>
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>{`Are you sure you want to ${
          selectedCategoryData?.status ? "Inactivate" : "Activate"
        } this Category?`}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={toggleCategoryStatus}
            color={selectedCategoryData?.status ? "error" : "success"}
            // color="error"
            variant="contained"
          >
            {/* Deactivate */}
            {selectedCategoryData?.status ? "Inactivate" : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
