// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav id="sidebar" className="sidebar js-sidebar">
      <div className="sidebar-content js-simplebar">
        <Link className="sidebar-brand" to="/">
          <span className="align-middle logo">
            <img src="https://super.bombaymatka.in/logo.png" alt="logo" />
          </span>
        </Link>

        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/">
              <i className="align-middle" data-feather="home"></i>
              <span className="align-middle">Dashboard</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/settings">
              <i className="align-middle" data-feather="settings"></i>
              <span className="align-middle">Settings</span>
            </Link>
          </li>
          {/* More sidebar items */}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
