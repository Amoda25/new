import React from "react";
import "./ResourceFilters.css";

export default function ResourceFilters({ filters, onChange, onReset }) {
  return (
    <div className="resource-filters">
      <input
        type="text"
        name="location"
        placeholder="Filter by location"
        value={filters.location}
        onChange={onChange}
      />

      <select name="type" value={filters.type} onChange={onChange}>
        <option value="">All Types</option>
        <option value="ROOM">ROOM</option>
        <option value="LAB">LAB</option>
        <option value="EQUIPMENT">EQUIPMENT</option>
      </select>

      <select name="status" value={filters.status} onChange={onChange}>
        <option value="">All Status</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
      </select>

      <button onClick={onReset}>Reset</button>
    </div>
  );
}