import React from "react";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  const path = window.location.pathname;

  const serviceProviderLinks = [
    {
      name: "Dashboard",
      link: "/service_provider/dashboard",
      icon: "dashboard",
    },
    {
      name: "Add Service",
      link: "/service_provider/addservice",
      icon: "add",
    },
    {
      name: "My Service",
      link: "/service_provider/myservices",
      icon: "table_view",
    },
    {
      name: "Booking Management",
      link: "/service_provider/booking-management",
      icon: "person",
    },
    {
      name: "Profile",
      link: "/service_provider/profile",
      icon: "person",
    },
    {
      name: "logout",
      link: "/service_provider/logout",
      icon: "assignment",
    }
  ];

  const userLinks = [
    {
      name: "Dashboard",
      link: "/user/dashboard",
      icon: "dashboard",
    },
    {
      name: "Book Services",
      link: "/user/bookservices",
      icon: "person",
    },
    {
      name: "My Bookings",
      link: "user/bookings",
      icon: "table_view",
    },
    {
      name: "Profile",
      link: "/user/profile",
      icon: "person",
    },
    { name: "Logout", link: "/user/logout", icon: "assignment" },
  ];

  const adminLinks = [
    { name: "Dashboard", link: "/admin/dashboard", icon: "dashboard" },
    { name: "Add Category", link: "/admin/add-category", icon: "category" },
    { name: "My Categories", link: "/admin/mycategories", icon: "list" },
    { name: "Add Sub-Category", link: "/admin/add-subcategory", icon: "category" },
    { name: "My Sub-Categories", link: "/admin/mysubcategories", icon: "list" },
    { name: "Manage Users", link: "/admin/manage-users", icon: "table_view" },
    { name: "Manage Service-Providers", link: "/admin/manage-serviceProviders", icon: "table_view" },
    { name: "Profile", link: "/admin/profile", icon: "person" },
    { name: "Logout", link: "/admin/logout", icon: "assignment" },
  ];

  const navLinks = path.includes("service_provider")
    ? serviceProviderLinks
    : path.includes("admin")
      ? adminLinks
      : userLinks;

  return (
    <aside
      className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-dark bg-white"
      id="sidenav-main"
    >
      <div className="sidenav-header">
        <i
          className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
          aria-hidden="true"
          id="iconSidenav"
        />
        <div
          className="navbar-brand m-0"
        >
          <span className="ms-1 font-weight-bold text-white">
            Urban Services
          </span>
        </div>
      </div>
      <hr className="horizontal light mt-0 mb-2" />
      <div
        className="collapse navbar-collapse  w-auto "
        id="sidenav-collapse-main"
      >
        <ul className="navbar-nav">
          {navLinks.map((item, index) => (
            <li className="nav-item" key={index}>
              <Link className="nav-link text-white" to={item.link}>
                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">{item.icon}</i>
                </div>
                <span className="nav-link-text ms-1">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
