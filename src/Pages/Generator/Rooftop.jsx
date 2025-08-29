import React, { useState } from "react";
import { Table, Button, Card } from "antd";
import RooftopModal from "../../Components/Generator/RooftopModal";

// Dummy data for demonstration
const consumers = [
  {
    consumer_id: "C001",
    industry: "Manufacturing",
    state: "Maharashtra",
    required_capacity: "500 kWp",
    name: "ABC Industries",
    address: "123 Industrial Area, Pune",
    contact: "9876543210",
    email: "abc@industry.com",
    details: "Large scale manufacturer of automotive parts.",
  },
  {
    consumer_id: "C002",
    industry: "Pharma",
    state: "Gujarat",
    required_capacity: "300 kWp",
    name: "XYZ Pharma",
    address: "456 Pharma Park, Ahmedabad",
    contact: "9123456780",
    email: "xyz@pharma.com",
    details: "Pharmaceutical company specializing in generics.",
  },
  // ...more consumers
];

const GeneratorRooftop = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState(null);

  const columns = [
    {
      title: "Sr. No.",
      key: "srno",
      render: (text, record, index) => index + 1,
      align: "center",
    },
    {
      title: "Consumer ID",
      dataIndex: "consumer_id",
      key: "consumer_id",
      align: "center",
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      align: "center",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      align: "center",
    },
    {
      title: "Required Capacity",
      dataIndex: "required_capacity",
      key: "required_capacity",
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: () => (
        <Button type="link" style={{ color: "#fff", background: "#669800", borderRadius: 4 }}>
          View Details
        </Button>
      ),
    }
  ];

  const handleRowClick = (record) => {
    setSelectedConsumer(record);
    setModalVisible(true);
  };

  return (
    <div style={{ padding: 24 }}>
        <Card>
      <Table
        columns={columns}
        dataSource={consumers}
        rowKey="consumer_id"
        bordered
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          onMouseEnter: () => setSelectedConsumer(record),
        })}
        pagination={false}
        style={{ cursor: "pointer" }}
      />
      </Card>

      <RooftopModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        consumer={selectedConsumer}
      />
    </div>
  );
};

export default GeneratorRooftop;
