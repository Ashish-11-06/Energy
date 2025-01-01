import React, { useState } from 'react';
import { Table, Button, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import RequirenmentForm from './Modal/RequirenmentForm';

const RequirementsPage = () => {
  const [requirements, setRequirements] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Track selected row keys
  const navigate = useNavigate();

  // Define columns for the table (Remove selection column)
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
      title: 'Contracted Demand (kWh)',
      dataIndex: 'contractedDemand',
      key: 'ContractedDemand',
    },
    
    {
      title: 'Tarrif Category',
      dataIndex: 'tariffCategory',
      key: 'tariffCategory',
    },
    {
      title: 'Voltage Level',
      dataIndex: 'voltageLevel',
      key: 'voltageLevel',
    },
    {
      title: 'Procurement Date',
      dataIndex: 'procurement',
      key: 'procurement',
      render: (date) => (date ? date.format('DD-MM-YYYY') : ''),
    },
    
  ];

  // Add a selection column for row selection (Remove radio button column)
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys); // Update selected row keys when selection changes
    },
    type: 'radio', // Single selection (radio button)
  };

  // Handle row selection when the radio button is clicked
  const handleRowSelect = (key) => {
    setSelectedRowKeys([key]); // Only allow single selection
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values) => {
    console.log('Form Values: ', values);
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

  const handleClearAll = () => {
    setRequirements([]);
    setSelectedRowKeys([]); // Clear the selected row when clearing all requirements
    message.success('All requirements have been cleared!');
  };

  const handleContinue = () => {
    if (selectedRowKeys.length === 1) {
      const selectedRequirement = requirements.find(
        (req) => req.key === selectedRowKeys[0]
      );
      navigate('/consumer/matching-ipp', { state: { selectedRequirement } }); // Pass the selected requirement to the next page
    } else {
      message.error('Please select a single requirement before continuing.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
     <h2 style={{ textAlign: 'center' }}>Consumption Unit</h2>

      <Table
        columns={columns}
        dataSource={requirements}
        pagination={false}
        bordered
        rowSelection={rowSelection} // Apply row selection to the table
        onRow={(record) => ({
          onClick: () => handleRowSelect(record.key), // Make entire row clickable
        })}
      />

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }} justify="center">
        <Col>
          <Button type="primary" onClick={showModal} style={{ width: 160 }}>
            Add Requirement +
          </Button>
        </Col>
        <Col>
          {/* <Button
            type="danger"
            onClick={handleClearAll}
            style={{ width: 160 }}
            disabled={requirements.length === 0}
          >
            Clear All
          </Button> */}
        </Col>
        <Col>
          <Button
            type="default"
            onClick={handleContinue}
            style={{ width: 160 }}
            disabled={selectedRowKeys.length !== 1} // Disable "Continue" if no row is selected or more than one row is selected
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
