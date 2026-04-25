import React from "react";
import "./ResourceCard.css";

const typeClass = {
  LAB: "type-lab",
  ROOM: "type-room",
  EQUIPMENT: "type-equip",
};

const TYPE_CONFIG = {
  LAB: {
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1400&q=80",
    imageFallback: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1400&q=80",
  },
  ROOM: {
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1400&q=80",
    imageFallback: "https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=80",
  },
  EQUIPMENT: {
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&q=80",
    imageFallback: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1400&q=80",
  },
};

const DEFAULT_CONFIG = TYPE_CONFIG.ROOM;

export default function ResourceCard({ resource, onView }) {
  const [imgError, setImgError] = React.useState(false);
  const isActive = resource.status === "ACTIVE";
  
  const cfg = TYPE_CONFIG[resource.type] ?? DEFAULT_CONFIG;
  const baseImg = resource.imageUrl ? resource.imageUrl : cfg.image;
  const imgSrc = imgError ? cfg.imageFallback : baseImg;

  return (
    <div className="resource-card">
      <div style={{ margin: '-24px -22px 16px -22px' }}>
        <img 
          src={imgSrc} 
          alt={resource.name} 
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '140px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', display: 'block' }} 
        />
      </div>
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