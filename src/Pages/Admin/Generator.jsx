import React, { useState } from 'react';
import { Table, Space, Button, Popconfirm, message, Input } from 'antd';
import EditUser from './Modal/EditUser';

const Generator = () => {
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState([
    {
      key: '1',
      name: 'Samya K',
      company: 'Tech Solutions',
      email: 'samya@example.com',
      phone: '9876543210',
      city: 'Pune',
    },
    {
      key: '2',
      name: 'Ravi Sharma',
      company: 'Green Solutions',
      email: 'ravi@example.com',
      phone: '9123456780',
      city: 'Mumbai',
    },
    {
      key: '3',
      name: 'Anita Mehra',
      company: 'Eco Innovations',
      email: 'anita@example.com',
      phone: '9988776655',
      city: 'Delhi',
    },
  ]);

  const handleEdit = (record) => {
    setSelectedUser(record);
    setEditModalVisible(true);
  };

  const handleDelete = (record) => {
    setData((prev) => prev.filter((item) => item.key !== record.key));
    message.success(`Deleted Generator: ${record.name}`);
  };

  const handleUpdate = (updatedUser) => {
    setData((prev) =>
      prev.map((item) => (item.key === updatedUser.key ? updatedUser : item))
    );
    message.success(`Updated Generator: ${updatedUser.name}`);
    setEditModalVisible(false);
  };

  const filteredData = data.filter((item) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      item.name.toLowerCase().includes(lowerSearch) ||
      item.city.toLowerCase().includes(lowerSearch)
    );
  });

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', align: 'center' },
  { title: 'Company Name', dataIndex: 'company', key: 'company', align: 'center' },
  { title: 'Email', dataIndex: 'email', key: 'email', align: 'center' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone', align: 'center' },
  { title: 'City', dataIndex: 'city', key: 'city', align: 'center' },
  {
    title: 'Actions',
    key: 'actions',
    align: 'center',
    render: (_, record) => (
      <Space size="middle">
        <Button type="primary" onClick={() => handleEdit(record)}>
          Edit
        </Button>
        <Popconfirm
          title="Are you sure to delete this Consumer?"
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

  return (
    <div style={{ padding: 24 }}>
      <h2>Generator List</h2>

      <Input
        placeholder="Search by Name or City"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
        style={{ width: 300, marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        bordered
        pagination={{ pageSize: 10 }}
         style={{ textAlign: 'center' }}
      />

      {/* Edit Modal */}
      <EditUser
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onUpdate={handleUpdate}
        userData={selectedUser}
      />
    </div>
  );
};

export default Generator;
