import React, { useState } from 'react';
import { Table, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import AddPortfolioModal from '../../Modals/Generator/AddPortfolioModal';
const { Title } = Typography;

const GenerationPortfolio = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([ 
    // Initial data if needed
  ]);

  const navigate = useNavigate(); // Initialize navigate function

  const columns = [
    {
      title: 'S.No', // Serial Number column
      key: 'serialNumber',
      render: (text, record, index) => index + 1, // Display row index + 1 for serial number
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (text) => `${text}`, // Just display the numeric capacity
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      render: (text) => `${text}`, // Display the unit (MW or GW)
    },
    {
      title: 'COD (Commercial Operation Date)',
      dataIndex: 'cod',
      key: 'cod',
    },
  ];

  const handleAddEntry = (newEntry) => {
    setDataSource((prev) => [
      ...prev,
      {
        key: Date.now().toString(),
        ...newEntry,
        cod: newEntry.cod.format('YYYY-MM-DD'),
        unit: newEntry.unit, // Save the selected unit in the data source
      },
    ]);
  };

  const handleFindConsumer = () => {
    navigate('/generator/matching-consumer'); // Navigate to the consumer page (update this path as needed)
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f9'}}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Title level={2} style={{ textAlign: 'center' }}>
          Available Generation Portfolio
        </Title>

        <Table dataSource={dataSource} columns={columns} pagination={false} bordered />
        
        <AddPortfolioModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAdd={handleAddEntry}
        />

        <Button type="primary" style={{ marginTop: '20px' }} onClick={() => setIsModalVisible(true)}>
          Add New Entry +
        </Button>

        <Button
          type="default"
          style={{ marginTop: '20px', float: 'right',}} // Added margin for spacing
          onClick={handleFindConsumer}
        >
          Find Consumer
        </Button>
      </div>
    </div>
  );
};

export default GenerationPortfolio;
