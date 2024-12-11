import React, { useState } from 'react';
import { Table, Button, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported
import RequirenmentForm from './Modal/RequirenmentForm'; // Import the RequirenmentForm component

const RequirementsPage = () => {
  const [requirements, setRequirements] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Define columns for the table
  const columns = [
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Procurement Date',
      dataIndex: 'procurement',
      key: 'procurement',
      render: (date) => (date ? date.format('DD-MM-YYYY') : ''),
    },
  ];

  // Show modal to add new requirement
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Close the modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle form submission
  const handleSubmit = (values) => {
    console.log('Form Values: ', values);
    // Add new requirement to the table
    setRequirements([
      ...requirements,
      {
        key: requirements.length + 1,
        ...values,
        procurement: values.procurement ? values.procurement : null,
      },
    ]);
    setIsModalVisible(false);
    message.success('Requirement added successfully!');
  };

  // Handle Clear All
  const handleClearAll = () => {
    setRequirements([]);
    message.success('All requirements have been cleared!');
  };

  // Handle Continue and navigate to next page with data
  const handleContinue = () => {
    if (requirements.length > 0) {
      navigate('/matching-ipp', { state: { requirements } }); // Navigate to next page and pass the requirements data
    } else {
      message.error('Please add at least one requirement before continuing.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Requirements Table</h2>

      <Table
        columns={columns}
        dataSource={requirements}
        pagination={false} // Disable pagination for simplicity
        bordered
      />

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }} justify="center">
        <Col>
          <Button type="primary" onClick={showModal} style={{ width: 160 }}>
            Add Requirement +
          </Button>
        </Col>
        <Col>
          <Button
            type="danger"
            onClick={handleClearAll}
            style={{ width: 160 }}
            disabled={requirements.length === 0} // Disable button if no requirements
          >
            Clear All
          </Button>
        </Col>
        <Col>
          <Button
            type="default"
            onClick={handleContinue}
            style={{ width: 160 }}
            disabled={requirements.length === 0} // Disable if no requirements have been added
          >
            Continue
          </Button>
        </Col>
      </Row>

      {/* Modal for adding new requirement */}
      <RequirenmentForm
        isVisible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default RequirementsPage;
