// src/services/authService.js
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// API Base URL (Replace with your backend URL)
const API_URL = "http://localhost:5000/api"; 

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  const token = getToken();
  return token ? jwtDecode(token) : null;
};

export const isAuthenticated = () => !!getToken();
