import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import AnnualSaving from "../../Components/Consumer/AnnualSaving";

const AnnualSvg = () => {
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Hook for navigation

  if (loading) {
    return null; // Return nothing while loading
  }

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F6FB",
        padding: "20px",
        flexDirection: "column",
        height: '100%',
        // border:"2px solid red"
      }}
    >
      <div style={{ backgroundColor: "#F5F6FB", padding: "20px", border:"2px solid #6698005c", borderRadius:"5px"}}>
        <AnnualSaving />
      </div>

      <Button
        type="primary"
        style={{
          marginTop: "20px",
          backgroundColor: "#669800",
          borderColor: "#669800",
          fontSize: "16px",
          padding: "0 30px",
        }}
        onClick={() => navigate("/consumer/subscription-plan")}
      >
        Continue
      </Button>
    </main>
  );
};

export default AnnualSvg;
