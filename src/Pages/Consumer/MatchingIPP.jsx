import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, Spin, Alert, Row, Button, Radio } from "antd";
import { fetchMatchingIPPById } from "../../Redux/Slices/Consumer/matchingIPPSlice";

const MatchingIPP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedRow, setSelectedRow] = useState(null); // Track selected row
  const { matchingIPP, status, error } = useSelector((state) => state.matchingIPP);

  useEffect(() => {
    const requirementId = location.state?.selectedRequirement?.id;
    if (requirementId) {
      dispatch(fetchMatchingIPPById(requirementId));
    } else {
      console.error("Requirement ID not found in location state.");
    }
  }, [location, dispatch]);

  const handleRowClick = (record) => {
    setSelectedRow(record); // Set selected row when a row is clicked
  };

  const handleRadioChange = (e, record) => {
    if (e.target.checked) {
      setSelectedRow(record);
    }
  };

  const handleContinue = () => {
    if (selectedRow) {
      const requirementId = location.state?.selectedRequirement?.id;
      navigate("/consumer/annual-saving", { state: { requirementId } });
    }
  };

  const columns = [
    {
      title: "Select",
      key: "select",
      render: (text, record) => (
        <Radio
          checked={selectedRow?.id === record.id}
          onChange={(e) => handleRadioChange(e, record)}
        />
      ),
    },
    {
      title: "IPP",
      dataIndex: "user__username",
      key: "user__username",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Available Capacity (MW)",
      dataIndex: "available_capacity",
      key: "available_capacity",
    },
  ];

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Loading IPP details..." />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Row style={{ width: "100%" }}>
        <h2>Matching IPP Details</h2>
        <Table
          columns={columns}
          dataSource={Array.isArray(matchingIPP) ? matchingIPP : []}
          rowKey={(record) => record.user || record.id || Math.random()}
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleRowClick(record), // Handle row click to set selected row
          })}
          locale={{
            emptyText: "No Matching IPPs found",
          }}
          style={{ marginTop: "5%", width: "60%" }}
        />
      </Row>
      <Row
        style={{
          width: "100%",
          marginTop: "20px",
          justifyContent: "center",
        }}
      >
        <Button
          type="primary"
          onClick={handleContinue}
          disabled={!selectedRow} // Disable button until a row is selected
          style={{
            pointerEvents: selectedRow ? "auto" : "none",
            opacity: selectedRow ? 1 : 0.5,
            cursor: selectedRow ? "pointer" : "not-allowed",
          }}
        >
          Continue
        </Button>
      </Row>
    </main>
  );
};

export default MatchingIPP;
