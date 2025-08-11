import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Switch, Select, Typography, Tag, Card, Space, message, Input } from 'antd';
import AddSubscriptionModal from './Modal/AddSubscriptionModal';
import { offlineSubscription, offlineSubscriptionStatus } from '../../Redux/Admin/slices/subscriptionSlice';
import { useDispatch } from 'react-redux';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import AssignPlanUserModal from './Modal/AssignPlanUserModal';

const { Option } = Select;
const { Title } = Typography;
const { confirm } = Modal;

const OfflineSub = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isAddAssignPlan, setIsAddAssignPlan] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isDocModalVisible, setIsDocModalVisible] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [offlineUserTypeFilter, setOfflineUserTypeFilter] = useState('');
  const [offlineData, setOfflineData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOfflineData = async () => {
      setLoading(true);
      const res = await dispatch(offlineSubscription());
      console.log('Api data', res);
      
      if (res?.payload) {
        console.log('offline subscription data', res?.payload);
        setOfflineData(res.payload);
      }
      setLoading(false);
    };
    fetchOfflineData();
  }, [dispatch]);

  // Wrapper to show confirmation before updating status
const confirmUpdateStatus = (id, newStatus) => {
  confirm({
    title: `Are you sure you want to ${newStatus.toLowerCase()} this subscription?`,
    content: `This will mark the payment status as ${newStatus}.`,
    okText: 'Yes',
    cancelText: 'No',
     centered: true,
    onOk: () => updateStatus(id, newStatus),
  });
};

  const toggleStatus = (key) => {
    setOfflineData((prev) =>
      prev.map((item) =>
        item.key === key || item.id === key // support both key and id
          ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' }
          : item
      )
    );
  };

  const showDocumentModal = (url) => {
    setDocumentUrl(url);
    setIsDocModalVisible(true);
  };

  const updateStatus = async (id, newStatus) => {

    try {
      console.log('Updating', id, newStatus);
      
      const result = await dispatch(offlineSubscriptionStatus({ id, status: newStatus }));

      if (offlineSubscriptionStatus.fulfilled.match(result)) {
        setOfflineData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, payment_status: newStatus } : item
          )
        );

        message.success(result.payload.message || `Status updated to ${newStatus}`);
      } else {
        throw new Error(result.payload || 'Update failed');
      }
    } catch (error) {
      message.error(error.message || 'Something went wrong while updating status');
    }
  };


  const columns = [
    {
      title: 'Sr.No', dataIndex: 'sr_no', key: 'sr_no',
      render: (_, __, index) => index + 1, align: 'center'
    },
    { title: 'User Category', dataIndex: 'user_category' },
    { title: 'Name', dataIndex: 'user_name' },
    { title: 'Company Name', dataIndex: 'company_name' },
    { title: 'Subscription Plan', dataIndex: 'subscription_type', align: 'center',
      render: (plan) => {
              let color = '';
              if (plan?.toLowerCase() === 'lite') color = 'green';
              else if (plan?.toLowerCase() === 'pro') color = 'pink';
              else if (plan?.toLowerCase() === 'free') color = 'yellow';
              else color = 'default';
      
              return <Tag color={color}>{plan ? plan.charAt(0).toUpperCase() + plan.slice(1).toUpperCase() : 'N/A'}</Tag>;
            },
    },
    { title: 'Start Date', dataIndex: 'start_date' },
    { title: 'Ent Date', dataIndex: 'end_date' },
    { 
      title: 'Payment Status', 
      dataIndex: 'payment_status', align: 'center',
      render: (status) => {
        let color = '';
        if (status?.toLowerCase() === 'approved') color = 'green';
        else if (status?.toLowerCase() === 'rejected') color = 'red';
        else if (status?.toLowerCase() === 'pending') color = 'gold';
        else color = 'default';
        // Show capitalized status for display
        return <Tag color={color}>{status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'N/A'}</Tag>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      // render: (status, record) => (
      //   <Switch
      //     checked={status === 'Active'}
      //     onChange={() => toggleStatus(record.key ?? record.id)}
      //     checkedChildren="Active"
      //     unCheckedChildren="Inactive"
      //   />
      // ),
    },
  {
  title: 'Action',
  dataIndex: 'document',
  render: (_, record) => (
    <Space>
      {/* Approve Icon */}
      <CheckCircleOutlined
        style={{
          color: record.payment_status === 'Approved' ? 'gray' : 'green',
          cursor: record.payment_status === 'Approved' ? 'not-allowed' : 'pointer',
          pointerEvents: record.payment_status === 'Approved' ? 'none' : 'auto',
        }}
        title="Approve"
        onClick={() => confirmUpdateStatus(record.id, 'Approved')}
      />

      {/* Reject Icon */}
      <CloseCircleOutlined
        style={{
          color: record.payment_status === 'Rejected' ? 'gray' : 'red',
          cursor: record.payment_status === 'Rejected' ? 'not-allowed' : 'pointer',
          pointerEvents: record.payment_status === 'Rejected' ? 'none' : 'auto',
        }}
        title="Reject"
        onClick={() => confirmUpdateStatus(record.id, 'Rejected')}
      />
    </Space>
  ),
}

];

  const filteredOfflineData = Array.isArray(offlineData)
  
    ? offlineUserTypeFilter
      ? offlineData.filter((item) => item.user_category === offlineUserTypeFilter)
      : offlineData
    : [];
    console.log('Filtered offline data:', filteredOfflineData);


    
  const finalFilterData = filteredOfflineData.filter((item) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      (item.user_name?.toLowerCase().includes(lowerSearch) || '') ||
      (item.company_name?.toLowerCase().includes(lowerSearch) || '') ||
      (item.subscription_type?.toLowerCase().includes(lowerSearch) || '') ||
      (item.user_category?.toLowerCase().includes(lowerSearch) || '')
    );
  });

  return (
    <div style={{ padding: 24 }}>
      {/* Top Action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
          View Subscription Plans
        </Button>
        <Button type="primary" onClick={() => setIsAddAssignPlan(true)} style={{ marginLeft: 8 }}>
          Assign Plan To User
        </Button>
      </div>

      {/* Offline Subscriptions Table */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Offline Subscriptions</Title>
          <Select
            style={{ width: 240 }}
            placeholder="Filter by User Category"
            allowClear
            value={offlineUserTypeFilter || undefined}
            onChange={(value) => setOfflineUserTypeFilter(value)}
          >
            <Option value="Consumer">Consumer</Option>
            <Option value="Generator">Generator</Option>
          </Select>
        </div>
        <Input  
          placeholder="Search by name, company name, subscription type, user catagory"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 500, marginBottom: 16 }}
        />
        <Card>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={finalFilterData}
            pagination={{ pageSize: 10 }}
            loading={loading}
            bordered
            scroll={{ x: 'max-content' }}
            size="middle"
          />
      </Card>
      </div>

      {/* Add Subscription Modal */}
      {/* <Modal
        title="Add Subscription"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <p>Form goes here...</p>
      </Modal> */}

      {/* Document Preview Modal */}
      {/* <Modal
        title="Document Preview"
        open={isDocModalVisible}
        onCancel={() => setIsDocModalVisible(false)}
        footer={null}
        width={500}
        centered
      >
        <img src={documentUrl} alt="Document" style={{ width: '100%', borderRadius: 4 }} />
      </Modal> */}

      {/* Optional Custom Modal */}
      {typeof AddSubscriptionModal === 'function' && (
        <AddSubscriptionModal
          visible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
        />
      )}

       {/* Optional Custom Modal */}
      {typeof AssignPlanUserModal === 'function' && (
        <AssignPlanUserModal
          visible={isAddAssignPlan}
          onCancel={() => setIsAddAssignPlan(false)}
        />
      )}
    </div>
  );
};

export default OfflineSub;
