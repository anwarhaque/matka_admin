// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const handleToggle = () => {
    document.getElementById("sidebar").classList.toggle("collapsed");
  };

  return (
    <nav className="navbar navbar-expand navbar-light navbar-bg">
      <a className="sidebar-toggle js-sidebar-toggle" onClick={handleToggle}>
        <i className="hamburger align-self-center"></i>
      </a>

      <div className="navbar-collapse collapse">
        <ul className="navbar-nav navbar-align">
         
          <li className="nav-item dropdown">
            <Link className="nav-icon dropdown-toggle d-inline-block d-sm-none" 
              data-bs-toggle="dropdown">
              <i className="align-middle" data-feather="settings"></i>
            </Link>

            <Link className="nav-link dropdown-toggle d-none d-sm-inline-block" 
              data-bs-toggle="dropdown">
              <img src="img/avatars/avatar.jpg" className="avatar img-fluid rounded me-1"
                alt="Charles Hall" /> <span className="text-dark">Charles Hall</span>
            </Link>
            <div className="dropdown-menu dropdown-menu-end">
              <Link className="dropdown-item" to="/profile"><i className="align-middle me-1"
                data-feather="user"></i> Profile</Link>
              <Link className="dropdown-item" to="/change-password"><i className="align-middle me-1"
                data-feather="pie-chart"></i> Change Password</Link>
              <div className="dropdown-divider"></div>
              <Link className="dropdown-item" to="/">Log out</Link>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
