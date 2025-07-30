import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Switch, Select, Typography } from 'antd';
import AddSubscriptionModal from './Modal/AddSubscriptionModal';
import { offlineSubscription } from '../../Redux/Admin/slices/subscriptionSlice';
import { useDispatch } from 'react-redux';

const { Option } = Select;
const { Title } = Typography;

const OfflineSub = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
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
      if (res?.payload) {
        setOfflineData(res.payload);
      }
      setLoading(false);
    };
    fetchOfflineData();
  }, [dispatch]);

  const toggleStatus = (key) => {
    setOfflineData((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' }
          : item
      )
    );
  };

  const showDocumentModal = (url) => {
    setDocumentUrl(url);
    setIsDocModalVisible(true);
  };

  const columns = [
    {
      title: 'Sr. No',
      render: (text, record, index) => index + 1,
    },
    { title: 'User Category', dataIndex: 'user_category' },
    { title: 'Name', dataIndex: 'user_name' },
    { title: 'Company Name', dataIndex: 'company_name' },
    { title: 'Subscription Plan', dataIndex: 'subscription_type' },
    { title: 'Start Date', dataIndex: 'start_date' },
    { title: 'Ent Date', dataIndex: 'end_date' },
    { title: 'Payment Status', dataIndex: 'payment_status' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status, record) => (
        <Switch
          checked={status === 'Active'}
          onChange={() => toggleStatus(record.key)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: 'View Document',
      dataIndex: 'document',
      render: (url) => (
        <Button onClick={() => showDocumentModal(url)}>View</Button>
      ),
    },
  ];

  const filteredOfflineData = Array.isArray(offlineData)
    ? offlineUserTypeFilter
      ? offlineData.filter((item) => item.user_category === offlineUserTypeFilter)
      : offlineData
    : [];

  return (
    <div style={{ padding: 24 }}>
      {/* Top Action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
          View Subscription Plans
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
        <Table
          columns={columns}
          dataSource={filteredOfflineData}
          pagination={{ pageSize: 10 }}
          loading={loading}
          bordered
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </div>

      {/* Add Subscription Modal */}
      <Modal
        title="Add Subscription"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <p>Form goes here...</p>
      </Modal>

      {/* Document Preview Modal */}
      <Modal
        title="Document Preview"
        open={isDocModalVisible}
        onCancel={() => setIsDocModalVisible(false)}
        footer={null}
        width={500}
        centered
      >
        <img src={documentUrl} alt="Document" style={{ width: '100%', borderRadius: 4 }} />
      </Modal>

      {/* Optional Custom Modal */}
      {typeof AddSubscriptionModal === 'function' && (
        <AddSubscriptionModal
          visible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
        />
      )}
    </div>
  );
};

export default OfflineSub;
