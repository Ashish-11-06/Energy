import React, { useEffect, useState } from 'react';
import {
  Table,
  Space,
  Button,
  Popconfirm,
  message,
  Input,
  Card,
  Popover,
  Modal,
} from 'antd';
import EditUser from './Modal/EditUser';
import AssignPlanUserModal from './Modal/AssignPlanUserModal';
import Notification from "./Notification";
import { useDispatch } from 'react-redux';
import { deleteGenerator, editGenerator, getGeneratorList } from '../../Redux/Admin/slices/generatorSlice';
import { CloseOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';

const Generator = () => {
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [consumerList, setConsumerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [actionPopoverVisible, setActionPopoverVisible] = useState(null);
  const [assignPlanModalVisible, setAssignPlanModalVisible] = useState(false);
  const [assignPlanUser, setAssignPlanUser] = useState(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [notificationUser, setNotificationUser] = useState(null);
  const dispatch = useDispatch();

  const getList = async () => {
    setLoading(true);
    const res = await dispatch(getGeneratorList());
    if (res?.payload) {
      setConsumerList(res.payload.results);
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

  const handleActionClick = (record) => {
    setActionPopoverVisible(record.id);
  };

  const handleClosePopover = () => {
    setActionPopoverVisible(null);
  };

  const handleAssignPlan = (record) => {
    setAssignPlanUser({ ...record, fromGeneratorPage: true });
    setAssignPlanModalVisible(true);
    handleClosePopover();
  };

  const handleSendNotification = (record) => {
    setNotificationUser(record);
    setNotificationModalVisible(true);
    handleClosePopover();
  };

  // Fix: Ensure consumerList is always an array
  const filteredData = Array.isArray(consumerList)
    ? consumerList.filter((item) => {
        const lowerSearch = searchText.toLowerCase();
        return (
          (item.company || '').toLowerCase().includes(lowerSearch) ||
          (item.email || '').toLowerCase().includes(lowerSearch)
        );
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    : [];

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
       <Popover
          content={
            <div style={{ position: "relative", minWidth: 160 }}>
              <CloseOutlined
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  color: "#669800",
                  cursor: "pointer",
                  fontSize: 16,
                  zIndex: 2,
                }}
                onClick={handleClosePopover}
              />
              <Space direction="vertical" style={{ marginTop: 24 }}>
                <Button type="link" style={{ color: "#fff", background: "#669800", borderRadius: 4 }}
                  onClick={() => { handleEdit(record); handleClosePopover(); }}>Edit</Button>
                <Button type="link" style={{ color: "#fff", background: "#669800", borderRadius: 4 }}
                  onClick={() => handleSendNotification(record)}>Send Notification</Button>
                <Button type="link" style={{ color: "#fff", background: "#669800", borderRadius: 4 }}
                  onClick={() => handleAssignPlan(record)}>Assign Plan</Button>
              </Space>
            </div>
          }
          trigger="click"
          open={actionPopoverVisible === record.id}
          onOpenChange={(visible) => {
            if (visible) handleActionClick(record);
            else handleClosePopover();
          }}
          placement="bottom"
        >
          <SettingOutlined style={{ color: "#669800", cursor: "pointer", fontSize: 18 }} />
        </Popover>
      ),
      align: "center",
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

      <Card style={{ borderRadius: 8 }}>
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
      {/* Notification Modal */}
      <Modal
        open={notificationModalVisible}
        footer={null}
        onCancel={() => setNotificationModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Notification
          isModal={true}
          onClose={() => setNotificationModalVisible(false)}
          initialUserType="Generator"
          initialUserNumber="single_user"
          initialSelectedUser={notificationUser?.id}
        />
      </Modal>
      {/* Assign Plan Modal */}
      <AssignPlanUserModal
        visible={assignPlanModalVisible}
        onCancel={() => setAssignPlanModalVisible(false)}
        record={assignPlanUser}
        mode="add"
        onUpdate={getList}
        recordList={consumerList}
      />
    </div>
  );
};

export default Generator;
