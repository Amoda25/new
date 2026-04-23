import React from "react";
import "./ResourceCard.css";

const typeClass = {
  LAB: "type-lab",
  ROOM: "type-room",
  EQUIPMENT: "type-equip",
};

export default function ResourceCard({ resource, onView }) {
  const isActive = resource.status === "ACTIVE";

  return (
    <div className="resource-card">
      <div className={`resource-card-type ${typeClass[resource.type] ?? "type-room"}`}>
        {resource.type}
      </div>

      <h3>{resource.name}</h3>

      <p><strong>Location</strong>{resource.location}</p>
      <p><strong>Capacity</strong>{resource.capacity ?? "N/A"}</p>
      <p><strong>Info</strong>{resource.description || "No description"}</p>

      <div className="resource-card-divider" />

      <div className={isActive ? "status-active" : "status-inactive"}>
        {resource.status}
      </div>

      <button onClick={() => onView(resource.id)} className="resource-btn">
        View Details →
      </button>
    </div>
  );
}