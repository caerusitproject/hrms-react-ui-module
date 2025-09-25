// employeeService.js - Real API integration for employee data

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.data?.error || 'Server error occurred';
    throw new Error(`${error.response.status}: ${message}`);
  } else if (error.request) {
    // Network error
    throw new Error('Network error - please check your connection');
  } else {
    // Other error
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Map database employee to component format
const mapDbToComponentFormat = (dbEmployee) => {
  return {
    id: dbEmployee.empCode || dbEmployee.id?.toString(),
    personalDetails: {
      fullName: dbEmployee.name || '',
      dateOfBirth: dbEmployee.dateOfBirth || '',
      gender: dbEmployee.gender || '',
      maritalStatus: dbEmployee.maritalStatus || '',
      nationality: 'American', // Default - add to DB if needed
      identificationNumber: dbEmployee.idNumber || '',
      profilePhoto: null
    },
    contactDetails: {
      workEmail: dbEmployee.email || '',
      personalEmail: '', // Not in current DB model
      phone: dbEmployee.mobile || dbEmployee.phone || '',
      alternatePhone: dbEmployee.phone !== dbEmployee.mobile ? dbEmployee.phone : '',
      residentialAddress: dbEmployee.address || '',
      permanentAddress: `${dbEmployee.city || ''} ${dbEmployee.country || ''}`.trim() || dbEmployee.address || '',
      emergencyContact: {
        name: '', // Add to DB if needed
        relationship: '', // Add to DB if needed
        phone: '' // Add to DB if needed
      }
    },
    employmentDetails: {
      employeeId: dbEmployee.empCode || dbEmployee.id?.toString(),
      jobTitle: dbEmployee.designation || '',
      department: dbEmployee.department || dbEmployee.Department?.name || '', // Handle association
      manager: '', // Add to DB if needed
      employmentType: dbEmployee.employmentType || 'Full-time',
      dateOfJoining: dbEmployee.joiningDate || '',
      workLocation: `${dbEmployee.city || ''} Office`.trim() || 'Main Office'
    },
    educationalDetails: {
      highestQualification: '', // Add to DB if needed
      previousExperience: '', // Add to DB if needed
      certifications: [], // Add to DB if needed
      skills: [] // Add to DB if needed
    },
    bankingDetails: {
      bankName: '', // Add to DB if needed
      accountHolderName: dbEmployee.name || '',
      accountNumber: '', // Add to DB if needed
      ifscCode: '', // Add to DB if needed
      panNumber: '', // Add to DB if needed
      salaryStructure: '' // Add to DB if needed
    },
    documents: [], // Add to DB if needed
    metadata: {
      createdAt: dbEmployee.createdAt || new Date().toISOString(),
      updatedAt: dbEmployee.updatedAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(), // Add to DB if needed
      profileCompleteness: calculateProfileCompleteness(dbEmployee),
      status: dbEmployee.status || 'Active',
      state: dbEmployee.state || 'ACTIVE'
    }
  };
};

// Map component format to database format
const mapComponentToDbFormat = (componentData) => {
  return {
    empCode: componentData.employmentDetails?.employeeId || componentData.id,
    name: componentData.personalDetails?.fullName || '',
    email: componentData.contactDetails?.workEmail || '',
    dateOfBirth: componentData.personalDetails?.dateOfBirth || null,
    joiningDate: componentData.employmentDetails?.dateOfJoining || null,
    gender: componentData.personalDetails?.gender || '',
    maritalStatus: componentData.personalDetails?.maritalStatus || null,
    fatherName: '', // Add to component if needed
    idNumber: componentData.personalDetails?.identificationNumber || null,
    address: componentData.contactDetails?.residentialAddress || null,
    city: extractCityFromAddress(componentData.contactDetails?.permanentAddress) || null,
    country: extractCountryFromAddress(componentData.contactDetails?.permanentAddress) || null,
    mobile: componentData.contactDetails?.phone || null,
    phone: componentData.contactDetails?.alternatePhone || null,
    designation: componentData.employmentDetails?.jobTitle || '',
    employmentType: componentData.employmentDetails?.employmentType || 'Full-time',
    status: componentData.metadata?.status || 'Active',
    state: componentData.metadata?.state || 'ACTIVE',
    // Note: department will need to be handled separately if it's a foreign key
    departmentId: null // Will need to fetch department ID based on name
  };
};

// Helper function to extract city from address
const extractCityFromAddress = (address) => {
  if (!address) return null;
  // Simple extraction - you might want to make this more sophisticated
  const parts = address.split(',').map(part => part.trim());
  return parts.length > 1 ? parts[parts.length - 2] : null;
};

// Helper function to extract country from address
const extractCountryFromAddress = (address) => {
  if (!address) return null;
  const parts = address.split(',').map(part => part.trim());
  return parts.length > 0 ? parts[parts.length - 1] : null;
};

// Calculate profile completeness based on available data
const calculateProfileCompleteness = (employee) => {
  const requiredFields = [
    'name', 'email', 'gender', 'mobile', 'address', 
    'designation', 'dateOfBirth', 'joiningDate'
  ];
  
  let completedFields = 0;
  requiredFields.forEach(field => {
    if (employee[field] && employee[field].toString().trim() !== '') {
      completedFields++;
    }
  });
  
  return Math.round((completedFields / requiredFields.length) * 100);
};

// Main service functions
export const fetchEmployeeData = async (employeeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const dbEmployee = await response.json();
    return mapDbToComponentFormat(dbEmployee);
  } catch (error) {
    handleApiError(error);
  }
};

export const saveEmployeeData = async (employeeData) => {
  try {
    const dbFormat = mapComponentToDbFormat(employeeData);
    const employeeId = employeeData.id || employeeData.employmentDetails?.employeeId;
    
    // Determine if this is create or update
    const isUpdate = employeeId && employeeId !== 'new';
    
    const url = isUpdate 
      ? `${API_BASE_URL}/employees/${employeeId}` 
      : `${API_BASE_URL}/employees/create`;
    
    const method = isUpdate ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(dbFormat)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
    }

    const savedEmployee = await response.json();
    
    return {
      success: true,
      message: isUpdate ? "Employee data updated successfully" : "Employee created successfully",
      employee: mapDbToComponentFormat(savedEmployee)
    };
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchEmployeeList = async (page = 1, limit = 10, search = '') => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });

    const response = await fetch(`${API_BASE_URL}/employees?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle both paginated and non-paginated responses
    const employees = Array.isArray(data) ? data : (data.employees || data.data || []);
    
    return {
      employees: employees.map(emp => ({
        id: emp.empCode || emp.id?.toString(),
        fullName: emp.name,
        jobTitle: emp.designation,
        department: emp.department || emp.Department?.name || '',
        workEmail: emp.email,
        profileCompleteness: calculateProfileCompleteness(emp),
        lastUpdated: emp.updatedAt,
        status: emp.status,
        state: emp.state
      })),
      total: data.total || employees.length,
      page: data.page || page,
      totalPages: data.totalPages || Math.ceil((data.total || employees.length) / limit)
    };
  } catch (error) {
    handleApiError(error);
  }
};

export const searchEmployees = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const employees = await response.json();
    
    return employees.map(emp => ({
      id: emp.empCode || emp.id?.toString(),
      fullName: emp.name,
      jobTitle: emp.designation,
      department: emp.department || emp.Department?.name || '',
      workEmail: emp.email
    }));
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return {
      success: true,
      message: "Employee deleted successfully"
    };
  } catch (error) {
    handleApiError(error);
  }
};

export const updateEmployeeStatus = async (employeeId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const updatedEmployee = await response.json();
    
    return {
      success: true,
      message: "Employee status updated successfully",
      employee: mapDbToComponentFormat(updatedEmployee)
    };
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch departments for dropdown
export const fetchDepartments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const departments = await response.json();
    return departments.map(dept => ({
      id: dept.id,
      name: dept.name,
      value: dept.name,
      label: dept.name
    }));
  } catch (error) {
    console.warn('Could not fetch departments:', error.message);
    return []; // Return empty array if departments endpoint doesn't exist
  }
};

// Validation functions
export const validateEmployeeData = (data) => {
  const errors = {};
  
  // Required field validation
  if (!data.personalDetails?.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  }
  
  if (!data.contactDetails?.workEmail?.trim()) {
    errors.workEmail = 'Work email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactDetails.workEmail)) {
    errors.workEmail = 'Please enter a valid email address';
  }
  
  if (!data.personalDetails?.gender) {
    errors.gender = 'Gender is required';
  }
  
  if (!data.employmentDetails?.jobTitle?.trim()) {
    errors.jobTitle = 'Job title is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Export utility functions
export const getEmployeeById = fetchEmployeeData;
export const createEmployee = (data) => saveEmployeeData({ ...data, id: 'new' });
export const updateEmployee = saveEmployeeData;

// Default export
const employeeService = {
  fetchEmployeeData,
  saveEmployeeData,
  fetchEmployeeList,
  searchEmployees,
  deleteEmployee,
  updateEmployeeStatus,
  fetchDepartments,
  validateEmployeeData,
  getEmployeeById,
  createEmployee,
  updateEmployee
};

export default employeeService;