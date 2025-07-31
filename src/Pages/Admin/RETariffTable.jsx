import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AddEditRETarrifModal from './Modal/AddEditRETarrifModal';
import RETariffApi from '../../Redux/Admin/api/RETariffApi';

const { Title } = Typography;

const RETariffTable = () => {
  const [data, setData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [mode, setMode] = useState('add');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await RETariffApi.getData();
      if (response.status === 200) {
        setData(response.data);
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

  const openAddModal = () => {
    setEditRecord(null);
    setMode('add');
    setModalVisible(true);
  };

  const openEditModal = (record) => {
    setEditRecord(record);
    setMode('edit');
    setModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      const res = await RETariffApi.deleteData(record.id);
      if (res.status === 200) {
        message.success('Deleted successfully');
        fetchData();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Delete failed');
    }
  };

  const handleFormSubmit = (values) => {
    if (mode === 'edit') {
      setData((prev) =>
        prev.map((item) => (item.id === editRecord.id ? { ...item, ...values } : item))
      );
      message.success('Updated successfully');
    } else {
      const newId = Math.max(0, ...data.map((d) => d.id)) + 1;
      setData((prev) => [...prev, { id: newId, ...values }]);
      message.success('Added successfully');
    }
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
        <Space size="middle">
          <EditOutlined
            onClick={() => openEditModal(record)}
            style={{ color: '#669800', cursor: 'pointer' }}
          />
          <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Industry-wise RE Tariff & Savings
        </Title>
        <Button type="primary" onClick={openAddModal}>
          Add Data
        </Button>
      </div>
      <Card>
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>

      <AddEditRETarrifModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
        mode={mode}
        initialValues={editRecord}
      />
    </div>
  );
};

export default RETariffTable;
