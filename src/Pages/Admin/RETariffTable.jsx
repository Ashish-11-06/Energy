import React, { useState } from 'react';
import { Table, Button, Space, Typography } from 'antd';

const { Title } = Typography;

const RETariffTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      industry: 'Materials',
      re_tariff: 3.4,
      average_savings: 20000000.0,
    },
  ]);

  const handleEdit = (record) => {
    console.log('Edit', record);
    // Open edit modal here
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const columns = [
    { title: 'Industry', dataIndex: 'industry', key: 'industry' },
    { title: 'RE Tariff (₹/kWh)', dataIndex: 're_tariff', key: 're_tariff' },
    {
      title: 'Average Savings (₹)',
      dataIndex: 'average_savings',
      key: 'average_savings',
      render: (value) => value.toLocaleString('en-IN'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger type="link" onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Industry-wise RE Tariff & Savings</Title>
        <Button type="primary" onClick={() => console.log('Open Add Modal')}>Add Data</Button>
      </div>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        bordered
        pagination={false}
      />
    </div>
  );
};

export default RETariffTable;
