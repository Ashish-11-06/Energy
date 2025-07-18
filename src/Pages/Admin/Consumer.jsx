import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Popconfirm, message, Input } from 'antd';
import EditUser from './Modal/EditUser';
import { deleteConsumer, editConsumer, getConsumerList } from '../../Redux/Admin/slices/consumerSlice';
import { useDispatch } from 'react-redux';

const Consumer = () => {
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [consumerList, setConsumerList] = useState([]);
  const [loading,setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false); 
  const dispatch = useDispatch();

  const getList = async () => {
    setLoading(true);
    const res = await dispatch(getConsumerList());
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
    console.log('record',record);
    const res=await dispatch(deleteConsumer(record?.id));
    console.log('res delete',res);
    if(res?.payload) {
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

  const res = await dispatch(editConsumer({ data, id: updatedUser?.id }));
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
  });

  const columns = [
    { title: 'Name', dataIndex: 'company_representative', key: 'company_representative', align: 'center' },
    { title: 'Company Name', dataIndex: 'company', key: 'company', align: 'center' },
    { title: 'Email', dataIndex: 'email', key: 'email', align: 'center' },
    { title: 'Phone', dataIndex: 'mobile', key: 'mobile', align: 'center' },
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
      <h2>Consumer List</h2>

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
        loading={loading}
        pagination={{ pageSize: 10 }}
        size="small"
      />

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
