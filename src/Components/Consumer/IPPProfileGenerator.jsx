import React, { useState } from "react";
import { Table, Button, Radio } from "antd";
import PropTypes from "prop-types";

const IPPProfileGenerator = ({ title, data }) => {
  const [selectedIPP, setSelectedIPP] = useState(null); // State to store the selected IPP key

  const handleSelect = (key) => {
    setSelectedIPP(key); // Update the selected IPP
  };

  const columns = [
    {
      title: "IPP",
      dataIndex: "ipp",
      key: "ipp",
      align: "center",
    },
    {
      title: "States",
      dataIndex: "states",
      key: "states",
      align: "center",
    },
    {
      title: "Available Capacity",
      dataIndex: "capacity",
      key: "capacity",
      align: "center",
    },
    {
      title: "Select",
      key: "select",
      align: "center",
      render: (_, record) => (
        <Radio
          value={record.key}
          checked={selectedIPP === record.key}
          onChange={() => handleSelect(record.key)}
        />
      ),
    },
  ];

  return (
    <div
      style={{
       
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "600",
          marginBottom: "20px",
        }}
      >
        {title}
      </h1>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        bordered
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #E6E8F1",
        }}
      />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          type="primary"
          style={{
            backgroundColor: "#669800",
            borderColor: "#669800",
            color: "#fff",
            fontSize: "16px",
            padding: "0 30px",
          }}
          disabled={!selectedIPP} // Disable the button if no IPP is selected
          onClick={() => alert(`Selected IPP Key: ${selectedIPP}`)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

IPPProfileGenerator.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number.isRequired,
      ipp: PropTypes.string.isRequired,
      states: PropTypes.string.isRequired,
      capacity: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default IPPProfileGenerator;
