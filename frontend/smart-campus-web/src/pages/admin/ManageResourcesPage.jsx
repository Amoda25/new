import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
} from "../../services/resourceService";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import "./ManageResourcesPage.css";

export default function ManageResourcesPage() {
  const [resources, setResources] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeView, setActiveView] = useState("OVERVIEW"); // OVERVIEW, MANAGE, LIST, ACTIVE_LIST, SERVICE_LIST

  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
    capacity: "",
    status: "ACTIVE",
    description: "",
    imageUrl: "",
    fileName: "",
  });

  const [formErrors, setFormErrors] = useState({});


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
    const halls = resources.filter((r) => r.type === "LECTURE_HALL").length;
    const equipment = resources.filter((r) => r.type === "EQUIPMENT").length;

    return { total, active, rooms, labs, halls, equipment };
  }, [resources]);

  const chartData = useMemo(() => {
    return [
      { name: "Rooms", value: stats.rooms, color: "#3b82f6" },
      { name: "Labs", value: stats.labs, color: "#10b981" },
      { name: "Halls", value: stats.halls, color: "#f59e0b" },
      { name: "Equip", value: stats.equipment, color: "#ef4444" },
    ];
  }, [stats]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setForm({
      ...form,
      [name]: value,
    });

    // Immediate validation for negative capacity
    if (name === "capacity" && value !== "" && Number(value) < 0) {
      setFormErrors((prev) => ({
        ...prev,
        capacity: "Capacity cannot be a negative value"
      }));
    } else if (formErrors[name]) {
      // Clear error for this field when user corrects it or starts typing other fields
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
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
      fileName: "",
    });
    setEditingId(null);
    setFormErrors({});
  };


  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) {
      errors.name = "Resource name is required";
    } else if (form.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }

    if (!form.type) {
      errors.type = "Please select a resource type";
    }

    if (!form.location.trim()) {
      errors.location = "Location is required";
    }

    if (form.capacity !== "" && (isNaN(form.capacity) || Number(form.capacity) <= 0)) {
      errors.capacity = "Capacity must be a positive number";
    }

    if (!form.status) {
      errors.status = "Status is required";
    }

    // Preserve image error if it exists from handleImageChange
    if (formErrors.image) {
      errors.image = formErrors.image;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please fix the errors in the form.");
      return;
    }

    setSubmitting(true);
    setError("");


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
      setActiveView("LIST"); // Go to list after adding
      
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (error) {
      console.error("Failed to save resource", error);
      setError("Failed to save resource");
    } finally {
      setSubmitting(false);
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
      fileName: resource.imageUrl ? "Existing Image" : "",
    });
    setActiveView("MANAGE");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type - Only allow JPG and PNG
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          image: "Only JPG and PNG images are allowed."
        }));
        // Reset image in form
        setForm(prev => ({
          ...prev,
          imageUrl: "",
          fileName: ""
        }));
        return;
      }

      // Clear previous image error
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ 
          ...prev, 
          imageUrl: reader.result,
          fileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(id);
        loadResources();
      } catch (error) {
        console.error("Failed to delete resource", error);
        setError("Failed to delete resource");
      }
    }
  };

  return (
    <div className="admin-resource-dashboard">
      {successMsg && (
        <div className="success-toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          {successMsg}
        </div>
      )}

      {error && !loading && (
        <div className="error-toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          {error}
          <button className="close-toast" onClick={() => setError("")}>×</button>
        </div>
      )}


      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h2>Admin Panel</h2>
          <p>Resource Management</p>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-group">
            <span className="group-label">Navigation</span>
            <button 
              className={`sidebar-nav-btn ${activeView === 'OVERVIEW' ? 'active' : ''}`}
              onClick={() => setActiveView('OVERVIEW')}
            >
              <span className="dot" /> Dashboard Overview
            </button>
            <button 
              className={`sidebar-nav-btn ${activeView === 'MANAGE' ? 'active' : ''}`}
              onClick={() => { resetForm(); setActiveView('MANAGE'); }}
            >
              <span className="dot" /> Add Resource
            </button>
            <button 
              className={`sidebar-nav-btn ${activeView === 'LIST' ? 'active' : ''}`}
              onClick={() => setActiveView('LIST')}
            >
              <span className="dot" /> Maintain Resources
            </button>
            <button 
              className={`sidebar-nav-btn ${activeView === 'ACTIVE_LIST' ? 'active' : ''}`}
              onClick={() => setActiveView('ACTIVE_LIST')}
            >
              <span className="dot" style={{ background: '#10b981' }} /> Active Resources
            </button>
            <button 
              className={`sidebar-nav-btn ${activeView === 'SERVICE_LIST' ? 'active' : ''}`}
              onClick={() => setActiveView('SERVICE_LIST')}
            >
              <span className="dot" style={{ background: '#ef4444' }} /> Out of Service
            </button>
          </div>




          <div className="sidebar-footer">
            <Link to="/admin/dashboard" className="back-link">← Back</Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <header className="content-header">
          <div className="header-text">
            <h1>
              {activeView === 'OVERVIEW' ? 'Resources Overview' : 
               activeView === 'MANAGE' ? (editingId ? 'Edit Resource' : 'Add New Resource') : 
               activeView === 'ACTIVE_LIST' ? 'Active Resources' :
               activeView === 'SERVICE_LIST' ? 'Out of Service Resources' :
               'Maintain Resources'}
            </h1>
            <p>
              {activeView === 'OVERVIEW' ? 'Real-time metrics of campus facilities.' : 
               activeView === 'MANAGE' ? 'Create or update resource details.' : 
               activeView === 'ACTIVE_LIST' ? 'Resources currently available for use.' :
               activeView === 'SERVICE_LIST' ? 'Resources under maintenance or repair.' :
               'Review and manage all registered campus resources.'}
            </p>
          </div>
        </header>

        {activeView === 'OVERVIEW' && (
          <div className="overview-container animate-fade-in">
            <div className="overview-stats-grid">
              <div className="overview-stat-card">
                <h3>{stats.total}</h3>
                <p>Total Resources</p>
                <div className="stat-progress total-bg" />
              </div>
              <div className="overview-stat-card">
                <h3>{stats.active}</h3>
                <p>Active Status</p>
                <div className="stat-progress approved-bg" />
              </div>
              <div className="overview-stat-card">
                <h3>{stats.rooms + stats.labs + stats.halls}</h3>
                <p>Learning Spaces</p>
                <div className="stat-progress pending-bg" />
              </div>
              <div className="overview-stat-card">
                <h3>{stats.equipment}</h3>
                <p>Assets / Equip</p>
                <div className="stat-progress rejected-bg" />
              </div>
            </div>

            <section className="resource-charts-section">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Inventory Distribution</h3>
                  <p>Breakdown of resources by category</p>
                </div>
                <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                  <div style={{ width: '100%', maxWidth: '500px', height: '350px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip 
                           cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="chart-legend-custom">
                    {chartData.map((item, i) => (
                      <div key={i} className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                        <span className="legend-label">{item.name}</span>
                        <span className="legend-value">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeView === 'MANAGE' && (
          <div className="manage-shell animate-fade-in">
            <section className="form-section-card">
              <div className="section-header">
                <h2>{editingId ? "Edit Resource" : "Create New Resource"}</h2>
                <p>Provide the essential details for the resource record.</p>
              </div>

              <form onSubmit={handleSubmit} className="manage-resource-form">
                <div className="manage-form-row">
                  <div className="manage-form-group">
                    <label>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                      Resource Name
                    </label>
                    <input
                      name="name"
                      placeholder="e.g. Main Auditorium"
                      value={form.name}
                      onChange={handleChange}
                      className={formErrors.name ? "input-error" : ""}
                    />
                    {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                  </div>


                  <div className="manage-form-group">
                    <label>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                      Resource Type
                    </label>
                    <select 
                      name="type" 
                      value={form.type} 
                      onChange={handleChange}
                      className={formErrors.type ? "input-error" : ""}
                    >
                      <option value="">Select type</option>
                      <option value="ROOM">ROOM</option>
                      <option value="LAB">LAB</option>
                      <option value="LECTURE_HALL">LECTURE HALL</option>
                      <option value="EQUIPMENT">EQUIPMENT</option>
                    </select>
                    {formErrors.type && <span className="error-text">{formErrors.type}</span>}
                  </div>

                </div>

                <div className="manage-form-row">
                  <div className="manage-form-group">
                    <label>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      Location
                    </label>
                    <input
                      name="location"
                      placeholder="e.g. Block A, 1st Floor"
                      value={form.location}
                      onChange={handleChange}
                      className={formErrors.location ? "input-error" : ""}
                    />
                    {formErrors.location && <span className="error-text">{formErrors.location}</span>}
                  </div>


                  <div className="manage-form-group">
                    <label>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      Capacity
                    </label>
                    <input
                      name="capacity"
                      placeholder="e.g. 50"
                      type="number"
                      min="1"
                      value={form.capacity}
                      onChange={handleChange}
                      className={formErrors.capacity ? "input-error" : ""}
                    />
                    {formErrors.capacity && <span className="error-text">{formErrors.capacity}</span>}
                  </div>

                </div>

                <div className="manage-form-row">
                  <div className="manage-form-group">
                    <label>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      Status
                    </label>
                    <select name="status" value={form.status} onChange={handleChange} required>
                      <option value="ACTIVE">Active</option>
                      <option value="OUT_OF_SERVICE">Out of Service</option>
                    </select>
                  </div>

                  <div className="manage-form-group">
                    <label>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      Description
                    </label>
                    <input
                      name="description"
                      placeholder="Add some details about the resource"
                      value={form.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="manage-form-group full-width">
                  <label htmlFor="resource-image">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    Resource Image
                  </label>
                  <div className="manage-image-upload-wrapper">
                    <input
                      type="file"
                      id="resource-image"
                      accept="image/*,application/pdf"
                      onChange={handleImageChange}
                      className={`file-input ${formErrors.image ? "input-error" : ""}`}
                    />
                    {form.imageUrl ? (
                      <div className="image-inside-preview">
                        <div className="preview-content">
                          <img src={form.imageUrl} alt="Preview" />
                          {form.fileName && <span className="file-name-badge">{form.fileName}</span>}
                        </div>
                        <div className="change-image-overlay">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                          <span>Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className={`upload-placeholder ${formErrors.image ? "error-border" : ""}`}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <span>Drag and drop or click to upload</span>
                      </div>
                    )}
                  </div>
                  {formErrors.image && <span className="error-text" style={{ marginTop: '8px', display: 'block' }}>{formErrors.image}</span>}
                </div>

                <div className="manage-form-actions">
                  <button type="submit" className="manage-primary-btn" disabled={submitting}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    {submitting ? "Saving..." : (editingId ? "Update Resource" : "Create Resource")}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      className="manage-secondary-btn"
                      onClick={resetForm}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>
          </div>
        )}

        {(activeView === 'LIST' || activeView === 'ACTIVE_LIST' || activeView === 'SERVICE_LIST') && (
          <div className="manage-shell animate-fade-in">
            {loading ? (
              <div className="manage-message">Loading inventory...</div>
            ) : error ? (
              <div className="manage-message">{error}</div>
            ) : (
              (() => {
                const filtered = activeView === 'ACTIVE_LIST' 
                  ? resources.filter(r => r.status === 'ACTIVE')
                  : activeView === 'SERVICE_LIST'
                  ? resources.filter(r => r.status === 'OUT_OF_SERVICE')
                  : resources;

                if (filtered.length === 0) {
                  return <div className="manage-message">No matching resources found.</div>;
                }

                return (
                  <div className="manage-resource-grid">
                    {filtered.map((resource) => (
                      <div key={resource.id} className="manage-resource-card">
                        <div className="manage-card-image">
                          {resource.imageUrl ? (
                            <img src={resource.imageUrl} alt={resource.name} />
                          ) : (
                            <div className="placeholder-image" style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            </div>
                          )}
                          <div className="manage-card-badge">
                            {resource.type || "RESOURCE"}
                          </div>
                        </div>

                        <div className="card-content">
                          <h3 className="resource-name-title">{resource.name}</h3>

                          <div className="info-row">
                            <span className="info-label">Location</span>
                            <span className="info-value">{resource.location}</span>
                          </div>

                          <div className="info-row">
                            <span className="info-label">Capacity</span>
                            <span className="info-value">{resource.capacity ?? "N/A"}</span>
                          </div>

                          <div className="info-row">
                            <span className="info-label">Status</span>
                            <div className={`status-indicator ${resource.status.toLowerCase()}`}>
                              <span className="dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }}></span>
                              {resource.status}
                            </div>
                          </div>
                        </div>

                        <div className="manage-card-actions">
                          <button
                            className="admin-approve-btn"
                            onClick={() => handleEdit(resource)}
                          >
                            Edit
                          </button>

                          <button
                            className="admin-delete-btn"
                            onClick={() => handleDelete(resource.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}
          </div>
        )}
      </main>
    </div>
  );
}
