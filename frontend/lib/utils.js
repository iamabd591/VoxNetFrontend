import axios from "axios";

const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
// console.log("Base URL:", baseURL);

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
