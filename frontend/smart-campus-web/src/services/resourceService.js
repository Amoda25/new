import api from "./api";

export const getAllResources = async () => {
  const response = await api.get("/api/user/resources");
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await api.get(`/api/user/resources/${id}`);
  return response.data;
};

export const createResource = async (resourceData) => {
  const response = await api.post("/api/admin/resources", resourceData);
  return response.data;
};

export const updateResource = async (id, resourceData) => {
  const response = await api.put(`/api/admin/resources/${id}`, resourceData);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/api/admin/resources/${id}`);
  return response.data;
};