import React, { useEffect, useState } from "react";
import {
  getAllTicketsForAdmin,
  getAdminTicketImages,
  updateAdminTicketStatus,
  updateAdminResolution,
  getTicketComments,
  addTicketComment
} from "../../services/ticketService";
import "./TicketDetailsModal.css";

const TicketDetailsModal = ({ ticketId, onClose, onUpdate }) => {
  const [ticket, setTicket] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolutionNote, setResolutionNote] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const data = await getTicketComments(ticketId);
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const fetchTicketDetails = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const tickets = await getAllTicketsForAdmin();
      const selectedTicket = tickets.find((t) => String(t.id) === String(ticketId));

      if (selectedTicket) {
        setTicket(selectedTicket);
        setResolutionNote(selectedTicket.resolutionNotes || "");
        const imageData = await getAdminTicketImages(ticketId);
        setImages(imageData);
      }
    } catch (error) {
      console.error("Failed to load details", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
      fetchComments();
    }
  }, [ticketId]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateAdminTicketStatus(ticketId, newStatus);
      
      // Optimistically update local state for instant feedback
      setTicket(prev => prev ? { ...prev, status: newStatus } : prev);
      
      // Refetch full details silently to ensure consistency
      fetchTicketDetails(true);
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Status update error:", error);
      const msg = error.response?.data || error.message || "Unknown error";
      alert("Failed to update status: " + msg);
    }
  };

  const handleSaveResolution = async () => {
    try {
      await updateAdminResolution(ticketId, resolutionNote);
      alert("Resolution note saved successfully!");
    } catch (error) {
      alert("Failed to save resolution note");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addTicketComment(ticketId, newComment);
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Failed to add comment", error);
      const msg = error.response?.data?.message || error.response?.data || error.message;
      alert("Failed to add comment: " + msg);
    }
  };

  if (!ticketId) return null;

  return (
    <div className="ticket-modal-overlay" onClick={onClose}>
      <div className="ticket-modal-container animate-slide-up" onClick={(e) => e.stopPropagation()}>
        
        {loading ? (
          <div className="modal-loading">Loading ticket details...</div>
        ) : !ticket ? (
          <div className="modal-error">Ticket not found.</div>
        ) : (
          <>
            {/* Header */}
            <header className="modal-header">
              <div className="header-left">
                <span className="modal-tag">TICKET DETAILS</span>
                <h1 className="modal-title">{ticket.title}</h1>
                <p className="modal-subtitle">INC-{ticket.id} • {ticket.location || "N/A"}</p>
              </div>
              <button className="modal-close-btn" onClick={onClose}>Close</button>
            </header>

            <div className="modal-meta-bar">
              <div className="modal-badges">
                <span className={`prio-badge-big ${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
                <span className={`status-pill-big ${ticket.status.toLowerCase()}`}>{ticket.status.replace('_', ' ')}</span>
              </div>
              <div className="modal-id-tag">Ticket ID: INC-{ticket.id}</div>
            </div>

            {/* Scrollable Content */}
            <div className="modal-body-scroll">
              
              <section className="modal-section">
                <h3>Ticket Information</h3>
                <div className="modal-info-card">
                  <div className="modal-info-row">
                    <span className="label">Ticket ID</span>
                    <span className="value bold">INC-{ticket.id}</span>
                  </div>
                  <div className="modal-info-row">
                    <span className="label">Contact Name</span>
                    <span className="value">{ticket.contactName || "N/A"}</span>
                  </div>
                  <div className="modal-info-row">
                    <span className="label">Contact Details</span>
                    <span className="value">{ticket.contactDetails || "N/A"}</span>
                  </div>
                  <div className="modal-info-row">
                    <span className="label">Category</span>
                    <span className="value">{ticket.category || "General Issue"}</span>
                  </div>
                  <div className="modal-info-row">
                    <span className="label">Location</span>
                    <span className="value">{ticket.location || "N/A"}</span>
                  </div>
                  <div className="modal-info-row">
                    <span className="label">Submitted On</span>
                    <span className="value">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "N/A"}</span>
                  </div>
                  <div className="modal-info-row">
                    <span className="label">Assigned Technician</span>
                    <span className="value bold">{ticket.assignedTo || "Not Assigned"}</span>
                  </div>
                </div>
              </section>

              <section className="modal-section">
                <h3>Issue Description</h3>
                <div className="modal-text-card">
                  <p>{ticket.description}</p>
                </div>
              </section>

              <section className="modal-section">
                <h3>Attached Images</h3>
                <div className="modal-images-card">
                  {images.length > 0 ? (
                    <div className="modal-image-strip">
                      {images.map((img, idx) => (
                        <img key={idx} src={img.imageUrl} alt="Attached" className="modal-img" />
                      ))}
                    </div>
                  ) : (
                    <p className="muted">No images attached.</p>
                  )}
                </div>
              </section>

              <section className="modal-section">
                <h3>Workflow Actions</h3>
                <div className="modal-actions-card">
                  <button className="btn-prog" onClick={() => handleStatusUpdate("IN_PROGRESS")}>Mark In Progress</button>
                  <button className="btn-res" onClick={() => handleStatusUpdate("RESOLVED")}>Mark Resolved</button>
                  <button className="btn-close-wf" onClick={() => handleStatusUpdate("CLOSED")}>Close Ticket</button>
                </div>
              </section>

              <section className="modal-section">
                <h3>Resolution Note</h3>
                <div className="modal-res-card">
                  <textarea 
                    placeholder="Add technician resolution note" 
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                  />
                  <button className="btn-save" onClick={handleSaveResolution}>Save Resolution Note</button>
                </div>
              </section>

              <section className="modal-section">
                <h3>Comments & Updates</h3>
                <div className="modal-comments-card">
                  <div className="comments-thread">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className={`comment-bubble ${comment.userRole?.toLowerCase() || 'student'}`}>
                          <div className="comment-header">
                            <span className="comment-user">{comment.userName || "User"}</span>
                            <span className={`comment-role-badge ${comment.userRole?.toLowerCase() || 'student'}`}>
                              {comment.userRole || 'STUDENT'}
                            </span>
                            <span className="comment-time">
                              {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                            </span>
                          </div>
                          <p className="comment-content">{comment.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="no-comments">No comments yet. Start the conversation!</div>
                    )}
                  </div>
                  <div className="comment-input-area">
                    <input 
                      type="text" 
                      placeholder="Type your message..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button className="send-btn" onClick={handleAddComment}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                  </div>
                </div>
              </section>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketDetailsModal;
