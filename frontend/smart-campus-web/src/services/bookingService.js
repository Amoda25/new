import api from './api';

// ========== USER OPERATIONS ==========

export const getUserBookings = async () => {
  try {
    const response = await api.get('/api/user/bookings');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/api/user/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelBooking = async (id) => {
  try {
    const response = await api.put(`/api/user/bookings/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBooking = async (id) => {
  try {
    const response = await api.delete(`/api/user/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailability = async (resourceId, date) => {
  try {
    const response = await api.get('/api/user/bookings/availability', {
      params: { resourceId, date }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ========== ADMIN OPERATIONS ==========

export const adminGetAllBookings = async (status = '') => {
  try {
    const response = await api.get('/api/admin/bookings', {
      params: { status }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminApproveBooking = async (id) => {
  try {
    const response = await api.put(`/api/admin/bookings/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminRejectBooking = async (id, reason) => {
  try {
    const response = await api.put(`/api/admin/bookings/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminDeleteBooking = async (id) => {
  try {
    const response = await api.delete(`/api/admin/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
