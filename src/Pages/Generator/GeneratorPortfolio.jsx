import React, { useState } from 'react';
import { Table, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import AddPortfolioModal from './Modal/AddPortfolioModal';

const { Title } = Typography;

const GenerationPortfolio = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const navigate = useNavigate();

  const columns = [
    {
      title: 'Sr. No',
      key: 'serialNumber',
      render: (text, record, index) => index + 1,
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
      render: (text) => `${text}`,
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
        cod: newEntry.cod.format('DD-MM-YYYY'),
        unit: newEntry.unit,
      },
    ]);
  };

  const handleFindConsumer = () => {
    navigate('/generator/matching-consumer');
  };

  return (
    <div style={{ padding: '20px' }}>
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

        <Button
          type="primary"
          style={{ marginTop: '20px' }}
          onClick={() => setIsModalVisible(true)}
        >
          Add New Entry +
        </Button>

        {dataSource.length > 0 && (
          <Button
            type="default"
            style={{ marginTop: '20px', float: 'right' }}
            onClick={handleFindConsumer}
          >
            Find Consumer
          </Button>
        )}
      </div>
    </div>
  );
};

export default GenerationPortfolio;
