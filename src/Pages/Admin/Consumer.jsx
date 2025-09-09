import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Popconfirm,
  message,
  Input,
  Card,
  Select,
  Popover,
  Modal,
} from "antd";
import EditUser from "./Modal/EditUser";
import Notification from "./Notification";
import AssignPlanUserModal from "./Modal/AssignPlanUserModal";
import {
  deleteConsumer,
  editConsumer,
  getConsumerList,
} from "../../Redux/Admin/slices/consumerSlice";
import { useDispatch } from "react-redux";
import { EditOutlined, DeleteOutlined, SettingOutlined, CloseOutlined } from "@ant-design/icons";

const { Option } = Select;

const Consumer = () => {
  const [searchText, setSearchText] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [consumerList, setConsumerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionPopoverVisible, setActionPopoverVisible] = useState(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [notificationUser, setNotificationUser] = useState(null);
  const [assignPlanModalVisible, setAssignPlanModalVisible] = useState(false);
  const [assignPlanUser, setAssignPlanUser] = useState(null);

  const dispatch = useDispatch();

  const getList = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getConsumerList());
      if (Array.isArray(res?.payload.results)) {
        setConsumerList(res.payload.results);
      } else {
        setConsumerList([]);
        console.error("Unexpected response:", res.payload.results);
      }
    } catch (error) {
      console.error("Error fetching consumer list:", error);
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
        message.success(res.payload.detail || "Consumer deleted successfully");
        await getList();
      } else {
        message.error("Failed to delete consumer");
      }
    } catch (error) {
      message.error("Delete failed");
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

    if (res?.meta?.requestStatus === "fulfilled") {
      console.log(res);
      
      message.success("Consumer updated");
      setEditModalVisible(false);
      await getList();
    } else {
      message.error("Failed to update consumer");
    }
  };

  const handleActionClick = (record) => {
    setActionPopoverVisible(record.id);
  };

  const handleClosePopover = () => {
    setActionPopoverVisible(null);
  };

  const handleSendNotification = (record) => {
    setNotificationUser(record);
    setNotificationModalVisible(true);
    handleClosePopover();
  };

  const handleAssignPlan = (record) => {
    setAssignPlanUser(record);
    setAssignPlanModalVisible(true);
    handleClosePopover();
  };

  const filteredData = Array.isArray(consumerList)
    ? consumerList.filter((item) => {
        const lowerSearch = searchText.toLowerCase();
        const matchesSearch =
          (item.company || "").toLowerCase().includes(lowerSearch) ||
          (item.email || "").toLowerCase().includes(lowerSearch) ||
          (item.company_representative || "").toLowerCase().includes(lowerSearch);

        const matchesStatus =
          statusFilter === "all" || item.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      // .sort((a, b) => b.id - a.id)  // Sort by newest first
    : [];

  const columns = [
    {
      title: "Sr.No",
      dataIndex: "sr_no",
      key: "sr_no",
      render: (_, __, index) => index + 1,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "company_representative",
      key: "company_representative",
      // align: 'center',
    },
    {
      title: "Company Name",
      dataIndex: "company",
      key: "company",
      // align: 'center',
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      // align: 'center'
    },
    {
      title: "Phone",
      dataIndex: "mobile",
      key: "mobile",
      //  align: 'center'
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (value) => value ? "Active" : "Inactive",
    },
    {
      title: "Actions",
      key: "actions",
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
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Consumer List</h2>

      <Input
        placeholder="Search by Name, Company or Email"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
        style={{ width: 300, marginBottom: 16 }}
      />
      <Select
        placeholder="Filter by Status"
            style={{ width: 200 }}
            onChange={(value) => setStatusFilter(value)}
      >
        <Option value="Active">Active</Option>
        <Option value="Inactive">Inactive</Option>
      </Select>

      <Card style={{ borderRadius: 8 }}>
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
          initialUserType="Consumer"
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
        // You can pass recordList={consumerList} if needed for duplicate check
        recordList={consumerList}
      />
    </div>
  );
};

export default Consumer;
