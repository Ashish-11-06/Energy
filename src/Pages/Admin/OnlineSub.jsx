import React, { useState } from 'react';
import { Button, Modal, Table, Switch, Select } from 'antd';
import AddSubscriptionModal from './Modal/AddSubscriptionModal'; // Optional

const { Option } = Select;

const OnlineSub = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDocModalVisible, setIsDocModalVisible] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [onlineUserTypeFilter, setOnlineUserTypeFilter] = useState('');

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
      onChange={() => toggleStatus(record.key)}
      checkedChildren="Active"
      unCheckedChildren="Inactive"
    //   {<span style={{ color: 'red' }}>Inactive</span>}
    />
  ),
}

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
          scroll={{ x: 'max-content' }}
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
