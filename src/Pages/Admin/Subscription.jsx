import React, { useState } from 'react';
import { Button, Modal, Table, Switch, Select } from 'antd';
import AddSubscriptionModal from './Modal/AddSubscriptionModal'; // Optional if you have a modal component

const { Option } = Select;

const Subscription = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDocModalVisible, setIsDocModalVisible] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');

  const [onlineUserTypeFilter, setOnlineUserTypeFilter] = useState('');
  const [offlineUserTypeFilter, setOfflineUserTypeFilter] = useState('');

  const [onlineData, setOnlineData] = useState([
    {
      key: '1',
      srNo: 1,
      userType: 'Consumer',
      name: 'Alice',
      companyName: 'InnoTech',
      siteName: 'Factory A',
      subscriptionPlan: 'PRO',
      enrollDate: '05-01-2024',
      expiryDate: '05-01-2025',
      status: true,
    },
    {
      key: '2',
      srNo: 2,
      userType: 'Generator',
      name: 'Bob',
      companyName: 'GreenPower',
      siteName: 'Solar Farm',
      subscriptionPlan: 'LITE',
      enrollDate: '10-01-2024',
      expiryDate: '10-01-2025',
      status: false,
    },
  ]);

  const [offlineData, setOfflineData] = useState([
    {
      key: '1',
      srNo: 1,
      userType: 'Generator',
      name: 'John Doe',
      companyName: 'TechCorp',
      siteName: 'Main Office',
      subscriptionPlan: 'LITE',
      enrollDate: '01-01-2024',
      expiryDate: '01-01-2025',
      status: true,
      document: 'https://via.placeholder.com/300x400?text=Document',
    },
    {
      key: '2',
      srNo: 2,
      userType: 'Consumer',
      name: 'Jane Smith',
      companyName: 'EcoEnergy',
      siteName: 'Wind Park',
      subscriptionPlan: 'PRO',
      enrollDate: '02-01-2024',
      expiryDate: '02-01-2025',
      status: false,
      document: 'https://via.placeholder.com/300x400?text=Another+Doc',
    },
  ]);

  const toggleStatus = (key, type) => {
    if (type === 'online') {
      setOnlineData((prev) =>
        prev.map((item) =>
          item.key === key ? { ...item, status: !item.status } : item
        )
      );
    } else {
      setOfflineData((prev) =>
        prev.map((item) =>
          item.key === key ? { ...item, status: !item.status } : item
        )
      );
    }
  };

  const showDocumentModal = (url) => {
    setDocumentUrl(url);
    setIsDocModalVisible(true);
  };

  const baseColumns = (type) => [
    { title: 'Sr. No', dataIndex: 'srNo' },
    { title: 'User Category', dataIndex: 'userType' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Company Name', dataIndex: 'companyName' },
    { title: 'Site Name', dataIndex: 'siteName' },
    { title: 'Subscription Plan', dataIndex: 'subscriptionPlan' },
    { title: 'Enroll Date', dataIndex: 'enrollDate' },
    { title: 'Expiry Date', dataIndex: 'expiryDate' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => (
        <Switch
          checked={record.status}
          onChange={() => toggleStatus(record.key, type)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
  ];

  const offlineExtraColumns = [
    {
      title: 'View Document',
      dataIndex: 'document',
      render: (url) => (
        <Button onClick={() => showDocumentModal(url)}>
          View
        </Button>
      ),
    },
  ];

  const filteredOnlineData = onlineUserTypeFilter
    ? onlineData.filter((item) => item.userType === onlineUserTypeFilter)
    : onlineData;

  const filteredOfflineData = offlineUserTypeFilter
    ? offlineData.filter((item) => item.userType === offlineUserTypeFilter)
    : offlineData;

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
          columns={baseColumns('online')}
          dataSource={filteredOnlineData}
          pagination={true}
          bordered
          scroll={{ x: 'max-content',y: 400 }}
        />
      </div>

      {/* Offline Subscriptions */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Offline Subscriptions</h3>
          <Select
            style={{ width: 200 }}
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
          columns={[...baseColumns('offline'), ...offlineExtraColumns]}
          dataSource={filteredOfflineData}
          pagination={true}
          bordered
          scroll={{ x: 'max-content',y: 400 }}
        
        />
      </div>

      {/* Add Subscription Modal */}
      <Modal
        title="Add Subscription"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <p>Form goes here...</p>
      </Modal>

      {/* View Document Modal */}
      <Modal
        title="Document Preview"
        visible={isDocModalVisible}
        onCancel={() => setIsDocModalVisible(false)}
        footer={null}
        width={400}
      >
        <img src={documentUrl} alt="Document" style={{ width: '100%' }} />
      </Modal>

      {/* Optional: Custom AddSubscriptionModal Component */}
      {typeof AddSubscriptionModal === 'function' && (
        <AddSubscriptionModal
          visible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
        />
      )}
    </div>
  );
};

export default Subscription;
