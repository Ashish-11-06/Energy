import React from "react";
import "./ProgressBar.css"; // Ensure CSS styling

const ProgressBar = ({ progress, breakpoints, onProgressChange }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>

        {/* Breakpoints with titles on the bar */}
        {breakpoints.map((bp, index) => (
          <div key={index}>
            <div
              className={`breakpoint ${progress >= bp.value ? "active" : ""}`}
              style={{ left: `${bp.value}%` }}
              onClick={() => onProgressChange(bp.value)} // Update progress when clicked
            >
              ●
              <span className="breakpoint-title">{bp.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
