import React, { useState } from 'react';
import { Table, Space, Button, Popconfirm, message, Input } from 'antd';
import EditUser from './Modal/EditUser';
import ConsumptionUnitModal from './Modal/ConsumptionUnitModal';

const DemandData = () => {
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
   const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState([
    {
      key: '1',
      cid: 'CUD1234',
      site_name: 'Tech Solutions',
      industry: 'Information Technology',
      phone: '9876543210',
      city: 'Pune',
      contracted_demand: '100 kW',
      tariff_category: 'Commercial',
    },
    {
      key: '2',
      cid: 'CUD2345',
      site_name: 'Green Solutions',
      industry: 'Consumer Discretionary',
      phone: '9123456780',
      city: 'Mumbai',
    },
    {
      key: '3',
      cid: 'CUD6789',
      site_name: 'Eco Innovations',
      industry: 'Financials',
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
    message.success(`Deleted DemandData: ${record.name}`);
  };

  const handleUpdate = (updatedUser) => {
    setData((prev) =>
      prev.map((item) => (item.key === updatedUser.key ? updatedUser : item))
    );
    message.success(`Updated DemandData: ${updatedUser.name}`);
    setEditModalVisible(false);
  };

  const filteredData = data.filter((item) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      item.site_name.toLowerCase().includes(lowerSearch) ||
      item.industry.toLowerCase().includes(lowerSearch)
    );
  });

 const handleConsumptionUnitClick = (record) => {
    console.log('record is ',record);
    
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRecord(null);
  };

  const columns = [
    { title: 'Consumer ID', dataIndex: 'cid', key: 'cid', align: 'center' },
    {
      title: 'Consumption Unit',
      dataIndex: 'site_name',
      key: 'site_name',
      align: 'center',
      render: (_, record) => (
        <p type="link" onClick={() => handleConsumptionUnitClick(record)} style={{ color: 'rgb(154, 132, 6)', cursor: 'pointer' }}>
          {record.site_name}
        </p>
      ),
    },
    { title: 'Industry', dataIndex: 'industry', key: 'industry', align: 'center' },
    {
      title: '12 Month Demand Data',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            View
          </Button>
        </Space>
      ),
    },
  ];



  return (
    <div style={{ padding: 24 }}>
      <h2>DemandData List</h2>

      <Input
        placeholder="Search by consumption Unit or Industry"
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
        rowKey="cid"
      />

      {/* Edit Modal */}
      <EditUser
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onUpdate={handleUpdate}
        userData={selectedUser}
      />
      <ConsumptionUnitModal
        open={modalOpen}
        onClose={handleModalClose}
        record={selectedRecord}
      />
    </div>
  );
};

export default DemandData;
