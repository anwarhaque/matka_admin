// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import Axios from '../api/Axios';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const navigate = useNavigate()


  useEffect(() => {
    // Check for the token in localStorage on component mount
    const userData = JSON.parse(localStorage.getItem('superAuthToken'));
    if (userData?.token) {
      

      Axios.get('/verify-token') 
        .then(res => {
          // Token is valid, keep authenticated
          if( res.data?.meta?.status){
            setCurrentUser(userData)
            setIsAuthenticated(true);
            navigate("/");
          }
          
        })
        .catch(error => {
          // Token is invalid, clear localStorage and update state
          console.error("Token verification failed:", error);
          localStorage.removeItem('superAuthToken');
          setIsAuthenticated(false);
        });
    }
  }, []);


  const login = async (credentials) => {
    
    try {
      const {data} = await Axios.post('login', credentials); // Use the Axios instance
      
      if (data.meta.status && data.token) {
        let userData = {token:data.token, ...data.data}
        setIsAuthenticated(true);
        setCurrentUser(userData)
        localStorage.setItem('superAuthToken', JSON.stringify(userData));
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed: ", error);
      setIsAuthenticated(false);
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
