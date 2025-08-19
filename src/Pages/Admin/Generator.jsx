import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Popconfirm, message, Input, Card } from 'antd';
import EditUser from './Modal/EditUser';
import { useDispatch } from 'react-redux';
import { deleteGenerator, editGenerator, getGeneratorList } from '../../Redux/Admin/slices/generatorSlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Generator = () => {
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [consumerList, setConsumerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const dispatch = useDispatch();

  const getList = async () => {
    setLoading(true);
    const res = await dispatch(getGeneratorList());
    if (res?.payload) {
      setConsumerList(res.payload);
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
    // console.log('record',record);
    const res = await dispatch(deleteGenerator(record?.id));
    // console.log('res delete',res);
    if (res?.payload) {
      message.success(res?.payload.detail || 'Consumer deleted successfully');
    }
    await getList();
  };

  const handleUpdate = async (updatedUser) => {
    setModalLoading(true);
    const data = {
      company: updatedUser?.company,
      company_representative: updatedUser?.company_representative,
      email: updatedUser?.email,
      mobile: updatedUser?.mobile,
    };

    const res = await dispatch(editGenerator({ data, id: updatedUser?.id }));
    setModalLoading(false);

    if (res?.meta?.requestStatus === 'fulfilled') {
      message.success(`Consumer updated`);
      setEditModalVisible(false);
      await getList();
    } else {
      message.error('Failed to update consumer');
    }
  };


  const filteredData = consumerList.filter((item) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      (item.company || '').toLowerCase().includes(lowerSearch) ||
      (item.email || '').toLowerCase().includes(lowerSearch)
    );
  })
  // .sort((a, b) => b.id - a.id); // Sort by ID descending (newest first)
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const columns = [
    {
      title: 'Sr.No', dataIndex: 'sr_no', key: 'sr_no',
      render: (_, __, index) => index + 1, align: 'center'
    },
    { title: 'Name', dataIndex: 'company_representative', key: 'company_representative' },
    { title: 'Company Name', dataIndex: 'company', key: 'company' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'mobile', key: 'mobile' },
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
      <h2>Generator List</h2>

      <Input
        placeholder="Search by name, email or company"
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

export default Generator;
