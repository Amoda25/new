import api from "./api";

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
    const response = await api.post("/api/user/profile/image", formData);
    return response.data; // This is the image URL
};
