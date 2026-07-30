import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// SEND TOKEN AUTOMATICALLY
API.interceptors.request.use((req) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  req.headers = req.headers || {};

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  } else {
    delete req.headers.Authorization;
  }

  return req;
});

export default API;