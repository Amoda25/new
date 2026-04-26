import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllTicketsForAdmin,
  getAdminTicketImages,
  assignTechnician,
  getTechnicians,
  updateTechnicianTicketStatus,
  updateTechnicianResolution
} from "../../services/ticketService";

import "./AdminTicketDetailsPage.css"; 

function AdminTicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [images, setImages] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/comments/ticket/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const tickets = await getAllTicketsForAdmin();
      const selectedTicket = tickets.find((t) => String(t.id) === String(id));

      if (!selectedTicket) {
        setErrorMessage("Ticket not found.");
        return;
      }

      setTicket(selectedTicket);
      setResolutionNote(selectedTicket.resolutionNotes || "");

      const imageData = await getAdminTicketImages(id);
      setImages(imageData);
      
      const techData = await getTechnicians();
      setTechnicians(techData);
    } catch (error) {
      setErrorMessage("Failed to load ticket details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    fetchComments();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateTechnicianTicketStatus(id, newStatus);
      fetchTicketDetails();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleSaveResolution = async () => {
    try {
      await updateTechnicianResolution(id, resolutionNote);
      alert("Resolution note saved successfully!");
    } catch (error) {
      alert("Failed to save resolution note");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`http://localhost:8081/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          ticketId: id,
          content: newComment
        })
      });
      if (res.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  if (loading) return <div className="admin-detail-shell loading">Loading ticket database...</div>;
  if (!ticket) return <div className="admin-detail-shell error">{errorMessage || "Ticket not found"}</div>;

  return (
    <div className="admin-detail-page">
      <div className="admin-detail-container animate-fade-in">
        
        {/* Header */}
        <header className="detail-header">
          <div className="header-left">
            <span className="tag-line">TICKET DETAILS</span>
            <h1 className="ticket-title-main">{ticket.title}</h1>
            <p className="ticket-subtitle-main">INC-{ticket.id} • {ticket.location || "N/A"}</p>
          </div>
          <button className="close-btn-top" onClick={() => navigate("/admin/tickets")}>Close</button>
        </header>

        <div className="detail-meta-bar">
          <div className="meta-badges">
            <span className={`prio-badge-big ${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
            <span className={`status-pill-big ${ticket.status.toLowerCase()}`}>{ticket.status.replace('_', ' ')}</span>
          </div>
          <div className="meta-id-tag">Ticket ID: INC-{ticket.id}</div>
        </div>

        {/* Content Body */}
        <div className="detail-content-body">
          
          {/* Ticket Information */}
          <section className="detail-section">
            <h3>Ticket Information</h3>
            <div className="info-table-card">
              <div className="info-row-item">
                <span className="info-row-label">Student</span>
                <span className="info-row-value bold">{ticket.createdBy}</span>
              </div>
              <div className="info-row-item">
                <span className="info-row-label">Contact</span>
                <span className="info-row-value">{ticket.contactNumber || "N/A"}</span>
              </div>
              <div className="info-row-item">
                <span className="info-row-label">Preferred Time</span>
                <span className="info-row-value">{ticket.preferredTime || "N/A"}</span>
              </div>
              <div className="info-row-item">
                <span className="info-row-label">Category</span>
                <span className="info-row-value">{ticket.category || "General Issue"}</span>
              </div>
              <div className="info-row-item">
                <span className="info-row-label">Location</span>
                <span className="info-row-value">{ticket.location || "N/A"}</span>
              </div>
              <div className="info-row-item">
                <span className="info-row-label">Submitted</span>
                <span className="info-row-value">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "N/A"}</span>
              </div>
              <div className="info-row-item">
                <span className="info-row-label">Technician</span>
                <span className="info-row-value bold">{ticket.assignedTo || "Not Assigned"}</span>
              </div>
            </div>
          </section>

          {/* Issue Description */}
          <section className="detail-section">
            <h3>Issue Description</h3>
            <div className="description-box-card">
              <p>{ticket.description}</p>
            </div>
          </section>

          {/* Attached Images */}
          <section className="detail-section">
            <h3>Attached Images</h3>
            <div className="images-scroll-card">
              {images.length > 0 ? (
                <div className="image-strip">
                  {images.map((img, idx) => (
                    <img key={idx} src={img.imageUrl} alt="Attached" className="attached-img" />
                  ))}
                </div>
              ) : (
                <p className="muted-text">No images attached to this ticket.</p>
              )}
            </div>
          </section>

          {/* Workflow Actions */}
          <section className="detail-section">
            <h3>Workflow Actions</h3>
            <div className="actions-button-card">
              <button className="btn-wf-progress" onClick={() => handleStatusUpdate("IN_PROGRESS")}>Mark In Progress</button>
              <button className="btn-wf-resolved" onClick={() => handleStatusUpdate("RESOLVED")}>Mark Resolved</button>
              <button className="btn-wf-close" onClick={() => navigate("/admin/tickets")}>Close Ticket</button>
            </div>
          </section>

          {/* Resolution Note */}
          <section className="detail-section">
            <h3>Resolution Note</h3>
            <div className="resolution-card">
              <textarea 
                placeholder="Add technician resolution note" 
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
              />
              <button className="btn-save-res" onClick={handleSaveResolution}>Save Resolution Note</button>
            </div>
          </section>

          {/* Comments & Updates */}
          <section className="detail-section">
            <h3>Comments & Updates</h3>
            <div className="comments-thread-card">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-bubble-item">
                  <span className={`role-badge ${comment.userRole?.toLowerCase() || 'student'}`}>
                    {comment.userRole || 'STUDENT'}
                  </span>
                  <p className="comment-text-p">{comment.content}</p>
                </div>
              ))}
              <div className="comment-input-area">
                <input 
                  type="text" 
                  placeholder="Add a admin comment or update" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button className="btn-add-comment" onClick={handleAddComment}>Add Comment</button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default AdminTicketDetailsPage;
