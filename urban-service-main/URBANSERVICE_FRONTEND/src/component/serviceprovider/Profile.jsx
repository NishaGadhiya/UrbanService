import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  IconButton,
  CardContent,
} from "@mui/material";
import { Edit, CameraAlt, Save } from "@mui/icons-material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSpInfo, getToken } from "../../utils/auth";
import { Loader } from "../Loader";

export const ServiceProviderProfile = () => {
  const [sp, setSp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchSp = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const sp = getSpInfo();
        const res = await axios.get(
          `http://localhost:4000/serviceproviders/profile/${sp._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 200) {
          setSp(res.data.data);
          setFormData({
            name: res.data.data.name,
            email: res.data.data.email,
            phone: res.data.data.phone || "",
            profilePicture: res.data.data.profilePicture || "",
          });
        }
      } catch (error) {
        toast.error("Failed to fetch Service-provider profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchSp();
  }, []);

  const handleEdit = () => setEditing(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Allow only numbers and restrict to 10 digits
      if (!/^\d{0,10}$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const formDataImage = new FormData();
    formDataImage.append("profilePicture", selectedFile);

    try {
      setLoading(true);
      const token = getToken();
      const sp = getSpInfo();
      const res = await axios.post(
        `http://localhost:4000/service-provider/upload-profile/${sp._id}`,
        formDataImage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        const imageUrl = res.data.url;
        setFile(selectedFile);
        setFormData((prev) => ({ ...prev, profilePicture: imageUrl }));
        toast.success("Profile picture updated!");
      }
    } catch (error) {
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const sp = getSpInfo();
      await axios.put(
        `http://localhost:4000/serviceproviders/profile/update/${sp._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Profile updated successfully!");
      setSp(formData);
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loader />;
  return (
    <>
      <ToastContainer autoClose={1000} />
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Card sx={{ boxShadow: 5, borderRadius: 3, textAlign: "center", p: 3 }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                margin: "0 auto",
                bgcolor: "black",
                color: "white",
              }}
              src={formData.profilePicture || "/default-avatar.png"}
            >
              {sp?.name?.charAt(0).toUpperCase()}
            </Avatar>
            {editing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="upload-profile"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-profile">
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "white",
                      boxShadow: 3,
                    }}
                    component="span"
                  >
                    <CameraAlt color="inherit" />
                  </IconButton>
                </label>
              </>
            )}
          </div>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Service-provider Profile
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  variant="outlined"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  inputProps={{ maxLength: 10 }} // Prevents input beyond 10 characters
                />
              </Grid>
            </Grid>

            {editing ? (
              <Button
                variant="contained"
                className="btn bg-gradient-dark"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSave}
              >
                <Save sx={{ mr: 1 }} />
                Save Changes
              </Button>
            ) : (
              <Button
                variant="contained"
                className="btn bg-gradient-dark"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleEdit}
              >
                <Edit sx={{ mr: 1 }} /> Edit Profile
              </Button>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};
