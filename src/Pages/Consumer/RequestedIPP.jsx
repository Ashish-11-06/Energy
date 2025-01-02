import React, { useState } from 'react';
import { Table, Button, Modal, Col, Row, Typography, Select, Input } from 'antd';

// Sample data to be displayed in the table
const ippData = [
  {
    key: "1",
    ipp: "1",
    states: "Karnataka",
    capacity: "50 MW",
    replacement: "65%",
    perUnitCost: 5.45,
    status: "Pending",
  },
  {
    key: "2",
    ipp: "2",
    states: "Maharashtra",
    capacity: "30 MW",
    replacement: "65%",
    perUnitCost: 6.2,
    status: "Accepted",
  },
  {
    key: "3",
    ipp: "3",
    states: "Rajasthan",
    capacity: "10 MW",
    replacement: "65%",
    perUnitCost: 4.85,
    status: "Rejected",
  },
];

const { Title } = Typography;
const { Option } = Select;

const RequestedIPP = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const [searchText, setSearchText] = useState(""); // State for search text

  // Function to handle button click and show modal
  const showModal = (record) => {
    setModalContent(record);
    setIsModalVisible(true);
  };

  // Function to handle closing the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle change in the status filter
  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  // Handle change in search input
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Filter the data based on search text and status filter
  const filteredData = ippData.filter((record) => {
    const statusMatch = statusFilter ? record.status === statusFilter : true;
    const searchMatch =
      record.ipp.includes(searchText) ||
      record.states.toLowerCase().includes(searchText.toLowerCase()) ||
      record.capacity.toLowerCase().includes(searchText.toLowerCase()) ||
      record.replacement.toLowerCase().includes(searchText.toLowerCase()) ||
      record.perUnitCost.toString().includes(searchText);
    return statusMatch && searchMatch;
  });

  // Define table columns with filter functionality for status
  const columns = [
    {
      title: 'IPP ID',
      dataIndex: 'ipp',
      key: 'ipp',
      width: '100px',
    },
    {
      title: 'State',
      dataIndex: 'states',
      key: 'states',
      width: '150px',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      width: '150px',
    },
    {
      title: 'Replacement',
      dataIndex: 'replacement',
      key: 'replacement',
      width: '150px',
    },
    {
      title: 'Per Unit Cost',
      dataIndex: 'perUnitCost',
      key: 'perUnitCost',
      render: (text) => `₹${text}`, // Format cost with currency symbol
      width: '150px',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => showModal(record)} // Show modal on button click
        >
          View Status
        </Button>
      ),
      width: '150px',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Col span={24} style={{ textAlign: "center" }}>
        <Title level={3} style={{ color: "#001529" }}>
          Your Requested IPPs
        </Title>
      </Col>

      {/* Search and Filter in the same row */}
      <Row gutter={16} style={{ marginBottom: '20px', justifyContent: 'center' }}>
      <Col style={{marginRight:'40%'}}>
          <Input
            placeholder="Search"
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: 200 }}
          />
        </Col>
        <Col>
          <Select
            placeholder="Filter by Status"
            onChange={handleStatusChange}
            style={{ width: 200 }}
            allowClear
          >
            <Option value="Pending">Pending</Option>
            <Option value="Accepted">Accepted</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        </Col>
       
      </Row>

      <Table
        dataSource={filteredData} // Use filtered data for the table
        columns={columns} // Columns definition
        pagination={false} // Disable pagination if not needed
        style={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow to the table
          width: '80%', // Reduce the table width
          margin: '0 auto', // Center the table horizontally
        }}
      />

      {/* Modal to display status and additional information */}
      <Modal
        title="IPP Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // No footer buttons, you can add if needed
      >
        {modalContent && (
          <div>
            <p><strong>IPP ID:</strong> {modalContent.ipp}</p>
            <p><strong>State:</strong> {modalContent.states}</p>
            <p><strong>Capacity:</strong> {modalContent.capacity}</p>
            <p><strong>Replacement:</strong> {modalContent.replacement}</p>
            <p><strong>Per Unit Cost:</strong> ₹{modalContent.perUnitCost}</p>
            <p><strong>Status:</strong> {modalContent.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RequestedIPP;
