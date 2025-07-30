import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, Table, Typography, Space, Switch, Card } from 'antd';
import AddSubscriptionModal from './Modal/AddSubscriptionModal'; // Optional
import { onlineSubscription } from '../../Redux/Admin/slices/subscriptionSlice';
import { useDispatch } from 'react-redux';

const { Option } = Select;
const { Title } = Typography;

const OnlineSub = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDocModalVisible, setIsDocModalVisible] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [onlineUserTypeFilter, setOnlineUserTypeFilter] = useState('');
  const dispatch = useDispatch();
  const [onlineData, setOnlineData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const onlineData = async () => {
      setLoading(true);
      const res = await dispatch(onlineSubscription());
      console.log('online subscription data', res);
      if (res?.payload) {
        setOnlineData(res?.payload);
        setLoading(false);
      }
    }
    onlineData();
  }, [dispatch])

  // const [onlineData, setOnlineData] = useState([
  //   {
  //     key: '1',
  //     srNo: 1,
  //     userType: 'Consumer',
  //     name: 'Alice',
  //     companyName: 'InnoTech',
  //     siteName: 'Factory A',
  //     subscriptionPlan: 'PRO',
  //     enrollDate: '05-01-2024',
  //     expiryDate: '05-01-2025',
  //     status: true,
  //   },
  //   {
  //     key: '2',
  //     srNo: 2,
  //     userType: 'Generator',
  //     name: 'Bob',
  //     companyName: 'GreenPower',
  //     siteName: 'Solar Farm',
  //     subscriptionPlan: 'LITE',
  //     enrollDate: '10-01-2024',
  //     expiryDate: '10-01-2025',
  //     status: false,
  //   },
  // ]);

  const toggleStatus = (key) => {
    setOnlineData((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
            ...item,
            status: item.status === 'Active' ? 'Inactive' : 'Active',
          }
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
    { title: 'End Date', dataIndex: 'end_date' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status, record) => (
        <Switch
          checked={status === 'Active'}
          onChange={(checked) =>
            toggleStatus(record.key, checked ? 'Active' : 'Inactive')
          }
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    }

  ];


  const filteredOnlineData = onlineUserTypeFilter
    ? onlineData.filter((item) => item.user_category === onlineUserTypeFilter)
    : onlineData;

  return (
    <div style={{ padding: 24 }}>
      {/* Top Right Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
          View Subscription Plans
        </Button>
      </div>

      {/* Online Subscriptions Section */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <Title level={4} style={{ margin: 0 }}>Online Subscriptions</Title>
          <Select
            style={{ width: 240 }}
            placeholder="Filter by User Category"
            allowClear
            value={onlineUserTypeFilter || undefined}
            onChange={setOnlineUserTypeFilter}
          >
            <Option value="Consumer">Consumer</Option>
            <Option value="Generator">Generator</Option>
          </Select>
        </div>
        <Card
          style={{ borderRadius: 8 }}
        >
          <Table
            columns={columns}
            dataSource={filteredOnlineData}
            pagination={{ pageSize: 10 }}
            bordered
            loading={loading}
            scroll={{ x: 'max-content' }}
            size="middle"
          />
        </Card>

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

      {/* Conditional Custom Modal */}
      {typeof AddSubscriptionModal === 'function' && (
        <AddSubscriptionModal
          visible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
        />
      )}
    </div>
  );
};

export default OnlineSub;
