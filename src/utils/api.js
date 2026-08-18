import axios from "axios";

export const api = axios.create({
  baseURL: "https://backend.magnateshop.uz",
});

let activeCheckTokenPromise = null;

api.interceptors.request.use(
  async (config) => {
    if (config._isPublic) {
      return config;
    }

    try {
      if (!activeCheckTokenPromise) {
        activeCheckTokenPromise = axios
          .post("/api/auth/checktoken")
          .then((res) => res?.data?.accessToken)
          .catch((err) => {
            err._isAuthFailure = true;
            throw err;
          })
          .finally(() => {
            activeCheckTokenPromise = null;
          });
      }

      const accessToken = await activeCheckTokenPromise;

      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    } catch (error) {
      return Promise.reject(error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
