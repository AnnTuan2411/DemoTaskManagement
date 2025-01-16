import axios from "axios";

// API lấy danh sách nhân viên
export const getEmployees = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:5000/employee-managment/employees");
        return response.data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
};

export const getEmployeebyId = async (employee_id) => {
    try {
        const response = await axios.get(`http://127.0.0.1:5000/employee-managment/employee/${employee_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
};

export const AddEmployees = async (employeeData) => {
    try {
        const response = await axios.post("http://127.0.0.1:5000/employee-managment/employee",employeeData);
        return response.data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
};

export const UpdateEmployees = async (employee_id,employeeData) => {
    try {
        const response = await axios.put(`http://127.0.0.1:5000/employee-managment/employee/${employee_id}`,employeeData);
        return response.data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
};

