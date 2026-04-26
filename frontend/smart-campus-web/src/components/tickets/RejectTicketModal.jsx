
import React, { useState } from 'react';
import api from '../../services/api';
import './RejectTicketModal.css';

const RejectTicketModal = ({ ticket, onClose, onRejectSuccess }) => {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleReject = async () => {
        if (!reason.trim()) {
            setError("Please provide a reason for rejection");
            return;
        }

        try {
            setLoading(true);
            // Using the endpoint established in previous steps
            await api.put(`/api/admin/tickets/${ticket.id}/reject`, { reason });
            onRejectSuccess();
            onClose();
        } catch (err) {
            setError("Failed to reject ticket. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in">
                <div className="reject-header">
                    <h3>Reject Support Ticket</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="ticket-summary-box">
                        <span className="label">Ticket</span>
                        <span className="value">{ticket.title}</span>
                    </div>

                    <div className="input-group">
                        <label>Reason for Rejection *</label>
                        <textarea 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why this ticket is being rejected..."
                            rows="4"
                            disabled={loading}
                        />
                        <p className="help-text">This reason will be visible to the student.</p>
                    </div>

                    {error && <p className="error-msg">{error}</p>}
                </div>

                <div className="modal-footer">
                    <button className="btn-back" onClick={onClose} disabled={loading}>Go Back</button>
                    <button className="btn-reject-confirm" onClick={handleReject} disabled={loading}>
                        {loading ? "Processing..." : "Reject Ticket"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectTicketModal;
