import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Loader } from "../Loader";
// import "react-toastify/dist/ReactToastify.css";

export const UserRegistration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/api/signup", data);
      // localStorage.setItem('sessionInfo', JSON.stringify({ token: res.data.token, role:res.data.role}))
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="page-header min-vh-100">
      <ToastContainer autoClose={1000} />
      <div className="container">
        <div className="row">
          <div className="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
            <div
              className="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
              style={{
                backgroundImage:
                  'url("../assets/img/illustrations/Connected world.gif")',
                backgroundSize: "cover",
              }}
            ></div>
          </div>
          <div className="col-xl-4 col-lg-5 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5">
            <div className="card">
              <div className="card-header text-center">
                <h4 className="font-weight-bolder">Sign Up</h4>
                <p className="mb-0">Enter your details to register</p>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div>
                    <input
                      type="radio"
                      className="input-form-check"
                      checked
                      value="user"
                      {...register("role")}
                    />
                  </div>

                  <label className="form-label">Name:</label>
                  <div className="input-group input-group-outline mb-3">
                    <input
                      type="text"
                      className="form-control"
                      {...register("name", { required: "Name is required" })}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-danger">{errors.name.message}</p>
                  )}

                  <label className="form-label">Email:</label>
                  <div className="input-group input-group-outline mb-3">
                    <input
                      type="email"
                      className="form-control"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Invalid email format",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-danger">{errors.email.message}</p>
                  )}

                  <label className="form-label">Password:</label>
                  <div className="input-group input-group-outline mb-3">
                    <input
                      type="password"
                      className="form-control"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 4,
                          message:
                            "Password must be at least 6 characters long",
                        },
                      })}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-danger">{errors.password.message}</p>
                  )}

                  <label className="form-label">Contact:</label>
                  <div className="input-group input-group-outline mb-3">
                    <input
                      type="tel"
                      className="form-control"
                      maxLength="10" // Prevents more than 10 characters
                      onInput={(e) =>
                        (e.target.value = e.target.value
                          .replace(/[^0-9]/g, "")
                          .slice(0, 10))
                      } // Allows only numbers and limits to 10
                      {...register("contact", {
                        required: "Contact number is required",
                        pattern: {
                          value: /^[0-9]{10}$/, // Ensures exactly 10 digits
                          message: "Contact number must be exactly 10 digits",
                        },
                      })}
                    />
                  </div>
                  {errors.contact && (
                    <p className="text-danger">{errors.contact.message}</p>
                  )}

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 mt-3"
                      disabled={!isValid}
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer text-center">
                <p className="mb-2">
                  Already have an account? <Link to="/login">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
