import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import '../assets/js/app'

const Layout = () => {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main">
        <Header />
        <main className="content">
          <Outlet /> {/* This renders the routed pages */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
