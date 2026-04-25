import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllTicketsForAdmin, deleteAdminTicket } from "../../services/ticketService";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import './AdminTicketsPage.css';

const AdminTicketsPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [activeView, setActiveView] = useState("OVERVIEW"); 
    const navigate = useNavigate();

    const ticketChartData = useMemo(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const counts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
        
        tickets.forEach(ticket => {
            if (ticket.createdAt) {
                const dayName = days[new Date(ticket.createdAt).getDay()];
                counts[dayName]++;
            }
        });

        return days.map(day => ({ day, count: counts[day] }));
    }, [tickets]);

    const fetchAllTickets = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getAllTicketsForAdmin();
            setTickets(data);
        } catch (err) {
            console.error("Failed to load admin tickets", err);
            setError("Failed to load tickets database.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTickets();
    }, []);

    const stats = useMemo(() => {
        return {
            total: tickets.length,
            unassigned: tickets.filter(t => !t.assignedTo).length,
            inProgress: tickets.filter(t => t.status === "IN_PROGRESS").length,
            resolved: tickets.filter(t => t.status === "RESOLVED").length
        };
    }, [tickets]);

    const handleDeleteTicket = async (ticketId) => {
        if (window.confirm("Are you sure you want to permanently delete this ticket record?")) {
            try {
                await deleteAdminTicket(ticketId);
                fetchAllTickets();
            } catch (err) {
                alert("Deletion failed");
            }
        }
    };

    const filteredTickets = useMemo(() => {
        if (filterStatus === "ALL") return tickets;
        return tickets.filter(t => t.status === filterStatus);
    }, [tickets, filterStatus]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="admin-ticket-dashboard">
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <h2>Admin Panel</h2>
                    <p>Ticket Management</p>
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
                            <span className="dot" /> Support Tickets
                        </button>
                    </div>

                    {activeView === 'LIST' && (
                        <div className="nav-group animate-fade-in">
                            <span className="group-label">Filter Status</span>
                            {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map(s => (
                                <button 
                                    key={s} 
                                    className={`sidebar-nav-btn ${filterStatus === s ? 'active' : ''}`}
                                    onClick={() => setFilterStatus(s)}
                                >
                                    <span className="dot" /> {s.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="nav-group">
                        <span className="group-label">Quick Stats</span>
                        <div className="mini-stat">
                            <span className="stat-num orange">{stats.unassigned}</span>
                            <span className="stat-txt">Unassigned</span>
                        </div>
                        <div className="mini-stat">
                            <span className="stat-num">{stats.inProgress}</span>
                            <span className="stat-txt">In Progress</span>
                        </div>
                        <div className="mini-stat">
                            <span className="stat-num green">{stats.resolved}</span>
                            <span className="stat-txt">Resolved</span>
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
                        <h1>{activeView === 'OVERVIEW' ? 'Dashboard Overview' : 'Support Tickets'}</h1>
                    </div>
                </header>

                {activeView === 'OVERVIEW' ? (
                    <div className="overview-container animate-fade-in">
                        <div className="overview-stats-grid">
                            <div className="overview-stat-card">
                                <h3>{stats.unassigned}</h3>
                                <p>Unassigned</p>
                                <div className="stat-progress unassigned-bg" />
                            </div>
                            <div className="overview-stat-card">
                                <h3>{stats.inProgress}</h3>
                                <p>In Progress</p>
                                <div className="stat-progress inprogress-bg" />
                            </div>
                            <div className="overview-stat-card">
                                <h3>{stats.resolved}</h3>
                                <p>Total Resolved</p>
                                <div className="stat-progress resolved-bg" />
                            </div>
                            <div className="overview-stat-card">
                                <h3>{stats.total}</h3>
                                <p>Total History</p>
                                <div className="stat-progress total-bg" />
                            </div>
                        </div>

                        <section className="ticket-chart-section">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>Weekly Ticket Activity</h3>
                                    <p>Number of support tickets received per day</p>
                                </div>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={ticketChartData}>
                                            <defs>
                                                <linearGradient id="ticketGradient" x1="0" y1="0" x2="0" y2="1">
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
                                                fill="url(#ticketGradient)" 
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
                            <div className="manage-message">Loading tickets database...</div>
                        ) : error ? (
                            <div className="manage-message">{error}</div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="manage-message">No tickets found matching "{filterStatus}" status.</div>
                        ) : (
                            <div className="tickets-table-container">
                                <table className="tickets-table">
                                    <thead>
                                        <tr>
                                            <th>Ticket ID</th>
                                            <th>Title</th>
                                            <th>Location</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Technician</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTickets.map(ticket => (
                                            <tr key={ticket.id}>
                                                <td className="bold mono">INC-{ticket.id.slice(-4).toUpperCase()}</td>
                                                <td>
                                                    <div className="title-cell">
                                                        <span className="main-title">{ticket.title}</span>
                                                        <span className="sub-title">{ticket.category || "General"} ● {ticket.createdBy}</span>
                                                    </div>
                                                </td>
                                                <td>{ticket.location || "N/A"}</td>
                                                <td>
                                                    <span className={`prio-badge ${ticket.priority.toLowerCase()}`}>
                                                        {ticket.priority}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-pill ${ticket.status.toLowerCase()}`}>
                                                        {ticket.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className={ticket.assignedTo ? "bold" : "muted"}>
                                                    {ticket.assignedTo || "Not Assigned"}
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="act-view" onClick={() => navigate(`/admin/tickets/${ticket.id}`)}>View</button>
                                                        <button className="act-assign" onClick={() => navigate(`/admin/tickets/${ticket.id}`)}>Assign</button>
                                                        <button className="act-reject" onClick={() => handleDeleteTicket(ticket.id)}>Reject</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default AdminTicketsPage;