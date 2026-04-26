import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTechnicianTicketImages,
  getTechnicianTickets,
  updateTechnicianResolution,
  updateTechnicianTicketStatus,
} from "../../services/ticketService";

function TechnicianTicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [images, setImages] = useState([]);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [resolveLoading, setResolveLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [comments, setComments] = useState([]);



  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8081/api/comments/ticket/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
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
      setErrorMessage("");

      const tickets = await getTechnicianTickets();
      const selectedTicket = tickets.find((t) => String(t.id) === String(id));

      if (!selectedTicket) {
        setErrorMessage("Ticket not found.");
        setLoading(false);
        return;
      }

      setTicket(selectedTicket);

      const imageData = await getTechnicianTicketImages(id);
      setImages(imageData);
    } catch (error) {
      console.error("Failed to load technician ticket details:", error);
      setErrorMessage("Failed to load ticket details.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleResolveTicket = async () => {
    if (!resolutionNotes.trim()) {
        setErrorMessage("Resolution notes are required.");
        return;
    }

    try {
        setResolveLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        await updateTechnicianResolution(id, resolutionNotes);
        await updateTechnicianTicketStatus(id, "RESOLVED");

        setSuccessMessage("Ticket resolved successfully.");

        const updatedTickets = await getTechnicianTickets();
        const updatedTicket = updatedTickets.find((t) => String(t.id) === String(id));
        setTicket(updatedTicket);
    } catch (error) {
        console.error("Failed to resolve ticket:", error);
        console.error("Backend response:", error.response);

        if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
        } else if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
        } else {
        setErrorMessage("Failed to resolve ticket.");
        }
    } finally {
        setResolveLoading(false);
    }
    };



  if (loading) {
    return (
      <div style={styles.page}>
        <p style={styles.info}>Loading ticket details...</p>
      </div>
    );
  }

  if (errorMessage && !ticket) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={styles.error}>{errorMessage}</p>
          <button style={styles.backButton} onClick={() => navigate("/technician/tickets")}>
            Back to Assigned Tickets
          </button>
        </div>
      </div>
    );
  }



  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => navigate("/technician/tickets")}>
          ← Back to Assigned Tickets
        </button>

        <div style={styles.card}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>{ticket.title}</h1>
              <p style={styles.subtitle}>Ticket ID: {ticket.id}</p>
            </div>

            <span style={getStatusStyle(ticket.status)}>
              {ticket.status}
            </span>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={styles.text}>{ticket.description}</p>
          </div>

          <div style={styles.metaGrid}>
            <div style={styles.metaBox}>
              <span style={styles.metaLabel}>Priority</span>
              <span style={styles.metaValue}>{ticket.priority}</span>
            </div>

            <div style={styles.metaBox}>
              <span style={styles.metaLabel}>Status</span>
              <span style={styles.metaValue}>{ticket.status}</span>
            </div>

            <div style={styles.metaBox}>
              <span style={styles.metaLabel}>Created By</span>
              <span style={styles.metaValue}>{ticket.createdBy}</span>
            </div>

            <div style={styles.metaBox}>
              <span style={styles.metaLabel}>Assigned To</span>
              <span style={styles.metaValue}>
                {ticket.assignedTo ? ticket.assignedTo : "Not assigned"}
              </span>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Uploaded Images</h3>

            {images.length === 0 ? (
              <p style={styles.noImages}>No images uploaded for this ticket.</p>
            ) : (
              <div style={styles.imageGrid}>
                {images.map((image) => (
                  <div key={image.id} style={styles.imageCard}>
                    <img
                      src={image.imageUrl}
                      alt={image.fileName}
                      style={styles.image}
                    />
                    <div style={styles.imageInfo}>
                      <p style={styles.imageName}>{image.fileName}</p>
                      <p style={styles.imageMeta}>Size: {image.fileSize} bytes</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Additional Comments</h3>

              {comments.length === 0 ? (
                <p style={styles.noImages}>No comments yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      style={{
                        padding: "12px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        background: "#f9fafb"
                      }}
                    >
                      <p style={{ margin: 0 }}>{comment.message}</p>

                      <span style={{ fontSize: "12px", color: "#6b7280" }}>
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : "Just now"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Resolve Ticket</h3>

            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Enter resolution notes"
              rows="5"
              style={styles.textarea}
              disabled={ticket.status === "RESOLVED"}
            />

            {errorMessage && <p style={styles.error}>{errorMessage}</p>}
            {successMessage && <p style={styles.success}>{successMessage}</p>}

            <button
              style={styles.resolveButton}
              onClick={handleResolveTicket}
              disabled={resolveLoading || ticket.status === "RESOLVED"}
            >
              {ticket.status === "RESOLVED"
                ? "Already Resolved"
                : resolveLoading
                ? "Resolving..."
                : "Resolve Ticket"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const getStatusStyle = (status) => {
  return {
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
    backgroundColor:
      status === "RESOLVED"
        ? "#dcfce7"
        : status === "PENDING"
        ? "#fef3c7"
        : "#dbeafe",
    color:
      status === "RESOLVED"
        ? "#166534"
        : status === "PENDING"
        ? "#92400e"
        : "#1d4ed8",
    height: "fit-content",
  };
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#282828",
    padding: "40px 20px",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  backButton: {
    marginBottom: "20px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    background: "#374151",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },
  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  title: {
    margin: "0 0 6px 0",
    fontSize: "30px",
    color: "#111827",
  },
  subtitle: {
    margin: 0,
    color: "#6b7280",
  },
  section: {
    marginBottom: "24px",
  },
  sectionTitle: {
    margin: "0 0 12px 0",
    fontSize: "20px",
    color: "#111827",
  },
  text: {
    margin: 0,
    color: "#374151",
    lineHeight: "1.6",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },
  metaBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  metaLabel: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "600",
  },
  metaValue: {
    fontSize: "16px",
    color: "#111827",
    fontWeight: "700",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  imageCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#ffffff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    display: "block",
    background: "#f3f4f6",
  },
  imageInfo: {
    padding: "14px",
  },
  imageName: {
    margin: "0 0 6px 0",
    fontWeight: "600",
    color: "#111827",
    wordBreak: "break-word",
  },
  imageMeta: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
  },
  noImages: {
    margin: 0,
    color: "#6b7280",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    background: "#e5e5e5",
    resize: "vertical",
    marginBottom: "14px",
    boxSizing: "border-box",
  },
  resolveButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "12px",
    background: "#0051ff",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },
  info: {
    color: "#ffffff",
    fontSize: "16px",
  },
  error: {
    color: "#dc2626",
    fontSize: "14px",
    marginTop: "12px",
  },
  success: {
    color: "#16a34a",
    fontSize: "14px",
    marginTop: "12px",
  },
};

export default TechnicianTicketDetailsPage;