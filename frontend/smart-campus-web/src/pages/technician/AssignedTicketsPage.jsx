import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTechnicianTickets,deleteTechnicianTicket} from "../../services/ticketService";
import "./AssignedTicketsPage.css";

function AssignedTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTechnicianTickets();
  }, []);

  const fetchTechnicianTickets = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getTechnicianTickets();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch technician tickets:", error);
      setErrorMessage("Failed to load assigned tickets.");
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteTicket = async (ticketId) => {
    const confirmed = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmed) return;

    try {
      setErrorMessage("");

      await deleteTechnicianTicket(ticketId);

      // remove from UI
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Failed to delete ticket.");
      }
    }
  };


  const handleViewTicket = (ticketId) => {
    navigate(`/technician/tickets/${ticketId}`);
  };

  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === "RESOLVED").length;
  const yetToResolve = total - resolved;

  return (
      <div className="soft-page">

        {/* HERO */}
        <section className="tech-hero">
          <div className="hero-content">

            <div className="hero-text">
              <h1>Assigned Tickets</h1>
              <p>Manage and resolve your assigned tickets.</p>
            </div>

            <div className="stats-panel">
              <div className="stat-box">
                <h2>{tickets.length}</h2>
                <p>Total Assigned</p>
              </div>

              <div className="stat-box">
                <h2>{yetToResolve}</h2>
                <p>Action Required</p>
              </div>

              <div className="stat-box">
                <h2>{tickets.filter(t => t.status === "RESOLVED").length}</h2>
                <p>Resolved</p>
              </div>
            </div>

          </div>
        </section>

        {/* CONTENT */}
        <section className="catalogue-shell">

          <div className="catalogue-header">
            <h2>Your Assigned Tickets</h2>
            <p>View and manage your assigned tickets.</p>
          </div>

          {loading && <div className="catalogue-message">Loading...</div>}
          {errorMessage && <div className="catalogue-message">{errorMessage}</div>}

          {!loading && tickets.length === 0 && (
            <div className="catalogue-message">
              No assigned tickets.
            </div>
          )}

          {!loading && tickets.length > 0 && (
            <div className="catalogue-grid">

              {tickets.map((ticket) => (
                <div key={ticket.id} className="ticket-card">

                  <div className="ticket-top">
                    <h3>{ticket.title}</h3>
                    <span className={`status ${ticket.status.toLowerCase()}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <p className="ticket-desc">{ticket.description}</p>

                  <div className="ticket-meta">
                    <span><strong>Priority:</strong> {ticket.priority}</span>
                    <span><strong>ID:</strong> {ticket.id}</span>
                  </div>

                  <div className="ticket-meta">
                    <span><strong>Created By:</strong> {ticket.createdBy}</span>
                  </div>

                  <div className="ticket-actions">
                    <button onClick={() => handleViewTicket(ticket.id)}>
                      View →
                    </button>

                    {ticket.status === "RESOLVED" && (
                      <button
                        className="delete"
                        onClick={() => handleDeleteTicket(ticket.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>
      </div>
    );
}

export default AssignedTicketsPage;
