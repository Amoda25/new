import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  adminGetAllBookings, 
  adminApproveBooking, 
  adminRejectBooking, 
  adminDeleteBooking 
} from '../../services/bookingService';
import { getAllResources } from '../../services/resourceService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import './BookingApprovalsPage.css';

const BookingApprovalsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState("PENDING");
    const [activeView, setActiveView] = useState("OVERVIEW"); 
    
    // Rejection Modal State
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);

    // Sample data for the chart
    const bookingChartData = [
        { day: "Mon", count: 4 },
        { day: "Tue", count: 7 },
        { day: "Wed", count: 5 },
        { day: "Thu", count: 9 },
        { day: "Fri", count: 12 },
        { day: "Sat", count: 6 },
        { day: "Sun", count: 3 },
    ];

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
        <div className="admin-booking-dashboard">
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <h2>Admin Panel</h2>
                    <p>Booking Management</p>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-group">
                        <span className="group-label">Navigation</span>
                        <button 
                            className={`sidebar-nav-btn ${activeView === 'OVERVIEW' ? 'active' : ''}`}
                            onClick={() => setActiveView('OVERVIEW')}
                        >
                            <span className="dot" /> Dashboard Overview
                        </button>
                        <button 
                            className={`sidebar-nav-btn ${activeView === 'LIST' ? 'active' : ''}`}
                            onClick={() => setActiveView('LIST')}
                        >
                            <span className="dot" /> Booking Requests
                        </button>
                    </div>

                    {activeView === 'LIST' && (
                        <div className="nav-group animate-fade-in">
                            <span className="group-label">Filter Status</span>
                            {["ALL", "PENDING", "APPROVED", "REJECTED"].map(s => (
                                <button 
                                    key={s} 
                                    className={`sidebar-nav-btn ${filterStatus === s ? 'active' : ''}`}
                                    onClick={() => setFilterStatus(s)}
                                >
                                    <span className="dot" /> {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="nav-group">
                        <span className="group-label">Quick Stats</span>
                        <div className="mini-stat">
                            <span className="stat-num">{stats.pending}</span>
                            <span className="stat-txt">Pending</span>
                        </div>
                        <div className="mini-stat">
                            <span className="stat-num">{stats.approved}</span>
                            <span className="stat-txt">Approved</span>
                        </div>
                        <div className="mini-stat">
                            <span className="stat-num">{stats.rejected}</span>
                            <span className="stat-txt">Rejected</span>
                        </div>
                    </div>

                    <div className="sidebar-footer">
                        <Link to="/admin" className="back-link">← Back to Dashboard</Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main-content">
                <header className="content-header">
                    <div className="header-text">
                        <h1>{activeView === 'OVERVIEW' ? 'Dashboard Overview' : 'Booking Requests'}</h1>
                        <p>{activeView === 'OVERVIEW' ? 'Performance metrics and booking trends.' : 'Manage and review campus resource allocations.'}</p>
                    </div>
                </header>

                {activeView === 'OVERVIEW' ? (
                    <div className="overview-container animate-fade-in">
                        <div className="overview-stats-grid">
                            <div className="overview-stat-card">
                                <h3>{stats.pending}</h3>
                                <p>Requests Pending</p>
                                <div className="stat-progress pending-bg" />
                            </div>
                            <div className="overview-stat-card">
                                <h3>{stats.approved}</h3>
                                <p>Total Approved</p>
                                <div className="stat-progress approved-bg" />
                            </div>
                            <div className="overview-stat-card">
                                <h3>{stats.rejected}</h3>
                                <p>Requests Rejected</p>
                                <div className="stat-progress rejected-bg" />
                            </div>
                            <div className="overview-stat-card">
                                <h3>{stats.total}</h3>
                                <p>Total History</p>
                                <div className="stat-progress total-bg" />
                            </div>
                        </div>

                        <section className="booking-chart-section">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>Weekly Activity Analysis</h3>
                                    <p>Number of resource bookings processed per day</p>
                                </div>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={bookingChartData}>
                                            <defs>
                                                <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={1}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis 
                                                dataKey="day" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#6b8db5', fontSize: 12 }} 
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#6b8db5', fontSize: 12 }} 
                                            />
                                            <Tooltip 
                                                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                                contentStyle={{ 
                                                    borderRadius: '12px', 
                                                    border: 'none', 
                                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                                                }}
                                            />
                                            <Bar 
                                                dataKey="count" 
                                                fill="url(#bookingGradient)" 
                                                radius={[6, 6, 0, 0]} 
                                                barSize={45}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <section className="manage-shell animate-fade-in">
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
                )}
            </main>

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
