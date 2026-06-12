import axios from "axios";
import useAuth from "./Store";

const apiClient = axios.create({
  baseURL: import.meta.env.BACKEND_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuth.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let pendingReq = [];

function queueReq(req) {
  pendingReq.push(req);
}

function releaseQueue(newRefreshToken) {
  pendingReq.forEach((req) => req(newRefreshToken));
  pendingReq = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const is401 = error?.response?.status === 401;
    const originalReq = error.config;

    if (!is401 || originalReq._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queueReq((newRefreshToken) => {
          if (!newRefreshToken) return reject();

          originalReq.headers.Authorization = `Bearer ${newRefreshToken}`;
          resolve(apiClient(originalReq));
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await apiClient.post("/auth/refresh-token");
      const newToken = res.data?.accessToken;

      if (!newToken) throw new Error("No access token received");

      useAuth
        .getState()
        .changeLocalLoginData(newToken, useAuth.getState().user, true);

      releaseQueue(newToken);
      originalReq.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalReq);
    } catch (error) {
      releaseQueue(null);
      useAuth.getState().logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
