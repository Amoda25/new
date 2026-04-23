import React, { useEffect, useState, useMemo } from 'react';
import { 
  adminGetAllBookings, 
  adminApproveBooking, 
  adminRejectBooking, 
  adminDeleteBooking 
} from '../../services/bookingService';
import { getAllResources } from '../../services/resourceService';
import './BookingApprovalsPage.css';

const BookingApprovalsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState("PENDING");
    
    // Rejection Modal State
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const [bookingsData, resourcesData] = await Promise.all([
                adminGetAllBookings(),
                getAllResources()
            ]);
            setBookings(bookingsData);
            setResources(resourcesData);
        } catch (err) {
            console.error("Failed to load admin bookings", err);
            setError("Failed to load bookings database.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const stats = useMemo(() => {
        return {
            total: bookings.length,
            pending: bookings.filter(b => b.status === "PENDING").length,
            approved: bookings.filter(b => b.status === "APPROVED").length,
            rejected: bookings.filter(b => b.status === "REJECTED").length
        };
    }, [bookings]);

    const getResourceName = (id) => {
        const res = resources.find(r => r.id === id);
        return res ? res.name : `Resource #${id}`;
    };

    const handleApprove = async (id) => {
        try {
            await adminApproveBooking(id);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Approval failed");
        }
    };

    const openRejectModal = (id) => {
        setSelectedBookingId(id);
        setRejectionReason("");
        setShowRejectModal(true);
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert("Please provide a rejection reason");
            return;
        }
        try {
            await adminRejectBooking(selectedBookingId, rejectionReason);
            setShowRejectModal(false);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Rejection failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to permanently delete this booking record?")) {
            try {
                await adminDeleteBooking(id);
                loadData();
            } catch (err) {
                alert(err.response?.data?.message || "Deletion failed");
            }
        }
    };

    const filteredBookings = useMemo(() => {
        if (filterStatus === "ALL") return bookings;
        return bookings.filter(b => b.status === filterStatus);
    }, [bookings, filterStatus]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="manage-soft-page">
            <section className="manage-hero-section">
                <div className="manage-hero-content">
                    <div className="manage-hero-text">
                        <h1>Booking Requests</h1>
                        <p>Review and manage resource allocation requests across the campus.</p>
                    </div>

                    <div className="manage-stats-panel">
                        <div className="manage-stat-box">
                            <h2>{stats.pending}</h2>
                            <p>Pending Review</p>
                        </div>
                        <div className="manage-stat-box">
                            <h2>{stats.approved}</h2>
                            <p>Approved</p>
                        </div>
                        <div className="manage-stat-box">
                            <h2>{stats.total}</h2>
                            <p>Total History</p>
                        </div>
                    </div>

                    <div className="status-nav">
                        {["PENDING", "APPROVED", "REJECTED", "ALL"].map(s => (
                            <button 
                                key={s} 
                                className={`nav-btn ${filterStatus === s ? 'active' : ''}`}
                                onClick={() => setFilterStatus(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="manage-shell">
                {loading ? (
                    <div className="manage-message">Loading booking database...</div>
                ) : error ? (
                    <div className="manage-message">{error}</div>
                ) : filteredBookings.length === 0 ? (
                    <div className="manage-message">No bookings found matching "{filterStatus}" status.</div>
                ) : (
                    <div className="manage-resource-grid">
                        {filteredBookings.map(booking => (
                            <div key={booking.id} className="manage-resource-card">
                                <div className="card-header-top">
                                    <div className={`manage-card-badge ${booking.status.toLowerCase()}`}>
                                        {booking.status}
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#6b8db5' }}>#{booking.id}</span>
                                </div>

                                <h3 className="booking-purpose">{booking.purpose}</h3>

                                <div className="info-row">
                                    <span className="info-label">Resource</span>
                                    <span className="info-value"><strong>{getResourceName(booking.resourceId)}</strong></span>
                                </div>

                                <div className="info-row">
                                    <span className="info-label">Reserved Period</span>
                                    <span className="info-value">{formatDate(booking.startTime)} - {formatDate(booking.endTime)}</span>
                                </div>

                                <div className="info-row">
                                    <span className="info-label">Attendees</span>
                                    <span className="info-value">{booking.attendees} persons</span>
                                </div>

                                {booking.rejectionReason && (
                                    <div className="rejection-reason-box">
                                        <span className="info-label">Rejection Reason</span>
                                        <p>{booking.rejectionReason}</p>
                                    </div>
                                )}

                                <div className="manage-card-divider" />

                                <div className="manage-card-actions">
                                    {booking.status === "PENDING" && (
                                        <>
                                            <button className="admin-approve-btn" onClick={() => handleApprove(booking.id)}>
                                                Approve
                                            </button>
                                            <button className="admin-reject-btn" onClick={() => openRejectModal(booking.id)}>
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    <button className="admin-delete-btn" onClick={() => handleDelete(booking.id)}>
                                        Delete Forever
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="rejection-modal-overlay">
                    <div className="rejection-modal">
                        <h3>Reject Booking</h3>
                        <p style={{ fontSize: '0.9rem', color: '#6b8db5', marginBottom: '15px' }}>
                            Please provide a reason why this booking is being rejected. The user will be notified.
                        </p>
                        <textarea 
                            rows="4" 
                            placeholder="Reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button className="modal-cancel" onClick={() => setShowRejectModal(false)}>
                                Cancel
                            </button>
                            <button className="modal-reject-confirm" onClick={handleReject}>
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingApprovalsPage;
