import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Popconfirm, message, Input, Card } from 'antd';
import EditUser from './Modal/EditUser';
import ConsumptionUnitModal from './Modal/ConsumptionUnitModal';
import MonthData from './Modal/MonthData';
import demandDataApi from '../../Redux/Admin/api/demandDataApi';

const DemandData = () => {
  const [searchText, setSearchText] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await demandDataApi.getData();
      if (response.status === 200) {
        setData(response.data.results);
      } else {
        message.error('Failed to fetch data');
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleView = (record) => {
    setSelectedUser(record);
    setViewModal(true);
  };

  // Fix: Ensure data is always an array before using filter
  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        const lowerSearch = searchText.toLowerCase();
        return (
          (item.consumption_unit?.toLowerCase().includes(lowerSearch) || '') ||
          (item.industry?.toLowerCase().includes(lowerSearch) || '') ||
          (item.state?.toLowerCase().includes(lowerSearch) || '')
        );
      })
    : [];

  const handleConsumptionUnitClick = (record) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRecord(null);
  };

  const columns = [
    {
      title: 'Sr.No.',
      dataIndex: 'sr_no',
      key: 'sr_no',
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    // {
    //   title: 'Consumer ID',
    //   dataIndex: 'username',
    //   key: 'username',
    //   align: 'center',
    // },
    {
      title: 'Consumption Unit',
      dataIndex: 'consumption_unit',
      key: 'consumption_unit',
      align: 'center',
      render: (_, record) => (
        <p type="link" onClick={() => handleConsumptionUnitClick(record)} style={{ color: 'rgb(154, 132, 6)', cursor: 'pointer' }}>
          {record.consumption_unit}
        </p>
      ),
    },
    {title: 'State', dataIndex: 'state', key: 'state', align: 'center'},
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
        placeholder="Search by consumption Unit, State, Industry"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
        style={{ width: 400, marginBottom: 16 }}
      />
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          bordered
          pagination={{ pageSize: 10 }}
          rowKey="id"
          size="small"
          loading={loading}
        />
      </Card>
      {/* view Modal */}
      <MonthData
        open={viewModal}
        onCancel={() => setViewModal(false)}
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
