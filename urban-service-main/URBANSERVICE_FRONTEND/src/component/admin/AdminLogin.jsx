import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Loader } from "../Loader";
import "react-toastify/dist/ReactToastify.css";

export const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/admin/login", data);
      if (res.status === 200) {
        localStorage.setItem(
          "sessionInfo",
          JSON.stringify({
            token: res.data.token,
            role: res.data.role,
            admin: res.data.data,
          })
        );
        navigate(`/${res.data.role}/dashboard`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <ToastContainer autoClose={1000} />
      <div className="page-header min-vh-100">
        <div className="container">
          <div className="row">
            <div className="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
              <div
                className="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
                style={{
                  backgroundImage:
                    'url("../assets/img/illustrations/admin login.gif")',
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
            <div className="container my-auto">
              <div className="row">
                <div className="col-xl-4 col-lg-5 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5">
                  <div className="card z-index-0 fadeIn3 fadeInBottom">
                    <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                      <div className="bg-gradient-dark shadow-dark border-radius-lg py-3 pe-1">
                        <br />
                        <h2 className="text-white font-weight-bolder text-center mt-2 mb-0">
                          Admin Login
                        </h2>
                        <br />
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
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email",
                              },
                            })}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-danger">{errors.email.message}</p>
                        )}

                        <div className="input-group input-group-outline mb-3">
                          <input
                            type="password"
                            className="form-control"
                            onfocus="focused(this)"
                            onfocusout="defocused(this)"
                            placeholder="Password"
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 4,
                                message:
                                  "Password must be at least 4 characters",
                              },
                            })}
                          />
                        </div>
                        {errors.password && (
                          <p className="text-danger">
                            {errors.password.message}
                          </p>
                        )}

                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn bg-gradient-dark w-100 my-4 mb-2"
                            disabled={!isValid || loading}
                          >
                            {loading ? "Signing in..." : "Sign In"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
