import axios from "axios";
import api from "./api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export const getUserProfile = async () => {
    const response = await api.get("/api/user/profile");
    return response.data;
};

export const updateUserProfile = async (profileData) => {
    const response = await api.put("/api/user/profile", profileData);
    return response.data;
};

export const deleteUserAccount = async () => {
    const response = await api.delete("/api/user/profile");
    return response.data;
};

export const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");
    
    // Using axios directly to avoid the global 401 redirect interceptor during debug
    const response = await axios.post(`${API_BASE_URL}/api/user/profile/image`, formData, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response.data; // This is the image URL
};
