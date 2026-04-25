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
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

import './BookingApprovalsPage.css';

const BookingApprovalsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState("PENDING");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeView, setActiveView] = useState("OVERVIEW"); 
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [viewBooking, setViewBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    
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

    const getResourceName = (id) => {
        const res = resources.find(r => r.id === id);
        return res ? res.name : `Resource #${id}`;
    };

    // Processing data for charts
    const chartData = useMemo(() => {
        if (!bookings.length) return { monthly: [], resources: [], peakDays: [] };

        // 1. Monthly Stats
        const monthlyMap = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Initialize last 6 months
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            monthlyMap[months[d.getMonth()]] = 0;
        }

        // 2. Resource Usage
        const resourceMap = {};
        
        // 3. Peak Days
        const dayMap = { "Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0 };
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        bookings.forEach(b => {
            const date = new Date(b.startTime);
            
            // Monthly
            const m = months[date.getMonth()];
            if (monthlyMap[m] !== undefined) monthlyMap[m]++;

            // Resource
            const resName = getResourceName(b.resourceId);
            resourceMap[resName] = (resourceMap[resName] || 0) + 1;

            // Day
            const day = dayNames[date.getDay()];
            dayMap[day]++;
        });

        return {
            monthly: Object.entries(monthlyMap).map(([name, count]) => ({ name, count })),
            resources: Object.entries(resourceMap)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5), // Top 5
            peakDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(name => ({ name, count: dayMap[name] }))
        };
    }, [bookings, resources]);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const stats = useMemo(() => {

        return {
            total: bookings.length,
            pending: bookings.filter(b => b.status === "PENDING").length,
            approved: bookings.filter(b => b.status === "APPROVED").length,
            rejected: bookings.filter(b => b.status === "REJECTED").length
        };
    }, [bookings]);


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
        return bookings.filter(b => {
            const matchesStatus = filterStatus === "ALL" || b.status === filterStatus;
            const resName = getResourceName(b.resourceId).toLowerCase();
            const matchesSearch = 
                b.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resName.includes(searchQuery.toLowerCase()) ||
                b.id.toString().includes(searchQuery) ||
                b.resourceId.toString().includes(searchQuery);
            return matchesStatus && matchesSearch;

        });
    }, [bookings, filterStatus, searchQuery, resources]);

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    }, [currentMonth]);

    const getBookingsForDate = (date) => {
        if (!date) return [];
        return bookings.filter(b => new Date(b.startTime).toDateString() === date.toDateString());
    };

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
                        <button 
                            className={`sidebar-nav-btn ${activeView === 'CALENDAR' ? 'active' : ''}`}
                            onClick={() => setActiveView('CALENDAR')}
                        >
                            <span className="dot" /> Calendar View
                        </button>

                    </div>



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
                        <h1>
                            {activeView === 'OVERVIEW' ? 'Dashboard Overview' : 
                             activeView === 'CALENDAR' ? 'Booking Calendar' : 'Booking Requests'}
                        </h1>
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
                            <div className="chart-card full-width">
                                <div className="chart-header">
                                    <h3>Monthly Booking Volume</h3>
                                    <p>Total bookings recorded over the last 6 months</p>
                                </div>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={chartData.monthly}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                            <Tooltip 
                                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                                            />
                                            <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="charts-flex-row">
                                <div className="chart-card">
                                    <div className="chart-header">
                                        <h3>Most Used Resources</h3>
                                        <p>Top 5 campus facilities by booking count</p>
                                    </div>
                                    <div className="chart-container">
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={chartData.resources}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {chartData.resources.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="pie-legend">
                                            {chartData.resources.map((r, i) => (
                                                <div key={i} className="legend-item">
                                                    <span className="legend-dot" style={{background: COLORS[i % COLORS.length]}}></span>
                                                    <span className="legend-name">{r.name}</span>
                                                    <span className="legend-val">{r.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="chart-card">
                                    <div className="chart-header">
                                        <h3>Peak Usage Days</h3>
                                        <p>Density of bookings across the week</p>
                                    </div>
                                    <div className="chart-container">
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={chartData.peakDays}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                                <YAxis hide />
                                                <Tooltip cursor={{fill: '#f8fafc'}} />
                                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                ) : activeView === 'CALENDAR' ? (
                    <div className="calendar-view-container animate-fade-in">
                        <div className="calendar-wrapper">
                            <div className="calendar-header-nav">
                                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                                    &larr; Prev
                                </button>
                                <h2>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                                    Next &rarr;
                                </button>
                            </div>

                            <div className="calendar-grid">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                                    <div key={d} className="calendar-weekday">{d}</div>
                                ))}
                                {calendarDays.map((date, i) => {
                                    if (!date) return <div key={`empty-${i}`} className="calendar-day empty" />;
                                    
                                    const dayBookings = getBookingsForDate(date);
                                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                                    const isToday = date.toDateString() === new Date().toDateString();

                                    return (
                                        <div 
                                            key={date.toISOString()} 
                                            className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                            onClick={() => setSelectedDate(date)}
                                        >
                                            <span className="day-number">{date.getDate()}</span>
                                            {dayBookings.length > 0 && (
                                                <div className="day-indicators">
                                                    {dayBookings.slice(0, 3).map((b, idx) => (
                                                        <span key={idx} className={`indicator-dot ${b.status.toLowerCase()}`} />
                                                    ))}
                                                    {dayBookings.length > 3 && <span className="more-indicator">+{dayBookings.length - 3}</span>}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="selected-date-details">
                            {selectedDate ? (
                                <>
                                    <div className="details-header">
                                        <h3>Date: {selectedDate.toLocaleDateString()}</h3>
                                    </div>

                                    <div className="details-tabs">
                                        <div className="availability-summary">
                                            <div className="avail-section">
                                                <h4><span className="dot available" /> Available Facilities</h4>
                                                <div className="resource-chips">
                                                    {resources.filter(r => !getBookingsForDate(selectedDate).some(b => b.resourceId === r.id && b.status === "APPROVED")).map(r => (
                                                        <span key={r.id} className="resource-chip available">{r.name}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="avail-section">
                                                <h4><span className="dot unavailable" /> Booked Facilities</h4>
                                                <div className="resource-chips">
                                                    {resources.filter(r => getBookingsForDate(selectedDate).some(b => b.resourceId === r.id && b.status === "APPROVED")).map(r => (
                                                        <span key={r.id} className="resource-chip unavailable">{r.name}</span>
                                                    ))}
                                                    {resources.filter(r => getBookingsForDate(selectedDate).some(b => b.resourceId === r.id && b.status === "APPROVED")).length === 0 && (
                                                        <span className="no-data">None</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bookings-section">
                                            <h4><span className="dot requests" /> Booking Requests ({getBookingsForDate(selectedDate).length})</h4>
                                            <div className="details-list">
                                                {getBookingsForDate(selectedDate).length > 0 ? (
                                                    getBookingsForDate(selectedDate).map(b => (
                                                        <div key={b.id} className="mini-booking-card">
                                                            <div className="mini-card-header">
                                                                <span className={`status-tag ${b.status.toLowerCase()}`}>{b.status}</span>
                                                                <span className="time-tag">{new Date(b.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                            </div>
                                                            <p className="mini-purpose">{b.purpose}</p>
                                                            <p className="mini-resource">{getResourceName(b.resourceId)}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="no-bookings-msg">No booking requests for this date.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="select-date-prompt">
                                    <p>Select a date to view facility availability and requests</p>
                                </div>
                            )}
                        </div>

                    </div>
                ) : (
                    <section className="manage-shell animate-fade-in">
                        <div className="search-filter-wrapper">
                            <div className="status-filter-bar">
                                {["ALL", "PENDING", "APPROVED", "REJECTED"].map(s => (
                                    <button 
                                        key={s} 
                                        className={`filter-tab ${filterStatus === s ? 'active' : ''}`}
                                        onClick={() => setFilterStatus(s)}
                                    >
                                        {s}
                                        <span className="tab-count">
                                            {s === "ALL" ? stats.total : stats[s.toLowerCase()]}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="search-bar-container">
                                <span className="search-icon">🔍</span>
                                <input 
                                    type="text" 
                                    placeholder="Search by purpose, facility number, or ID..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />

                                {searchQuery && (
                                    <button className="clear-search" onClick={() => setSearchQuery("")}>×</button>
                                )}
                            </div>
                        </div>


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

                                        <div className="student-quick-info">
                                            <span className="student-id-primary">Student ID: {booking.idNumber || "No ID"}</span>
                                            <span className="student-name-secondary">{booking.studentName || booking.userId}</span>
                                        </div>




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
                                            <button className="admin-view-btn" onClick={() => { setViewBooking(booking); setShowDetailsModal(true); }}>
                                                View Details
                                            </button>
                                            
                                            {booking.status !== "APPROVED" && (
                                                <button className="admin-approve-btn" onClick={() => handleApprove(booking.id)}>
                                                    Approve
                                                </button>
                                            )}
                                            
                                            {booking.status !== "REJECTED" && (
                                                <button className="admin-reject-btn" onClick={() => openRejectModal(booking.id)}>
                                                    Reject
                                                </button>
                                            )}

                                            <button className="admin-delete-btn" onClick={() => handleDelete(booking.id)}>
                                                Delete
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

            {/* Booking Details Modal */}
            {showDetailsModal && viewBooking && (
                <div className="rejection-modal-overlay">
                    <div className="rejection-modal details-modal">
                        <div className="modal-header-with-badge">
                            <h3>Booking Details</h3>
                            <span className={`manage-card-badge ${viewBooking.status.toLowerCase()}`}>
                                {viewBooking.status}
                            </span>
                        </div>
                        
                        <div className="modal-scroll-content">
                            <div className="detail-item student-main-info">
                                <label>Student / Requester</label>
                                <p className="purpose-text">{viewBooking.studentName || viewBooking.userId}</p>
                                <span className="sub-info">
                                    {viewBooking.idNumber && `ID: ${viewBooking.idNumber}`}
                                    {viewBooking.idNumber && viewBooking.department && " • "}
                                    {viewBooking.department}
                                </span>
                            </div>


                            <div className="detail-item">
                                <label>Booking Purpose</label>
                                <p>{viewBooking.purpose}</p>
                            </div>


                            <div className="detail-grid">
                                <div className="detail-item">
                                    <label>Resource</label>
                                    <p>{getResourceName(viewBooking.resourceId)}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Facility #</label>
                                    <p>#{viewBooking.resourceId}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Attendees</label>
                                    <p>{viewBooking.attendees} persons</p>
                                </div>
                                <div className="detail-item">
                                    <label>Booking ID</label>
                                    <p>#{viewBooking.id}</p>
                                </div>
                            </div>

                            <div className="detail-item">
                                <label>Schedule</label>
                                <div className="time-box">
                                    <div>
                                        <span>Start:</span>
                                        <strong>{formatDate(viewBooking.startTime)}</strong>
                                    </div>
                                    <div>
                                        <span>End:</span>
                                        <strong>{formatDate(viewBooking.endTime)}</strong>
                                    </div>
                                </div>
                            </div>

                            {viewBooking.rejectionReason && (
                                <div className="detail-item rejection-box">
                                    <label>Rejection Reason</label>
                                    <p>{viewBooking.rejectionReason}</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button className="modal-cancel full-width" onClick={() => setShowDetailsModal(false)}>
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default BookingApprovalsPage;
