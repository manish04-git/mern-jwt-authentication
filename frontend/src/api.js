// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

//Attach token automatically if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // we’ll store token here
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
