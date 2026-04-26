import React, { useState, useEffect } from 'react';
import BookingForm from '../../components/bookings/BookingForm';
import BookingTable from '../../components/bookings/BookingTable';
import { getUserBookings } from '../../services/bookingService';
import { getAllResources } from '../../services/resourceService';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            
            // Fetch bookings and resources in parallel
            const [bookingsData, resourcesData] = await Promise.all([
                getUserBookings(),
                getAllResources()
            ]);
            
            setBookings(bookingsData || []);
            setResources(resourcesData || []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            setErrorMessage(error.response?.data?.message || "Failed to load dashboard data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleForm = () => setShowForm(!showForm);

    const stats = {
        total: (bookings || []).length,
        upcoming: (bookings || []).filter(b => b && (b.status === 'CONFIRMED' || b.status === 'PENDING' || b.status === 'APPROVED')).length,
        pending: (bookings || []).filter(b => b && b.status === 'PENDING').length
    };

    return (
        <div className="soft-page">
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>My Bookings</h1>
                        <p>Track and manage your campus resource reservations in one place.</p>
                    </div>

                    <div className="stats-panel">
                        <div className="stat-box">
                            <h2>{stats.total}+</h2>
                            <p>Total Bookings</p>
                        </div>
                        <div className="stat-box">
                            <h2>{stats.upcoming}</h2>
                            <p>Active</p>
                        </div>
                        <div className="stat-box">
                            <h2>{stats.pending}</h2>
                            <p>Pending</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="catalogue-shell">
                <div className="catalogue-header booking-header">
                    <div>
                        <h2>Booking History</h2>
                        <p>View and manage your previous resource bookings.</p>
                    </div>

                    <button className="create-ticket-btn" onClick={toggleForm}>
                        + New Booking
                    </button>
                </div>

                {errorMessage && (
                    <div className="local-error-message">
                        <span>⚠️ {errorMessage}</span>
                        <button onClick={fetchInitialData}>Retry</button>
                    </div>
                )}

                {showForm && (
                    <BookingForm 
                        onClose={toggleForm} 
                        resources={resources}
                        onSuccess={() => {
                            fetchInitialData();
                        }}
                    />
                )}

                <div className="booking-content">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loader"></div>
                            <p>Loading your bookings...</p>
                        </div>
                    ) : (
                        <BookingTable bookings={bookings} resources={resources} />
                    )}
                </div>
            </section>
        </div>
    );
};

export default MyBookingsPage;
