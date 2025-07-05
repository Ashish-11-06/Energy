import React from 'react';
import { Table, Space, Button, Popconfirm, message } from 'antd';

const Generator = () => {
  const handleEdit = (record) => {
    message.info(`Edit Generator: ${record.name}`);
    // Implement edit logic here
  };

  const handleDelete = (record) => {
    message.success(`Deleted Generator: ${record.name}`);
    // Implement delete logic here
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this Generator?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Samya K',
      email: 'samya@example.com',
      phone: '9876543210',
      city: 'Pune',
    },
    {
      key: '2',
      name: 'Ravi Sharma',
      email: 'ravi@example.com',
      phone: '9123456780',
      city: 'Mumbai',
    },
    {
      key: '3',
      name: 'Anita Mehra',
      email: 'anita@example.com',
      phone: '9988776655',
      city: 'Delhi',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Generator List</h2>
      <Table columns={columns} dataSource={data} bordered/>
    </div>
  );
};

export default Generator;
