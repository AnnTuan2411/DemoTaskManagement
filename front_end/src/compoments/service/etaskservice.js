import axios from "axios";

// API lấy danh sách task
export const getEtasks = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:5000/etask-managment/etasks");
        return response.data;
    } catch (error) {
        console.error("Error fetching etasks:", error);
        throw error;
    }
};

export const getEtaskbyEmployeeId = async (employee_id) => {
    try {
        const response = await axios.get(`http://127.0.0.1:5000/etask-managment/etasks/${employee_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching etasks:", error);
        throw error;
    }
};

export const AddEtasks = async (etaskData) => {
    try {
        const response = await axios.post("http://127.0.0.1:5000/etask-managment/etask",etaskData);
        return response.data;
    } catch (error) {
        console.error("Error add etasks:", error);
        throw error;
    }
};

export const UpdateEtasks = async (etask_id,etaskData) => {
    try {
        const response = await axios.put(`http://127.0.0.1:5000/etask-managment/etask/${etask_id}`,etaskData);
        return response.data;
    } catch (error) {
        console.error("Error Update etasks:", error);
        throw error;
    }
};

export const DeleteEtasks = async (etask_id) => {
    try {
        const response = await axios.delete(`http://127.0.0.1:5000/etask-managment/etask/${etask_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching etasks:", error);
        throw error;
    }
};