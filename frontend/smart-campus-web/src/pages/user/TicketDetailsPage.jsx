import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketImages, getUserTickets } from "../../services/ticketService";
import "./TicketDetailsPage.css";
import ticketBg from "../../assets/ticketimage.png";

function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/comments/ticket/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    fetchComments();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const tickets = await getUserTickets();
      const selectedTicket = tickets.find((t) => String(t.id) === String(id));

      if (!selectedTicket) {
        setErrorMessage("Ticket not found.");
        return;
      }

      setTicket(selectedTicket);
      const imageData = await getTicketImages(id);
      setImages(imageData);
    } catch (error) {
      setErrorMessage("Failed to load ticket details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`http://localhost:8081/api/comments/ticket/${ticket.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ message: commentText })
      });

      if (res.ok) {
        setCommentText("");
        fetchComments();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;

    try {
      await fetch(`http://localhost:8081/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      // remove from UI instantly
      setComments((prev) => prev.filter(c => c.id !== commentId));

    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (errorMessage || !ticket) return <div className="error-container"><p>{errorMessage || "Ticket not found"}</p></div>;

  return (
    <div className="ticket-details-premium">
      {/* HERO SECTION */}
      <div className="td-hero">
        <div className="td-hero-overlay" />
        
        <div className="td-hero-nav">
          <button className="back-pill-btn" onClick={() => navigate("/user/tickets")}>
            ← Back to Tickets
          </button>
          <div className="support-badge">SUPPORT TICKET</div>
        </div>

        <div className="td-hero-content">
          <span className="td-category-tag">TICKET</span>
          <h1 className="td-main-title">{ticket.title}</h1>
          <div className="td-id-line">
            Ticket ID: #{ticket.id}
          </div>
        </div>

        <div className={`td-floating-status ${ticket.status.toLowerCase()}`}>
          <span className="status-dot"></span>
          {ticket.status}
        </div>
      </div>

      <div className="td-container">
        {/* TOP SUMMARY BAR */}
        <div className="td-summary-bar">
          <div className="summary-item">
            <span className="summary-label">PRIORITY</span>
            <span className="summary-value bold">{ticket.priority}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-item">
            <span className="summary-label">STATUS</span>
            <span className="summary-value bold">{ticket.status}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-item">
            <span className="summary-label">TICKET ID</span>
            <span className="summary-value mono">#{ticket.id}</span>
          </div>
        </div>

        <div className="td-grid">
          {/* MAIN CONTENT AREA */}
          <div className="td-main-column">
            {/* DESCRIPTION */}
            <div className="td-card">
              <h2 className="td-card-title">DESCRIPTION</h2>
              <p className="td-description-text">{ticket.description}</p>
            </div>

            {/* IMAGES */}
            <div className="td-card">
              <h2 className="td-card-title">UPLOADED IMAGES</h2>
              {images.length > 0 ? (
                <div className="td-image-grid">
                  {images.map((img, idx) => (
                    <div key={idx} className="td-image-wrapper">
                      <img src={img.imageUrl} alt={`Evidence ${idx + 1}`} />
                      <span className="image-caption">Evidence image {idx + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No images uploaded for this ticket.</p>
              )}
            </div>

            {/* COMMENTS SECTION */}
            <div className="td-card">
              <h2 className="td-card-title">COMMENTS</h2>
              
              <div className="comment-input-area">
                <textarea 
                  placeholder="Write a comment..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button className="add-comment-btn" onClick={handleAddComment}>
                  + Add Comment
                </button>
              </div>

              <div className="comments-stack">
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <div key={c.id} className="comment-bubble">
                      <div className="comment-header">
                        <span className="comment-user">{c.userName || "Admin User"}</span>
                        {c.userRole && <span className={`role-badge ${c.userRole.toLowerCase()}`}>{c.userRole}</span>}
                        <span className="comment-time">
                          {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                        </span>
                      </div>
                      <p className="comment-message">{c.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No comments yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="td-sidebar">
            <div className="td-card sidebar-card">
              <table className="info-table">
                <tbody>
                  <tr>
                    <td>Ticket ID</td>
                    <td className="bold mono">#{ticket.id}</td>
                  </tr>
                  <tr>
                    <td>Priority</td>
                    <td className="bold">{ticket.priority}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td className="bold">{ticket.status}</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td className="bold">{ticket.category || "General"}</td>
                  </tr>
                  <tr>
                    <td>Location</td>
                    <td className="bold">{ticket.location || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Technician</td>
                    <td className="bold">{ticket.assignedTo || "Not assigned yet"}</td>
                  </tr>
                  <tr>
                    <td>Contact Person</td>
                    <td className="bold">{ticket.contactName || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Contact</td>
                    <td className="bold">{ticket.contactDetails || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="td-sidebar-actions">
              <button className="action-btn green" onClick={() => document.querySelector('.comment-input-area textarea').focus()}>
                + Add Additional Comments
              </button>
              <button className="action-btn blue" onClick={() => navigate("/user/tickets")}>
                ← Back to Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailsPage;
