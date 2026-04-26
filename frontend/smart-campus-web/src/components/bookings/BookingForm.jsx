import React, { useState, useEffect } from 'react';
import { createBooking, getAvailability } from '../../services/bookingService';
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
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [isFetchingAvailability, setIsFetchingAvailability] = useState(false);

  useEffect(() => {
    if (formData.resourceId && formData.startDate) {
      fetchAvailability();
    }
  }, [formData.resourceId, formData.startDate]);

  const fetchAvailability = async () => {
    setIsFetchingAvailability(true);
    try {
      const bookings = await getAvailability(formData.resourceId, formData.startDate);
      setOccupiedSlots(bookings);
    } catch (err) {
      console.error("Error fetching availability:", err);
    } finally {
      setIsFetchingAvailability(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "attendees" && value !== "" && Number(value) < 0) {
      setError("Number of attendees cannot be negative");
    } else if (error) {
      setError("");
    }
    
    if (successMessage) setSuccessMessage("");
  };

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    // Validate that the date is not in the past
    const startDateTime = `${formData.startDate}T${formData.startTime}:00`;
    const endDateTime = `${formData.endDate}T${formData.endTime}:00`;
    const now = new Date();
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (start < now) {
      setError("Start time cannot be in the past.");
      setIsLoading(false);
      return;
    }

    if (end <= start) {
      setError("End time must be after start time.");
      setIsLoading(false);
      return;
    }

    try {
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
      const backendMessage = err.response?.data;
      const msg = typeof backendMessage === 'string' && backendMessage.length > 0
        ? backendMessage
        : err.response?.data?.message || "Failed to create booking. Please check your inputs.";
      setError(msg);
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
              <input type="date" name="startDate" min={today} value={formData.startDate} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required disabled={isLoading} />
            </div>
          </div>

          {/* Availability Display */}
          {formData.resourceId && formData.startDate && (
            <div className="availability-info">
              <h4>Occupied Slots for this day:</h4>
              {isFetchingAvailability ? (
                <p className="loading-text">Checking availability...</p>
              ) : occupiedSlots.length > 0 ? (
                <div className="occupied-list">
                  {occupiedSlots.map((b, idx) => (
                    <span key={idx} className="occupied-tag">
                      {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="available-text">✅ All slots available</p>
              )}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" name="endDate" min={formData.startDate || today} value={formData.endDate} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required disabled={isLoading} />
            </div>
          </div>

          <div className="form-group">
            <label>Number of Attendees</label>
            <input 
              type="number" 
              name="attendees" 
              min="1" 
              value={formData.attendees} 
              onChange={handleChange} 
              required 
              disabled={isLoading} 
            />
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
