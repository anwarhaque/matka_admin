// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import Axios from '../api/Axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Notifier from '../components/Notifier';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    // Check for the token in localStorage on component mount
    const userData = JSON.parse(localStorage.getItem('superAuthToken'));
    if (userData?.token) {
      setCurrentUser(userData)
      setIsAuthenticated(true);
      navigate(location.pathname);
    }
  }, []);


  const login = async (credentials) => {

    try {
      const res = await Axios.post('admin/login', credentials); // Use the Axios instance
     
      
      if (res.meta.status && res.token) {
        let userData = { token: res.token, ...res.data }
        setIsAuthenticated(true);
        setCurrentUser(userData)
        localStorage.setItem('superAuthToken', JSON.stringify(userData));
        navigate("/");
      }
    } catch (error) {
      setIsAuthenticated(false);
      Notifier(error?.meta?.msg, 'Error')
    }
  };

  const logout = () => {
    localStorage.removeItem('superAuthToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
