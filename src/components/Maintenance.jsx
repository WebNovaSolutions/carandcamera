import React from "react";
import "./Maintenance.css";

export default function Maintenance() {
  return (
    <div className="maintenance-page">
      <div className="maintenance-card">

        <div className="maintenance-icon">🛠️</div>

        <span className="maintenance-status">
          TEMPORARILY UNAVAILABLE
        </span>

        <h1>We'll Be Back Soon!</h1>

        <p>
          We're currently performing scheduled maintenance
          to improve our website and services.
        </p>

        <p className="maintenance-subtext">
          Our team is working hard to get everything
          back up and running as soon as possible.
        </p>

        <div className="maintenance-line"></div>

        <h3>Thank You for Your Patience!</h3>

        <p className="maintenance-footer">
          We apologize for any inconvenience.
        </p>

      </div>
    </div>
  );
}
