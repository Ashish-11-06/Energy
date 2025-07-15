import React, { useState } from 'react';
import { Table, Space, Button, Popconfirm, message, Input } from 'antd';
import EditUser from './Modal/EditUser';
import ConsumptionUnitModal from './Modal/ConsumptionUnitModal';
import MonthData from './Modal/MonthData';

const DemandData = () => {
  const [searchText, setSearchText] = useState('');
  const [viewModal, setViewModal] = useState(false);
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
      voltage_level: '11 kV',
      annual_electricity_consumption: '120 MWh',
      expected_date: '2023-12-01',
    },
    {
      key: '2',
      cid: 'CUD2345',
      site_name: 'Green Solutions',
      industry: 'Consumer Discretionary',
      phone: '9123456780',
      city: 'Mumbai',
      contracted_demand: '150 kW',
      tariff_category: 'Commercial',
      voltage_level: '33 kV',
      annual_electricity_consumption: '120 MWh',
      expected_date: '2023-12-01',
    },
    {
      key: '3',
      cid: 'CUD6789',
      site_name: 'Eco Innovations',
      industry: 'Financials',
      phone: '9988776655',
      city: 'Delhi',
      contracted_demand: '100 kW',
      tariff_category: 'Commercial',
      voltage_level: '66 kV',
      annual_electricity_consumption: '120 MWh',
      expected_date: '2023-12-01',
    },
  ]);

  const handleView = (record) => {
    console.log('handle view called');
    console.log('record is ', record);
    setSelectedUser(record);
    setViewModal(true);
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
          <Button type="primary" onClick={() => handleView(record)}>
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
        size='small'
      />

      {/* view Modal */}
      <MonthData
        open={viewModal}
        onCancel={() => setViewModal(false)}
        // onUpdate={handleUpdate}
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
