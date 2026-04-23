
import { createTicket,getResources} from "../../services/ticketService";
import "./TicketForm.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function TicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [resourceId, setResourceId] = useState("");
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

       <section className="mini-hero">
        <div className="mini-hero-content">
          <h1>Create New Ticket</h1>
          <p>Submit an issue and our team will assist you.</p>
        </div>
      </section>
      <div className="create-wrapper">

        <div className="create-card">

          <div className="create-header">
            <h2>Create Support Ticket</h2>
            <p>Report an issue and attach up to 3 images if needed.</p>
          </div>

          <form onSubmit={handleSubmit} className="create-form">

            <div className="field">
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter ticket title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                placeholder="Describe the issue clearly"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="">Select priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="field">
                <label>Resource</label>
                <select
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                >
                  <option value="">Select resource (optional)</option>

                  {resources.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label>Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
              <small>Maximum 3 images allowed.</small>

              {images.length > 0 && (
                <div className="file-list">
                  {images.map((img, i) => (
                    <div key={i}>{img.name}</div>
                  ))}
                </div>
              )}
            </div>

            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Ticket"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}



export default TicketForm;