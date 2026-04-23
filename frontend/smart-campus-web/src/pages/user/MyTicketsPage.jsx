import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserTickets, deleteUserTicket } from "../../services/ticketService";
import "./MyTicketsPage.css";

function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getUserTickets();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setErrorMessage("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/user/tickets/${ticketId}`);
  };

  const handleDeleteTicket = async (ticketId) => {
    const confirmed = window.confirm("Are you sure you want to delete this ticket?");
    if (!confirmed) return;

    try {
      setErrorMessage("");

      await deleteUserTicket(ticketId);

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

  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === "RESOLVED").length;
  const pending = total - resolved;

return (
    <div className="soft-page">

      {/* HERO */}
      <section className="user-hero">
        <div className="hero-content">

          <div className="hero-text">
            <h1>My Tickets</h1>
            <p>Track and manage all your submitted support tickets.</p>
          </div>

          <div className="stats-panel">
            <div className="stat-box">
              <h2>{tickets.length}+</h2>
              <p>Total Tickets</p>
            </div>

            <div className="stat-box">
              <h2>{pending}</h2>
              <p>Pending</p>
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

        <div className="catalogue-header ticket-header">
          <div>
            <h2>Your Tickets</h2>
            <p>View, track and manage your tickets.</p>
          </div>

          <button
            className="create-ticket-btn"
            onClick={() => navigate("/user/tickets/create")}
          >
            + Create Ticket
          </button>
        </div>

        {loading && <div className="catalogue-message">Loading tickets...</div>}

        {errorMessage && (
          <div className="catalogue-message">{errorMessage}</div>
        )}

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

                <div className="ticket-actions">
                  <button onClick={() => handleViewTicket(ticket.id)}>
                    View →
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

export default MyTicketsPage;