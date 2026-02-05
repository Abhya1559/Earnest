import axios from "axios";
import { config } from "process";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");

      const res = await axios.post("http://localhost:5000/auth/refresh", {
        refreshToken,
      });

      localStorage.setItem("accessToken", res.data.accessToken);

      err.config.headers.Authorization = `Bearer ${res.data.accessToken}`;

      return axios(err.config);
    }

    return Promise.reject(err);
  },
);
export default api;
