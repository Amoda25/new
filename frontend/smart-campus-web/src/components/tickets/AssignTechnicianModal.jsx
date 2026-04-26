import React, { useEffect, useState } from 'react';
import { getTechnicians, assignTechnician } from '../../services/ticketService';
import './AssignTechnicianModal.css';

const AssignTechnicianModal = ({ ticket, onClose, onAssignSuccess }) => {
    const [technicians, setTechnicians] = useState([]);
    const [selectedTechId, setSelectedTechId] = useState("");
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTechs = async () => {
            try {
                setLoading(true);
                const data = await getTechnicians();
                setTechnicians(data);
            } catch (err) {
                console.error("Failed to fetch technicians", err);
                setError("Failed to load technicians list.");
            } finally {
                setLoading(false);
            }
        };

        fetchTechs();
    }, []);

    const handleConfirmAssignment = async () => {
        if (!selectedTechId) {
            alert("Please select a technician first.");
            return;
        }

        try {
            setAssigning(true);
            await assignTechnician(ticket.id, selectedTechId);
            onAssignSuccess();
            onClose();
        } catch (err) {
            console.error("Assignment failed", err);
            alert("Failed to assign technician: " + (err.response?.data || err.message));
        } finally {
            setAssigning(false);
        }
    };

    if (!ticket) return null;

    return (
        <div className="assign-modal-overlay" onClick={onClose}>
            <div className="assign-modal-container animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <header className="assign-modal-header">
                    <div className="header-info">
                        <span className="modal-label">ASSIGN TECHNICIAN</span>
                        <h2 className="modal-ticket-title">{ticket.title}</h2>
                        <p className="modal-ticket-meta">
                            INC-{ticket.id.slice(-4).toUpperCase()} • {ticket.location || "N/A"}
                        </p>
                    </div>
                    <button className="close-btn" onClick={onClose}>Close</button>
                </header>

                <div className="assign-modal-body">
                    <div className="selection-card">
                        <p className="selection-hint">
                            Select any technician and assign this ticket for: <strong>{ticket.category || "General Issue"}</strong>
                        </p>
                        
                        <label className="select-label">Select Technician</label>
                        <div className="select-wrapper">
                            <select 
                                value={selectedTechId} 
                                onChange={(e) => setSelectedTechId(e.target.value)}
                                disabled={loading || assigning}
                                className={!selectedTechId ? "placeholder" : ""}
                            >
                                <option value="" disabled>Choose a technician</option>
                                {technicians.map(tech => (
                                    <option key={tech.id} value={tech.id}>
                                        {tech.name} — {tech.specialization || "General Maintenance"}
                                    </option>
                                ))}
                            </select>
                            <div className="select-arrow">
                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            </div>
                        </div>
                        
                        {loading && <p className="loading-txt">Loading technicians...</p>}
                        {error && <p className="error-txt">{error}</p>}
                    </div>
                </div>

                <footer className="assign-modal-footer">
                    <button className="btn-cancel" onClick={onClose} disabled={assigning}>Cancel</button>
                    <button 
                        className="btn-confirm" 
                        onClick={handleConfirmAssignment} 
                        disabled={assigning || !selectedTechId}
                    >
                        {assigning ? "Assigning..." : "Confirm Assignment"}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AssignTechnicianModal;
