import React from 'react';

const BookingTable = ({ bookings = [], resources = [], onDelete }) => {
  
  const getResourceName = (resourceId) => {
    const resource = resources.find(r => r.id === resourceId);
    return resource ? resource.name : `Resource #${resourceId}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="booking-table-container">
      <table className="booking-table">
        <thead>
          <tr>
            <th>Resource</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Purpose</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings && bookings.length > 0 ? (
            bookings.filter(b => b !== null).map((booking) => (
              <tr key={booking.id || Math.random()}>
                <td className="resource-name">{getResourceName(booking.resourceId)}</td>
                <td>{formatDate(booking.startTime)}</td>
                <td>{formatDate(booking.endTime)}</td>
                <td className="purpose-cell">{booking.purpose || 'No purpose provided'}</td>
                <td>
                  <span className={`status-badge ${(booking.status || 'unknown').toLowerCase()}`}>
                    {booking.status || 'UNKNOWN'}
                  </span>
                </td>
                <td>
                  <button 
                    className="delete-booking-btn" 
                    onClick={() => onDelete(booking.id)}
                    title="Delete Booking"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty-message">No bookings found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
