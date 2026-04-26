import React, { useState } from 'react';
import { createBooking } from '../../services/bookingService';
import './BookingForm.css';

const BookingForm = ({ onClose, onSuccess, resources = [] }) => {
  const [formData, setFormData] = useState({
    resourceId: resources.length === 1 ? resources[0].id : '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    purpose: '',
    attendees: 1
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Format to LocalDateTime: YYYY-MM-DDTHH:MM:SS
      const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
      const endDateTime = `${formData.endDate}T${formData.endTime}:00`;

      const payload = {
        resourceId: String(formData.resourceId),
        startTime: startDateTime,
        endTime: endDateTime,
        purpose: formData.purpose,
        attendees: parseInt(formData.attendees)
      };

      await createBooking(payload);
      setSuccessMessage("Booking created successfully!");
      
      // Delay before closing to let user see the message
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);
      
    } catch (err) {
      console.error("Booking error:", err);
      // Backend conflict errors are typically returned in the message field
      setError(err.response?.data?.message || "Failed to create booking. Please check your inputs or try a different time slot.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="booking-form-overlay">
      <div className="booking-form-card">
        <div className="form-header">
          <h2>Book a Resource</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="server-error-message" style={{ marginBottom: '15px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Resource</label>
            <select name="resourceId" value={formData.resourceId} onChange={handleChange} required disabled={isLoading}>
              <option value="">Choose a resource...</option>
              {resources.map(res => (
                <option key={res.id} value={res.id}>{res.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required disabled={isLoading} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required disabled={isLoading} />
            </div>
          </div>

          <div className="form-group">
            <label>Number of Attendees</label>
            <input type="number" name="attendees" min="1" value={formData.attendees} onChange={handleChange} required disabled={isLoading} />
          </div>

          <div className="form-group">
            <label>Purpose of Booking</label>
            <textarea name="purpose" rows="2" placeholder="Describe the purpose..." value={formData.purpose} onChange={handleChange} required disabled={isLoading} />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
