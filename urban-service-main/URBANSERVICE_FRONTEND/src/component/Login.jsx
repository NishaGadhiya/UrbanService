import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "./Loader";

export const Login = () => {
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
      const res = await axios.post("http://localhost:4000/api/login", data);
      if (res.status === 200) {
        localStorage.setItem(
          "sessionInfo",
          JSON.stringify({
            token: res.data.token,
            role: res.data.role,
            user: res.data.result,
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
      <main className="main-content  mt-0">
        <div
          className="page-header align-items-start min-vh-100"
          style={{
            backgroundImage: "url()",
          }}
        >
          <span className="mask bg-gradient-dark opacity-6" />
          <div className="container my-auto">
            <div className="row">
              <div className="col-lg-4 col-md-8 col-12 mx-auto">
                <div className="card z-index-0 fadeIn3 fadeInBottom">
                  <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-gradient-dark shadow-dark border-radius-lg py-3 pe-1">
                      <br />
                      <h2 className="text-white font-weight-bolder text-center mt-2 mb-0">
                        Sign in
                      </h2>
                      <br />
                    </div>
                  </div>
                  <div className="card-body">
                    <form
                      className="text-start"
                      onSubmit={handleSubmit(submitHandler)}
                    >
                      <div className="input-group input-group-outline my-3">
                        <input
                          type="email"
                          className="form-control"
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
                          placeholder="Password"
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 4,
                              message: "Password must be at least 4 characters",
                            },
                          })}
                        />
                      </div>
                      {errors.password && (
                        <p className="text-danger">{errors.password.message}</p>
                      )}

                      <div className="input-group input-group-outline mb-3">
                        <select
                          className="form-control"
                          {...register("roles", {
                            required: "Please select a role",
                          })}
                        >
                          <option value="">Select Role</option>
                          <option value="user">User</option>
                          <option value="service_provider">
                            Service Provider
                          </option>
                        </select>
                      </div>
                      {errors.roles && (
                        <p className="text-danger">{errors.roles.message}</p>
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
                      <p className="mt-4 text-sm text-center">
                        Don't have an account?
                        <Link
                          to="/registration"
                          className="text-dark text-gradient font-weight-bold"
                        >
                          {" "}
                          Sign up
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
