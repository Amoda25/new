import React from 'react';

const BookingTable = ({ bookings = [], resources = [] }) => {
  
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
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="resource-name">{getResourceName(booking.resourceId)}</td>
                <td>{formatDate(booking.startTime)}</td>
                <td>{formatDate(booking.endTime)}</td>
                <td className="purpose-cell">{booking.purpose}</td>
                <td>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="empty-message">No bookings found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
