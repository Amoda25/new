import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTicketsForAdmin, deleteAdminTicket} from "../../services/ticketService";
import "./AdminTicketsPage.css";

function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAllTicketsForAdmin();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch admin tickets:", error);
      setErrorMessage("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    const confirmed = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmed) return;

    try {
      setErrorMessage("");

      await deleteAdminTicket(ticketId);

      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.id !== ticketId)
      );
    } catch (error) {
      console.error("Failed to delete ticket:", error);
      console.error("Backend response:", error.response);

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
    navigate(`/admin/tickets/${ticketId}`);
  };

  return (
      <div className="soft-page">

        {/* HERO */}
        <section className="admin-hero">
          <div className="hero-content">

            <div className="hero-text">
              <h1>Admin Tickets</h1>
              <p>Manage and assign all support tickets.</p>
            </div>

            <div className="stats-panel">
              <div className="stat-box">
                <h2>{tickets.length}+</h2>
                <p>Total Tickets</p>
              </div>

              <div className="stat-box">
                <h2>{tickets.filter(t => !t.assignedTo).length}</h2>
                <p>Unassigned Tickets</p>
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
            <h2>All Tickets</h2>
            <p>View, assign and manage tickets.</p>
          </div>

          {loading && <div className="catalogue-message">Loading tickets...</div>}
          {errorMessage && <div className="catalogue-message">{errorMessage}</div>}

          {!loading && !errorMessage && tickets.length === 0 && (
            <div className="catalogue-message">
              No tickets found.
            </div>
          )}

          {!loading && !errorMessage && tickets.length > 0 && (
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

                  {/* ADMIN INFO */}
                  <div className="ticket-meta">
                    <span><strong>User:</strong> {ticket.createdBy}</span>
                    <span><strong>Assigned:</strong> {ticket.assignedTo || "None"}</span>
                  </div>

                  <div className="ticket-actions">
                    <button onClick={() => handleViewTicket(ticket.id)}>
                      Assign Technician →
                    </button>

                    <button
                      className="delete"
                      onClick={() => handleDeleteTicket(ticket.id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}

            </div>
          )}
        </section>
      </div>
    );
}


export default AdminTicketsPage;