import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllTicketsForAdmin,
  getAdminTicketImages,
  assignTechnician,
  getTechnicians,
} from "../../services/ticketService";

import "./AdminTicketDetailsPage.css"; 

function AdminTicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [images, setImages] = useState([]);
  const [technicianId, setTechnicianId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    fetchTicketDetails();
    fetchTechnicians();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const tickets = await getAllTicketsForAdmin();
      const selectedTicket = tickets.find((t) => String(t.id) === String(id));

      if (!selectedTicket) {
        setErrorMessage("Ticket not found.");
        setLoading(false);
        return;
      }

      setTicket(selectedTicket);

      const imageData = await getAdminTicketImages(id);
      setImages(imageData);
    } catch (error) {
      console.error("Failed to load admin ticket details:", error);
      setErrorMessage("Failed to load ticket details.");
    } finally {
      setLoading(false);
    }
  };
    const fetchTechnicians = async () => {
    try {
      const data = await getTechnicians();
      console.log("Technicians:", data);
      setTechnicians(data);
    } catch (error) {
      console.error("Failed to fetch technicians:", error);
    }
  };

  const handleAssignTechnician = async () => {
    if (!technicianId) {
      setErrorMessage("Please select a technician.");
      return;
    }

    try {
      setAssignLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await assignTechnician(id, Number(technicianId));

      setSuccessMessage("Technician assigned successfully.");

      const updatedTickets = await getAllTicketsForAdmin();
      const updatedTicket = updatedTickets.find((t) => String(t.id) === String(id));
      setTicket(updatedTicket);
    } catch (error) {
      console.error("Failed to assign technician:", error);
      setErrorMessage("Failed to assign technician.");
    } finally {
      setAssignLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rd-page">
        <p className="info">Loading ticket details...</p>
      </div>
    );
  }

  if (errorMessage && !ticket) {
    return (
      <div className="rd-page">
        <div className="details-wrapper">
          <p className="error">{errorMessage}</p>
          <button
            className="back-btn"
            onClick={() => navigate("/admin/tickets")}
          >
            ← Back to All Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
      <div className="rd-page">

        {/* HERO */}
        <section className="mini-hero">
          <div className="mini-hero-content">

            

            <h1>{ticket.title}</h1>
            <p>Ticket ID: #{ticket.id}</p>

            <span className={`status ${ticket.status.toLowerCase()}`}>
              {ticket.status}
            </span>

          </div>
        </section>

        {/* FLOATING INFO BAR */}
        <div className="ticket-summary-bar">
          <div>
            <p>Priority</p>
            <strong>{ticket.priority}</strong>
          </div>

          <div>
            <p>Status</p>
            <strong>{ticket.status}</strong>
          </div>

          <div>
            <p>Ticket ID</p>
            <strong>#{ticket.id}</strong>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="details-wrapper">

          {/* LEFT SIDE */}
          <div className="details-left">
            
            <div className="details-card">
              <p><strong>Created By User:</strong> {ticket.createdBy}</p>
              <h3>Description</h3>
              <p>{ticket.description}</p>
            </div>

            

            {/* IMAGES */}
            <div className="details-card">
              <h3>Uploaded Images</h3>

              {images.length === 0 ? (
                <p>No images uploaded.</p>
              ) : (
                <div className="image-grid">
                  {images.map((image) => (
                    <img
                      key={image.id}
                      src={image.imageUrl}
                      alt={image.fileName}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="details-right">

            

            {/* ASSIGN SECTION */}
            <div className="details-card">
              <h3 className="assign-Text">Assign a Technician</h3>

              <div className="assign-row">
                <select
                  value={technicianId}
                  onChange={(e) => setTechnicianId(e.target.value)}
                >
                  <option value="">Select Technician</option>
                  
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name}
                      </option>
                    ))}
                </select>

                <button
                  className="assign-btn"
                  onClick={handleAssignTechnician}
                  disabled={assignLoading}
                >
                  {assignLoading ? "Assigning..." : "Assign "}
                </button>
              </div>
              

              {errorMessage && <p className="error">{errorMessage}</p>}
              {successMessage && <p className="success">{successMessage}</p>}
            </div>
            <div className="back button section-card">
            <button
              className="back-btn-secondary"
              onClick={() => navigate("/admin/tickets")}
            >
              ← Back to All Tickets
            </button>
          </div>

            

          </div>
          

        </div>
      </div>
    );
}


export default AdminTicketDetailsPage;