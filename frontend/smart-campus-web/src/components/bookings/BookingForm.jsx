import React, { useState, useEffect } from 'react';
import { createBooking, getAvailability } from '../../services/bookingService';
import './BookingForm.css';

const BookingForm = ({ onClose, onSuccess, resources = [] }) => {
  const [formData, setFormData] = useState({
    resourceId: resources.length === 1 ? resources[0].id : '',
    startDate: '',
    timeSlot: '', // Format: "HH:mm-HH:mm"
    purpose: '',
    attendees: 1
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [isFetchingAvailability, setIsFetchingAvailability] = useState(false);

  // Generate 1-hour slots from 8 AM to 6 PM
  const timeSlots = [
    { label: "08:00 AM - 09:00 AM", value: "08:00-09:00" },
    { label: "09:00 AM - 10:00 AM", value: "09:00-10:00" },
    { label: "10:00 AM - 11:00 AM", value: "10:00-11:00" },
    { label: "11:00 AM - 12:00 PM", value: "11:00-12:00" },
    { label: "12:00 PM - 01:00 PM", value: "12:00-13:00" },
    { label: "01:00 PM - 02:00 PM", value: "13:00-14:00" },
    { label: "02:00 PM - 03:00 PM", value: "14:00-15:00" },
    { label: "03:00 PM - 04:00 PM", value: "15:00-16:00" },
    { label: "04:00 PM - 05:00 PM", value: "16:00-17:00" },
    { label: "05:00 PM - 06:00 PM", value: "17:00-18:00" }
  ];

  useEffect(() => {
    if (formData.resourceId && formData.startDate) {
      console.log("DEBUG: Fetching availability for:", formData.resourceId, formData.startDate);
      fetchAvailability();
    }
  }, [formData.resourceId, formData.startDate]);

  const fetchAvailability = async () => {
    setIsFetchingAvailability(true);
    setOccupiedSlots([]); // Clear old data while loading
    try {
      const bookings = await getAvailability(formData.resourceId, formData.startDate);
      console.log("DEBUG: Received occupied slots:", bookings);
      setOccupiedSlots(bookings || []);
    } catch (err) {
      console.error("Error fetching availability:", err);
    } finally {
      setIsFetchingAvailability(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const selectSlot = (slotValue) => {
    if (isSlotOccupied(slotValue)) return;
    setFormData(prev => ({ ...prev, timeSlot: slotValue }));
    if (error) setError("");
  };

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.timeSlot) {
      setError("Please select a time slot.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const [startT, endT] = formData.timeSlot.split('-');
    const startDateTime = `${formData.startDate}T${startT}:00`;
    const endDateTime = `${formData.startDate}T${endT}:00`;
    
    const now = new Date();
    const start = new Date(startDateTime);

    if (start < now) {
      setError("This time slot has already passed.");
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
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);
      
    } catch (err) {
      console.error("Booking error:", err);
      const backendMessage = err.response?.data;
      const msg = typeof backendMessage === 'string' && backendMessage.length > 0
        ? backendMessage
        : err.response?.data?.message || "Conflict: This slot is taken.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const parseBackendDate = (dateVal) => {
    if (!dateVal) return null;
    // If it's an array [YYYY, MM, DD, HH, mm]
    if (Array.isArray(dateVal)) {
      // Month is 0-indexed in JS Date
      return new Date(dateVal[0], dateVal[1] - 1, dateVal[2], dateVal[3], dateVal[4]);
    }
    // Otherwise assume it's a string
    return new Date(dateVal);
  };

  const isSlotOccupied = (slotValue) => {
    if (!formData.startDate || occupiedSlots.length === 0) return false;

    const [slotStart, slotEnd] = slotValue.split('-');
    const slotStartTime = new Date(`${formData.startDate}T${slotStart}:00`).getTime();
    const slotEndTime = new Date(`${formData.startDate}T${slotEnd}:00`).getTime();

    if (isNaN(slotStartTime) || isNaN(slotEndTime)) return false;

    return occupiedSlots.some(b => {
      const bStart = parseBackendDate(b.startTime)?.getTime();
      const bEnd = parseBackendDate(b.endTime)?.getTime();
      
      if (!bStart || !bEnd) return false;

      // Overlap logic: (SlotStart < BookingEnd) AND (SlotEnd > BookingStart)
      return (slotStartTime < bEnd) && (slotEndTime > bStart);
    });
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

          <div className="form-group">
            <label>Select Date</label>
            <input type="date" name="startDate" min={today} value={formData.startDate} onChange={handleChange} required disabled={isLoading} />
          </div>

          <div className="form-group">
            <label>Select Time Slot (1 Hour)</label>
            <div className="time-grid">
              {timeSlots.map((slot, idx) => {
                const occupied = formData.startDate && isSlotOccupied(slot.value);
                const isSelected = formData.timeSlot === slot.value;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`time-slot-btn ${occupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => selectSlot(slot.value)}
                    disabled={occupied || !formData.startDate}
                  >
                    {slot.label}
                    {occupied && <span className="occupied-label">Occupied</span>}
                  </button>
                );
              })}
            </div>
            {isFetchingAvailability && <p className="loading-text">Checking availability...</p>}
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
            <button type="submit" className="submit-btn" disabled={isLoading || !formData.timeSlot}>
              {isLoading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
