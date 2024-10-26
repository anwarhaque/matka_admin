
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./components/Dashboard";
import ChangePassword from "./components/ChangePassword";
import Profile from "./components/Profile";
import DrowMaster from "./components/master/DrowMaster";
import ClientMaster from "./components/master/clientMaster";
import AgentMaster from "./components/master/AgentMaster";
import ClientReport from './components/reports/ClientReport';
import AgentReport from './components/reports/AgentReport';
import MyReport from './components/reports/MyReport';
import ClientLimit from './components/limits/ClientLimit';
import AgentLimit from './components/limits/agentLimit';
import Login from './components/login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for Toastify

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="drow-master" element={<DrowMaster />} />
            <Route path="client-master" element={<ClientMaster />} />
            <Route path="agent-master" element={<AgentMaster />} />
            <Route path="client-report" element={<ClientReport />} />
            <Route path="agent-report" element={<AgentReport />} />
            <Route path="my-report" element={<MyReport />} />
            <Route path="client-limit" element={<ClientLimit />} />
            <Route path="agent-limit" element={<AgentLimit />} />
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
        <ToastContainer /> {/* Add ToastContainer here to display toasts globally */}
      </AuthProvider>
    </Router>
  )
}

export default App
