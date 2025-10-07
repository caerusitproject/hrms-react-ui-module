import config from "../config/config";
import apiService from "../utils/http-interceptor";
import axios from "axios";

const API = config.webSiteUrl;
const HIP_API = config.webHipSiteUrl;
const APPOINTMENT_API = config.patientCare;
const LOCAL_API = "http://localhost:3000";

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
});

const getAuthHeadersWithUserId = () => ({
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
    'userId': sessionStorage.getItem('userId'),
});

const getHeaders = () => ({
    'Facility-id': sessionStorage.getItem('facilityId'),
    'Branch-id': sessionStorage.getItem('branchId'),
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
});

const getHeaders1 = () => ({
    'Facility-Id': sessionStorage.getItem('facilityId'),
    'Branch-Id': sessionStorage.getItem('branchId'),
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
    'accept': '*/*'
});

const getNormalPostHeaders = () => ({
    Accept: "application/json",
    "Content-Type": "application/json",
});

const getPostAuthHeaders = () => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
});

const getPostHeaders = () => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Facility-id': sessionStorage.getItem('facilityId'),
    'Branch-id': sessionStorage.getItem('branchId'),
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
});

export const EmployeeAPI = {
     async cats() {
        return await axios.get(`${HIP_API}/posts`);
    },

    async fetchEmployeeData(employeeId) {
        const response = await fetch(`${LOCAL_API}/employees/${employeeId}`, {
        });
        // if (!response.ok) {
        //     throw new Error(`HTTP error! Status: ${response.status}`);
        // }
        return response.json();
    },
    

    async requestCredentials(body) {
        return await fetch(`${HIP_API}/auth/request-credentials`, body);
    },

    async createAccount(body) {
        return await fetch(`${HIP_API}/auth/create-account`, body);
    },

    async verifyOTP(body) {
        return await fetch(`${HIP_API}/auth/create-account/verify-otp`, body);
    },

    async getToken(code) {
        return await axios.post(`${HIP_API}/auth/oauth2`, code, {
            headers: getNormalPostHeaders(),
        });
    },

    async forgotPassword(email) {
        return await fetch(`${HIP_API}/auth/forgot-password?email=${email}`)
    },

    async resetPassword(token, body) {
        return await axios.post(`${HIP_API}/auth/reset-password?token=${token}`, body);
    },

    async prePatientRegistration(data) {
        return await axios.post(`${HIP_API}/pre-patient-registration`, data,

            {
                headers: getPostHeaders()
            }
        );
    },

    async getUserDetail(email) {

        const response = await fetch(`${HIP_API}/auth/user-detail?emailId=${email}`,
            {
                headers: getAuthHeaders()
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();

    },

    async getUserDetailById(id) {

        const response = await fetch(`${HIP_API}/auth/user-detail-id?id=${id}`,
            {
                headers: getAuthHeaders()
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();

    },

    
}