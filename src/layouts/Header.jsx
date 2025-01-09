import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import userPic from '../assets/img/user-pic.png';

const Header = () => {
  const handleToggle = () => {
    document.getElementById("sidebar").classList.toggle("collapsed");
  };

  const auth = useAuth();
  
  const handleLogout = (event) => {
    event.preventDefault();
    auth.logout();
};

  return (
    <nav className="navbar navbar-expand navbar-light navbar-bg">
      <Link className="sidebar-toggle js-sidebar-toggle"  onClick={handleToggle}>
        <i className="hamburger align-self-center"></i>
      </Link>

      <div className="navbar-collapse collapse">
        <ul className="navbar-nav navbar-align">
          <li>
            <div className="mt-2">
              <span>{auth?.currentUser?.userName} {auth?.currentUser?.name}</span>
            </div>
          </li>
          <li>
            <Link onClick={handleLogout} className="btn btn-danger mx-4">
              Logout <i className="fa fa-sign-out" ></i>
            </Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
