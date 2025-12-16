import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

 const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
      if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    });

    const resInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          await logout();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
