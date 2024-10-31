
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./components/Dashboard";
import ChangePassword from "./components/ChangePassword";
import Profile from "./components/Profile";
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
import AgnetList from './components/master/agent/AgnetList';
import AddAgent from './components/master/agent/AddAgent';
import EditAgent from './components/master/agent/EditAgent';
import ClientList from './components/master/client/ClientList';
import AddClient from './components/master/client/addClient';
import EditClient from './components/master/client/EditClient';
import './assets/css/app.css'
import DrowList from './components/master/drow/DrowList';
import AddDrow from './components/master/drow/AddDrow';
import EditDrow from './components/master/drow/EditDrow';
function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="drow-master" element={<DrowList />} />
            <Route path="drow-master/add" element={<AddDrow />} />
            <Route path="drow-master/edit/:drowId" element={<EditDrow />} />
            <Route path="client-master" element={<ClientList />} />
            <Route path="client-master/add" element={<AddClient />} />
            <Route path="client-master/edit/:userId" element={<EditClient />} />
            <Route path="agent-master" element={<AgnetList />} />
            <Route path="agent-master/add" element={<AddAgent />} />
            <Route path="agent-master/edit/:userId" element={<EditAgent />} />
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
