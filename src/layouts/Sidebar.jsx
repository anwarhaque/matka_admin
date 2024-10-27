import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation(); // Get the current route path

  // Helper function to check if the path matches
  const isActive = (path) => location.pathname === path;
  return (
    <nav id="sidebar" className="sidebar js-sidebar">
      <div className="sidebar-content js-simplebar">
        <Link className="sidebar-brand" to="/">
          <span className="align-middle"><img src="/img/logo.png" alt="Logo" style={{width: "100%"}} /></span>
        </Link>

        <ul className="sidebar-nav">
          <li className={`sidebar-item ${isActive("/") ? "active" : ""}`} >
            <Link className="sidebar-link" to="/">
              <i className="align-middle" data-feather="sliders"></i> <span
                className="align-middle">Dashboard</span>
            </Link>
          </li>

          <li className="sidebar-header">
            Master
          </li>

          <li className={`sidebar-item ${isActive("/drow-master") ? "active" : ""}`}>
            <Link className="sidebar-link" to="/drow-master">
              <i className="align-middle" data-feather="user"></i> <span className="align-middle">Drow Master</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/client-master") ? "active" : ""}`}>
            <Link className="sidebar-link" to="/client-master">
              <i className="align-middle" data-feather="user"></i> <span className="align-middle">Client Master</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/agent-master") ? "active" : ""}`}>
            <Link className="sidebar-link" to="/agent-master">
              <i className="align-middle" data-feather="user"></i> <span className="align-middle">Agent Master</span>
            </Link>
          </li>

          <li className="sidebar-header">
            Report
          </li>
          <li className={`sidebar-item ${isActive("/client-report") ? "active" : ""}`}>
            <Link className="sidebar-link" to="/client-report">
              <i className="align-middle" data-feather="user"></i> <span className="align-middle">Client Report</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/agent-report") ? "active" : ""}`}>
            <Link className="sidebar-link" to="/agent-report">
              <i className="align-middle" data-feather="user"></i> <span className="align-middle">Agent Report</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/my-report") ? "active" : ""}`}>
            <Link className="sidebar-link" to="/my-report">
              <i className="align-middle" data-feather="user"></i> <span className="align-middle">My Report</span>
            </Link>
          </li>
          <li className="sidebar-header">
            Limit/Loan
          </li>
          <li className={`sidebar-item ${isActive("/client-limit") ? "active" : ""}`}>
            <Link className="sidebar-link" to="/client-limit">
              <i className="align-middle" data-feather="user"></i> <span className="align-middle">Client Limit</span>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/agent-limit") ? "active" : ""}`}>
            <Link className="sidebar-link" to="/agent-limit">
              <i className="align-middle" data-feather="user"></i> <span className="align-middle">Agent Limit</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
