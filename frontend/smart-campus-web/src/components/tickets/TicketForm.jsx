
import { createTicket,getResources} from "../../services/ticketService";
import "./TicketForm.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function TicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [images, setImages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources();
        setResources(data);
      } catch (error) {
        console.error("Failed to load resources:", error);
      }
    };

    fetchResources();
  }, []);
  

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 3) {
      setErrorMessage("You can upload a maximum of 3 images.");
      setImages([]);
      return;
    }

    setErrorMessage("");
    setImages(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }

    if (!description.trim()) {
      setErrorMessage("Description is required.");
      return;
    }

    if (!priority) {
      setErrorMessage("Priority is required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("priority", priority);
      formData.append("category", category);
      formData.append("location", location);
      formData.append("contactName", contactName);
      formData.append("contactDetails", contactDetails);

      if (resourceId) {
        formData.append("resourceId", resourceId);
      }

      images.forEach((image) => {
        formData.append("images", image);
      });

      await createTicket(formData);

      setSuccessMessage("Ticket created successfully.");
      setTitle("");
      setDescription("");
      setPriority("");
      setResourceId("");
      setImages([]);
      setTimeout(() => {
        navigate("/user/tickets");
      }, 1500);
    } catch (error) {
      console.error("Ticket creation failed:", error);
      setErrorMessage("Failed to create ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rd-page">
      <div className="create-wrapper">
        <div className="create-card">
          <div className="create-header">
            <div className="badge">Maintenance & Incident Ticketing</div>
            <h1>CREATE INCIDENT TICKET</h1>
            <p>Report a campus resource or location issue with category, priority, contact details and up to 3 evidence images.</p>
          </div>

          <form onSubmit={handleSubmit} className="create-form">
            <div className="field">
              <label>Ticket Title *</label>
              <input
                type="text"
                placeholder="Example: Projector not working in Lab 03"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="IT_SUPPORT">IT Support</option>
                  <option value="ELECTRICAL">Electrical</option>
                  <option value="PLUMBING">Plumbing</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="field">
                <label>Priority *</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="">Select priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Resource *</label>
                <select
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                  required
                >
                  <option value="">Select resource</option>
                  {resources.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Location *</label>
                <input
                  type="text"
                  placeholder="Example: B401 / Lab 03"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Issue Description *</label>
              <textarea
                placeholder="Describe the issue clearly. Example: Projector turns on, but the display is blank."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                required
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label>Contact Name *</label>
                <input
                  type="text"
                  placeholder="Example: Samindi Wijekoon"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Preferred Contact Details *</label>
                <input
                  type="text"
                  placeholder="Email or phone number"
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Upload Evidence Images</label>
              <div className="file-upload-box">
                <div className="file-upload-content">
                  <strong>Attach images as evidence</strong>
                  <p>Maximum 3 images allowed. Use damaged equipment photos or error screen screenshots.</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    id="file-input"
                  />
                </div>
              </div>
              {images.length > 0 && (
                <div className="file-list">
                  {images.map((img, i) => (
                    <div key={i} className="file-item">{img.name}</div>
                  ))}
                </div>
              )}
            </div>

            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Incident Ticket"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



export default TicketForm;