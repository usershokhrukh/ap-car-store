import axios from "axios";

export const api = axios.create({
  baseURL: "https://backend.magnateshop.uz",
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest._isPublic
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            err._isAuthFailure = true;
            return Promise.reject(err);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const check = await axios.post("/api/auth/checktoken");
        const accessToken = check?.data?.accessToken;
        if (accessToken) {
          isRefreshing = false;
          processQueue(null, accessToken);
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        isRefreshing = false;
        refreshError._isAuthFailure = true;
        if (refreshError.response) {
          refreshError.response._isAuthFailure = true;
        }

        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);