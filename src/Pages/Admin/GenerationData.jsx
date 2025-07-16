import React, { useState } from 'react';
import { Table, Space, Button, Input } from 'antd';
import * as XLSX from 'xlsx'; // Import xlsx for Excel export
import GenerationModal from './Modal/GenerationModal';

const GenerationData = () => {
  const [searchText, setSearchText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [data] = useState([
    {
      key: '1',
      gen_id: 'GEN1234',
      site_name: 'Tech Solutions',
      technology: 'Solar',
      connectivity: 'CTU',
      available_capacity: '120 kW',
      total_install_capacity: '150 kW',
      capital_cost: 100,
      expected_tariff: 5,
      annual_generation: '120 MWh',
      expected_date: '2023-12-01',
    },
    {
      key: '2',
      gen_id: 'GEN2345',
      site_name: 'Green Solutions',
      technology: 'Wind',
      connectivity: 'STU',
      available_capacity: '120 kW',
      total_install_capacity: '150 kW',
      capital_cost: 100,
      expected_tariff: 5,
      annual_generation: '120 MWh',
      expected_date: '2023-12-01',
    },
    {
      key: '3',
      gen_id: 'GEN6789',
      site_name: 'Eco Innovations',
      technology: 'ESS',
      connectivity: 'STU',
      available_capacity: '120 kW',
      total_install_capacity: '150 kW',
      capital_cost: 100,
      expected_tariff: 5,
      annual_generation: '120 MWh',
      expected_date: '2023-12-01',
    },
  ]);

  // Filter records by site_name or industry (optional field)
  const filteredData = data.filter((item) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      item.site_name.toLowerCase().includes(lowerSearch) ||
      (item.industry?.toLowerCase().includes(lowerSearch) ?? false)
    );
  });

  const handleConsumptionUnitClick = (record) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRecord(null);
  };

  // ✅ Export selected record to Excel
  const downloadExcel = (record) => {
    const worksheet = XLSX.utils.json_to_sheet([record]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Generation Data');
    XLSX.writeFile(workbook, `${record.site_name}_details.xlsx`);
  };

  const columns = [
    { title: 'Generator ID', dataIndex: 'gen_id', key: 'cid', align: 'center' },
    {
      title: 'Site Name',
      dataIndex: 'site_name',
      key: 'site_name',
      align: 'center',
      render: (_, record) => (
        <p
          type="link"
          onClick={() => handleConsumptionUnitClick(record)}
          style={{ color: 'rgb(154, 132, 6)', cursor: 'pointer' }}
        >
          {record.site_name}
        </p>
      ),
    },
    { title: 'Technology', dataIndex: 'technology', key: 'technology', align: 'center' },
    { title: 'Connectivity', dataIndex: 'connectivity', key: 'connectivity', align: 'center' },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => downloadExcel(record)}>Download</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Generation Data List</h2>

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

      <GenerationModal open={modalOpen} onClose={handleModalClose} record={selectedRecord} />
    </div>
  );
};

export default GenerationData;
