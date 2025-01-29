import React, { useState } from "react";
import "./ProgressBar.css"; // Ensure CSS styling

const ProgressBar = ({ progress: initialProgress = 0, breakpoints = [] }) => {
  const [progress, setProgress] = useState(initialProgress);

  // Handle click on breakpoint to set the progress
  const handleBreakpointClick = (value) => {
    setProgress(value); // Update progress to the clicked breakpoint value
  };

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
              onClick={() => handleBreakpointClick(bp.value)} // Click handler
            >
              ●
              <span className="breakpoint-title" style={{ marginBottom: "30px", color: "red" }}>
                {bp.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
