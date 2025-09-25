import axios from 'axios';
import { toast } from "react-toastify";

const apiService = axios.create();

// Request interceptor
apiService.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiService.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        try {
            if (error.response.status === 409) {
                toast.error(error.response.data.error);
            }
            if (error.response.status === 400) {
                const data = JSON.parse(error.response.data.message);
                toast.error(data?.message);
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
        return Promise.reject(error);
    }
);

export default apiService;
