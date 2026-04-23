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

  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
    capacity: "",
    status: "ACTIVE",
    description: "",
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
      } else {
        await createResource(payload);
      }

      resetForm();
      loadResources();
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
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
          <input
            name="name"
            placeholder="Resource name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">Select type</option>
            <option value="ROOM">ROOM</option>
            <option value="LAB">LAB</option>
            <option value="EQUIPMENT">EQUIPMENT</option>
          </select>

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <input
            name="capacity"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
          />

          <select name="status" value={form.status} onChange={handleChange} required>
            <option value="ACTIVE">ACTIVE</option>
            <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
          </select>

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

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