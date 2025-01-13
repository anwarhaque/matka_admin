import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import '../assets/js/app'
import MarqueeNotification from "../components/marquee-notification/MarqueeNotification";

const Layout = () => {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="marquee">
          <MarqueeNotification />
        </div>
        <main className="content">
          <div className="container-fluid p-0">
            <Outlet /> {/* This renders the routed pages */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
