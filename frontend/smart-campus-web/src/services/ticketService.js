import api from "./api";

// The base URL is now handled by the 'api' axios instance, 
// so we only need the relative path here.
const BASE_PATH = "/api/user/tickets";

export const createTicket = async (formData) => {
  const response = await api.post(BASE_PATH, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getUserTickets = async () => {
  const response = await api.get(BASE_PATH);
  return response.data;
};

export const getTicketImages = async (ticketId) => {
  const response = await api.get(`${BASE_PATH}/${ticketId}/images`);
  return response.data;
};

export const getAllTicketsForAdmin = async () => {
  const response = await api.get("/api/admin/tickets");
  return response.data;
};

export const getAdminTicketImages = async (ticketId) => {
  const response = await api.get(`/api/admin/tickets/${ticketId}/images`);
  return response.data;
};

export const assignTechnician = async (ticketId, technicianId) => {
  const response = await api.put(
    `/api/admin/tickets/${ticketId}/assign`,
    { technicianId }
  );
  return response.data;
};

export const getTechnicianTickets = async () => {
  const response = await api.get("/api/technician/tickets");
  return response.data;
};

export const getTechnicianTicketImages = async (ticketId) => {
  const response = await api.get(`/api/technician/tickets/${ticketId}/images`);
  return response.data;
};

export const updateTechnicianResolution = async (ticketId, resolutionNotes) => {
  const response = await api.put(
    `/api/technician/tickets/${ticketId}/resolution`,
    { resolutionNotes }
  );
  return response.data;
};

export const updateTechnicianTicketStatus = async (ticketId, status) => {
  const response = await api.put(
    `/api/technician/tickets/${ticketId}/status`,
    { status }
  );
  return response.data;
};

export const updateAdminTicketStatus = async (ticketId, status) => {
  const response = await api.put(
    `/api/admin/tickets/${ticketId}/status`,
    { status }
  );
  return response.data;
};

export const rejectAdminTicket = async (ticketId, reason) => {
  const response = await api.put(
    `/api/admin/tickets/${ticketId}/reject`,
    { reason }
  );
  return response.data;
};

export const deleteAdminTicket = async (ticketId) => {
  const response = await api.delete(`/api/admin/tickets/${ticketId}`);
  return response.data;
};

export const deleteTechnicianTicket = async (ticketId) => {
  const response = await api.delete(
    `/api/technician/tickets/${ticketId}`
  );
  return response.data;
};

export const deleteUserTicket = async (ticketId) => {
  const response = await api.delete(
    `${BASE_PATH}/${ticketId}`
  );
  return response.data;
};

export const getTechnicians = async () => {
  const response = await fetch(
    "http://localhost:8081/api/admin/tickets/technicians",
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );

  return response.json();
};

export const getResources = async () => {
  const response = await api.get("/api/user/resources");
  return response.data;
};