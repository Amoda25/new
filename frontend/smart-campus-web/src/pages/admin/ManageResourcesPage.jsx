import React, { useEffect, useMemo, useState } from "react";
import {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
} from "../../services/resourceService";
import "./ManageResourcesPage.css";

export default function ManageResourcesPage() {
  const [resources, setResources] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
    capacity: "",
    status: "ACTIVE",
    description: "",
    imageUrl: "",
  });

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await getAllResources();
      setResources(data);
      setError("");
    } catch (error) {
      console.error("Failed to load resources", error);
      setError("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const stats = useMemo(() => {
    const total = resources.length;
    const active = resources.filter((r) => r.status === "ACTIVE").length;
    const rooms = resources.filter((r) => r.type === "ROOM").length;
    const labs = resources.filter((r) => r.type === "LAB").length;

    return { total, active, rooms, labs };
  }, [resources]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      type: "",
      location: "",
      capacity: "",
      status: "ACTIVE",
      description: "",
      imageUrl: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      capacity: form.capacity ? Number(form.capacity) : null,
    };

    try {
      if (editingId) {
        await updateResource(editingId, payload);
        setSuccessMsg("Resource updated successfully!");
      } else {
        await createResource(payload);
        setSuccessMsg("Resource added successfully!");
      }

      resetForm();
      loadResources();
      
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (error) {
      console.error("Failed to save resource", error);
      setError("Failed to save resource");
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource.id);
    setForm({
      name: resource.name || "",
      type: resource.type || "",
      location: resource.location || "",
      capacity: resource.capacity ?? "",
      status: resource.status || "ACTIVE",
      description: resource.description || "",
      imageUrl: resource.imageUrl || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteResource(id);
      loadResources();
    } catch (error) {
      console.error("Failed to delete resource", error);
      setError("Failed to delete resource");
    }
  };

  return (
    <div className="manage-soft-page">
      {successMsg && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#4caf50', color: 'white', padding: '15px 30px', borderRadius: '8px', zIndex: 9999, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          {successMsg}
        </div>
      )}
      <section className="manage-hero-section">
        <div className="manage-hero-overlay" />

        <div className="manage-hero-content">
          <div className="manage-hero-text">
            <h1>Manage Campus Resources</h1>
            <p>
              Add, update, and maintain rooms, labs, and equipment through a
              centralized resource management interface.
            </p>
          </div>

          <div className="manage-stats-panel">
            <div className="manage-stat-box">
              <h2>{stats.total}+</h2>
              <p>Total Resources</p>
            </div>
            <div className="manage-stat-box">
              <h2>{stats.active}+</h2>
              <p>Active Resources</p>
            </div>
            <div className="manage-stat-box">
              <h2>{stats.rooms + stats.labs}+</h2>
              <p>Rooms & Labs</p>
            </div>
          </div>
        </div>
      </section>

      <section className="manage-shell">
        <div className="manage-header">
          <h2>{editingId ? "Edit Resource" : "Create New Resource"}</h2>
          <p>
            Fill in the details below to {editingId ? "update" : "add"} a campus
            resource.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="manage-resource-form">
          <div className="manage-form-row">
            <div className="manage-form-group">
              <label>Resource Name</label>
              <input
                name="name"
                placeholder="e.g. Main Auditorium"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="manage-form-group">
              <label>Resource Type</label>
              <select name="type" value={form.type} onChange={handleChange} required>
                <option value="">Select type</option>
                <option value="ROOM">ROOM</option>
                <option value="LAB">LAB</option>
                <option value="EQUIPMENT">EQUIPMENT</option>
              </select>
            </div>
          </div>

          <div className="manage-form-row">
            <div className="manage-form-group">
              <label>Location</label>
              <input
                name="location"
                placeholder="e.g. Block A, 1st Floor"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="manage-form-group">
              <label>Capacity</label>
              <input
                name="capacity"
                placeholder="e.g. 50"
                type="number"
                value={form.capacity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="manage-form-row">
            <div className="manage-form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange} required>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>

            <div className="manage-form-group">
              <label>Description</label>
              <input
                name="description"
                placeholder="Add some details about the resource"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="manage-form-group full-width">
            <label htmlFor="resource-image">Resource Image</label>
            <div className="manage-image-upload-wrapper">
              <input
                type="file"
                id="resource-image"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <div className="upload-placeholder">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                 <span>Click or drag image here to upload</span>
              </div>
            </div>
            {form.imageUrl && (
              <div className="image-preview-container">
                <img src={form.imageUrl} alt="Preview" className="image-preview" />
              </div>
            )}
          </div>

          <div className="manage-form-actions">
            <button type="submit" className="manage-primary-btn">
              {editingId ? "Update Resource" : "Add Resource"}
            </button>

            {editingId && (
              <button
                type="button"
                className="manage-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="manage-list-header">
          <h2>Existing Resources</h2>
          <p>Review, edit, or remove resources from the system.</p>
        </div>

        {loading ? (
          <div className="manage-message">Loading resources...</div>
        ) : error ? (
          <div className="manage-message">{error}</div>
        ) : resources.length === 0 ? (
          <div className="manage-message">No resources available.</div>
        ) : (
          <div className="manage-resource-grid">
            {resources.map((resource) => (
              <div key={resource.id} className="manage-resource-card">
                <div className="manage-card-badge">
                  {resource.type || "RESOURCE"}
                </div>

                {resource.imageUrl && (
                  <div className="manage-card-image">
                    <img src={resource.imageUrl} alt={resource.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                  </div>
                )}

                <h3>{resource.name}</h3>

                <p>
                  <strong>Location</strong>
                  <span>{resource.location}</span>
                </p>

                <p>
                  <strong>Capacity</strong>
                  <span>{resource.capacity ?? "N/A"}</span>
                </p>

                <p>
                  <strong>Status</strong>
                  <span>{resource.status}</span>
                </p>

                <p>
                  <strong>Info</strong>
                  <span>{resource.description || "No description"}</span>
                </p>

                <div className="manage-card-divider" />

                <div className="manage-card-actions">
                  <button
                    className="manage-edit-btn"
                    onClick={() => handleEdit(resource)}
                  >
                    Edit
                  </button>

                  <button
                    className="manage-delete-btn"
                    onClick={() => handleDelete(resource.id)}
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