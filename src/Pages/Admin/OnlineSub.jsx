import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Switch, Select } from 'antd';
import AddSubscriptionModal from './Modal/AddSubscriptionModal'; // Optional
import { onlineSubscription } from '../../Redux/Admin/slices/subscriptionSlice';
import { useDispatch } from 'react-redux';

const { Option } = Select;

const OnlineSub = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDocModalVisible, setIsDocModalVisible] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [onlineUserTypeFilter, setOnlineUserTypeFilter] = useState('');
  const dispatch=useDispatch();
  const [onlineData, setOnlineData] = useState([]);
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    const onlineData =async () => {
      setLoading(true);
      const res=await dispatch(onlineSubscription());
      console.log('online subscription data',res);
      if(res?.payload) {
        setOnlineData(res?.payload);
        setLoading(false);
      }
    }
    onlineData();
  },[dispatch])

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
        item.key === key ? { ...item, status: !item.status } : item
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
  { title: 'Site Name', dataIndex: 'siteName' },
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
    },
];


  const filteredOnlineData = onlineUserTypeFilter
    ? onlineData.filter((item) => item.userType === onlineUserTypeFilter)
    : onlineData;

  return (
    <div style={{ padding: '16px' }}>
      {/* Top Right Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
          View Subscription Plans
        </Button>
      </div>

      {/* Online Subscriptions */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Online Subscriptions</h3>
          <Select
            style={{ width: 200 }}
            placeholder="Filter by User Category"
            allowClear
            value={onlineUserTypeFilter || undefined}
            onChange={(value) => setOnlineUserTypeFilter(value)}
          >
            <Option value="Consumer">Consumer</Option>
            <Option value="Generator">Generator</Option>
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={filteredOnlineData}
          pagination={true}
          bordered
          loading={loading}
          scroll={{ x: 'max-content' }}
          size='small'
        />
      </div>

      {/* Add Subscription Modal */}
      <Modal
        title="Add Subscription"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <p>Form goes here...</p>
      </Modal>

      {/* View Document Modal */}
      <Modal
        title="Document Preview"
        open={isDocModalVisible}
        onCancel={() => setIsDocModalVisible(false)}
        footer={null}
        width={400}
      >
        <img src={documentUrl} alt="Document" style={{ width: '100%' }} />
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

export default OnlineSub;
