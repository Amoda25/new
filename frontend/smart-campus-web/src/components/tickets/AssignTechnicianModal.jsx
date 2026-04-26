
import React, { useState, useEffect } from 'react';
import { getTechnicians, assignTechnician } from '../../services/ticketService';
import './AssignTechnicianModal.css';

const AssignTechnicianModal = ({ ticket, onClose, onAssignSuccess }) => {
    const [technicians, setTechnicians] = useState([]);
    const [selectedTech, setSelectedTech] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTechs = async () => {
            try {
                const data = await getTechnicians();
                setTechnicians(data);
            } catch (err) {
                console.error("Failed to load technicians:", err);
            }
        };
        fetchTechs();
    }, []);

    const handleAssign = async () => {
        if (!selectedTech) {
            setError("Please select a technician");
            return;
        }

        try {
            setLoading(true);
            await assignTechnician(ticket.id, selectedTech);
            onAssignSuccess();
            onClose();
        } catch (err) {
            setError("Failed to assign technician");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in">
                <div className="modal-header-premium">
                    <h3>Assign Technician</h3>
                    <p>Assigning for: {ticket.title}</p>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="select-group">
                        <label>Choose a Technician</label>
                        <select 
                            value={selectedTech} 
                            onChange={(e) => setSelectedTech(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Select Technician...</option>
                            {technicians.map(tech => (
                                <option key={tech.id} value={tech.id}>
                                    {tech.name} ({tech.specialization || 'General'})
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="error-msg">{error}</p>}
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
                    <button className="btn-confirm" onClick={handleAssign} disabled={loading}>
                        {loading ? "Assigning..." : "Confirm Assignment"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignTechnicianModal;
