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
  Switch,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete, Block, CheckCircle } from "@mui/icons-material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { Loader } from "../Loader";

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const navigate = useNavigate();

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:4000/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
    } catch (error) {
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Block/Unblock User
  const toggleUserStatus = async () => {
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:4000/users/user/toggle-status/${selectedUserData._id}`,
        { status: !selectedUserData.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        `User ${
          !selectedUserData.status ? "unblocked" : "blocked"
        } successfully!`
      );
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status.");
    } finally {
      handleCloseDialog();
    }
  };

  // Handle Delete Users
  const handleOpenDialog = (udata) => {
    setSelectedUserData(udata);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserData(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Table Columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "contact", headerName: "Contact", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
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
          {params.value ? "Active" : "Blocked"}
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
            sx={{
              color: params.row.status ? "error.main" : "success.main",
              "&:hover": { color: "red" },
            }}
            onClick={() => handleOpenDialog(params.row)}
          >
            {params.row.status ? <Block /> : <CheckCircle />}
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
                User Management
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
            <DataGrid
              rows={users.map((user, index) => ({
                ...user,
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
        <DialogTitle>Confirm Block</DialogTitle>
        <DialogContent>{`Are you sure you want to ${
          selectedUserData?.status ? "block" : "unblock"
        } this User?`}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={toggleUserStatus}
            color={selectedUserData?.status ? "error" : "success"}
            variant="contained"
          >
            {selectedUserData?.status ? "block" : "unblock"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
