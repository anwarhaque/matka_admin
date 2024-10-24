
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import './App.css'
import ChangePassword from "./components/ChangePassword";
import Profile from "./components/Profile";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<ChangePassword />} />
          {/* Add more routes here */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
