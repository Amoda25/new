
import { createTicket } from "../../services/ticketService";
import { getAllResources } from "../../services/resourceService";
import "./TicketForm.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function TicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");

  const [category, setCategory] = useState("RESOURCE_ISSUE");
  const [resourceId, setResourceId] = useState("");
  const [resources, setResources] = useState([]);
  const [location, setLocation] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [images, setImages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    let error = "";
    if (!value || (typeof value === "string" && !value.trim())) {
      error = "This field is required";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources();
        setResources(data);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      }
    };
    fetchResources();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (images.length + selectedFiles.length > 3) {
      setErrorMessage("You can upload a maximum of 3 images.");
      return;
    }

    const newImages = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setErrorMessage("");
    setImages(prev => [...prev, ...newImages]);
    
    // Reset input value so same file can be selected again if removed
    e.target.value = "";
  };

  const removeImage = (index) => {
    const imageToRemove = images[index];
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const fieldsToValidate = {
      title,
      resourceId,
      priority,
      location,
      description,
      contactName,
      contactDetails
    };

    let hasErrors = false;
    const newErrors = {};
    Object.keys(fieldsToValidate).forEach(key => {
      const val = fieldsToValidate[key];
      if (!val || (typeof val === 'string' && !val.trim())) {
        newErrors[key] = "This field is required";
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      setErrorMessage("Please fill in all required fields.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("priority", priority);
      formData.append("resourceId", resourceId);
      formData.append("category", category);
      formData.append("location", location);
      formData.append("contactName", contactName);
      formData.append("contactDetails", contactDetails);



      images.forEach((imgObj) => {
        formData.append("images", imgObj.file);
      });

      await createTicket(formData);

      setSuccessMessage("Ticket created successfully.");
      setTitle("");
      setDescription("");
      setPriority("");
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
                onChange={(e) => {
                  setTitle(e.target.value);
                  validate("title", e.target.value);
                }}
                className={errors.title ? "input-error" : ""}
                required
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-row">
              <div className="field">
                <label>Resource *</label>
                <select
                  value={resourceId}
                  onChange={(e) => {
                    setResourceId(e.target.value);
                    validate("resourceId", e.target.value);
                  }}
                  className={errors.resourceId ? "input-error" : ""}
                  required
                >
                  <option value="">Select Resource</option>
                  {resources.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.name} ({res.id})
                    </option>
                  ))}
                </select>
                {errors.resourceId && <span className="field-error">{errors.resourceId}</span>}
              </div>

              <div className="field">
                <label>Priority *</label>
                <select
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value);
                    validate("priority", e.target.value);
                  }}
                  className={errors.priority ? "input-error" : ""}
                  required
                >
                  <option value="">Select priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                {errors.priority && <span className="field-error">{errors.priority}</span>}
              </div>
            </div>

            <div className="field">
              <label>Location *</label>
              <input
                type="text"
                placeholder="Example: B401 / Lab 03"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  validate("location", e.target.value);
                }}
                className={errors.location ? "input-error" : ""}
                required
              />
              {errors.location && <span className="field-error">{errors.location}</span>}
            </div>

            <div className="field">
              <label>Issue Description *</label>
              <textarea
                placeholder="Describe the issue clearly. Example: Projector turns on, but the display is blank."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  validate("description", e.target.value);
                }}
                className={errors.description ? "input-error" : ""}
                rows="5"
                required
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="field">
                <label>Contact Name *</label>
                <input
                  type="text"
                  placeholder="Example: Samindi Wijekoon"
                  value={contactName}
                  onChange={(e) => {
                    setContactName(e.target.value);
                    validate("contactName", e.target.value);
                  }}
                  className={errors.contactName ? "input-error" : ""}
                  required
                />
                {errors.contactName && <span className="field-error">{errors.contactName}</span>}
              </div>

              <div className="field">
                <label>Preferred Contact Details *</label>
                <input
                  type="text"
                  placeholder="Email or phone number"
                  value={contactDetails}
                  onChange={(e) => {
                    setContactDetails(e.target.value);
                    validate("contactDetails", e.target.value);
                  }}
                  className={errors.contactDetails ? "input-error" : ""}
                  required
                />
                {errors.contactDetails && <span className="field-error">{errors.contactDetails}</span>}
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
                <div className="image-preview-grid">
                  {images.map((img, i) => (
                    <div key={i} className="preview-card">
                      <img src={img.preview} alt={`Preview ${i}`} />
                      <button 
                        type="button" 
                        className="remove-img-btn"
                        onClick={() => removeImage(i)}
                        title="Remove image"
                      >
                        &times;
                      </button>
                      <div className="img-info">
                        <span>{img.file.name.length > 15 ? img.file.name.substring(0, 12) + '...' : img.file.name}</span>
                      </div>
                    </div>
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
