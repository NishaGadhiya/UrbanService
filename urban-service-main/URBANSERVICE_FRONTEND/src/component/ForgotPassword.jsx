import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Container,
  TextField,
  Button,
  Grid,
  CssBaseline,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";

export const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [roles, setRoles] = useState();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/users/user/isUserExist",
        data
      );
      if (res.data.flag === 1) {
        console.log("Email exists", res.data.data.email);
        setSubmitted(true);
        setTimeout(() => {
          navigate("/resetpassword", {
            state: { email: res.data.data.email },
          });
        }, 2000);
      } else {
        setError(true);
        setErrorMessage(
          "Email address is not valid. Please enter a valid email address."
        );
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setErrorMessage(
        "Email address is not valid. Please enter a valid email address."
      );
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      {/* <div
        style={{
          backgroundColor: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CssBaseline />
        <Container maxWidth="sm">
          <Box sx={{ p: 4, borderRadius: 8, boxShadow: 4, bgcolor: "#B3C8CF" }}>
            <Card sx={{ bgcolor: "#f0f0f0" }}>
              <CardContent>
                <Typography
                  variant="h4"
                  component="h1"
                  align="center"
                  gutterBottom
                >
                  Forgot Password
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                  Lost your password? Please enter your email address. You will
                  receive a OTP to create a new password via email.
                </Typography>
                {submitted ? (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    An email has been sent with instructions to reset your
                    password.
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit(submitHandler)}>
                    <Grid container spacing={2} justifyContent="center">
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type="email"
                          label="Email"
                          variant="outlined"
                          {...register("email", { required: true })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          fullWidth
                        >
                          Submit
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" align="center">
                          Remembered your password?{" "}
                          <Link to="/login">Log in here</Link>
                        </Typography>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </CardContent>
            </Card>
            <Box mt={2}>
              <Typography variant="body2" align="center">
                Security Tips: Choose a strong password with a combination of
                letters, numbers, and symbols.
              </Typography>
            </Box>
          </Box>
        </Container>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </div> */}

      <main className="main-content  mt-0">
        <div
          className="page-header align-items-start min-vh-100"
          style={{
            backgroundImage: "url()",
          }}
        >
          <span className="mask bg-gradient-light opacity-6" />
          <div className="container my-auto">
            <div className="row">
              <div className="col-lg-4 col-md-8 col-12 mx-auto">
                <div className="card z-index-0 fadeIn3 fadeInBottom">
                  <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                      <br />
                      <h3 className="text-white font-weight-bolder text-center mt-2 mb-0">
                        Forgot Password
                      </h3>
                      <br />
                      {/* <div className="row mt-3">
                        <div className="col-2 text-center ms-auto">
                          <a className="btn btn-link px-3" href="javascript:;">
                            <i
                              className="fa fa-facebook text-white text-lg"
                              aria-hidden="true"
                            />
                          </a>
                        </div>
                        <div className="col-2 text-center px-1">
                          <a className="btn btn-link px-3" href="javascript:;">
                            <i
                              className="fa fa-github text-white text-lg"
                              aria-hidden="true"
                            />
                          </a>
                        </div>
                        <div className="col-2 text-center me-auto">
                          <a className="btn btn-link px-3" href="javascript:;">
                            <i
                              className="fa fa-google text-white text-lg"
                              aria-hidden="true"
                            />
                          </a>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div className="card-body">
                    <form
                      role="form"
                      className="text-start"
                      onSubmit={handleSubmit(submitHandler)}
                    >
                      <div className="input-group input-group-outline my-3">
                        <input
                          type="email"
                          className="form-control"
                          onfocus="focused(this)"
                          onfocusout="defocused(this)"
                          placeholder="Email"
                          {...register("email")}
                        />
                      </div>
                      <div className="input-group input-group-outline mb-3">
                        <select
                          className="form-control"
                          value={roles}
                          onChange={(e) => setRoles(e.target.value)}
                        >
                          <option>Select Role</option>
                          <option value="65ccb8aa9a50ad86fbda41ae">User</option>
                          <option value="65ccb89d9a50ad86fbda41ac">
                            ServiceProvider
                          </option>
                        </select>
                      </div>
                      <div className="text-center">
                        <input
                          type="submit"
                          className="btn bg-gradient-primary w-100 my-4 mb-2"
                          value="Forgot passsword"
                        ></input>
                      </div>
                      <p className="mt-4 text-sm text-center">
                        Back to login?
                        <Link
                          to="/login"
                          className="text-primary text-gradient font-weight-bold"
                        >
                          log in
                        </Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
