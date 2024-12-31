import React from 'react';
import { Table } from 'antd';
import 'antd/dist/reset.css';

const Offer = () => {
  // Array of offers sent by generators
  const offers = [
    { id: 1, generator: 'IPP 1', tariff: '$0.10/kWh', duration: '12 months' },
    { id: 2, generator: 'IPP 2', tariff: '$0.08/kWh', duration: '6 months' },
    { id: 3, generator: 'IPP 3', tariff: '$0.09/kWh', duration: '24 months' },
    { id: 4, generator: 'IPP 4', tariff: '$0.07/kWh', duration: '18 months' },
    { id: 5, generator: 'IPP 5', tariff: '$0.10/kWh', duration: '12 months' },
    { id: 6, generator: 'IPP 6', tariff: '$0.08/kWh', duration: '6 months' },
    { id: 7, generator: 'IPP 7', tariff: '$0.09/kWh', duration: '24 months' },
    { id: 8, generator: 'IPP 8', tariff: '$0.07/kWh', duration: '18 months' },
    { id: 9, generator: 'IPP 9', tariff: '$0.07/kWh', duration: '18 months' },
    { id: 10, generator: 'IPP 10', tariff: '$0.10/kWh', duration: '12 months' },
    { id: 11, generator: 'IPP 11', tariff: '$0.08/kWh', duration: '6 months' },
    { id: 12, generator: 'IPP 12', tariff: '$0.09/kWh', duration: '24 months' },
    { id: 13, generator: 'IPP 13', tariff: '$0.07/kWh', duration: '18 months' },
  ];

  // Columns for the Ant Design table
  const columns = [
    {
      title: 'Generator',
      dataIndex: 'generator',
      key: 'generator',
      align: 'center',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Tariff',
      dataIndex: 'tariff',
      key: 'tariff',
      align: 'center',
      render: (text) => <span style={{ color: '#52c41a' }}>{text}</span>,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      align: 'center',
    },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#52c41a' }}>Available Tariff Offers</h1>
      <Table 
        dataSource={offers.map((offer) => ({ ...offer, key: offer.id }))} 
        columns={columns} 
        bordered 
        pagination={{ pageSize: 10, position: ['bottomCenter'] }}
        style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', backgroundColor: 'white', borderRadius: '8px' }}
      />
    </div>
  );
};

export default Offer;
