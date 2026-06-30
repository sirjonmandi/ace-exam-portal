import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request Interceptor
 */
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Response Interceptor
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized");

          localStorage.removeItem("token");

          // Optional:
          // window.location.href = "/login";

          break;

        case 403:
          console.error("Forbidden");
          break;

        case 404:
          console.error("Resource not found");
          break;

        case 422:
          console.error("Validation Error", error.response.data);
          break;

        case 500:
          console.error("Server Error");
          break;

        default:
          console.error(error.response.data);
      }
    } else if (error.request) {
      console.error("Network Error");
    } else {
      console.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;