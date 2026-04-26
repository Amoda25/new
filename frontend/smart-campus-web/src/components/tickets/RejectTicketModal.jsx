import React, { useState } from 'react';
import { rejectAdminTicket } from '../../services/ticketService';
import './RejectTicketModal.css';

const RejectTicketModal = ({ ticket, onClose, onRejectSuccess }) => {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) {
            setError("Please provide a reason for rejection.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");
            await rejectAdminTicket(ticket.id, reason);
            onRejectSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to reject ticket", err);
            setError(err.response?.data || "Failed to reject ticket. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="reject-modal-overlay" onClick={onClose}>
            <div className="reject-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="reject-modal-header">
                    <h3>Reject Ticket</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="reject-modal-body">
                        <div className="ticket-info-mini">
                            <p><strong>Ticket:</strong> {ticket.title}</p>
                            <p><strong>ID:</strong> INC-{ticket.id.slice(-4).toUpperCase()}</p>
                            <p><strong>Student:</strong> {ticket.createdBy}</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="reason">Reason for Rejection</label>
                            <textarea
                                id="reason"
                                placeholder="Explain why this ticket is being rejected..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            />
                            {error && <p className="error-text" style={{color: '#ef4444', fontSize: '0.85rem', marginTop: '4px'}}>{error}</p>}
                        </div>
                    </div>
                    <div className="reject-modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-confirm-reject" disabled={isSubmitting}>
                            {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RejectTicketModal;
