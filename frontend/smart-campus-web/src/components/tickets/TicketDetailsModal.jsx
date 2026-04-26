
import React, { useState, useEffect } from 'react';
import { getAdminTicketImages, getAllTicketsForAdmin } from '../../services/ticketService';
import './TicketDetailsModal.css';

const TicketDetailsModal = ({ ticketId, onClose, onUpdate }) => {
    const [ticket, setTicket] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const allTickets = await getAllTicketsForAdmin();
                const found = allTickets.find(t => String(t.id) === String(ticketId));
                setTicket(found);

                const imageList = await getAdminTicketImages(ticketId);
                setImages(imageList);
            } catch (error) {
                console.error("Failed to fetch ticket details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [ticketId]);

    if (loading) return null;
    if (!ticket) return null;

    return (
        <div className="ticket-modal-overlay">
            <div className="ticket-modal-content animate-fade-in">
                <div className="modal-header">
                    <div className="header-info">
                        <h2>{ticket.title}</h2>
                        <span className="ticket-id">INC-{ticket.id.slice(-4).toUpperCase()}</span>
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="info-section">
                        <div className="info-group">
                            <label>Status</label>
                            <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                                {ticket.status.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="info-group">
                            <label>Priority</label>
                            <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>
                                {ticket.priority}
                            </span>
                        </div>
                        <div className="info-group">
                            <label>Category</label>
                            <span>{ticket.category || "General"}</span>
                        </div>
                        <div className="info-group">
                            <label>Location</label>
                            <span>{ticket.location || "N/A"}</span>
                        </div>
                    </div>

                    <div className="description-section">
                        <label>Description</label>
                        <p>{ticket.description}</p>
                    </div>

                    <div className="user-section">
                        <div className="info-group">
                            <label>Reported By</label>
                            <span>{ticket.createdBy}</span>
                        </div>
                        <div className="info-group">
                            <label>Assigned To</label>
                            <span className={ticket.assignedTo ? "bold" : "muted"}>
                                {ticket.assignedTo || "Not Assigned"}
                            </span>
                        </div>
                    </div>

                    {images.length > 0 && (
                        <div className="images-section">
                            <label>Evidence Images</label>
                            <div className="image-grid">
                                {images.map((img, idx) => (
                                    <img key={idx} src={img.imageUrl} alt="evidence" />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {ticket.rejectionReason && (
                        <div className="rejection-section">
                            <label>Rejection Reason</label>
                            <p className="rejection-text">{ticket.rejectionReason}</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Close Details</button>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailsModal;
