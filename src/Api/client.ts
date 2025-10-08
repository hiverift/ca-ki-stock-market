// import axios from 'axios';
// import config from '../pages/config';
// const API_BASE =config.BASE_URL;

// const client = axios.create({
//   baseURL: API_BASE,
//   timeout: 15000,
// });

// Add auth header if you have token
// export function setAuthToken(token?: string ) {
//   if (token) client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   else delete client.defaults.headers.common['Authorization'];
// }

// export default client;


// src/Api/client.js
import axios from "axios";
import config from "../pages/config";

const API_BASE = config.BASE_URL;

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: true, // 👈 add this line
});

export default client;
