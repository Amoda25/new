import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllResources } from "../../services/resourceService";
import ResourceCard from "../../components/resources/ResourceCard";
import ResourceFilters from "../../components/resources/ResourceFilters";
import "./ResourceCataloguePage.css";

export default function ResourceCataloguePage() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    type: "",
    location: "",
    status: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources();
        setResources(data);
        setFilteredResources(data);
      } catch (err) {
        setError("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let filtered = [...resources];

    if (filters.type) {
      filtered = filtered.filter((r) => r.type === filters.type);
    }

    if (filters.location) {
      filtered = filtered.filter((r) =>
        r.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    setFilteredResources(filtered);
  }, [filters, resources]);

  const handleView = (id) => {
    navigate(`/user/resources/${id}`);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      type: "",
      location: "",
      status: "",
    });
  };

  const stats = useMemo(() => {
    const total = resources.length;
    const active = resources.filter((r) => r.status === "ACTIVE").length;
    const rooms = resources.filter((r) => r.type === "ROOM").length;
    const labs = resources.filter((r) => r.type === "LAB").length;
    const halls = resources.filter((r) => r.type === "LECTURE_HALL").length;

    return { total, active, rooms, labs, halls };
  }, [resources]);

  if (loading) {
    return <div className="catalogue-message">Loading resources...</div>;
  }

  if (error) {
    return <div className="catalogue-message">{error}</div>;
  }

  return (
    <div className="soft-page">
      <section className="hero-section">
        <div className="hero-overlay" />

        <div className="hero-content">
          

          <div className="hero-text">
            <h1>Smart Campus Resources</h1>
            <p>
              Browse, manage, and explore campus facilities through a modern
              digital interface.
            </p>
          </div>

          <div className="stats-panel">
            <div className="stat-box">
              <h2>{stats.total}+</h2>
              <p>Total Resources</p>
            </div>
            <div className="stat-box">
              <h2>{stats.active}+</h2>
              <p>Active Resources</p>
            </div>
            <div className="stat-box">
              <h2>{stats.rooms + stats.labs + stats.halls}+</h2>
              <p>Rooms, Labs & Halls</p>
            </div>
          </div>
        </div>
      </section>

      <section className="catalogue-shell">
        <div className="catalogue-header">
          <h2>Explore Available Resources</h2>
          <p>Find rooms, labs, and equipment with quick filters.</p>
        </div>

        <ResourceFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {filteredResources.length === 0 ? (
          <div className="catalogue-message">No matching resources found.</div>
        ) : (
          <div className="catalogue-grid">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
