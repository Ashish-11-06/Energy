import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Popconfirm, message, Input, Card } from 'antd';
import EditUser from './Modal/EditUser';
import {
  deleteConsumer,
  editConsumer,
  getConsumerList,
} from '../../Redux/Admin/slices/consumerSlice';
import { useDispatch } from 'react-redux';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Consumer = () => {
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [consumerList, setConsumerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const dispatch = useDispatch();

  const getList = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getConsumerList());
      if (Array.isArray(res?.payload)) {
        setConsumerList(res.payload);
      } else {
        setConsumerList([]);
        console.error('Unexpected response:', res.payload);
      }
    } catch (error) {
      console.error('Error fetching consumer list:', error);
      setConsumerList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, [dispatch]);

  const handleEdit = (record) => {
    setSelectedUser(record);
    setEditModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      const res = await dispatch(deleteConsumer(record?.id));
      if (res?.payload) {
        message.success(res.payload.detail || 'Consumer deleted successfully');
        await getList();
      } else {
        message.error('Failed to delete consumer');
      }
    } catch (error) {
      message.error('Delete failed');
    }
  };

  const handleUpdate = async (updatedUser) => {
    setModalLoading(true);
    const data = {
      company: updatedUser?.company,
      company_representative: updatedUser?.company_representative,
      email: updatedUser?.email,
      mobile: updatedUser?.mobile,
    };

    const res = await dispatch(editConsumer({ data, id: updatedUser?.id }));
    setModalLoading(false);

    if (res?.meta?.requestStatus === 'fulfilled') {
      message.success('Consumer updated');
      setEditModalVisible(false);
      await getList();
    } else {
      message.error('Failed to update consumer');
    }
  };

  const filteredData = Array.isArray(consumerList)
    ? consumerList.filter((item) => {
      const lowerSearch = searchText.toLowerCase();
      return (
        (item.company || '').toLowerCase().includes(lowerSearch) ||
        (item.email || '').toLowerCase().includes(lowerSearch)
      );
    })
    : [];

  const columns = [
    {
      title: 'Sr.No', dataIndex: 'sr_no', key: 'sr_no',
      render: (_, __, index) => index + 1, align: 'center'
    },
    {
      title: 'Name',
      dataIndex: 'company_representative',
      key: 'company_representative',
      // align: 'center',
    },
    {
      title: 'Company Name',
      dataIndex: 'company',
      key: 'company',
      // align: 'center',
    },
    {
      title: 'Email', dataIndex: 'email', key: 'email',
      // align: 'center'
    },
    {
      title: 'Phone', dataIndex: 'mobile', key: 'mobile',
      //  align: 'center' 
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ color: '#669800', cursor: 'pointer' }}
          />
          <Popconfirm
            title="Are you sure to delete this Consumer?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        </Space>
      ),
    }

  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Consumer List</h2>

      <Input
        placeholder="Search by Company or Email"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
        style={{ width: 300, marginBottom: 16 }}
      />

      <Card
        style={{ borderRadius: 8 }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          bordered
          loading={loading}
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>

      <EditUser
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onUpdate={handleUpdate}
        userData={selectedUser}
        loading={modalLoading}
      />
    </div>
  );
};

export default Consumer;
