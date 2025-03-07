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
import { Edit, Delete, AddCircle } from "@mui/icons-material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

export function MyServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const navigate = useNavigate();

  // Fetch all services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(
        "http://localhost:4000/services/service-provider-id",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setServices(res.data.data);
    } catch (error) {
      toast.error("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Service
  const handleOpenDialog = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = getToken();
      await axios.delete(
        `http://localhost:4000/services/services/${selectedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Service deleted successfully!");
      fetchServices(); // Refresh list
    } catch (error) {
      toast.error("Failed to delete service.");
    } finally {
      handleCloseDialog();
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Service Name", width: 200 },
    { field: "price", headerName: "Price", width: 120 },
    { field: "city", headerName: "City", width: 150 },
    { field: "state", headerName: "State", width: 150 },
    {
      field: "image",
      headerName: "Preview",
      width: 120,
      renderCell: (params) => {
        if (!params.row.image) return "No Image";

        const imageUrl = `data:${
          params.row.image.contentType
        };base64,${params.row.image.data?.toString("base64")}`;

        return (
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={imageUrl}
              alt="Service Preview"
              style={{
                width: 50,
                height: 50,
                borderRadius: "8px",
                cursor: "pointer",
              }}
            />
          </a>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            sx={{ color: "primary.main", "&:hover": { color: "blue" } }}
            onClick={() =>
              navigate(`/service_provider/update-service/${params.row._id}`)
            }
          >
            <Edit />
          </IconButton>
          <IconButton
            sx={{ color: "error.main", "&:hover": { color: "red" } }}
            onClick={() => handleOpenDialog(params.row._id)}
          >
            <Delete />
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
                Service Management
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
              onClick={() => navigate("/service_provider/addservice")}
            >
              Add New Service
            </Button>
            <DataGrid
              rows={services.map((service, index) => ({
                ...service,
                id: index + 1,
              }))}
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
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this service?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
