import axios from "../utils/axiosInterceptor";
import { getCookie } from "../utils/cookiesUtil";

const LOCAL_API = "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = getCookie("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const AllemployeeApi = {
  async getEmployeesByRole() {
    try {
      // 🔹 Temporarily returning static mock data instead of real API call
      const mockResponse = {
        success: true,
        data: {
          totalEmployees: 10,
          employeeList: [
            {
              id: "1",
              empCode: "EMP1024",
              name: "Rohit Sharma",
              email: "rohit.sharma@company.com",
              designation: "Software Engineer",
              departmentId: 2,
              managerId: null,
              status: "Active",
            },
            {
              id: "4",
              empCode: "EMP1026",
              name: "Amit Verma",
              email: "amit.verma@company.com",
              designation: "Team Manager",
              departmentId: 2,
              managerId: null,
              status: "Active",
            },
            {
              id: "7",
              empCode: "EMP1025",
              name: "Alice",
              email: "alice@test.com",
              designation: "Software Development",
              departmentId: null,
              managerId: 4,
              status: "Active",
            },
            {
              id: "9",
              empCode: "EMP1078",
              name: "Shubradeep maity",
              email: "alice@rf.com",
              designation: "Software Development",
              departmentId: null,
              managerId: 4,
              status: "Active",
            },
            // add more employees as needed
          ],
        },
      };

      // ⏳ Simulate API delay (optional)
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mockResponse;
    } catch (error) {
      console.error("Error fetching employee list (mock fallback):", error.message);
      return {
        success: false,
        message: "Failed to fetch employee list (mock mode)",
      };
    }
  },
};




// import axios from "../utils/axiosInterceptor";
// import { getCookie } from "../utils/cookiesUtil";

// const LOCAL_API = "http://localhost:3000/api";

// // ✅ Always get latest token for Authorization header
// const getAuthHeaders = () => {
//   const token = getCookie("accessToken");
//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// };

// // ✅ Employee API object
// export const AllemployeeApi = {
//   async getEmployeesByRole() {
//     try {
//       const response = await axios.get(`${LOCAL_API}/employees/list`, {
//         headers: getAuthHeaders(),
//       });
//       return response.data;
//     } catch (error) {
//       console.error(
//         "Error fetching employees by role:",
//         error.response?.data || error.message
//       );
//       throw error;
//     }
//   },
// };
