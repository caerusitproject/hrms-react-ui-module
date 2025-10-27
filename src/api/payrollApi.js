import axios from "../utils/axiosInterceptor";
import { getCookie } from "../utils/cookiesUtil";

const LOCAL_API = "http://localhost:3000/api";

// ✅ Always get latest token for Authorization header
const getAuthHeaders = () => {
  const token = getCookie("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
const dummyEmployees = [
  { id: "7", empCode: "EMP1028", name: "Rahul Sharma", email: "rahul.sharma@company.com", designation: "Senior Developer", department: "Engineering" },
  { id: "8", empCode: "EMP1029", name: "Priya Singh", email: "priya.singh@company.com", designation: "HR Manager", department: "Human Resources" },
  { id: "9", empCode: "EMP1030", name: "Vikram Reddy", email: "vikram.reddy@company.com", designation: "Data Analyst", department: "Analytics" },
  { id: "10", empCode: "EMP1031", name: "Anita Patel", email: "anita.patel@company.com", designation: "Marketing Executive", department: "Marketing" },
  { id: "11", empCode: "EMP1032", name: "Karan Gupta", email: "karan.gupta@company.com", designation: "Operations Lead", department: "Operations" },
  { id: "12", empCode: "EMP1033", name: "Neha Joshi", email: "neha.joshi@company.com", designation: "Backend Developer", department: "Engineering" },
  { id: "13", empCode: "EMP1034", name: "Arjun Mehta", email: "arjun.mehta@company.com", designation: "Finance Analyst", department: "Finance" },
  { id: "14", empCode: "EMP1035", name: "Divya Rao", email: "divya.rao@company.com", designation: "Project Coordinator", department: "Project Management" },
];

// ✅ Employee API object
export const PayrollApi = {
  async getallPayroll() {
    try {
      const response = await axios.get(`${LOCAL_API}/compensations`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching employees by role:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
 async getpayrollById(id) {
    try {
      const response = await axios.get(`${LOCAL_API}/compensations/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching subordinates:", error.response?.data || error.message);
      throw error;
    }
  },
  async craetepayroll(payload) {
    try {
      const response = await axios.post(`${LOCAL_API}/compensations`, payload, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error assigning manager:", error.response?.data || error.message);
      throw error;
    }
  },
   


  async getAllEmployees() {
    try {
      // simulate API delay
     const response = await axios.get(`${LOCAL_API}/payrolls/employee-list`, { 
      headers: getAuthHeaders(), 
    }); 
     return response.data;
    } catch (error) {
      console.error("Error fetching employees (mock):", error.message);
      return {
        success: false,
        message: "Failed to fetch employees (mock)",
      };
    }
  },


};
